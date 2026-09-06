/**
 * POST /api/checkout — placement (features/checkout.md §2–§3).
 * 201 on creation, idempotent 200 on replay of an already-placed cart;
 * structured refusals per the doc's table. Clears the cart cookie on success —
 * the completed cart is checkout's record, not the browser's.
 */

import { NextRequest, NextResponse } from 'next/server';
import { placeOrder, type CheckoutInput } from '@/lib/server/orders/place';
import { CART_COOKIE } from '../cart/cookie';

const STATUS: Record<string, number> = {
  EMPTY_CART: 400,
  BAD_REQUEST: 400,
  UNAVAILABLE: 409,
  REQUOTED: 409,
  OUT_OF_STOCK: 409,
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Body must be JSON.' },
      { status: 400 }
    );
  }

  const cartId = req.cookies.get(CART_COOKIE)?.value ?? null;
  const result = await placeOrder(cartId, body as CheckoutInput);

  if (!result.ok) {
    return NextResponse.json(result, { status: STATUS[result.error] ?? 400 });
  }

  const { created, ...view } = result;
  const res = NextResponse.json(view, { status: created ? 201 : 200 });
  res.cookies.delete(CART_COOKIE);
  return res;
}
