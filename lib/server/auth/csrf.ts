/**
 * Session-bound CSRF tokens — `features/accounts.md` §5, ADR-0012.
 *
 * Ported in design from KORUM's `backend/app/domains/auth/csrf.py`, whose
 * header states the problem exactly:
 *
 *   Plain double-submit proves only that the cookie and the header agree with
 *   EACH OTHER — never that the value belongs to this session. An attacker who
 *   can plant a cookie on the domain (a sibling app on a subdomain, a subdomain
 *   takeover, an MITM on a non-HSTS subdomain) forces a value they chose and
 *   then trivially echoes it.
 *
 * The fix is to make the token self-verifying: `<nonce>.<hmac(secret, nonce +
 * user_id)>`. Nothing is stored server-side — the binding travels inside the
 * value — so verification stays a pure function with no session table, but a
 * token minted for one user cannot validate for another.
 *
 * This applies to the **cookie** authentication path only. Our cookies are
 * `SameSite=Lax`, which already blocks cross-site sends; this is
 * defence-in-depth, and it is cheap enough that it should be right.
 */

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { secrets } from './config';

function sign(nonce: string, userId: string): string {
  return createHmac('sha256', secrets().csrf)
    .update(`${nonce}:${userId}`)
    .digest('hex')
    .slice(0, 32);
}

/** Mint a CSRF token bound to this user. */
export function issueCsrfToken(userId: string): string {
  const nonce = randomBytes(18).toString('base64url');
  return `${nonce}.${sign(nonce, userId)}`;
}

/** True only if `token` was minted by us, for this user. */
export function csrfTokenMatches(token: string | undefined, userId: string): boolean {
  if (!token) return false;
  const [nonce, mac] = token.split('.');
  if (!nonce || !mac) return false;
  return constantTimeEquals(mac, sign(nonce, userId));
}

/**
 * The full check for a state-changing cookie-authenticated request: the header
 * must equal the cookie, AND the value must belong to this session.
 *
 * Both halves are needed. The first stops a cross-site request that cannot read
 * the cookie; the second stops an attacker who could plant one.
 */
export function csrfOk(
  cookieValue: string | undefined,
  headerValue: string | undefined,
  userId: string
): boolean {
  if (!cookieValue || !headerValue) return false;
  if (!constantTimeEquals(cookieValue, headerValue)) return false;
  return csrfTokenMatches(cookieValue, userId);
}

/** Constant-time compare that tolerates unequal lengths without leaking them. */
function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Still spend the comparison so length alone is not a fast path.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}
