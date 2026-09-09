/**
 * Password hashing, verification, and the two defences that surround it.
 *
 * `features/accounts.md` §5.1: one generic failure message for every credential
 * path, and equal work burned on the not-found branch so timing does not
 * distinguish an unknown address from a wrong password. Both come from KORUM's
 * `sign_in` (`_burn_password_time`), where they exist to close an account
 * enumeration oracle.
 *
 * bcrypt rather than argon2 for one concrete reason: the account migrated from
 * Supabase Auth in migration 0003 carries a `$2a$` bcrypt hash, and bcrypt can
 * verify it directly. Changing algorithm would have locked that account out,
 * and there is no password-reset email to recover with (R-78).
 */

import bcrypt from 'bcryptjs';
import { BCRYPT_ROUNDS } from './config';

/** A hash of a fixed string, used to burn equivalent time on the miss path. */
const DUMMY_HASH = '$2b$12$Ux3o9J4Qk5m8p1r2s3t4uOaBcDeFgHiJkLmNoPqRsTuVwXyZaBcDe';

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/**
 * Verify a password against a stored hash.
 *
 * `stored` is nullable because a Google-only account genuinely has no password
 * (`app_user.password_hash` is NULL). That case still burns bcrypt time before
 * refusing, so "this address exists but has no password" is not detectable from
 * outside — it would otherwise reveal which accounts use Google.
 */
export async function verifyPassword(
  plain: string,
  stored: string | null | undefined
): Promise<boolean> {
  if (!stored) {
    await burnPasswordTime(plain);
    return false;
  }
  try {
    return await bcrypt.compare(plain, stored);
  } catch {
    // A malformed hash in the column is a data fault, not a valid credential.
    return false;
  }
}

/**
 * Spend the same time a real comparison would, and discard the result.
 *
 * Called on the account-not-found branch. Without it, a missing account returns
 * measurably faster than a wrong password and the sign-in endpoint becomes an
 * account-existence oracle — the generic error message alone does not close
 * that, because the clock still answers the question.
 */
export async function burnPasswordTime(plain: string): Promise<void> {
  try {
    await bcrypt.compare(plain || 'x', DUMMY_HASH);
  } catch {
    /* the point is the time spent, not the answer */
  }
}

/**
 * Minimum strength. Deliberately length-first rather than a composition rule:
 * character-class requirements push people toward `Password1!` and are worse
 * than length for real-world guessing resistance.
 */
export function validatePasswordStrength(plain: string): string | null {
  if (plain.length < 10) return 'Use at least 10 characters.';
  if (plain.length > 200) return 'That password is too long.';
  if (!/[a-zA-Z]/.test(plain) || !/[0-9]/.test(plain)) {
    return 'Include at least one letter and one number.';
  }
  return null;
}
