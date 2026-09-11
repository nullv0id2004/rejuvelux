/**
 * POST /api/cart/lines — add a line by slug (features/cart.md §2.2, §3).
 * The first write creates the cart and sets the cookie. 201 with the fresh
 * cart view; structured refusals as { error, message }.
 */

import { NextRequest, NextResponse } from 'next/server';
import { addLine, readCart, CartError } from '@/lib/server/cart/cart';
import { CART_COOKIE, setCartCookie } from '../cookie';

const STATUS: Record<string, number> = {
  NOT_FOUND: 404,
  NOT_PURCHASABLE: 409,
  QUANTITY_LIMIT: 409,
  BAD_REQUEST: 400,
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
  const { slug, quantity } = (body ?? {}) as { slug?: unknown; quantity?: unknown };
  if (typeof slug !== 'string' || typeof quantity !== 'number') {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Expected { slug: string, quantity: number }.' },
      { status: 400 }
    );
  }

  const cookieCartId = req.cookies.get(CART_COOKIE)?.value ?? null;
  try {
    const { cartId } = await addLine(cookieCartId, slug, quantity);
    const view = await readCart(cartId);
    const res = NextResponse.json(view, { status: 201 });
    // Refresh the cookie on every write — a new cart gets its ticket, an
    // existing one gets its 30 days rolled forward.
    setCartCookie(res, cartId);
    return res;
  } catch (e) {
    if (e instanceof CartError) {
      return NextResponse.json(
        { error: e.code, message: e.message },
        { status: STATUS[e.code] ?? 400 }
      );
    }
    throw e;
  }
}
