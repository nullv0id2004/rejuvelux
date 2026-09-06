/**
 * GET /api/cart — read the cart (features/cart.md §2.3, §3).
 * Reads never create: no cookie, or a dead one, returns the empty shape and
 * sets nothing. The cookie is set only by the first write (lines/route.ts).
 */

import { NextRequest, NextResponse } from 'next/server';
import { readCart } from '@/lib/server/cart/cart';
import { CART_COOKIE } from './cookie';

export async function GET(req: NextRequest) {
  const cartId = req.cookies.get(CART_COOKIE)?.value ?? null;
  const view = await readCart(cartId);
  return NextResponse.json(view);
}
