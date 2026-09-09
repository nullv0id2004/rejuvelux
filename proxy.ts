/**
 * The admin guard — `features/admin.md` §8 stage 1 · ADR-0008's roles ·
 * ADR-0012's mechanism.
 *
 * One of exactly two places authorisation is enforced (the other is
 * `lib/server/auth/session.ts`), so the whole model can be audited by reading
 * two files.
 *
 * **This file is `proxy.ts`, not `middleware.ts`.** Next.js 16 deprecated the
 * middleware convention and renamed it. Read from the shipped reference at
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 * rather than assumed.
 *
 * **This is an optimistic check, and only that.** The same reference is
 * explicit: Proxy "should not be used as a full session management or
 * authorization solution", and names permission-based redirects as the
 * appropriate use. So the division is deliberate:
 *
 *   - HERE: verify the access token's signature, expiry and audience, and
 *     redirect if it is missing or bad. No database, no role.
 *   - `session.ts`: the real decision — the `app_user` row still exists, its
 *     `token_version` still matches, an `active` `admin_user` row exists, and
 *     the role permits the action. **Every page and action calls it.**
 *
 * A valid token is therefore not admission. It only means "this browser holds a
 * session our own key signed for the admin surface, and it has not expired."
 *
 * The storefront is untouched: the matcher covers /admin only.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE } from '@/lib/server/auth/config';
import { verifyToken } from '@/lib/server/auth/tokens';

const LOGIN_PATH = '/admin/login';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(COOKIE.admin.access)?.value;
  // Audience is checked here, not merely decoded: a customer session cookie
  // replayed into the admin cookie name fails signature-and-audience together.
  const claims = token ? await verifyToken(token, 'access', 'admin') : null;

  const { pathname } = req.nextUrl;
  const isLogin = pathname === LOGIN_PATH;

  if (!claims && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    // Preserve the destination so login can return them to it.
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (claims && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: req });
}

export const config = {
  // /admin and everything under it. Nothing else in the app is guarded.
  matcher: ['/admin/:path*'],
};
