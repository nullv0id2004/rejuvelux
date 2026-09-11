/**
 * The cart cookie contract (features/cart.md §2.1): httpOnly claim ticket,
 * set only on the first write, 30 days, Secure in production.
 */

import type { NextResponse } from 'next/server';

export const CART_COOKIE = 'rj_cart';
const THIRTY_DAYS_S = 30 * 24 * 60 * 60;

export function setCartCookie(res: NextResponse, cartId: string): void {
  res.cookies.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: THIRTY_DAYS_S,
    path: '/',
  });
}
