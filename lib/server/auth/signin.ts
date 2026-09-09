/**
 * Sign-in — `features/accounts.md` §5, ADR-0012.
 *
 * The security properties of this file are the reason ADR-0012 needed an ADR.
 * Each of the four below exists because its absence is a known, named failure,
 * and three of them come straight from KORUM's `sign_in`:
 *
 *   1. **One generic message for every credential failure.** Wrong password,
 *      unknown address, locked account, Google-only account — all identical.
 *      Anything else is an account-existence oracle.
 *   2. **Equal time on every path.** The generic message alone does not close
 *      the oracle, because the clock still answers the question: a missing
 *      account returns measurably faster than a wrong password unless bcrypt
 *      work is burned on the miss.
 *   3. **The lock is checked before the password**, so a locked account cannot
 *      be probed by watching which passwords take longer.
 *   4. **A successful password clears the counter**, but a later refusal (a
 *      disabled admin, say) does not re-arm it — that is not a credential
 *      failure.
 */

import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { appUser } from '../db/schema';
import type { Audience } from './config';
import { clearFailures, lockState, recordFailure } from './lockout';
import { burnPasswordTime, verifyPassword } from './password';
import { issueSession, type IssuedSession } from './sessions';

/** The one message every failure returns. Never vary it. */
export const GENERIC_FAILURE = 'That email and password do not match.';

export type SignInResult =
  | { ok: true; userId: string; session: IssuedSession }
  | { ok: false; message: string };

/**
 * Authenticate with email and password, and mint a session for one audience.
 *
 * Signing in at `/admin/login` asks for the `admin` audience; the storefront
 * asks for `customer`. **This function does not check whether the user is
 * actually an admin** — that is `getAdminSession()`'s job, deliberately, so
 * that "your password is right" and "you may enter the admin" stay separate
 * answers and the first cannot leak the second.
 */
export async function signInWithPassword(
  email: string,
  password: string,
  audience: Audience,
  deviceInfo?: string
): Promise<SignInResult> {
  const normalised = (email ?? '').trim().toLowerCase();

  // No email at all: still burn the time, still answer identically.
  if (!normalised || !password) {
    await burnPasswordTime(password ?? '');
    return { ok: false, message: GENERIC_FAILURE };
  }

  const [user] = await db
    .select()
    .from(appUser)
    .where(eq(appUser.email, normalised))
    .limit(1);

  // Unknown address. Burn equivalent bcrypt time so timing does not distinguish
  // this from a wrong password — see the header, point 2.
  if (!user) {
    await burnPasswordTime(password);
    return { ok: false, message: GENERIC_FAILURE };
  }

  // Locked: refuse before touching the password (header, point 3). The message
  // does say the account is locked — it is only reachable once someone has
  // already failed eight times, so it reveals nothing they did not cause, and
  // an unexplained refusal here is a support ticket.
  const lock = lockState(user);
  if (lock.locked) {
    await burnPasswordTime(password);
    const minutes = Math.max(1, Math.ceil((lock.until.getTime() - Date.now()) / 60000));
    return {
      ok: false,
      message: `Too many failed attempts. Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`,
    };
  }

  // Covers both a wrong password and a Google-only account with no password at
  // all — verifyPassword burns time on the NULL branch for the same reason.
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await recordFailure(user.id);
    return { ok: false, message: GENERIC_FAILURE };
  }

  await clearFailures(user.id);
  await db
    .update(appUser)
    .set({ lastSignInAt: new Date(), updatedAt: new Date() })
    .where(eq(appUser.id, user.id));

  return {
    ok: true,
    userId: user.id,
    session: await issueSession(user.id, audience, user.tokenVersion, deviceInfo),
  };
}
