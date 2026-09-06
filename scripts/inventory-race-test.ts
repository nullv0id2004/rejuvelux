/**
 * The exit test for features/inventory.md — architecture.md §2, race 1.
 *
 * Proves, against the real database:
 *   1. KIT MATH      — Ritual Set availability = min across six components.
 *   2. THE RACE      — two concurrent buyers, one last Ritual Set: exactly one
 *                      reservation succeeds, the loser is told which component
 *                      ran short, and no constraint is violated.
 *   3. MERGED LOCKS  — one order holding Matcha + Ritual Set reserves the
 *                      shared tin once, with summed quantity.
 *   4. RELEASE       — releasing the winner restores availability exactly.
 *
 * Run from apps/web with DATABASE_URL in .env.local:
 *   npx tsx scripts/inventory-race-test.ts
 *
 * Self-contained: creates its own carts/orders (clearly marked), restores all
 * stock, and deletes everything it created. Exits non-zero on any failure.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load .env.local by hand — this runs under node/tsx, not Next.js.
try {
  const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  /* .env.local absent — DATABASE_URL may be set in the environment already */
}

import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import {
  cart,
  inventoryItem,
  inventoryLevel,
  order,
  reservation,
  variantInventoryItem,
  productVariant,
} from '../lib/server/db/schema';
import { getVariantAvailability } from '../lib/server/inventory/availability';
import { releaseReservations, reserveForOrder } from '../lib/server/inventory/reserve';

let failures = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.error(`  FAIL  ${name}`, detail ?? '');
  }
}

async function makeTestOrder(label: string): Promise<{ orderId: string; cartId: string }> {
  const [c] = await db.insert(cart).values({}).returning({ id: cart.id });
  const [o] = await db
    .insert(order)
    .values({
      orderNumber: `TEST-${label}-${Date.now()}`,
      cartId: c.id,
      email: 'race-test@invalid.local',
      phone: '0000000000',
      shipName: 'Race Test',
      shipLine1: 'Test',
      shipCity: 'Test',
      shipState: 'Test',
      shipPincode: '000000',
      subtotalPaise: 0,
      shippingPaise: 0,
      totalPaise: 0,
    })
    .returning({ id: order.id });
  return { orderId: o.id, cartId: c.id };
}

