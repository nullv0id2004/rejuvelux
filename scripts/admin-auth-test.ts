/**
 * Exit test for features/admin.md §8 stage 1 — the auth guard.
 *
 * Stage 1's criterion: "A seeded owner signs in; every other /admin route 302s
 * to login when signed out."
 *
 * Everything except the password-holding half is exercised here. The sign-in
 * itself needs a real password, which deliberately does not live in this repo
 * or in my hands (ADR-0008: credentials stay in Supabase Auth), so §4 below
 * drives Supabase's own token endpoint with a password supplied at runtime:
 *
 *   ADMIN_TEST_PASSWORD=... npx tsx --env-file=.env.local scripts/admin-auth-test.ts
 *
 * Without it, §4 is SKIPPED and reported as skipped — never as passed.
 *
 * Run with the dev server on 3000.
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import { adminUser } from '../lib/server/db/schema';
import { BASE, requireServer } from './_server';

const OWNER_EMAIL = process.env.ADMIN_TEST_EMAIL ?? 'rejuveluxemarketing@gmail.com';
const PASSWORD = process.env.ADMIN_TEST_PASSWORD;

let failures = 0;
let skipped = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) console.log(`  PASS  ${name}`);
  else {
    failures++;
    console.error(`  FAIL  ${name}`, detail ?? '');
  }
}
function skip(name: string, why: string) {
  skipped++;
  console.log(`  SKIP  ${name} — ${why}`);
}

/** Guarded routes from features/admin.md §4, minus the login page itself. */
const GUARDED = [
  '/admin',
  '/admin/inventory',
  '/admin/products',
  '/admin/orders',
  '/admin/customers',
  '/admin/users',
  '/admin/audit',
];

async function main() {
  await requireServer();
  /* §1 — the owner row exists and is what stage 1 requires */
  const [owner] = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.email, OWNER_EMAIL));
  check('owner row exists', !!owner, OWNER_EMAIL);
  check('owner role is owner', owner?.role === 'owner', owner?.role);
  check('owner status is active', owner?.status === 'active', owner?.status);
  check('owner has no password column', !('password' in (owner ?? {})));

  /* §2 — signed out, every guarded route redirects to login */
  for (const path of GUARDED) {
    const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
    const loc = res.headers.get('location') ?? '';
    check(
      `signed out: ${path} → 307/302 to /admin/login`,
      (res.status === 307 || res.status === 302) && loc.includes('/admin/login'),
      { status: res.status, location: loc }
    );
  }

  /* §2b — the redirect preserves the destination */
  const deep = await fetch(`${BASE}/admin/inventory`, { redirect: 'manual' });
  const deepLoc = deep.headers.get('location') ?? '';
  check(
    'redirect preserves ?next=/admin/inventory',
    deepLoc.includes('next=%2Fadmin%2Finventory') || deepLoc.includes('next=/admin/inventory'),
    deepLoc
  );

  /* §3 — the login page itself is reachable while signed out */
  const login = await fetch(`${BASE}/admin/login`, { redirect: 'manual' });
  check('signed out: /admin/login renders 200', login.status === 200, login.status);
  const html = await login.text();
  check('login page has email and password fields', /name="email"/.test(html) && /name="password"/.test(html));
  check(
    'login page ships no auth token in markup',
    !html.includes('eyJhbG'),
    'a JWT-looking string appeared in the HTML'
  );

  /* §4 — the real sign-in, against Supabase's own token endpoint */
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!PASSWORD) {
    skip('sign-in with the owner password', 'ADMIN_TEST_PASSWORD not set');
    skip('signed in: /admin renders the worklist', 'depends on sign-in');
  } else if (!url || !anon) {
    skip('sign-in', 'NEXT_PUBLIC_SUPABASE_URL / ANON_KEY missing');
  } else {
    const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: anon, 'content-type': 'application/json' },
      body: JSON.stringify({ email: OWNER_EMAIL, password: PASSWORD }),
    });
    const body = (await tokenRes.json()) as {
      access_token?: string;
      user?: { id: string };
      error_description?: string;
    };
    check(
      'sign-in returns an access token',
      tokenRes.ok && !!body.access_token,
      body.error_description ?? tokenRes.status
    );
    check(
      'the signed-in identity is the owner row s auth user',
      body.user?.id === owner?.authUserId,
      { got: body.user?.id, expected: owner?.authUserId }
    );
  }

  /* §5 — a valid auth user is NOT automatically an admin (the second gate) */
  const orphans = await db.execute<{ n: number }>(
    sql`SELECT count(*)::int AS n FROM auth.users u
        LEFT JOIN admin_user a ON a.auth_user_id = u.id
        WHERE a.id IS NULL`
  );
  const orphanCount = orphans[0]?.n ?? 0;
  console.log(
    `  note: ${orphanCount} auth user(s) have no admin_user row — such accounts can sign in ` +
      'to Supabase but are not admins (session.ts, the second gate)'
  );

  console.log('');
  if (failures > 0) {
    console.error(`${failures} check(s) FAILED, ${skipped} skipped`);
    process.exit(1);
  }
  console.log(
    skipped > 0
      ? `All run checks passed. ${skipped} SKIPPED — stage 1 is not fully verified until those run.`
      : 'All checks passed.'
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
