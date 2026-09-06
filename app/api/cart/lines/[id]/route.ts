/**
 * PATCH  /api/cart/lines/:id — set quantity (0 removes)  (features/cart.md §2.4)
 * DELETE /api/cart/lines/:id — remove
 * Lookups always scope to the cookie's cart: a line id from any other cart 404s.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  CartError,
  readCart,
  removeLine,
  setLineQuantity,
} from '@/lib/server/cart/cart';
import { CART_COOKIE } from '../../cookie';

const STATUS: Record<string, number> = {
  NOT_FOUND: 404,
  QUANTITY_LIMIT: 409,
  BAD_REQUEST: 400,
};

function fail(e: unknown): NextResponse {
  if (e instanceof CartError) {
    return NextResponse.json(
      { error: e.code, message: e.message },
      { status: STATUS[e.code] ?? 400 }
    );
  }
  throw e;
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const cartId = req.cookies.get(CART_COOKIE)?.value ?? null;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Body must be JSON.' },
      { status: 400 }
    );
  }
  const { quantity } = (body ?? {}) as { quantity?: unknown };
  if (typeof quantity !== 'number') {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Expected { quantity: number }.' },
      { status: 400 }
    );
  }

  try {
    await setLineQuantity(cartId, id, quantity);
    return NextResponse.json(await readCart(cartId));
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const cartId = req.cookies.get(CART_COOKIE)?.value ?? null;
  try {
    await removeLine(cartId, id);
    return NextResponse.json(await readCart(cartId));
  } catch (e) {
    return fail(e);
  }
}
