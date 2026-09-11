/**
 * Cookie transport for sessions — ADR-0012.
 *
 * Tokens live in **httpOnly cookies**, never `localStorage`. KORUM's deployed
 * mode keeps its JWTs in `localStorage`, readable by any script on the page,
 * and carries the move to cookies as open follow-up F1 — hard there because its
 * frontend and backend are separate origins. We are one Next.js application on
 * one origin, so that difficulty does not exist and we start where KORUM is
 * trying to get to.
 *
 * The CSRF cookie is deliberately NOT httpOnly: the page has to read it to echo
 * it in a header. That is safe because the value is bound to the session by an
 * HMAC (`csrf.ts`) and is useless to anyone else.
 */

import { cookies } from 'next/headers';
import { COOKIE, SESSION_POLICY, type Audience } from './config';
import { issueCsrfToken } from './csrf';
import type { IssuedSession } from './sessions';

const isProduction = process.env.NODE_ENV === 'production';

const base = {
  httpOnly: true,
  sameSite: 'lax' as const,
  // Secure in production only, so local http development still works.
  secure: isProduction,
  path: '/',
};

/** Write a freshly issued session to the response. */
export async function setSessionCookies(
  audience: Audience,
  session: IssuedSession,
  userId: string
): Promise<void> {
  const jar = await cookies();
  const names = COOKIE[audience];

  jar.set(names.access, session.accessToken, {
    ...base,
    maxAge: SESSION_POLICY[audience].accessSeconds,
  });
  jar.set(names.refresh, session.refreshToken, {
    ...base,
    // The refresh cookie outlives the access cookie by design — that is what
    // makes renewal silent.
    expires: session.refreshExpiresAt,
  });
  jar.set(names.csrf, issueCsrfToken(userId), {
    ...base,
    httpOnly: false, // the page must read this one — see the header
    expires: session.refreshExpiresAt,
  });
}

/** Remove one audience's cookies. Does not touch the other audience's. */
export async function clearSessionCookies(audience: Audience): Promise<void> {
  const jar = await cookies();
  for (const name of Object.values(COOKIE[audience])) {
    jar.set(name, '', { ...base, httpOnly: name !== COOKIE[audience].csrf, maxAge: 0 });
  }
}

export async function readSessionCookies(audience: Audience) {
  const jar = await cookies();
  const names = COOKIE[audience];
  return {
    access: jar.get(names.access)?.value,
    refresh: jar.get(names.refresh)?.value,
    csrf: jar.get(names.csrf)?.value,
  };
}
