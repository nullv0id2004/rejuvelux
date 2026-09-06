/**
 * Cart domain — features/cart.md governs behaviour, data-model.md §6 the shape.
 *
 * A cart is intent, held honestly: price snapshotted at add, stock states
 * reported live, nothing reserved until checkout commits it. Reads never
 * create; a cart row exists only once something was added.
 */

import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { cart, cartLine, product, productVariant } from '../db/schema';
import {
  getVariantAvailability,
  stockState,
  type StockState,
} from '../inventory/availability';

export const QUANTITY_CAP = 10;

/** Structured refusals — the API voices these verbatim (features/cart.md §2.2). */
export type CartErrorCode =
  | 'NOT_FOUND'
  | 'NOT_PURCHASABLE'
  | 'QUANTITY_LIMIT'
  | 'BAD_REQUEST';

export class CartError extends Error {
  constructor(
    public code: CartErrorCode,
    message: string
  ) {
    super(message);
  }
}

export interface CartLineView {
  lineId: string;
  slug: string;
  name: string;
  quantity: number;
  /** The price shown at add time — what the customer agreed to. */
  unitPricePaise: number;
  /** The price now. Differences are surfaced, never silently substituted. */
  currentPricePaise: number | null;
  priceChanged: boolean;
  netQuantity: string;
  stockState: StockState;
  /** Variant retired since add — shown, excluded from subtotal, refused at checkout. */
  unavailable: boolean;
}

export interface CartView {
  cartId: string | null;
  lines: CartLineView[];
  /** Σ snapshot line totals over available lines. No other arithmetic exists (§49). */
  subtotalPaise: number;
}

const EMPTY: CartView = { cartId: null, lines: [], subtotalPaise: 0 };

/** A cookie is only as good as the open cart it points at. */
async function liveCart(cartId: string | null): Promise<string | null> {
  if (!cartId) return null;
  const [row] = await db
    .select({ id: cart.id, status: cart.status })
    .from(cart)
    .where(eq(cart.id, cartId));
  return row && row.status === 'open' ? row.id : null;
}

/** Read the cart (features/cart.md §2.3). Never creates. */
export async function readCart(cartId: string | null): Promise<CartView> {
  const id = await liveCart(cartId);
  if (!id) return EMPTY;

  const rows = await db
    .select({
      lineId: cartLine.id,
      quantity: cartLine.quantity,
      unitPricePaise: cartLine.unitPricePaise,
      variantId: productVariant.id,
      currentPricePaise: productVariant.pricePaise,
      variantStatus: productVariant.status,
      netQuantity: productVariant.netQuantity,
      slug: product.slug,
      name: product.name,
      productStatus: product.status,
    })
    .from(cartLine)
    .innerJoin(productVariant, eq(productVariant.id, cartLine.variantId))
    .innerJoin(product, eq(product.id, productVariant.productId))
    .where(eq(cartLine.cartId, id))
    .orderBy(asc(cartLine.createdAt));

  const availability = await getVariantAvailability(rows.map((r) => r.variantId));

  const lines: CartLineView[] = rows.map((r) => {
    const unavailable = r.variantStatus !== 'active' || r.productStatus !== 'active';
    return {
      lineId: r.lineId,
      slug: r.slug,
      name: r.name,
      quantity: r.quantity,
      unitPricePaise: r.unitPricePaise,
      currentPricePaise: r.currentPricePaise,
      priceChanged: r.currentPricePaise !== r.unitPricePaise,
      netQuantity: r.netQuantity,
      stockState: stockState(availability.get(r.variantId) ?? 0),
      unavailable,
    };
  });

  return {
    cartId: id,
    lines,
    subtotalPaise: lines
      .filter((l) => !l.unavailable)
      .reduce((sum, l) => sum + l.unitPricePaise * l.quantity, 0),
  };
}

/**
 * Add a line by product slug (features/cart.md §2.2). Creates the cart on
 * first write — the returned cartId is what the cookie must then carry.
 *
 * Same variant again = atomic quantity merge via ON CONFLICT; a merge that
 * would pass the cap is refused whole, not clamped.
 */
