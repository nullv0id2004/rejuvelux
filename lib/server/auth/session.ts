/**
 * The admin session — who is signed in, and what they may do.
 * features/admin.md §3 and §6; ADR-0008's role decision.
 *
 * ONE of the two places roles are enforced (the other is middleware.ts), so
 * the whole authorisation model is auditable by reading two files. That
 * smallness is deliberate: Medusa's RBAC is Enterprise Edition and out of
 * bounds per ADR-0006, so this model is designed independently rather than
 * ported, and kept far simpler than a policy engine.
 *
 * Two fixed roles. No dynamic policies, no per-resource grants, no field-level
 * filtering. If that ever proves too small, it is a new decision with an ADR,
 * not a quiet extension here.
 */

import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { adminUser } from '../db/schema';
import { createServerClient } from './supabase';

export type AdminRole = 'owner' | 'staff';

export interface AdminSession {
  adminUserId: string;
  authUserId: string;
  email: string;
  name: string | null;
  role: AdminRole;
}

/**
 * The signed-in admin, or null.
 *
 * Uses getUser(), never getSession(): getSession reads the cookie and trusts
 * it, while getUser revalidates the token with Supabase. On a surface that
 * guards prices and stock, the round trip is worth it.
 *
 * Two gates, not one — a valid Supabase user is NOT an admin. Only a matching
 * `active` row in admin_user makes someone an admin, so a customer account can
 * never become one by signing in.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [row] = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.authUserId, user.id));
  if (!row || row.status !== 'active') return null;

  return {
    adminUserId: row.id,
    authUserId: row.authUserId,
    email: row.email,
    name: row.name,
    role: row.role as AdminRole,
  };
}

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
 * handlers and server actions share one contract; pages redirect via
 * middleware before ever reaching here.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new NotAuthenticatedError();
  return session;
}

/**
 * Assert a role. `owner` implies everything `staff` may do; the reverse is
 * never true. Today only admin-user management requires `owner`.
 */
export async function requireRole(role: AdminRole): Promise<AdminSession> {
  const session = await requireAdmin();
  if (role === 'owner' && session.role !== 'owner') {
    throw new NotAuthorisedError('owner');
  }
  return session;
}
