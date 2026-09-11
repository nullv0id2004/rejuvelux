/**
 * The session store — issue, rotate, revoke.
 *
 * `features/accounts.md` §3 and §5, ADR-0012. Derived in design from KORUM's
 * `refresh_access_token`, with two deliberate departures recorded in ADR-0012:
 *
 *   1. **Tokens are stored hashed.** KORUM stores the refresh token verbatim in
 *      `refresh_tokens.token`, so a database read there mints a session. SHA-256
 *      costs nothing and removes that entirely.
 *   2. **Two windows, not one.** A `refresh_token` row carries both a sliding
 *      `expires_at` and a fixed `absolute_expires_at`. The sliding window moves
 *      on every use; the absolute one never does. That single pair of columns is
 *      what lets one code path serve a customer who is never signed out and an
 *      admin who re-authenticates weekly.
 */

import { createHash } from 'node:crypto';
import { and, eq, lt, or, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { appUser, refreshToken } from '../db/schema';
import { SESSION_POLICY, type Audience } from './config';
import { signAccessToken, signRefreshToken, verifyToken } from './tokens';

/** The stored form. The plaintext exists only in the cookie. */
function hash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export type IssuedSession = {
  accessToken: string;
  refreshToken: string;
  /** When the browser should stop sending the refresh cookie. */
  refreshExpiresAt: Date;
};

/**
 * Mint a fresh session. Called after a successful sign-in, never on refresh —
 * refresh goes through `rotateSession`, which preserves the absolute ceiling.
 */
export async function issueSession(
  userId: string,
  audience: Audience,
  tokenVersion: number,
  deviceInfo?: string
): Promise<IssuedSession> {
  const policy = SESSION_POLICY[audience];
  const now = Date.now();
  const absoluteExpiresAt = new Date(now + policy.refreshAbsoluteSeconds * 1000);
  const expiresAt = new Date(
    Math.min(now + policy.refreshSlidingSeconds * 1000, absoluteExpiresAt.getTime())
  );

  const token = await signRefreshToken(userId, audience, tokenVersion, absoluteExpiresAt);
  await db.insert(refreshToken).values({
    userId,
    tokenHash: hash(token),
    audience,
    expiresAt,
    absoluteExpiresAt,
    ...(deviceInfo ? { deviceInfo } : {}),
  });

  return {
    accessToken: await signAccessToken(userId, audience, tokenVersion),
    refreshToken: token,
    refreshExpiresAt: expiresAt,
  };
}

export type RotateResult =
  | { ok: true; session: IssuedSession }
  | { ok: false; reason: 'invalid' | 'expired' | 'replayed' | 'stale_version' | 'inactive' };

/**
 * Exchange a refresh token for a new pair. Single-use.
 *
 * Order matters and is the same as KORUM's, for the same reason: store the new
 * row BEFORE deleting the old one, so a crash between the two leaves the user
 * holding a token that still works rather than none at all.
 *
 * A token that verifies as a valid JWT but has no row has already been rotated
 * — it was replayed. We refuse it. (Revoking the whole token family on replay
 * is the stronger response and needs a lineage table plus a grace window for
 * benign concurrent refreshes across tabs; KORUM carries that as follow-up F2
 * and so do we.)
 */
export async function rotateSession(
  presented: string,
  audience: Audience
): Promise<RotateResult> {
  const claims = await verifyToken(presented, 'refresh', audience);
  if (!claims) return { ok: false, reason: 'invalid' };

  const presentedHash = hash(presented);
  const [row] = await db
    .select()
    .from(refreshToken)
    .where(and(eq(refreshToken.tokenHash, presentedHash), eq(refreshToken.audience, audience)))
    .limit(1);

  // Validly signed but absent from the table: already rotated, so replayed.
  if (!row) return { ok: false, reason: 'replayed' };

  const now = new Date();
  if (row.expiresAt <= now || row.absoluteExpiresAt <= now) {
    await db.delete(refreshToken).where(eq(refreshToken.id, row.id));
    return { ok: false, reason: 'expired' };
  }

  const [user] = await db
    .select({ tokenVersion: appUser.tokenVersion })
    .from(appUser)
    .where(eq(appUser.id, row.userId))
    .limit(1);
  if (!user) return { ok: false, reason: 'inactive' };

  // A credential change bumped the version, so this session is over — even
  // though its row is still here and its window is still open.
  if (user.tokenVersion !== claims.tv) {
    await db.delete(refreshToken).where(eq(refreshToken.id, row.id));
    return { ok: false, reason: 'stale_version' };
  }

  // The sliding window moves; the absolute ceiling does not, and clamps it.
  const policy = SESSION_POLICY[audience];
  const nextExpiresAt = new Date(
    Math.min(
      now.getTime() + policy.refreshSlidingSeconds * 1000,
      row.absoluteExpiresAt.getTime()
    )
  );

  const nextToken = await signRefreshToken(
    row.userId,
    audience,
    user.tokenVersion,
    row.absoluteExpiresAt
  );

  await db.insert(refreshToken).values({
    userId: row.userId,
    tokenHash: hash(nextToken),
    audience,
    expiresAt: nextExpiresAt,
    absoluteExpiresAt: row.absoluteExpiresAt,
    lastUsedAt: now,
    ...(row.deviceInfo ? { deviceInfo: row.deviceInfo } : {}),
  });
  await db.delete(refreshToken).where(eq(refreshToken.id, row.id));

  return {
    ok: true,
    session: {
      accessToken: await signAccessToken(row.userId, audience, user.tokenVersion),
      refreshToken: nextToken,
      refreshExpiresAt: nextExpiresAt,
    },
  };
}

/** End one session. Signing out should not end the others. */
export async function revokeSession(presented: string): Promise<void> {
  await db.delete(refreshToken).where(eq(refreshToken.tokenHash, hash(presented)));
}

/**
 * End every session for a user, in every browser.
 *
 * Deleting rows kills refresh; bumping `token_version` is what kills the access
 * tokens already issued. Both are needed — that is the whole point of `tv`.
 */
export async function revokeAllSessions(userId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(refreshToken).where(eq(refreshToken.userId, userId));
    await tx
      .update(appUser)
      .set({ tokenVersion: sql`${appUser.tokenVersion} + 1`, updatedAt: new Date() })
      .where(eq(appUser.id, userId));
  });
}

/**
 * End every session for ONE audience, leaving the other's alone.
 *
 * Disabling an admin should not sign that person out of the shop — Sayon is
 * both a customer and an admin (features/accounts.md §2). Refresh rows for the
 * audience are deleted; the live access token dies within its hour anyway, and
 * `getAdminSession` refuses a disabled `admin_user` row on every request before
 * that, so no `token_version` bump is needed here.
 */
export async function revokeSessionsForAudience(
  userId: string,
  audience: Audience
): Promise<number> {
  const deleted = await db
    .delete(refreshToken)
    .where(and(eq(refreshToken.userId, userId), eq(refreshToken.audience, audience)))
    .returning({ id: refreshToken.id });
  return deleted.length;
}

/**
 * Housekeeping: drop rows past either window.
 *
 * Expired rows are already refused by `rotateSession`, so this is hygiene
 * rather than enforcement — it keeps the table from growing without bound.
 */
export async function pruneExpiredSessions(): Promise<number> {
  const now = new Date();
  const deleted = await db
    .delete(refreshToken)
    .where(or(lt(refreshToken.expiresAt, now), lt(refreshToken.absoluteExpiresAt, now)))
    .returning({ id: refreshToken.id });
  return deleted.length;
}
