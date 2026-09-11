/**
 * Variant availability — the read path (features/inventory.md §4.1).
 *
 * Algorithm ported from Medusa v2.19.0,
 * packages/core/utils/src/product/get-variant-availability.ts:
 *   per link:  floor((stocked − reserved) / required_quantity)
 *   variant :  min across its links; zero links → 0 (fail closed, not infinite)
 * The MIT License (MIT) — Copyright (c) MedusaJS, Inc.
 * Simplifications vs upstream, per data-model.md §4: single location (no
 * sales-channel/location filter), no backorder flag (backorders do not exist).
 *
 * Computed live from inventory_level — no cached availability column exists to
 * drift. One query for any number of variants (the catalogue calls this once).
 */

import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/client';
import { inventoryLevel, variantInventoryItem } from '../db/schema';

export type AvailabilityMap = Map<string, number>;

/** Low-stock threshold — PROVISIONAL 5 (features/inventory.md §3). */
export const LOW_STOCK_THRESHOLD = 5;

export type StockState = 'available' | 'low' | 'out_of_stock';

export function stockState(availability: number): StockState {
  if (availability <= 0) return 'out_of_stock';
  if (availability < LOW_STOCK_THRESHOLD) return 'low';
  return 'available';
}

/**
 * Availability for a set of variants, one query.
 * Ids with no kit links (misconfigured products) stay at 0 — fail closed.
 */
export async function getVariantAvailability(
  variantIds: string[]
): Promise<AvailabilityMap> {
  const result: AvailabilityMap = new Map(variantIds.map((id) => [id, 0]));
  if (variantIds.length === 0) return result;

  const links = await db
    .select({
      variantId: variantInventoryItem.variantId,
      requiredQuantity: variantInventoryItem.requiredQuantity,
      stocked: inventoryLevel.stockedQuantity,
      reserved: inventoryLevel.reservedQuantity,
    })
    .from(variantInventoryItem)
    .innerJoin(
      inventoryLevel,
      eq(inventoryLevel.inventoryItemId, variantInventoryItem.inventoryItemId)
    )
    .where(inArray(variantInventoryItem.variantId, variantIds));

  // min over links of floor(available / required) — Medusa's computeVariantAvailability
  const seen = new Set<string>();
  for (const link of links) {
    const deliverable = Math.floor(
      (link.stocked - link.reserved) / link.requiredQuantity
    );
    if (!seen.has(link.variantId)) {
      seen.add(link.variantId);
      result.set(link.variantId, deliverable);
    } else {
      result.set(
        link.variantId,
        Math.min(result.get(link.variantId)!, deliverable)
      );
    }
  }
  return result;
}

/** Convenience for a single variant (product page). */
export async function getAvailability(variantId: string): Promise<number> {
  const map = await getVariantAvailability([variantId]);
  return map.get(variantId) ?? 0;
}