async function main() {
  // --- Resolve the fixtures --------------------------------------------------
  const [setVariant] = await db
    .select()
    .from(productVariant)
    .where(eq(productVariant.sku, 'RJ-RITUAL-SET'));
  const [matchaVariant] = await db
    .select()
    .from(productVariant)
    .where(eq(productVariant.sku, 'RJ-MATCHA-50'));
  const [bowl] = await db
    .select()
    .from(inventoryItem)
    .where(eq(inventoryItem.sku, 'INV-BOWL'));
  const [matchaTin] = await db
    .select()
    .from(inventoryItem)
    .where(eq(inventoryItem.sku, 'INV-MATCHA-50'));
  if (!setVariant || !matchaVariant || !bowl || !matchaTin) {
    throw new Error('Seed data missing — run drizzle/seed.sql first.');
  }

  const setLinks = await db
    .select()
    .from(variantInventoryItem)
    .where(eq(variantInventoryItem.variantId, setVariant.id));
  check('fixture: Ritual Set has 6 kit links', setLinks.length === 6, setLinks.length);

  // Snapshot stock to restore at the end.
  const itemIds = [...new Set([...setLinks.map((l) => l.inventoryItemId), matchaTin.id])];
  const before = await db
    .select()
    .from(inventoryLevel)
    .where(inArray(inventoryLevel.inventoryItemId, itemIds));
  const snapshot = new Map(before.map((l) => [l.inventoryItemId, l]));

  const cleanup: { orderIds: string[]; cartIds: string[] } = { orderIds: [], cartIds: [] };

  try {
    // --- 1. Kit math ---------------------------------------------------------
    const avail0 = await getVariantAvailability([setVariant.id, matchaVariant.id]);
    const expectedSet = Math.min(
      ...before
        .filter((l) => setLinks.some((s) => s.inventoryItemId === l.inventoryItemId))
        .map((l) => l.stockedQuantity - l.reservedQuantity)
    );
    check(
      `kit math: set availability = min across components (${expectedSet})`,
      avail0.get(setVariant.id) === expectedSet,
      avail0.get(setVariant.id)
    );

    // --- 2. The race: exactly one of two concurrent buyers wins the last set --
    // Choke the bowl down to exactly 1 available.
    const bowlLevel = snapshot.get(bowl.id)!;
    const bowlAvailable = bowlLevel.stockedQuantity - bowlLevel.reservedQuantity;
    await db
      .update(inventoryLevel)
      .set({ stockedQuantity: sql`${inventoryLevel.stockedQuantity} - ${bowlAvailable - 1}` })
      .where(eq(inventoryLevel.inventoryItemId, bowl.id));

    const availChoked = await getVariantAvailability([setVariant.id]);
    check('choke: set availability is exactly 1', availChoked.get(setVariant.id) === 1);

    const a = await makeTestOrder('A');
    const b = await makeTestOrder('B');
    cleanup.orderIds.push(a.orderId, b.orderId);
    cleanup.cartIds.push(a.cartId, b.cartId);

    const [resA, resB] = await Promise.all([
      reserveForOrder(a.orderId, [{ variantId: setVariant.id, quantity: 1 }]),
      reserveForOrder(b.orderId, [{ variantId: setVariant.id, quantity: 1 }]),
    ]);

    const winners = [resA, resB].filter((r) => r.ok);
    const losers = [resA, resB].filter((r) => !r.ok);
    check('race: exactly one winner', winners.length === 1, { resA, resB });
    check('race: exactly one loser', losers.length === 1);
    const loser = losers[0];
    check(
      'race: loser is told the bowl ran short',
      !loser.ok && loser.short.some((s) => s.inventoryItemId === bowl.id),
      loser
    );

    const availAfterRace = await getVariantAvailability([setVariant.id]);
    check('race: set availability now 0', availAfterRace.get(setVariant.id) === 0);

    const bowlAfter = await db
      .select()
      .from(inventoryLevel)
      .where(eq(inventoryLevel.inventoryItemId, bowl.id));
    check(
      'race: bowl reserved exactly once (no double count)',
      bowlAfter[0].reservedQuantity === bowlLevel.reservedQuantity + 1,
      bowlAfter[0]
    );

    // --- 3. Merged locks: Matcha + Set in one order share the tin -------------
    const winnerOrder = resA.ok ? a : b;
    await releaseReservations(winnerOrder.orderId); // free the set again
    const c3 = await makeTestOrder('C');
    cleanup.orderIds.push(c3.orderId);
    cleanup.cartIds.push(c3.cartId);

    const tinBefore = (
      await db.select().from(inventoryLevel).where(eq(inventoryLevel.inventoryItemId, matchaTin.id))
    )[0];
    const resC = await reserveForOrder(c3.orderId, [
      { variantId: matchaVariant.id, quantity: 1 },
      { variantId: setVariant.id, quantity: 1 },
    ]);
    check('merge: combined order reserves successfully', resC.ok, resC);
    const tinAfter = (
      await db.select().from(inventoryLevel).where(eq(inventoryLevel.inventoryItemId, matchaTin.id))
    )[0];
    check(
      'merge: shared tin reserved +2 in one row',
      tinAfter.reservedQuantity === tinBefore.reservedQuantity + 2,
      { before: tinBefore.reservedQuantity, after: tinAfter.reservedQuantity }
    );
    const tinReservations = await db
      .select()
      .from(reservation)
      .where(
        and(eq(reservation.orderId, c3.orderId), eq(reservation.inventoryItemId, matchaTin.id))
      );
    check(
      'merge: ONE reservation row for the tin, quantity 2',
      tinReservations.length === 1 && tinReservations[0].quantity === 2,
      tinReservations
    );

    // --- 4. Release restores exactly ------------------------------------------
    await releaseReservations(c3.orderId);
    const availEnd = await getVariantAvailability([setVariant.id]);
    check('release: set availability back to 1', availEnd.get(setVariant.id) === 1, availEnd);
  } finally {
    // --- Cleanup: release anything held, delete test rows, restore stock ------
    for (const oid of cleanup.orderIds) await releaseReservations(oid).catch(() => {});
    if (cleanup.orderIds.length) {
      await db.delete(reservation).where(inArray(reservation.orderId, cleanup.orderIds));
      await db.delete(order).where(inArray(order.id, cleanup.orderIds));
    }
    if (cleanup.cartIds.length) {
      await db.delete(cart).where(inArray(cart.id, cleanup.cartIds));
    }
    for (const [itemId, level] of snapshot) {
      await db
        .update(inventoryLevel)
        .set({ stockedQuantity: level.stockedQuantity, reservedQuantity: level.reservedQuantity })
        .where(eq(inventoryLevel.inventoryItemId, itemId));
    }
    console.log('  cleanup: stock restored, test orders deleted');
  }

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log('\nAll checks passed.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
