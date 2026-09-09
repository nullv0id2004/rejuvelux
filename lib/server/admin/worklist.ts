/**
 * The admin worklist — features/admin.md §4: "A worklist, not a dashboard.
 * Every row is a thing to do."
 *
 * Deliberately not a metrics dashboard. Nothing here is a number to admire;
 * each entry is an item someone can act on, and two of them correspond to
 * risks that are open in risks.md today only for want of a text field:
 * R-04 (Silver Needle's unconfirmed price) and R-66 (invented stock counts).
 */

import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../db/client';
import {
  inventoryItem,
  inventoryLevel,
  order,
  product,
  productVariant,
} from '../db/schema';
import { LOW_STOCK_THRESHOLD } from '../inventory/availability';

export interface Worklist {
  unpricedVariants: { productId: string; productName: string; sku: string; slug: string }[];
  lowStock: { inventoryItemId: string; sku: string; name: string; available: number }[];
  ordersAwaitingFulfilment: {
    orderNumber: string;
    id: string;
    placedAt: Date;
  }[];
  /** True when the seeded development quantities are still in place (R-66). */
  stockNeverCounted: boolean;
}

export async function getWorklist(): Promise<Worklist> {
  /* Unpriced, active variants — R-04's surface. */
  const unpricedVariants = await db
    .select({
      productId: product.id,
      productName: product.name,
      sku: productVariant.sku,
      slug: product.slug,
    })
    .from(productVariant)
    .innerJoin(product, eq(product.id, productVariant.productId))
    .where(
      and(
        isNull(productVariant.pricePaise),
        eq(productVariant.status, 'active'),
        eq(product.status, 'active')
      )
    );

  /* Low or exhausted stock, computed the same way availability.ts does. */
  const levels = await db
    .select({
      inventoryItemId: inventoryItem.id,
      sku: inventoryItem.sku,
      name: inventoryItem.name,
      stocked: inventoryLevel.stockedQuantity,
      reserved: inventoryLevel.reservedQuantity,
    })
    .from(inventoryLevel)
    .innerJoin(inventoryItem, eq(inventoryItem.id, inventoryLevel.inventoryItemId));

  const lowStock = levels
    .map((l) => ({
      inventoryItemId: l.inventoryItemId,
      sku: l.sku,
      name: l.name,
      available: l.stocked - l.reserved,
    }))
    .filter((l) => l.available < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.available - b.available);

  /*
   * Orders whose latest event is `placed` — nothing has shipped.
   * State is derived, never a column (data-model.md §7.3), so this asks the
   * event table rather than trusting a status field that does not exist.
   */
  const awaiting = await db
    .select({
      orderNumber: order.orderNumber,
      id: order.id,
      placedAt: order.createdAt,
      /*
       * The outer column MUST be qualified. Interpolating `${order.id}` emits a
       * bare `"id"`, which inside this subquery binds to `order_event.id`
       * (bigint) rather than `order.id` (uuid) — the inner table shadows the
       * outer one — and Postgres rejects the whole statement at parse time with
       * `operator does not exist: uuid = bigint`.
       *
       * This made /admin a 500 from the day it was written. It went unnoticed
       * because features/admin.md §8's "signed-in worklist renders" check had
       * been SKIPPED since 2 Sep 2026 for want of a password; the end-to-end
       * test added with ADR-0012 rendered the page for the first time and it
       * failed immediately.
       */
      latest: sql<string>`(
        SELECT e.type FROM order_event e
        WHERE e.order_id = "order"."id"
        ORDER BY e.id DESC LIMIT 1
      )`,
    })
    .from(order)
    .orderBy(order.createdAt);

  const ordersAwaitingFulfilment = awaiting
    .filter((o) => o.latest === 'placed' || o.latest === 'payment_captured')
    .map(({ orderNumber, id, placedAt }) => ({ orderNumber, id, placedAt }));

  /*
   * R-66: has anyone ever counted the stock? The seed wrote development
   * quantities and every adjustment writes an audit row, so "no stock.adjust
   * has ever been recorded" is a reliable proxy for "these numbers are still
   * invented".
   */
  const [{ adjustments }] = await db
    .select({
      adjustments: sql<number>`(
        SELECT count(*)::int FROM admin_action WHERE action = 'stock.adjust'
      )`,
    })
    .from(sql`(SELECT 1) AS one`);

  return {
    unpricedVariants,
    lowStock,
    ordersAwaitingFulfilment,
    stockNeverCounted: adjustments === 0,
  };
}
