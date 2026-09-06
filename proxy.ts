/**
 * The admin guard — features/admin.md §8 stage 1, ADR-0008.
 *
 * One of exactly two places authorisation is enforced (the other is
 * lib/server/auth/session.ts), so the whole model can be audited by reading
 * two files.
 *
 * **This file is `proxy.ts`, not `middleware.ts`.** Next.js 16 deprecated the
 * middleware convention and renamed it; the build warns on the old name. Read
 * from the shipped reference at
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 * rather than assumed — the request/response API and `config.matcher` are
 * unchanged, only the filename and the exported function name differ.
 *
 * What this does and does not do:
 *   - DOES refresh the Supabase session on every admin request, so a rotated
 *     token is written back to the browser. That is why the response object
 *     created here must be the one returned.
 *   - DOES redirect an unauthenticated visitor to /admin/login, preserving
 *     where they were going.
 *   - DOES NOT check the admin_user row or the role. This runs before render,
 *     without a database connection; session.ts owns that second gate and
 *     every page and action calls it. **A valid Supabase user is not an admin**
 *     — this guard only establishes "signed in to something".
 *
 * The storefront is untouched: the matcher covers /admin only.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createProxyClient } from '@/lib/server/auth/supabase';

const LOGIN_PATH = '/admin/login';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supabase = createProxyClient(req, res);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;
  const isLogin = pathname === LOGIN_PATH;

  if (!user && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    // Preserve the destination so login can return them to it.
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  // /admin and everything under it. Nothing else in the app is guarded.
  matcher: ['/admin/:path*'],
};
