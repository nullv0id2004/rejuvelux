/**
 * JWT issue and verification — ADR-0012, `features/accounts.md` §5.
 *
 * Derived in design from KORUM's `backend/app/domains/auth/auth_service.py`
 * (`create_access_token` / `verify_token` / `create_refresh_token`), including
 * two defences that exist there because their absence is a real bug:
 *
 *   - **`type` is checked on every verification.** Access, refresh and any
 *     future special-purpose token are signed with related secrets; without
 *     this check a refresh token authenticates a request directly, and in
 *     KORUM's case a 2FA-challenge token would have bypassed 2FA entirely.
 *   - **Every refresh token carries a unique `jti`.** KORUM shipped a bug where
 *     two tokens minted in the same second with the same payload were
 *     byte-identical, so rotation's store-then-delete deleted the token it had
 *     just stored, leaving the user with none.
 *
 * `tv` (token version) is what makes a credential change kill live ACCESS
 * tokens, not merely refresh ones.
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { randomUUID } from 'node:crypto';
import { SESSION_POLICY, secrets, type Audience } from './config';

const ALG = 'HS256';
const ISSUER = 'rejuveluxe';

export type TokenType = 'access' | 'refresh';

export type SessionClaims = {
  /** `app_user.id`. */
  sub: string;
  /** Which surface this session is for. Checked, never assumed. */
  aud: Audience;
  /** `app_user.token_version` at issue. A stale value is refused. */
  tv: number;
  type: TokenType;
  /** Refresh tokens only — makes every token unique. See the header. */
  jti?: string;
};

function keyFor(type: TokenType) {
  const s = secrets();
  return type === 'access' ? s.access : s.refresh;
}

/** Mint an access token. Short-lived; carries no `jti` because it is not stored. */
export async function signAccessToken(
  sub: string,
  audience: Audience,
  tokenVersion: number
): Promise<string> {
  return new SignJWT({ tv: tokenVersion, type: 'access' satisfies TokenType })
    .setProtectedHeader({ alg: ALG })
    .setSubject(sub)
    .setAudience(audience)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_POLICY[audience].accessSeconds}s`)
    .sign(keyFor('access'));
}

/**
 * Mint a refresh token. The `exp` is the ABSOLUTE ceiling, not the sliding
 * window — the sliding window lives in the database row, because it moves and a
 * signed claim cannot. A token that is still validly signed may therefore be
 * refused by the row check, which is exactly how rotation detects replay.
 */
export async function signRefreshToken(
  sub: string,
  audience: Audience,
  tokenVersion: number,
  absoluteExpiresAt: Date
): Promise<string> {
  return new SignJWT({
    tv: tokenVersion,
    type: 'refresh' satisfies TokenType,
    jti: randomUUID(),
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(sub)
    .setAudience(audience)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(Math.floor(absoluteExpiresAt.getTime() / 1000))
    .sign(keyFor('refresh'));
}

/**
 * Verify a token and return its claims, or `null`.
 *
 * Returns null rather than throwing: every caller's response to a bad token is
 * the same (401 or a redirect), and an exception here would be a way to leak
 * *why* it failed.
 */
export async function verifyToken(
  token: string,
  expected: TokenType,
  audience: Audience
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, keyFor(expected), {
      issuer: ISSUER,
      audience,
    });
    // The type check is the load-bearing line — see the file header.
    if (payload.type !== expected) return null;
    if (typeof payload.sub !== 'string') return null;
    const tv = typeof payload.tv === 'number' ? payload.tv : Number.NaN;
    if (!Number.isInteger(tv)) return null;
    return {
      sub: payload.sub,
      aud: audience,
      tv,
      type: expected,
      ...(typeof payload.jti === 'string' ? { jti: payload.jti } : {}),
    };
  } catch {
    // Expired, wrong signature, wrong audience, malformed — all the same answer.
    return null;
  }
}

/** Decode without verifying. Diagnostics only; never for an access decision. */
export function unsafeDecode(token: string): JWTPayload | null {
  try {
    const [, body] = token.split('.');
    if (!body) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as JWTPayload;
  } catch {
    return null;
  }
}
