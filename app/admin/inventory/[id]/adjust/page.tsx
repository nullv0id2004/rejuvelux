/**
 * /admin/inventory/[id]/adjust — the cure for R-66 (features/admin.md §4, §5, §6).
 *
 * **It asks for a count, not a difference.** An operator holding a clipboard
 * knows "there are 37 tins on the shelf"; making them work out that this is
 * −3 invites arithmetic mistakes on the one screen where a mistake means
 * overselling. The difference is computed here from the number the form was
 * rendered with.
 *
 * That framing also makes §5's **Stale** state real rather than theoretical: if
 * the stock changed between the page rendering and the form being submitted,
 * the count the operator typed was answering a different question, so the edit
 * is refused and re-presented rather than applied to a number they never saw.
 *
 * Three rules from §6 are load-bearing here:
 *   - §6.1 the domain layer is the only writer: this calls `adjustStock()` and
 *     never touches `inventory_level` itself.
 *   - §6.2 the audit row is written in the SAME transaction as the change, so
 *     if the audit fails the change fails.
 *   - §6.5 a refusal explains itself in a sentence. The database's no-oversell
 *     CHECK is a real guard, but `inventory_level_no_oversell_check` is not a
 *     sentence anyone can act on.
 */

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth/session';
import { auditedMutation } from '@/lib/server/admin/audit';
import { getInventoryRow, isOversellError } from '@/lib/server/admin/inventory';
import { adjustStock } from '@/lib/server/inventory/reserve';
import shell from '../../../admin.module.css';
import styles from '../../inventory.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Correct a stock count' };

type Params = { params: Promise<{ id: string }> };

async function submit(formData: FormData) {
  'use server';

  const session = await requireAdmin();

  const itemId = String(formData.get('itemId') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  const rawCount = String(formData.get('count') ?? '').trim();
  const expected = Number(formData.get('expectedStocked'));
  const back = `/admin/inventory/${itemId}/adjust`;

  const fail = (code: string): never =>
    redirect(`${back}?error=${code}&count=${encodeURIComponent(rawCount)}&reason=${encodeURIComponent(reason)}`);

  if (!reason) fail('reason');

  const count = Number(rawCount);
  if (!Number.isInteger(count) || count < 0) fail('count');

  const row = await getInventoryRow(itemId);
  if (!row) notFound();

  // §5 Stale — the shelf moved under the editor.
  if (row.stocked !== expected) fail('stale');

  const delta = count - row.stocked;
  if (delta === 0) fail('nochange');

  // The database refuses a count below what open orders already hold. Catch it
  // and say so in words rather than letting a constraint name reach a person.
  if (count < row.reserved) fail('reserved');

  try {
    await auditedMutation(
      session,
      // ONE transaction: the stock change and its audit row land together.
      async (tx) => {
        await adjustStock(itemId, delta, reason, tx);
        return { itemId, delta, from: row.stocked, to: count };
      },
      (result) => ({
        action: 'stock.adjust',
        entityType: 'inventory_item',
        entityId: result.itemId,
        before: { stockedQuantity: result.from },
        after: { stockedQuantity: result.to, delta: result.delta, reason },
      })
    );
  } catch (e) {
    // The no-oversell CHECK is the last line and it does not bend. If it fires
    // despite the check above, something changed concurrently — same answer.
    // Read through Drizzle's wrapper: its own message is the SQL, not the
    // constraint, so a naive string match here never fires (see isOversellError).
    if (isOversellError(e)) fail('reserved');
    throw e;
  }

  redirect('/admin/inventory?saved=1');
}

export default async function AdjustPage({
  params,
  searchParams,
}: Params & {
  searchParams: Promise<{ error?: string; count?: string; reason?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error, count, reason } = await searchParams;

  const row = await getInventoryRow(id);
  if (!row) notFound();

  const messages: Record<string, string> = {
    reason: 'Say why the count is changing — it is recorded with the change.',
    count: 'Enter the new count as a whole number, zero or more.',
    nochange: 'That is the same as the current count, so nothing was changed.',
    stale:
      'The stock changed while this page was open, so your count was answering an older number. The current figures are shown below — please check the shelf and enter it again.',
    reserved: `That count is below the ${row.reserved} unit${row.reserved === 1 ? '' : 's'} already promised to orders that have not shipped. Fulfil or cancel those orders first, or enter a count of at least ${row.reserved}.`,
  };

  return (
    <>
      <h1 className={shell.pageTitle}>Correct a stock count</h1>
      <p className={shell.pageIntro}>
        <strong>{row.name}</strong> · {row.sku}
      </p>

      {error && messages[error] ? (
        <p className={styles.refusal} role="alert">
          {messages[error]}
        </p>
      ) : null}

      <dl className={styles.facts}>
        <div>
          <dt>In stock now</dt>
          <dd>{row.stocked}</dd>
        </div>
        <div>
          <dt>Promised to orders</dt>
          <dd>{row.reserved}</dd>
        </div>
        <div>
          <dt>Available</dt>
          <dd>{row.available}</dd>
        </div>
      </dl>

      {row.usedBy.length > 0 ? (
        <p className={styles.blockNote}>
          Used by{' '}
          {row.usedBy
            .map((u) =>
              u.requiredQuantity > 1
                ? `${u.productName} (${u.requiredQuantity} per set)`
                : u.productName
            )
            .join(', ')}
          . Changing this count changes what those can sell.
        </p>
      ) : null}

      <form className={styles.form} action={submit}>
        <input type="hidden" name="itemId" value={row.itemId} />
        {/* The figure this form was rendered against — §5's staleness check. */}
        <input type="hidden" name="expectedStocked" value={row.stocked} />

        <label className={styles.field}>
          <span className={styles.label}>New count</span>
          <span className={styles.hint}>
            How many are actually there, counted just now — not the difference.
          </span>
          <input
            className={styles.input}
            type="number"
            name="count"
            min={0}
            step={1}
            required
            autoFocus
            defaultValue={count ?? String(row.stocked)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Reason</span>
          <span className={styles.hint}>
            For example: counted the shelf, stock received, damaged in transit.
          </span>
          <input
            className={styles.input}
            type="text"
            name="reason"
            required
            maxLength={200}
            defaultValue={reason ?? ''}
          />
        </label>

        <div className={styles.formActions}>
          <button className={styles.submit} type="submit">
            Save the new count
          </button>
          <Link className={styles.cancel} href="/admin/inventory">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
