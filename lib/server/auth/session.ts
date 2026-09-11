/**
 * The session — who is signed in, and what they may do.
 * `features/admin.md` §3 and §6 · `features/accounts.md` §2 · ADR-0008's role
 * decision · ADR-0012's mechanism.
 *
 * ONE of the two places roles are enforced (the other is `proxy.ts`), so the
 * whole authorisation model is auditable by reading two files. That smallness
 * is deliberate: Medusa's RBAC is Enterprise Edition and out of bounds per
 * ADR-0006, so this model is designed independently rather than ported, and
 * kept far simpler than a policy engine.
 *
 * Two fixed roles. No dynamic policies, no per-resource grants, no field-level
 * filtering. If that ever proves too small, it is a new decision with an ADR,
 * not a quiet extension here.
 *
 * **This file is the real authorisation boundary.** Next's own guidance is that
 * Proxy "should not be used as a full session management or authorization
 * solution" and is for optimistic checks only, so `proxy.ts` verifies the token
 * and redirects, while every genuine access decision is made here — including
 * the two the proxy cannot make: the account's live state and its role.
 */

import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { adminUser, appUser } from '../db/schema';
import { readSessionCookies } from './cookies';
import { verifyToken } from './tokens';
import type { Audience } from './config';

export type AdminRole = 'owner' | 'staff';

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

export interface AdminSession extends AuthenticatedUser {
  adminUserId: string;
  /** Kept for call-site compatibility; now an `app_user.id` (ADR-0012). */
  authUserId: string;
  name: string | null;
  role: AdminRole;
}

/**
 * Resolve the signed-in user for one audience, or null.
 *
 * Three gates, and each closes something the others do not:
 *
 *   1. the token verifies, and its `aud` matches the surface being asked about;
 *   2. the `app_user` row still exists;
 *   3. its `token_version` still matches the token's `tv` — so a password
 *      change, a reset or "sign out everywhere" invalidates a live ACCESS
 *      token, not merely the refresh token.
 *
 * Deduplicated per request by React `cache()`: a page, its layout and its
 * metadata all ask, and one database read is enough.
 */
export const getUser = cache(
  async (audience: Audience): Promise<AuthenticatedUser | null> => {
    const { access } = await readSessionCookies(audience);
    if (!access) return null;

    const claims = await verifyToken(access, 'access', audience);
    if (!claims) return null;

    const [row] = await db
      .select({
        id: appUser.id,
        email: appUser.email,
        tokenVersion: appUser.tokenVersion,
      })
      .from(appUser)
      .where(eq(appUser.id, claims.sub))
      .limit(1);

    if (!row) return null;
    if (row.tokenVersion !== claims.tv) return null;

    return { userId: row.id, email: row.email };
  }
);

/**
 * The signed-in admin, or null.
 *
 * A valid session is NOT an admin. Only a matching `active` row in `admin_user`
 * makes someone one, so a customer account can never become an admin by signing
 * in — and an admin whose row is disabled loses access immediately rather than
 * when their token expires.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const user = await getUser('admin');
  if (!user) return null;

  const [row] = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.authUserId, user.userId))
    .limit(1);
  if (!row || row.status !== 'active') return null;

  return {
    userId: user.userId,
    adminUserId: row.id,
    authUserId: row.authUserId,
    email: row.email,
    name: row.name,
    role: row.role as AdminRole,
  };
});

export class NotAuthenticatedError extends Error {
  constructor() {
    super('Not signed in.');
  }
}

export class NotAuthorisedError extends Error {
  constructor(required: AdminRole) {
    super(`This action requires the ${required} role.`);
  }
}

/**
 * Assert an admin session. Throws rather than redirecting so that route
 * handlers and server actions share one contract; pages redirect via the proxy
 * before ever reaching here.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new NotAuthenticatedError();
  return session;
}

/**
 * The role rule itself, as a pure function of a session already in hand.
 * `owner` implies everything `staff` may do; the reverse is never true. Today
 * only admin-user management requires `owner`.
 *
 * Kept here, beside `requireRole`, so this file stays the one place the rule
 * is written: the admin-user domain module calls it with the session it was
 * given rather than restating the comparison.
 */
export function assertRole(session: AdminSession, role: AdminRole): AdminSession {
  if (role === 'owner' && session.role !== 'owner') {
    throw new NotAuthorisedError('owner');
  }
  return session;
}

/** Assert a role for the signed-in admin. Pages and actions call this. */
export async function requireRole(role: AdminRole): Promise<AdminSession> {
  return assertRole(await requireAdmin(), role);
}

/** The signed-in customer, or null. Guest checkout never calls this. */
export const getCustomerUser = cache(
  async (): Promise<AuthenticatedUser | null> => getUser('customer')
);
