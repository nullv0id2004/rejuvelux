/**
 * Inventory write path: reserve, consume, release, adjust.
 * features/inventory.md §4.2–§4.4 governs behaviour; data-model.md §4.4 the shape.
 *
 * Reservation semantics derived from Medusa v2.19.0,
 * packages/core/core-flows/src/cart/steps/reserve-inventory.ts (per-component
 * reservation under lock). The MIT License (MIT) — Copyright (c) MedusaJS, Inc.
 * Ours differs mechanically: Postgres row locks (SELECT ... FOR UPDATE) instead
 * of Medusa's locking module, and quantities merged per item BEFORE locking so
 * an order holding Matcha + Ritual Set locks the shared tin once.
 *
 * This closes architecture.md §2 race 1: the kit reserves every component or
 * fails as a unit, and two buyers racing for the last set produce one order.
 */

import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { db, type Tx } from '../db/client';
import {
  inventoryLevel,
  reservation,
  variantInventoryItem,
} from '../db/schema';

/** A line to reserve: a purchasable variant and how many of it. */
export interface ReserveLine {
  variantId: string;
  quantity: number;
}

export type ReserveResult =
  | { ok: true; reservationIds: string[] }
  | {
      ok: false;
      /** Which inventory items ran short, so the storefront can say so honestly. */
      short: { inventoryItemId: string; requested: number; available: number }[];
    };

export class NoInventoryLinkError extends Error {
  constructor(variantId: string) {
    super(
      `Variant ${variantId} has no inventory links — misconfigured product, not purchasable (fail closed).`
    );
  }
}

/**
 * Reserve stock for an order, atomically. All components or none.
 *
 * Locking rules (features/inventory.md §4.2):
 *  - all affected levels locked in ONE SELECT ... FOR UPDATE, ordered by
 *    inventory_item_id — fixed lock order, no deadlock between concurrent kits;
 *  - no NOWAIT/SKIP LOCKED: a blocked checkout waits milliseconds for the
 *    winner's commit, then reads the truth;
 *  - shortfall anywhere → transaction rolls back, nothing reserved.
 */
export async function reserveForOrder(
  orderId: string,
  lines: ReserveLine[],
  tx?: Tx
): Promise<ReserveResult> {
  const run = async (t: Tx): Promise<ReserveResult> => {
    // 1. Resolve variant → component requirements.
    const variantIds = lines.map((l) => l.variantId);
    const links = await t
      .select({
        variantId: variantInventoryItem.variantId,
        inventoryItemId: variantInventoryItem.inventoryItemId,
        requiredQuantity: variantInventoryItem.requiredQuantity,
      })
      .from(variantInventoryItem)
      .where(inArray(variantInventoryItem.variantId, variantIds));

    const linksByVariant = new Map<string, typeof links>();
    for (const link of links) {
      const arr = linksByVariant.get(link.variantId) ?? [];
      arr.push(link);
      linksByVariant.set(link.variantId, arr);
    }

    // 2. Merge to per-item totals. A variant with zero links fails closed.
    const needed = new Map<string, number>(); // inventoryItemId → quantity
    for (const line of lines) {
      const variantLinks = linksByVariant.get(line.variantId);
      if (!variantLinks || variantLinks.length === 0) {
        throw new NoInventoryLinkError(line.variantId);
      }
      for (const link of variantLinks) {
        needed.set(
          link.inventoryItemId,
          (needed.get(link.inventoryItemId) ?? 0) +
            link.requiredQuantity * line.quantity
        );
      }
    }

    // 3. Lock every affected level, fixed order (race 1's actual mechanism).
    const itemIds = [...needed.keys()].sort();
    const levels = await t
      .select()
      .from(inventoryLevel)
      .where(inArray(inventoryLevel.inventoryItemId, itemIds))
      .orderBy(asc(inventoryLevel.inventoryItemId))
      .for('update');

    // 4. Check every component under the lock. Any shortfall → all-or-nothing rollback.
    const levelByItem = new Map(levels.map((l) => [l.inventoryItemId, l]));
    const short: { inventoryItemId: string; requested: number; available: number }[] =
      [];
    for (const [itemId, qty] of needed) {
      const level = levelByItem.get(itemId);
      const available = level ? level.stockedQuantity - level.reservedQuantity : 0;
      if (available < qty) short.push({ inventoryItemId: itemId, requested: qty, available });
    }
    if (short.length > 0) {
      // Rollback by throwing; caught below and returned as a structured result.
      throw new ShortfallRollback(short);
    }

    // 5. Reserve: bump levels, write reservation rows.
    const reservationIds: string[] = [];
    for (const [itemId, qty] of needed) {
      await t
        .update(inventoryLevel)
        .set({
          reservedQuantity: sql`${inventoryLevel.reservedQuantity} + ${qty}`,
          updatedAt: sql`now()`,
        })
        .where(eq(inventoryLevel.inventoryItemId, itemId));
      const [row] = await t
        .insert(reservation)
        .values({ inventoryItemId: itemId, orderId, quantity: qty })
        .returning({ id: reservation.id });
      reservationIds.push(row.id);
    }
    return { ok: true, reservationIds };
  };

  try {
    return tx ? await run(tx) : await db.transaction(run);
  } catch (e) {
    if (e instanceof ShortfallRollback) return { ok: false, short: e.short };
    throw e;
  }
}

