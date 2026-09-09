/**
 * Inventory, as the admin sees it — `features/admin.md` §4, stage 2.
 *
 * Reads only. Every write goes through `adjustStock()` in
 * `lib/server/inventory/reserve.ts`, which is the only sanctioned way
 * `stocked_quantity` changes (`features/inventory.md` §4.4) and which requires
 * a reason. §6.1 is the rule this file exists to respect: the domain layer is
 * the only writer, and an admin screen never issues its own SQL.
 *
 * **Available is computed, never stored and never editable** (§4). It is
 * stocked minus what is already promised to open orders, and showing it as an
 * editable field would invite someone to "fix" a number that is a consequence
 * rather than a fact.
 */

import { asc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import {
  inventoryItem,
  inventoryLevel,
  product,
  productVariant,
  variantInventoryItem,
} from '../db/schema';
import { LOW_STOCK_THRESHOLD, stockState } from '../inventory/availability';

export type InventoryRow = {
  itemId: string;
  sku: string;
  name: string;
  stocked: number;
  reserved: number;
  /** stocked − reserved. Derived here so no screen can invent its own answer. */
  available: number;
  state: ReturnType<typeof stockState>;
  /** Which sellable things consume this item, for context on the adjust page. */
  usedBy: { productName: string; variantSku: string; requiredQuantity: number }[];
  updatedAt: Date;
};

/** Every stock-tracked item, scarcest first — the order an operator wants. */
export async function listInventory(): Promise<InventoryRow[]> {
  const rows = await db
    .select({
      itemId: inventoryItem.id,
      sku: inventoryItem.sku,
      name: inventoryItem.name,
      stocked: inventoryLevel.stockedQuantity,
      reserved: inventoryLevel.reservedQuantity,
      updatedAt: inventoryLevel.updatedAt,
    })
    .from(inventoryItem)
    .innerJoin(inventoryLevel, eq(inventoryLevel.inventoryItemId, inventoryItem.id))
    .orderBy(asc(sql`${inventoryLevel.stockedQuantity} - ${inventoryLevel.reservedQuantity}`));

  const links = await db
    .select({
      inventoryItemId: variantInventoryItem.inventoryItemId,
      requiredQuantity: variantInventoryItem.requiredQuantity,
      variantSku: productVariant.sku,
      productName: product.name,
    })
    .from(variantInventoryItem)
    .innerJoin(productVariant, eq(productVariant.id, variantInventoryItem.variantId))
    .innerJoin(product, eq(product.id, productVariant.productId));

  return rows.map((r) => {
    const available = r.stocked - r.reserved;
    return {
      ...r,
      available,
      state: stockState(available),
      usedBy: links
        .filter((l) => l.inventoryItemId === r.itemId)
        .map(({ productName, variantSku, requiredQuantity }) => ({
          productName,
          variantSku,
          requiredQuantity,
        })),
    };
  });
}

/** One item, or null. Same shape as the list so the pages agree. */
export async function getInventoryRow(itemId: string): Promise<InventoryRow | null> {
  const all = await listInventory();
  return all.find((r) => r.itemId === itemId) ?? null;
}

export { LOW_STOCK_THRESHOLD };

/**
 * Did this error come from the no-oversell CHECK?
 *
 * Drizzle wraps a driver error in a `DrizzleQueryError` whose `message` is the
 * failed SQL, not the constraint — so the obvious `message.includes(...)` never
 * matches and the refusal silently falls through to a 500. Found by the stage 2
 * exit test, which asserted on the constraint name and failed.
 *
 * The constraint lives on the underlying postgres error, reachable through the
 * `cause` chain, and may appear as a field or in that error's own message.
 */
export function isOversellError(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; current && depth < 5; depth++) {
    const e = current as { message?: string; constraint_name?: string; constraint?: string; cause?: unknown };
    const named = e.constraint_name ?? e.constraint;
    if (named && /no_oversell/i.test(named)) return true;
    if (typeof e.message === 'string' && /no_oversell/i.test(e.message)) return true;
    current = e.cause;
  }
  return false;
}
