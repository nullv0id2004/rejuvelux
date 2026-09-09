/**
 * Exit test for `features/admin.md` §8 stage 2 — inventory list and adjust.
 *
 * Stage 2's criterion is that **R-66 becomes closable**: real counts enterable
 * with reasons, audited. So the checks below are about the guardrails, not the
 * happy path — an admin screen that can write a number is easy; one that cannot
 * break `data-model.md` §9.4's invariants with a non-technical person clicking
 * is the actual deliverable.
 *
 * Runs against the real database and restores every count it touches, including
 * on failure.
 *
 * Run:  npm run test:admin-inventory
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import {
  adminAction,
  adminUser,
  appUser,
  inventoryLevel,
  reservation,
} from '../lib/server/db/schema';
import { auditedMutation } from '../lib/server/admin/audit';
import { getInventoryRow, isOversellError, listInventory } from '../lib/server/admin/inventory';
import { adjustStock } from '../lib/server/inventory/reserve';
import type { AdminSession } from '../lib/server/auth/session';

let pass = 0;
let fail = 0;
const check = (ok: boolean, label: string) => {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}`);
  }
};

const MARK = 'invtest+admin@example.test';

async function main() {
  /* A throwaway admin to attribute the audit rows to. */
  await db.delete(appUser).where(eq(appUser.email, MARK));
  const [u] = await db.insert(appUser).values({ email: MARK }).returning();
  const [a] = await db
    .insert(adminUser)
    .values({ authUserId: u!.id, email: MARK, name: 'Inv Test', role: 'staff', status: 'active' })
    .returning();
  const session: AdminSession = {
    userId: u!.id,
    adminUserId: a!.id,
    authUserId: u!.id,
    email: MARK,
    name: 'Inv Test',
    role: 'staff',
  };

  let victimId: string | null = null;
  let originalStocked = 0;

  try {
    /* 1. The list ---------------------------------------------------------- */

    const rows = await listInventory();
    check(rows.length === 9, `lists every stock-tracked item (${rows.length})`);
    check(
      rows.every((r) => r.available === r.stocked - r.reserved),
      'available is stocked − reserved, computed not stored'
    );
    check(
      rows.every((r, i) => i === 0 || rows[i - 1]!.available <= r.available),
      'scarcest first'
    );

    const kitPart = rows.find((r) => r.sku === 'INV-WHISK');
    check(!!kitPart && kitPart.usedBy.length > 0, 'a kit component knows what uses it');

    /* 2. Adjust, audited atomically ---------------------------------------- */

    const victim = rows.find((r) => r.sku === 'INV-SILVER-50')!;
    victimId = victim.itemId;
    originalStocked = victim.stocked;

    const before = (await db.select().from(adminAction)).length;

    await auditedMutation(
      session,
      async (tx) => {
        await adjustStock(victim.itemId, +7, 'counted the shelf', tx);
        return { to: victim.stocked + 7 };
      },
      (r) => ({
        action: 'stock.adjust',
        entityType: 'inventory_item',
        entityId: victim.itemId,
        before: { stockedQuantity: victim.stocked },
        after: { stockedQuantity: r.to, reason: 'counted the shelf' },
      })
    );

    const afterRow = await getInventoryRow(victim.itemId);
    check(afterRow?.stocked === originalStocked + 7, 'the count changed');

    const actions = await db
      .select()
      .from(adminAction)
      .orderBy(desc(adminAction.id))
      .limit(1);
    check((await db.select().from(adminAction)).length === before + 1, 'exactly one audit row was written');
    check(actions[0]?.action === 'stock.adjust', 'the audit row names the action');
    check(actions[0]?.adminUserId === session.adminUserId, 'the audit row names who did it');
    check(
      (actions[0]?.before as { stockedQuantity: number })?.stockedQuantity === originalStocked,
      'the audit row records the value before'
    );
    check(
      (actions[0]?.after as { reason: string })?.reason === 'counted the shelf',
      'the audit row records the reason'
    );

    /* 3. The audit is not optional ----------------------------------------- */
    //
    // §6.2: written in the SAME transaction, so if the audit fails the change
    // fails. Forced here by throwing while building the entry.

    const beforeFailed = (await getInventoryRow(victim.itemId))!.stocked;
    const countBefore = (await db.select().from(adminAction)).length;
    let threw = false;
    try {
      await auditedMutation(
        session,
        async (tx) => {
          await adjustStock(victim.itemId, +100, 'should be rolled back', tx);
          return null;
        },
        () => {
          throw new Error('audit failed');
        }
      );
    } catch {
      threw = true;
    }
    check(threw, 'a failing audit throws');
    check(
      (await getInventoryRow(victim.itemId))!.stocked === beforeFailed,
      'and the stock change is rolled back with it'
    );
    check(
      (await db.select().from(adminAction)).length === countBefore,
      'no audit row survives the rollback either'
    );

    /* 4. A reason is mandatory --------------------------------------------- */

    let refusedNoReason = false;
    try {
      await adjustStock(victim.itemId, +1, '   ');
    } catch {
      refusedNoReason = true;
    }
    check(refusedNoReason, 'an adjustment with no reason is refused');

    /* 5. The database refuses to oversell ---------------------------------- */
    //
    // The screen checks this and explains it in a sentence, but the CHECK is
    // the thing that actually cannot be talked around. Prove it still bites.

    // Reserving properly needs an order, which is Phase 2's surface. The
    // constraint being proved here is the database's, so the reservation is
    // staged directly and removed immediately — restored in the finally too.
    const current = (await getInventoryRow(victim.itemId))!;
    await db
      .update(inventoryLevel)
      .set({ reservedQuantity: 5 })
      .where(eq(inventoryLevel.inventoryItemId, victim.itemId));

    let refused = false;
    let recognised = false;
    try {
      // Try to set the count to 2 while 5 are promised. Must not be possible.
      await adjustStock(victim.itemId, -(current.stocked - 2), 'attempt to oversell');
    } catch (e) {
      refused = true;
      recognised = isOversellError(e);
    }
    check(refused, 'a count below what is reserved is refused by the database');
    check(
      recognised,
      'and the screen can RECOGNISE that refusal, so it shows a sentence rather than a 500'
    );
    check(
      (await getInventoryRow(victim.itemId))!.stocked === current.stocked,
      'the refused adjustment changed nothing'
    );

    await db
      .update(inventoryLevel)
      .set({ reservedQuantity: 0 })
      .where(eq(inventoryLevel.inventoryItemId, victim.itemId));

    /* 6. R-66's own signal -------------------------------------------------- */

    const anyAdjust = await db
      .select()
      .from(adminAction)
      .where(eq(adminAction.action, 'stock.adjust'))
      .limit(1);
    check(
      anyAdjust.length > 0,
      'a stock.adjust row now exists — which is what the worklist reads to stop saying stock has never been counted'
    );
  } finally {
    /* Restore, whatever happened above. */
    if (victimId) {
      await db
        .update(inventoryLevel)
        .set({ reservedQuantity: 0 })
        .where(eq(inventoryLevel.inventoryItemId, victimId));
      const now = await getInventoryRow(victimId);
      if (now && now.stocked !== originalStocked) {
        await db
          .update(inventoryLevel)
          .set({ stockedQuantity: originalStocked })
          .where(eq(inventoryLevel.inventoryItemId, victimId));
      }
    }
    await db.delete(adminAction).where(eq(adminAction.adminUserId, a!.id));
    await db.delete(adminUser).where(eq(adminUser.id, a!.id));
    await db.delete(appUser).where(eq(appUser.id, u!.id));
    console.log('  cleanup: counts restored, test admin and its audit rows removed');
  }

  const [leak] = await db.select().from(reservation).limit(0);
  void leak;

  console.log(`\n${fail === 0 ? 'All checks passed.' : `${fail} FAILED`}  (${pass} passed)`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
