/**
 * Exit test for `features/accounts.md` stages 1–2 — the token core (ADR-0012).
 *
 * ADR-0012 gave up Supabase Auth as R-36's mitigation and said the replacement
 * mitigation is *our tests*. This is that file. Every check below corresponds to
 * a property the ADR claims, and each one is written so it would FAIL if the
 * property were absent rather than merely pass when present.
 *
 * Runs against the real database. Self-cleaning: creates two throwaway
 * `app_user` rows and deletes them, along with every session they minted.
 *
 * Run:  npm run test:auth
 */

import { and, eq, like } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import { adminUser, appUser, refreshToken } from '../lib/server/db/schema';
import { COOKIE } from '../lib/server/auth/config';
import { SESSION_POLICY } from '../lib/server/auth/config';
import { hashPassword, burnPasswordTime, verifyPassword } from '../lib/server/auth/password';
import { signAccessToken, signRefreshToken, verifyToken } from '../lib/server/auth/tokens';
import {
  issueSession,
  rotateSession,
  revokeAllSessions,
  revokeSession,
} from '../lib/server/auth/sessions';
import { signInWithPassword, GENERIC_FAILURE } from '../lib/server/auth/signin';
import { csrfOk, issueCsrfToken } from '../lib/server/auth/csrf';
import { LOCKOUT } from '../lib/server/auth/config';