export async function addLine(
  cartId: string | null,
  slug: string,
  quantity: number
): Promise<{ cartId: string; created: boolean }> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new CartError('BAD_REQUEST', 'Quantity must be a whole number of at least 1.');
  }
  if (quantity > QUANTITY_CAP) {
    throw new CartError(
      'QUANTITY_LIMIT',
      `No more than ${QUANTITY_CAP} of one item per order.`
    );
  }

  const [target] = await db
    .select({
      variantId: productVariant.id,
      pricePaise: productVariant.pricePaise,
      variantStatus: productVariant.status,
      productStatus: product.status,
      name: product.name,
    })
    .from(product)
    .innerJoin(productVariant, eq(productVariant.productId, product.id))
    .where(eq(product.slug, slug));

  if (!target || target.variantStatus !== 'active' || target.productStatus !== 'active') {
    throw new CartError('NOT_FOUND', 'That product is not available.');
  }
  if (target.pricePaise === null) {
    // Invariant 9: an unconfirmed price is never sold (R-04, open call #4).
    throw new CartError(
      'NOT_PURCHASABLE',
      `${target.name} does not have a confirmed price yet and cannot be ordered.`
    );
  }

  let id = await liveCart(cartId);
  let created = false;
  if (!id) {
    const [row] = await db.insert(cart).values({}).returning({ id: cart.id });
    id = row.id;
    created = true;
  }

  // Atomic merge: two tabs adding concurrently produce one line, summed.
  // The setWhere keeps the merge under the cap; a refused merge updates
  // nothing and RETURNING comes back empty — which we surface as the limit.
  const merged = await db
    .insert(cartLine)
    .values({
      cartId: id,
      variantId: target.variantId,
      quantity,
      unitPricePaise: target.pricePaise,
    })
    .onConflictDoUpdate({
      target: [cartLine.cartId, cartLine.variantId],
      set: {
        quantity: sql`${cartLine.quantity} + ${quantity}`,
        updatedAt: sql`now()`,
      },
      setWhere: sql`${cartLine.quantity} + ${quantity} <= ${QUANTITY_CAP}`,
    })
    .returning({ id: cartLine.id });

  if (merged.length === 0) {
    throw new CartError(
      'QUANTITY_LIMIT',
      `No more than ${QUANTITY_CAP} of one item per order.`
    );
  }
  return { cartId: id, created };
}

/** Set a line's quantity; 0 removes (features/cart.md §2.4). 404s outside this cart. */
export async function setLineQuantity(
  cartId: string | null,
  lineId: string,
  quantity: number
): Promise<void> {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new CartError('BAD_REQUEST', 'Quantity must be a whole number of at least 0.');
  }
  if (quantity > QUANTITY_CAP) {
    throw new CartError(
      'QUANTITY_LIMIT',
      `No more than ${QUANTITY_CAP} of one item per order.`
    );
  }
  const id = await liveCart(cartId);
  if (!id) throw new CartError('NOT_FOUND', 'No open cart.');

  if (quantity === 0) {
    const deleted = await db
      .delete(cartLine)
      .where(and(eq(cartLine.id, lineId), eq(cartLine.cartId, id)))
      .returning({ id: cartLine.id });
    if (deleted.length === 0) throw new CartError('NOT_FOUND', 'No such line in this cart.');
    return;
  }

  const updated = await db
    .update(cartLine)
    .set({ quantity, updatedAt: sql`now()` })
    .where(and(eq(cartLine.id, lineId), eq(cartLine.cartId, id)))
    .returning({ id: cartLine.id });
  if (updated.length === 0) throw new CartError('NOT_FOUND', 'No such line in this cart.');
}

/** Remove a line. 404s outside this cart. */
export async function removeLine(cartId: string | null, lineId: string): Promise<void> {
  await setLineQuantity(cartId, lineId, 0);
}
