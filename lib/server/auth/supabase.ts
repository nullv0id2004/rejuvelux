/**
 * Supabase Auth clients — ADR-0008's identity decision, features/admin.md §7.
 *
 * Supabase Auth holds credentials; our `admin_user` table holds the profile and
 * role. No password ever enters our tables. This module is the ONLY place a
 * Supabase client is constructed, so the cookie contract lives in one file.
 *
 * Two clients, because Next.js gives them different cookie powers:
 *   - createServerClient() — server components and route handlers
 *   - createProxyClient()  — proxy.ts (Next 16's renamed middleware), which is
 *                            where the session refresh must happen so a
 *                            rotated token is written back to the browser
 *
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.
 * They fail loudly for the same reason DATABASE_URL does: a storefront quietly
 * serving a broken login is worse than one that will not start.
 */

import { createServerClient as createSSRClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function config(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. ' +
        'Supabase dashboard → Project Settings → API. Add both to apps/web/.env.local.'
    );
  }
  return { url, anonKey };
}

/** For server components and route handlers. */
export async function createServerClient() {
  const { url, anonKey } = config();
  const cookieStore = await cookies();
  return createSSRClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a server component, where cookies are read-only.
          // Middleware refreshes the session, so this is safe to ignore —
          // the documented @supabase/ssr pattern.
        }
      },
    },
  });
}

/**
 * For proxy.ts. Writes refreshed auth cookies onto the response, which is why
 * the caller must return the exact response object it passed in.
 */
export function createProxyClient(req: NextRequest, res: NextResponse) {
  const { url, anonKey } = config();
  return createSSRClient(url, anonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => req.cookies.set(name, value));
        toSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });
}
