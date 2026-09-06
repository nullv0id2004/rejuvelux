/**
 * Order placement — features/checkout.md §2, the moment intent becomes
 * commitment. One transaction: snapshot, reserve, complete the cart, append
 * `placed` — or nothing at all happens.
 *
 * Race 2 (double submit) is closed by UNIQUE(cart_id) on `order`, not by any
 * pre-check: the second placement hits the constraint, and the handler
 * returns the existing order. Race 1 is closed inside reserveForOrder, which
 * joins this transaction.
 *
 * The payment seam (features/checkout.md §2.4): the Razorpay phase inserts
 * payment-intent creation between cart completion and the event append.
 * Nothing else here changes.
 */

import { asc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/client';
import {
  cart,
  cartLine,
  inventoryItem,
  order,
  orderEvent,
  orderLine,
  product,
  productVariant,
  variantInventoryItem,
} from '../db/schema';
import { reserveForOrder } from '../inventory/reserve';

/* ---------------------------------------------------------------- input -- */

export interface CheckoutInput {
  contact: { email: string; phone: string };
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  gift?: { isGift: true; message?: string };
}

export type PlaceResult =
  | {
      ok: true;
      /** false = idempotent replay of an already-placed cart (200, not 201). */
      created: boolean;
      orderId: string;
      orderNumber: string;
      subtotalPaise: number;
      shippingPaise: number;
      totalPaise: number;
      lines: { name: string; quantity: number; unitPricePaise: number }[];
      state: 'placed';
    }
  | { ok: false; error: 'EMPTY_CART'; message: string }
  | { ok: false; error: 'BAD_REQUEST'; message: string }
  | {
      ok: false;
      error: 'UNAVAILABLE';
      message: string;
      lines: { name: string }[];
    }
  | {
      ok: false;
      error: 'REQUOTED';
      message: string;
      lines: { name: string; wasPaise: number; nowPaise: number }[];
    }
  | {
      ok: false;
      error: 'OUT_OF_STOCK';
      message: string;
      products: string[];
    };

/* ----------------------------------------------------------- validation -- */

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_IN = /^[0-9]{10}$/; // India-only (R-23)
const PINCODE = /^[0-9]{6}$/; //  backs the DB CHECK

function validate(input: CheckoutInput): string | null {
  const { contact, shipping, gift } = input;
  if (!contact?.email || !EMAIL.test(contact.email)) return 'A valid email is required.';
  if (!contact?.phone || !PHONE_IN.test(contact.phone))
    return 'Phone must be a 10 digit Indian mobile number.';
  for (const [field, value] of [
    ['name', shipping?.name],
    ['line1', shipping?.line1],
    ['city', shipping?.city],
    ['state', shipping?.state],
  ] as const) {
    if (!value || !value.trim()) return `Shipping ${field} is required.`;
  }
  if (!shipping?.pincode || !PINCODE.test(shipping.pincode))
    return 'Pincode must be 6 digits.';
  if (gift?.message && gift.isGift !== true)
    return 'A gift message requires the order to be marked as a gift.';
  return null;
}

/* ------------------------------------------------------------ placement -- */

/**
 * shipping_paise = 0, PROVISIONAL — the one number here not from a document.
 * Charging an invented rate would be worse than charging nothing;
 * features/shipping.md owns the real answer (features/checkout.md §2.3).
 */
const SHIPPING_PAISE = 0;

export async function placeOrder(
  cartId: string | null,
  input: CheckoutInput
): Promise<PlaceResult> {
  const invalid = validate(input);
  if (invalid) return { ok: false, error: 'BAD_REQUEST', message: invalid };

  // The open cart and its lines, joined to current catalogue truth.
  if (!cartId) return emptyCart();
  const [cartRow] = await db.select().from(cart).where(eq(cart.id, cartId));
  if (!cartRow) return emptyCart();
  if (cartRow.status !== 'open') {
    // A completed cart with an order is the sequential retry (§4: response
    // lost, client resubmits) — the idempotent replay, same as the race path.
    const existing = await readPlacedOrder(cartId);
    if (existing) return existing;
    return emptyCart();
  }

  const lines = await db
    .select({
      lineId: cartLine.id,
      quantity: cartLine.quantity,
      snapshotPaise: cartLine.unitPricePaise,
      variantId: productVariant.id,
      currentPaise: productVariant.pricePaise,
      variantName: productVariant.name,
      variantStatus: productVariant.status,
      productName: product.name,
      productStatus: product.status,
    })
    .from(cartLine)
    .innerJoin(productVariant, eq(productVariant.id, cartLine.variantId))
    .innerJoin(product, eq(product.id, productVariant.productId))
    .where(eq(cartLine.cartId, cartId))
    .orderBy(asc(cartLine.createdAt));
  if (lines.length === 0) return emptyCart();

  // Gate: nothing retired, nothing priceless (invariant 9 holds at every gate).
  const unavailable = lines.filter(
    (l) =>
      l.variantStatus !== 'active' || l.productStatus !== 'active' || l.currentPaise === null
  );
  if (unavailable.length > 0) {
    return {
      ok: false,
      error: 'UNAVAILABLE',
      message: `No longer available: ${unavailable.map((l) => l.productName).join(', ')}. Remove to continue.`,
      lines: unavailable.map((l) => ({ name: l.productName })),
    };
  }

  // Re-quote (features/checkout.md §2.2): differences update the cart and
  // refuse the order — a knowing resubmit succeeds at the new numbers.
  const changed = lines.filter((l) => l.currentPaise !== l.snapshotPaise);
  if (changed.length > 0) {
    for (const l of changed) {
      await db
        .update(cartLine)
        .set({ unitPricePaise: l.currentPaise!, updatedAt: sql`now()` })
        .where(eq(cartLine.id, l.lineId));
    }
    return {
      ok: false,
      error: 'REQUOTED',
      message: 'Prices changed while these items were in the cart. Review and resubmit.',
      lines: changed.map((l) => ({
        name: l.productName,
        wasPaise: l.snapshotPaise,
        nowPaise: l.currentPaise!,
      })),
    };
  }

  const subtotalPaise = lines.reduce((s, l) => s + l.snapshotPaise * l.quantity, 0);
  const totalPaise = subtotalPaise + SHIPPING_PAISE;

  try {
    return await db.transaction(async (tx) => {
      // 2. The order, number from the sequence, everything embedded (snapshots).
      const [orderRow] = await tx
        .insert(order)
        .values({
          orderNumber: sql`'RJ-' || lpad(nextval('order_number_seq')::text, 5, '0')`,
          cartId,
          email: input.contact.email,
          phone: input.contact.phone,
          shipName: input.shipping.name,
          shipLine1: input.shipping.line1,
          shipLine2: input.shipping.line2 ?? null,
          shipCity: input.shipping.city,
          shipState: input.shipping.state,
          shipPincode: input.shipping.pincode,
          isGift: input.gift?.isGift === true,
          giftMessage: input.gift?.isGift === true ? (input.gift.message ?? null) : null,
          subtotalPaise,
          shippingPaise: SHIPPING_PAISE,
          totalPaise,
        })
        .returning({ id: order.id, orderNumber: order.orderNumber });

      // 3. Lines — snapshots the customer can be shown forever.
      await tx.insert(orderLine).values(
        lines.map((l) => ({
          orderId: orderRow.id,
          variantId: l.variantId,
          productName: l.productName,
          variantName: l.variantName,
          quantity: l.quantity,
          unitPricePaise: l.snapshotPaise,
          lineTotalPaise: l.snapshotPaise * l.quantity,
        }))
      );

      // 4. Reserve — inventory's transaction, joined to this one. All or nothing.
      const reserved = await reserveForOrder(
        orderRow.id,
        lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        tx
      );
      if (!reserved.ok) {
        const names = await shortProductNames(reserved.short.map((s) => s.inventoryItemId));
        // Throwing rolls the whole placement back — order, lines, everything.
        throw new OutOfStockRollback(names);
      }

      // 5. Complete the cart — terminal, never reopened.
      await tx
        .update(cart)
        .set({ status: 'completed', updatedAt: sql`now()` })
        .where(eq(cart.id, cartId));

      // (§2.4 — the payment phase inserts intent creation HERE.)

      // 6. The order's first event.
      await tx.insert(orderEvent).values({ orderId: orderRow.id, type: 'placed' });

      return {
        ok: true as const,
        created: true,
        orderId: orderRow.id,
        orderNumber: orderRow.orderNumber,
        subtotalPaise,
        shippingPaise: SHIPPING_PAISE,
        totalPaise,
        lines: lines.map((l) => ({
          name: l.productName,
          quantity: l.quantity,
          unitPricePaise: l.snapshotPaise,
        })),
        state: 'placed' as const,
      };
    });
  } catch (e) {
    if (e instanceof OutOfStockRollback) {
      return {
        ok: false,
        error: 'OUT_OF_STOCK',
        message: `Not enough stock: ${e.products.join(', ')}. The cart has not been charged or changed.`,
        products: e.products,
      };
    }
    // Race 2: UNIQUE(cart_id) fired — this cart already has its order.
    if (isUniqueViolation(e, 'order_cart_unique')) {
      const existing = await readPlacedOrder(cartId);
      if (existing) return existing;
    }
    throw e;
  }
}

/* -------------------------------------------------------------- helpers -- */

function emptyCart(): PlaceResult {
  return {
    ok: false,
    error: 'EMPTY_CART',
    message: 'There is nothing in the cart to order.',
  };
}

class OutOfStockRollback extends Error {
  constructor(public products: string[]) {
    super('out of stock');
  }
}

/** Short inventory items → the catalogue names a customer recognises. */
async function shortProductNames(itemIds: string[]): Promise<string[]> {
  const rows = await db
    .selectDistinct({ name: product.name })
    .from(inventoryItem)
    .innerJoin(
      variantInventoryItem,
      eq(variantInventoryItem.inventoryItemId, inventoryItem.id)
    )
    .innerJoin(productVariant, eq(productVariant.id, variantInventoryItem.variantId))
    .innerJoin(product, eq(product.id, productVariant.productId))
    .where(inArray(inventoryItem.id, itemIds));
  return rows.map((r) => r.name);
}

function isUniqueViolation(e: unknown, constraint: string): boolean {
  // postgres-js surfaces code 23505; drizzle may wrap it in .cause.
  const err = (e as { cause?: unknown })?.cause ?? e;
  const pg = err as { code?: string; constraint_name?: string; message?: string };
  return (
    pg?.code === '23505' &&
    (pg.constraint_name === constraint || (pg.message ?? '').includes(constraint))
  );
}

/** The idempotent replay: same content as the first response, created: false. */
async function readPlacedOrder(cartId: string): Promise<PlaceResult | null> {
  const [existing] = await db.select().from(order).where(eq(order.cartId, cartId));
  if (!existing) return null;
  const lines = await db
    .select({
      name: orderLine.productName,
      quantity: orderLine.quantity,
      unitPricePaise: orderLine.unitPricePaise,
    })
    .from(orderLine)
    .where(eq(orderLine.orderId, existing.id));
  return {
    ok: true,
    created: false,
    orderId: existing.id,
    orderNumber: existing.orderNumber,
    subtotalPaise: existing.subtotalPaise,
    shippingPaise: existing.shippingPaise,
    totalPaise: existing.totalPaise,
    lines,
    state: 'placed',
  };
}
