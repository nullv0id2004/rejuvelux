/**
 * Per-account brute-force lockout — `features/accounts.md` §5.2.
 *
 * KORUM raised this as P0-2 after noticing that a per-IP limiter does nothing
 * against a distributed attack on ONE account: many IPs, each staying under the
 * cap. This project has no rate limiter at all (accounts.md §9), so the
 * per-account lock is the only brute-force defence there is.
 *
 * **Timed, never permanent.** A permanent lock hands anyone who knows an email
 * address a denial-of-service against that account.
 *
 * State lives in `app_user`, not in process memory. KORUM's first implementation
 * was in-process and its own plan carries follow-up F3 to move it to a shared
 * store for multi-worker exactness — on Vercel, where every request may hit a
 * different lambda, an in-process counter would be worse than none, because it
 * would look like a defence while counting to eight separately per instance.
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { appUser } from '../db/schema';
import { LOCKOUT } from './config';

export type LockState = { locked: true; until: Date } | { locked: false };

/** Is this account locked right now? */
export function lockState(user: {
  lockedUntil: Date | null;
  failedLoginCount: number;
}): LockState {
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { locked: true, until: user.lockedUntil };
  }
  return { locked: false };
}

/**
 * Record a failed attempt, locking the account once the limit is reached.
 *
 * Best-effort by design: a bookkeeping failure must never stop a legitimate
 * sign-in, so this swallows. The counter resets to zero at the moment of
 * locking so the next window starts clean rather than locking again instantly.
 */
export async function recordFailure(userId: string): Promise<void> {
  try {
    await db
      .update(appUser)
      .set({
        failedLoginCount: sql`
          CASE WHEN ${appUser.failedLoginCount} + 1 >= ${LOCKOUT.limit}
               THEN 0 ELSE ${appUser.failedLoginCount} + 1 END`,
        lockedUntil: sql`
          CASE WHEN ${appUser.failedLoginCount} + 1 >= ${LOCKOUT.limit}
               THEN now() + ${`${LOCKOUT.windowSeconds} seconds`}::interval
               ELSE ${appUser.lockedUntil} END`,
        updatedAt: new Date(),
      })
      .where(eq(appUser.id, userId));
  } catch {
    /* never block a sign-in on lockout bookkeeping */
  }
}

/** A correct password clears the counter and any live lock. */
export async function clearFailures(userId: string): Promise<void> {
  try {
    await db
      .update(appUser)
      .set({ failedLoginCount: 0, lockedUntil: null, updatedAt: new Date() })
      .where(eq(appUser.id, userId));
  } catch {
    /* as above */
  }
}
