/**
 * Session policy — `features/accounts.md` §3, ADR-0012.
 *
 * The split between the two audiences is the point of ADR-0012. KORUM's
 * 15-minute access and 7-day refresh are right for a recruitment platform
 * handling candidate PII and wrong for a storefront: a customer should not be
 * signed out, and an admin console that changes prices and stock should not
 * stay open indefinitely on a shared laptop.
 *
 * Every value here is deliberate and every one is a security property, so they
 * live in one file rather than scattered through the call sites.
 */

/** Which surface a session was minted for. Carried in the token and the row. */
export type Audience = 'customer' | 'admin';

export const AUDIENCES = ['customer', 'admin'] as const;

export type SessionPolicy = {
  /** Access-token life. Short for both — renewal is silent and cheap. */
  accessSeconds: number;
  /**
   * The sliding window. Moves forward every time the token is used, so an
   * active session never expires from under someone.
   */
  refreshSlidingSeconds: number;
  /**
   * The hard ceiling, set once at sign-in and never moved. This is what makes
   * an admin re-authenticate on a schedule no amount of activity can defer.
   */
  refreshAbsoluteSeconds: number;
};

const HOUR = 60 * 60;
const DAY = 24 * HOUR;

export const SESSION_POLICY: Record<Audience, SessionPolicy> = {
  /**
   * Effectively never signed out. The absolute cap exists so a forgotten
   * session on a shared device does not live forever, not to log anyone out in
   * normal use — it is long enough that a returning customer never meets it.
   */
  customer: {
    accessSeconds: 1 * HOUR,
    refreshSlidingSeconds: 90 * DAY,
    refreshAbsoluteSeconds: 365 * DAY,
  },
  /**
   * Twelve hours idle, seven days absolute. A client team member signing in on
   * Monday morning is asked again the following Monday at the latest, and after
   * any twelve-hour gap. This is the compensation for having no second factor
   * (R-78) and it is weaker than one — say so rather than imply otherwise.
   */
  admin: {
    accessSeconds: 1 * HOUR,
    refreshSlidingSeconds: 12 * HOUR,
    refreshAbsoluteSeconds: 7 * DAY,
  },
};

/* Cookie names. Scoped per audience so an admin session and a customer session
 * can coexist in one browser — Sayon is both, and signing into the storefront
 * must not silently end an admin session or vice versa. */
export const COOKIE = {
  customer: { access: 'rjx_at', refresh: 'rjx_rt', csrf: 'rjx_csrf' },
  admin: { access: 'rjx_admin_at', refresh: 'rjx_admin_rt', csrf: 'rjx_admin_csrf' },
} as const satisfies Record<Audience, { access: string; refresh: string; csrf: string }>;

/**
 * Brute-force lockout — `features/accounts.md` §5.2.
 *
 * Timed, never permanent: a permanent lock lets anyone who knows an email
 * address deny that account service.
 */
export const LOCKOUT = {
  /** Consecutive failures before the account locks. */
  limit: 8,
  /** How long it stays locked. Long enough to make guessing pointless. */
  windowSeconds: 15 * 60,
} as const;

/** bcrypt cost. 12 is the current sensible floor; the existing hash is `$2a$`. */
export const BCRYPT_ROUNDS = 12;

/**
 * Secrets, read once and validated loudly.
 *
 * A missing secret must fail at startup, not silently fall back to a default —
 * a default JWT secret is an authentication bypass, and this is exactly the
 * kind of thing that ships when the fallback is convenient.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(
      `${name} is missing or too short (needs ≥32 chars). Generate one with:  openssl rand -base64 48`
    );
  }
  return value;
}

let cached: { access: Uint8Array; refresh: Uint8Array; csrf: string } | null = null;

export function secrets() {
  if (!cached) {
    const enc = new TextEncoder();
    const access = required('AUTH_JWT_SECRET');
    // A distinct refresh secret means a leaked access secret cannot mint a
    // 90-day session. Falls back to the access secret so a single-secret
    // deployment still works, which is what KORUM does.
    const refresh = process.env.AUTH_JWT_REFRESH_SECRET || access;
    cached = {
      access: enc.encode(access),
      refresh: enc.encode(refresh),
      csrf: process.env.AUTH_CSRF_SECRET || access,
    };
  }
  return cached;
}