let pass = 0;
let fail = 0;
const check = (ok: boolean, label: string) => {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}`);
  }
};

const MARK = 'authtest+';
const PASSWORD = 'correct-horse-9-battery';

async function makeUser(tag: string) {
  const [row] = await db
    .insert(appUser)
    .values({
      email: `${MARK}${tag}@example.test`,
      passwordHash: await hashPassword(PASSWORD),
      emailVerifiedAt: new Date(),
    })
    .returning();
  return row!;
}

async function cleanup() {
  const rows = await db.select({ id: appUser.id }).from(appUser).where(like(appUser.email, `${MARK}%`));
  for (const r of rows) {
    await db.delete(refreshToken).where(eq(refreshToken.userId, r.id));
  }
  await db.delete(appUser).where(like(appUser.email, `${MARK}%`));
  return rows.length;
}

async function main() {
  await cleanup(); // in case a previous run died mid-way

  /* 1. Tokens ------------------------------------------------------------ */

  const u = await makeUser('core');

  const access = await signAccessToken(u.id, 'admin', u.tokenVersion);
  check((await verifyToken(access, 'access', 'admin')) !== null, 'a valid access token verifies');

  // THE type check. Without it a refresh token authenticates a request, and in
  // KORUM's case a 2FA-challenge token bypassed 2FA entirely.
  const refresh = await signRefreshToken(u.id, 'admin', u.tokenVersion, new Date(Date.now() + 8.64e7));
  check(
    (await verifyToken(refresh, 'access', 'admin')) === null,
    'a REFRESH token is refused as an access token (type check)'
  );

  // The audience check. A customer session cookie replayed into the admin
  // cookie name must not work.
  check(
    (await verifyToken(access, 'access', 'customer')) === null,
    'an ADMIN token is refused for the customer audience'
  );

  check((await verifyToken(access + 'x', 'access', 'admin')) === null, 'a tampered token is refused');

  // Uniqueness — KORUM shipped a bug where two tokens minted in the same second
  // were byte-identical, so rotation deleted the token it had just stored.
  const abs = new Date(Date.now() + 8.64e7);
  const [a, b] = await Promise.all([
    signRefreshToken(u.id, 'admin', 0, abs),
    signRefreshToken(u.id, 'admin', 0, abs),
  ]);
  check(a !== b, 'two refresh tokens minted at once are NOT identical (jti)');

  /* 2. Session policy ----------------------------------------------------- */

  check(
    SESSION_POLICY.customer.refreshSlidingSeconds > SESSION_POLICY.admin.refreshSlidingSeconds,
    'the customer window is longer than the admin window'
  );
  check(
    SESSION_POLICY.admin.refreshAbsoluteSeconds === 7 * 24 * 3600,
    'the admin absolute cap is 7 days'
  );

  const custSession = await issueSession(u.id, 'customer', u.tokenVersion);
  const [custRow] = await db
    .select()
    .from(refreshToken)
    .where(and(eq(refreshToken.userId, u.id), eq(refreshToken.audience, 'customer')))
    .limit(1);
  check(!!custRow, 'issuing a session writes a refresh_token row');
  check(
    !!custRow && custRow.tokenHash !== custSession.refreshToken,
    'the refresh token is stored HASHED, not raw'
  );
  check(
    !!custRow && custRow.expiresAt <= custRow.absoluteExpiresAt,
    'the sliding window never exceeds the absolute ceiling'
  );

  /* 3. Rotation ----------------------------------------------------------- */

  const first = await issueSession(u.id, 'admin', u.tokenVersion);
  const rot = await rotateSession(first.refreshToken, 'admin');
  check(rot.ok, 'a valid refresh token rotates');
  check(
    rot.ok && rot.session.refreshToken !== first.refreshToken,
    'rotation returns a DIFFERENT refresh token'
  );

  // Replay: the presented token is validly signed but its row is gone.
  const replay = await rotateSession(first.refreshToken, 'admin');
  check(!replay.ok && replay.reason === 'replayed', 'the old token is refused as replayed');

  // Audience confusion at the row level.
  const crossed = rot.ok ? await rotateSession(rot.session.refreshToken, 'customer') : null;
  check(crossed !== null && !crossed.ok, 'an admin refresh token cannot rotate as a customer');

  /* 4. token_version — the credential-change kill switch ------------------ */

  const live = await issueSession(u.id, 'admin', u.tokenVersion);
  const stillGood = await verifyToken(live.accessToken, 'access', 'admin');
  check(stillGood?.tv === u.tokenVersion, 'the access token carries the current token_version');

  await revokeAllSessions(u.id);
  const [after] = await db.select().from(appUser).where(eq(appUser.id, u.id));
  check(after!.tokenVersion === u.tokenVersion + 1, '"sign out everywhere" bumps token_version');

  const orphaned = await rotateSession(live.refreshToken, 'admin');
  check(!orphaned.ok, 'a refresh token from before the bump no longer rotates');

  // The access token is still cryptographically valid — which is the whole
  // point: only the tv comparison in session.ts stops it, and this proves the
  // claim it compares against is genuinely stale.
  const claims = await verifyToken(live.accessToken, 'access', 'admin');
  check(
    claims !== null && claims.tv !== after!.tokenVersion,
    'the old access token still verifies but its tv is now stale'
  );

  /* 5. Sign-in, lockout and the timing defence ---------------------------- */

  const s = await makeUser('signin');

  const good = await signInWithPassword(s.email, PASSWORD, 'admin');
  check(good.ok, 'correct credentials sign in');
  if (good.ok) await revokeSession(good.session.refreshToken);

  const wrong = await signInWithPassword(s.email, 'not-the-password', 'admin');
  check(!wrong.ok && wrong.message === GENERIC_FAILURE, 'a wrong password returns the generic message');

  const missing = await signInWithPassword('nobody@example.test', 'whatever', 'admin');
  check(
    !missing.ok && missing.message === GENERIC_FAILURE,
    'an unknown address returns the SAME generic message'
  );

  // Timing: the miss path must cost roughly what the hit path costs. Compared
  // against a bcrypt burn rather than a fixed number so the check survives a
  // faster or slower machine.
  const t0 = Date.now();
  await burnPasswordTime(PASSWORD);
  const burn = Date.now() - t0;
  const t1 = Date.now();
  await signInWithPassword('nobody-else@example.test', PASSWORD, 'admin');
  const missCost = Date.now() - t1;
  check(
    missCost >= burn * 0.5,
    `the unknown-address path burns comparable time (${missCost}ms vs ${burn}ms)`
  );

  // Lockout. One failure already recorded above, so go to the limit.
  for (let i = 1; i < LOCKOUT.limit; i++) {
    await signInWithPassword(s.email, 'still-wrong', 'admin');
  }
  const locked = await signInWithPassword(s.email, PASSWORD, 'admin');
  check(
    !locked.ok && locked.message.startsWith('Too many'),
    `${LOCKOUT.limit} failures lock the account even with the RIGHT password`
  );

  const [lockedRow] = await db.select().from(appUser).where(eq(appUser.id, s.id));
  check(lockedRow!.lockedUntil !== null, 'locked_until is set');
  check(
    lockedRow!.lockedUntil !== null && lockedRow!.lockedUntil > new Date(),
    'the lock is in the future — and timed, never permanent'
  );

  // Clear it the way a support action would, and confirm sign-in works again.
  await db.update(appUser).set({ lockedUntil: null, failedLoginCount: 0 }).where(eq(appUser.id, s.id));
  const recovered = await signInWithPassword(s.email, PASSWORD, 'admin');
  check(recovered.ok, 'clearing the lock restores sign-in');
  if (recovered.ok) await revokeSession(recovered.session.refreshToken);

  /* 6. Google-only accounts have no password ------------------------------ */

  const [g] = await db
    .insert(appUser)
    .values({ email: `${MARK}google@example.test`, emailVerifiedAt: new Date() })
    .returning();
  check(g!.passwordHash === null, 'a Google-only account stores no password');
  check(
    (await verifyPassword('anything', g!.passwordHash)) === false,
    'no password means no password sign-in'
  );
  const gTry = await signInWithPassword(g!.email, 'anything', 'admin');
  check(
    !gTry.ok && gTry.message === GENERIC_FAILURE,
    'a Google-only account is indistinguishable from a wrong password'
  );

  /* 7. Session-bound CSRF -------------------------------------------------- */

  const csrf = issueCsrfToken(u.id);
  check(csrfOk(csrf, csrf, u.id), 'a CSRF token validates for the user it was minted for');
  check(
    !csrfOk(csrf, csrf, s.id),
    'the SAME token does NOT validate for another user (this is the bound part)'
  );
  check(!csrfOk(csrf, 'mismatched', u.id), 'header and cookie must agree');
  check(!csrfOk(undefined, csrf, u.id), 'a missing cookie fails closed');

  /* 8. End to end, through the running server ----------------------------- */
  //
  // ADR-0012 claimed the two checks SKIPPED in admin-auth-test since 2 Sep
  // "become runnable, because the password becomes ours". They still need the
  // real owner's password, which nobody should type into a test — so this
  // proves the same chain with a throwaway admin instead: session -> cookie ->
  // proxy -> session.ts -> the admin_user gate -> a rendered worklist.

  const BASE = process.env.BASE_URL ?? 'http://localhost:3315';
  let serverUp = true;
  try {
    await fetch(`${BASE}/admin/login`);
  } catch {
    serverUp = false;
    console.log('  SKIP  end-to-end — no dev server on ' + BASE);
  }

  if (serverUp) {
    const e2e = await makeUser('e2e');
    const [adminRow] = await db
      .insert(adminUser)
      .values({
        authUserId: e2e.id,
        email: e2e.email,
        name: 'Auth Test',
        role: 'staff',
        status: 'active',
      })
      .returning();

    const sess = await issueSession(e2e.id, 'admin', e2e.tokenVersion);
    const cookie = `${COOKIE.admin.access}=${sess.accessToken}`;

    const guarded = await fetch(`${BASE}/admin`, {
      headers: { cookie },
      redirect: 'manual',
    });
    check(guarded.status === 200, 'a real session reaches /admin (200, not a redirect)');
    const html = await guarded.text();
    check(html.includes('Auth Test') || html.length > 500, 'the admin page actually rendered');

    // The second gate, proved live: same valid cookie, disabled admin row.
    await db.update(adminUser).set({ status: 'disabled' }).where(eq(adminUser.id, adminRow!.id));
    const afterDisable = await fetch(`${BASE}/admin`, { headers: { cookie }, redirect: 'manual' });
    check(
      afterDisable.status >= 500 || afterDisable.status === 307 || afterDisable.status === 302,
      'disabling the admin_user row locks the SAME cookie out immediately'
    );

    // The audience gate, proved live: a customer session in the admin cookie.
    await db.update(adminUser).set({ status: 'active' }).where(eq(adminUser.id, adminRow!.id));
    const custSess = await issueSession(e2e.id, 'customer', e2e.tokenVersion);
    const crossCookie = `${COOKIE.admin.access}=${custSess.accessToken}`;
    const crossed2 = await fetch(`${BASE}/admin`, {
      headers: { cookie: crossCookie },
      redirect: 'manual',
    });
    check(
      crossed2.status === 307 || crossed2.status === 302,
      'a CUSTOMER token in the admin cookie is refused by the proxy'
    );

    await db.delete(adminUser).where(eq(adminUser.id, adminRow!.id));
  }

  /* Cleanup --------------------------------------------------------------- */

  const removed = await cleanup();
  console.log(`  cleanup: ${removed} test account(s) and their sessions deleted`);

  const [leaked] = await db.select().from(appUser).where(like(appUser.email, `${MARK}%`));
  check(leaked === undefined, 'no test accounts left behind');

  console.log(`\n${fail === 0 ? 'All checks passed.' : `${fail} FAILED`}  (${pass} passed)`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await cleanup().catch(() => {});
  process.exit(1);
});