/** Internal: aborts the transaction while carrying the shortfall detail out. */
class ShortfallRollback extends Error {
  constructor(
    public short: { inventoryItemId: string; requested: number; available: number }[]
  ) {
    super('insufficient stock');
  }
}

/**
 * Consume an order's held reservations — payment captured.
 * stocked −= q, reserved −= q, reservation → consumed. Idempotent by state:
 * already-consumed rows are skipped (features/inventory.md §4.3).
 */
export async function consumeReservations(orderId: string, tx?: Tx): Promise<number> {
  const run = async (t: Tx): Promise<number> => {
    const rows = await t
      .select()
      .from(reservation)
      .where(and(eq(reservation.orderId, orderId), eq(reservation.state, 'held')))
      .orderBy(asc(reservation.inventoryItemId))
      .for('update');

    for (const r of rows) {
      await t
        .update(inventoryLevel)
        .set({
          stockedQuantity: sql`${inventoryLevel.stockedQuantity} - ${r.quantity}`,
          reservedQuantity: sql`${inventoryLevel.reservedQuantity} - ${r.quantity}`,
          updatedAt: sql`now()`,
        })
        .where(eq(inventoryLevel.inventoryItemId, r.inventoryItemId));
      await t
        .update(reservation)
        .set({ state: 'consumed', updatedAt: sql`now()` })
        .where(eq(reservation.id, r.id));
    }
    return rows.length;
  };
  return tx ? run(tx) : db.transaction(run);
}

/**
 * Release an order's held reservations — payment failed or expired.
 * reserved −= q, reservation → released. Idempotent by state; a release after
 * consume is a no-op here and a reconciliation report upstream.
 */
export async function releaseReservations(orderId: string, tx?: Tx): Promise<number> {
  const run = async (t: Tx): Promise<number> => {
    const rows = await t
      .select()
      .from(reservation)
      .where(and(eq(reservation.orderId, orderId), eq(reservation.state, 'held')))
      .orderBy(asc(reservation.inventoryItemId))
      .for('update');

    for (const r of rows) {
      await t
        .update(inventoryLevel)
        .set({
          reservedQuantity: sql`${inventoryLevel.reservedQuantity} - ${r.quantity}`,
          updatedAt: sql`now()`,
        })
        .where(eq(inventoryLevel.inventoryItemId, r.inventoryItemId));
      await t
        .update(reservation)
        .set({ state: 'released', updatedAt: sql`now()` })
        .where(eq(reservation.id, r.id));
    }
    return rows.length;
  };
  return tx ? run(tx) : db.transaction(run);
}

/**
 * The ONLY sanctioned way stocked_quantity changes (features/inventory.md §4.4):
 * receiving stock, damage, correction. Reason required. The no-oversell CHECK
 * refuses a correction below current reserved — the operator resolves
 * reservations first, the database does not bend.
 */
export async function adjustStock(
  inventoryItemId: string,
  delta: number,
  reason: string,
  tx?: Tx
): Promise<void> {
  if (!reason.trim()) throw new Error('adjustStock requires a reason.');
  // Takes an optional transaction like its siblings above, so the admin can
  // write the stock change and its admin_action row in ONE transaction —
  // features/admin.md §6.2: if the audit write fails, the change fails.
  const run = async (t: Tx) => {
    const [level] = await t
      .select()
      .from(inventoryLevel)
      .where(eq(inventoryLevel.inventoryItemId, inventoryItemId))
      .for('update');
    if (!level) throw new Error(`No inventory level for item ${inventoryItemId}.`);
    await t
      .update(inventoryLevel)
      .set({
        stockedQuantity: sql`${inventoryLevel.stockedQuantity} + ${delta}`,
        updatedAt: sql`now()`,
      })
      .where(eq(inventoryLevel.inventoryItemId, inventoryItemId));
    // Movement log: console for now — a movements table is deliberately deferred
    // (features/inventory.md §10). The reason string is the audit trail.
    console.info(
      `[inventory] adjust ${inventoryItemId} by ${delta}: ${reason} (was ${level.stockedQuantity})`
    );
  };
  await (tx ? run(tx) : db.transaction(run));
}
