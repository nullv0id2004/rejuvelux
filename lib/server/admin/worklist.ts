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
  unpricedVariants: { productName: string; sku: string; slug: string }[];
  lowStock: { sku: string; name: string; available: number }[];
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
      sku: inventoryItem.sku,
      name: inventoryItem.name,
      stocked: inventoryLevel.stockedQuantity,
      reserved: inventoryLevel.reservedQuantity,
    })
    .from(inventoryLevel)
    .innerJoin(inventoryItem, eq(inventoryItem.id, inventoryLevel.inventoryItemId));

  const lowStock = levels
    .map((l) => ({ sku: l.sku, name: l.name, available: l.stocked - l.reserved }))
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
      latest: sql<string>`(
        SELECT e.type FROM order_event e
        WHERE e.order_id = ${order.id}
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
