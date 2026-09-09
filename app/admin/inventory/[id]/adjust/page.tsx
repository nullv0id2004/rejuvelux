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
 * **A lower count confirms** (§6.3, which lists "adjusting stock downward"
 * among the consequential actions). Raising a count is recoverable; lowering
 * one can take a product off sale, so the form comes back once naming the drop.
 * Uses the same `?confirm=1` mechanism as every other admin screen, so the
 * behaviour is learned once.
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
import {
  backTo,
  carry,
  checked,
  initial,
  integer,
  readNotice,
  text,
  type SearchParams,
} from '../../../form';
import { ConfirmNotice, Notices } from '../../../notices';
import shell from '../../../admin.module.css';
import styles from '../../inventory.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Correct a stock count' };

/** The fields carried back on a refusal, so nothing typed is lost. */
const FIELDS = ['count', 'reason'] as const;

async function submit(formData: FormData) {
  'use server';

  const session = await requireAdmin();

  const itemId = text(formData, 'itemId');
  const reason = text(formData, 'reason');
  const count = integer(formData, 'count');
  const expected = integer(formData, 'expectedStocked');
  const path = `/admin/inventory/${itemId}/adjust`;
  const carried = carry(formData, FIELDS);

  const refuse = (sentence: string): never =>
    redirect(backTo(path, { refused: sentence, carry: carried }));

  if (!reason) refuse('Say why the count is changing. It is recorded with the change.');
  if (!Number.isInteger(count) || count < 0) {
    refuse('Enter the new count as a whole number, zero or more.');
  }

  const row = await getInventoryRow(itemId);
  if (!row) notFound();

  // §5 Stale: the shelf moved under the editor, so the count they typed was
  // answering a number they never saw.
  if (row.stocked !== expected) {
    refuse(
      'The stock changed while this page was open, so your count was answering an older number. The current figures are below. Please check the shelf and enter it again.'
    );
  }

  const delta = count - row.stocked;
  if (delta === 0) refuse('That is the same as the current count, so nothing was changed.');

  // The database refuses a count below what open orders already hold. Say so in
  // words rather than letting a constraint name reach a person.
  if (count < row.reserved) {
    refuse(
      `That count is below the ${row.reserved} unit${row.reserved === 1 ? '' : 's'} already promised to orders that have not shipped. Fulfil or cancel those orders first, or enter a count of at least ${row.reserved}.`
    );
  }

  // §6.3: lowering a count is consequential, so it confirms. Raising one is not.
  if (delta < 0 && !checked(formData, 'confirm')) {
    redirect(backTo(path, { confirm: true, carry: carried }));
  }

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
    // despite the check above, something changed concurrently, so: same answer.
    // Read through Drizzle's wrapper: its own message is the SQL, not the
    // constraint, so a naive string match here never fires (see isOversellError).
    if (isOversellError(e)) {
      refuse(
        `That count is below what is already promised to orders that have not shipped. Fulfil or cancel those orders first.`
      );
    }
    throw e;
  }

  redirect(
    backTo('/admin/inventory', {
      done: `${row.name} is now ${count}, was ${row.stocked}.`,
    })
  );
}

export default async function AdjustPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const notice = readNotice(sp);

  const row = await getInventoryRow(id);
  if (!row) notFound();

  const typedCount = initial(sp, 'count', String(row.stocked));
  const dropTo = Number(typedCount);
  const confirmingDrop =
    notice.confirm && Number.isInteger(dropTo) && dropTo < row.stocked;

  return (
    <>
      <h1 className={shell.pageTitle}>Correct a stock count</h1>
      <p className={shell.pageIntro}>
        <strong>{row.name}</strong> · {row.sku}
      </p>

      <Notices notice={notice} />

      {confirmingDrop ? (
        <ConfirmNotice>
          This lowers <strong>{row.name}</strong> from {row.stocked} to {dropTo}
          {dropTo - row.reserved <= 0
            ? ', which leaves nothing available to sell.'
            : `, leaving ${dropTo - row.reserved} available to sell.`}{' '}
          Submit again to confirm.
        </ConfirmNotice>
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
        {/* The figure this form was rendered against: §5's staleness check. */}
        <input type="hidden" name="expectedStocked" value={row.stocked} />
        {confirmingDrop ? <input type="hidden" name="confirm" value="1" /> : null}

        <label className={styles.field}>
          <span className={styles.label}>New count</span>
          <span className={styles.hint}>
            How many are actually there, counted just now. Not the difference.
          </span>
          <input
            className={styles.input}
            type="number"
            name="count"
            min={0}
            step={1}
            required
            autoFocus
            defaultValue={typedCount}
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
            defaultValue={initial(sp, 'reason', '')}
          />
        </label>

        <div className={styles.formActions}>
          <button className={styles.submit} type="submit">
            {confirmingDrop ? 'Yes, lower the count' : 'Save the new count'}
          </button>
          <Link className={styles.cancel} href="/admin/inventory">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
