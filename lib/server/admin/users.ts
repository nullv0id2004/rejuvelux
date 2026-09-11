/**
 * Admin users, roles and invitations — features/admin.md §3, §4 and §8 stage
 * 5, on ADR-0012's self-built auth.
 *
 * Owner only, and the check is `assertRole` from session.ts rather than a
 * comparison written here, so the role model stays in its two files.
 *
 * Invitations: no email provider exists (R-78), so the link is shown to the
 * owner once and handed over by hand (features/admin.md §10). The token is
 * stored hashed; the plaintext exists only in that link. Accepting the link
 * creates the credential (`app_user`) and the commerce identity
 * (`admin_user`) together, or links an existing account if the address
 * already has one — one credential store serves both audiences
 * (features/accounts.md §2), so a customer can be invited to the admin.
 *
 * Two guards keep the admin from locking itself out: nobody disables their
 * own account, and the last active owner can be neither demoted nor disabled.
 */

import { createHash, randomBytes } from 'node:crypto';
import { and, asc, desc, eq, gt, isNull, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { adminInvite, adminUser, appUser } from '../db/schema';
import { hashPassword, validatePasswordStrength, verifyPassword } from '../auth/password';
import { assertRole, type AdminRole, type AdminSession } from '../auth/session';
import { issueSession, revokeSessionsForAudience, type IssuedSession } from '../auth/sessions';
import { auditedMutation, recordActionIn } from './audit';
import { RefusedError } from './refusal';

export const ADMIN_ROLES = ['owner', 'staff'] as const;
export const INVITE_DAYS = 7;

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/* ----------------------------------------------------------------- reads -- */

export interface AdminUserRow {
  id: string;
  authUserId: string;
  email: string;
  name: string | null;
  role: AdminRole;
  status: 'active' | 'disabled';
  lastSignInAt: Date | null;
  createdAt: Date;
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const rows = await db
    .select({
      id: adminUser.id,
      authUserId: adminUser.authUserId,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      status: adminUser.status,
      lastSignInAt: appUser.lastSignInAt,
      createdAt: adminUser.createdAt,
    })
    .from(adminUser)
    .leftJoin(appUser, eq(appUser.id, adminUser.authUserId))
    .orderBy(asc(adminUser.createdAt));
  return rows.map((r) => ({
    ...r,
    role: r.role as AdminRole,
    status: r.status as 'active' | 'disabled',
  }));
}

export interface InviteRow {
  id: string;
  email: string;
  role: AdminRole;
  expiresAt: Date;
  createdAt: Date;
  invitedByEmail: string;
}

/** Invitations that can still be accepted. */
export async function listOpenInvites(): Promise<InviteRow[]> {
  const rows = await db
    .select({
      id: adminInvite.id,
      email: adminInvite.email,
      role: adminInvite.role,
      expiresAt: adminInvite.expiresAt,
      createdAt: adminInvite.createdAt,
      invitedByEmail: adminUser.email,
    })
    .from(adminInvite)
    .innerJoin(adminUser, eq(adminUser.id, adminInvite.invitedBy))
    .where(and(isNull(adminInvite.acceptedAt), gt(adminInvite.expiresAt, new Date())))
    .orderBy(desc(adminInvite.createdAt));
  return rows.map((r) => ({ ...r, role: r.role as AdminRole }));
}

/* ---------------------------------------------------------- pure rules --- */

/**
 * The lockout guard. Pure so it can be tested without arranging a database
 * with exactly one owner. `activeOwners` counts owners who are active NOW,
 * including the target if they are one.
 */
export function assertAnOwnerRemains(activeOwners: number, targetIsActiveOwner: boolean): void {
  if (targetIsActiveOwner && activeOwners <= 1) {
    throw new RefusedError(
      'At least one active owner must remain, and this is the only one. Make someone else an owner first.'
    );
  }
}

async function countActiveOwners(tx: Parameters<Parameters<typeof auditedMutation>[1]>[0]) {
  const [{ n }] = await tx
    .select({ n: sql<number>`count(*)::int` })
    .from(adminUser)
    .where(and(eq(adminUser.role, 'owner'), eq(adminUser.status, 'active')));
  return n;
}

/* ---------------------------------------------------------------- writes -- */

export async function createInvite(
  session: AdminSession,
  input: { email: string; role: AdminRole }
): Promise<{ id: string; token: string; expiresAt: Date }> {
  assertRole(session, 'owner');
  const email = input.email.trim().toLowerCase();
  if (!EMAIL.test(email)) throw new RefusedError('Enter a valid email address.');
  if (!ADMIN_ROLES.includes(input.role)) throw new RefusedError('Role must be owner or staff.');

  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000);

  return auditedMutation(
    session,
    async (tx) => {
      const [existing] = await tx
        .select({ status: adminUser.status })
        .from(adminUser)
        .where(eq(adminUser.email, email))
        .limit(1);
      if (existing) {
        throw new RefusedError(
          existing.status === 'active'
            ? 'That address is already an admin user.'
            : 'That address is a disabled admin user. Enable the account instead of inviting it again.'
        );
      }
      const [open] = await tx
        .select({ id: adminInvite.id })
        .from(adminInvite)
        .where(
          and(
            eq(adminInvite.email, email),
            isNull(adminInvite.acceptedAt),
            gt(adminInvite.expiresAt, new Date())
          )
        )
        .limit(1);
      if (open) {
        throw new RefusedError(
          'An invitation for that address is already open. Revoke it first if you need a new link.'
        );
      }
      const [row] = await tx
        .insert(adminInvite)
        .values({
          email,
          role: input.role,
          tokenHash: hashToken(token),
          expiresAt,
          invitedBy: session.adminUserId,
        })
        .returning({ id: adminInvite.id });
      return { id: row.id, token, expiresAt };
    },
    (r) => ({
      action: 'invite.create',
      entityType: 'admin_invite',
      entityId: r.id,
      after: { email, role: input.role, expiresAt: expiresAt.toISOString() },
    })
  );
}

/** Revoke by expiring now; the row stays as the record that it was sent. */
export async function revokeInvite(session: AdminSession, inviteId: string): Promise<void> {
  assertRole(session, 'owner');
  await auditedMutation(
    session,
    async (tx) => {
      const [row] = await tx
        .select()
        .from(adminInvite)
        .where(eq(adminInvite.id, inviteId))
        .for('update');
      if (!row) throw new RefusedError('That invitation no longer exists.');
      if (row.acceptedAt) throw new RefusedError('That invitation was already accepted.');
      if (row.expiresAt <= new Date()) throw new RefusedError('That invitation had already expired.');
      await tx
        .update(adminInvite)
        .set({ expiresAt: new Date() })
        .where(eq(adminInvite.id, inviteId));
      return row;
    },
    (row) => ({
      action: 'invite.revoke',
      entityType: 'admin_invite',
      entityId: inviteId,
      before: { email: row.email, role: row.role, expiresAt: row.expiresAt.toISOString() },
      after: { revoked: true },
    })
  );
}

export interface InviteView {
  id: string;
  email: string;
  role: AdminRole;
  expiresAt: Date;
  /** The address already has a credential: accept by signing in, not by choosing a password. */
  hasAccount: boolean;
}

/** The invitation behind a link, or null when it cannot be accepted. */
export async function readInvite(token: string): Promise<InviteView | null> {
  if (!token || token.length > 200) return null;
  const [row] = await db
    .select()
    .from(adminInvite)
    .where(eq(adminInvite.tokenHash, hashToken(token)))
    .limit(1);
  if (!row || row.acceptedAt || row.expiresAt <= new Date()) return null;
  const [account] = await db
    .select({ id: appUser.id })
    .from(appUser)
    .where(eq(appUser.email, row.email))
    .limit(1);
  return {
    id: row.id,
    email: row.email,
    role: row.role as AdminRole,
    expiresAt: row.expiresAt,
    hasAccount: !!account,
  };
}

export type AcceptResult =
  | { ok: true; userId: string; session: IssuedSession }
  | { ok: false; message: string };

/**
 * Accept an invitation: create or link the credential, create the admin
 * identity, mark the invite used, audit it against the new admin, and mint an
 * admin session. One transaction for the writes; the session after commit.
 */
export async function acceptInvite(
  token: string,
  input: { name: string; password: string }
): Promise<AcceptResult> {
  const name = input.name.trim().slice(0, 80);
  if (!name) return { ok: false, message: 'Enter your name as it should appear to colleagues.' };

  const committed = await db.transaction(async (tx) => {
    const [invite] = await tx
      .select()
      .from(adminInvite)
      .where(eq(adminInvite.tokenHash, hashToken(token)))
      .for('update');
    if (!invite || invite.acceptedAt || invite.expiresAt <= new Date()) {
      return { ok: false as const, message: 'This invitation is no longer valid. Ask for a new link.' };
    }

    const [existing] = await tx.select().from(appUser).where(eq(appUser.email, invite.email)).limit(1);
    let userId: string;
    let tokenVersion: number;
    if (existing) {
      // An account already holds this address: prove it is theirs with the
      // password they have, rather than letting a link overwrite a credential.
      const valid = await verifyPassword(input.password, existing.passwordHash);
      if (!valid) {
        return {
          ok: false as const,
          message:
            'An account already exists for this address. Enter its password to accept the invitation.',
        };
      }
      userId = existing.id;
      tokenVersion = existing.tokenVersion;
    } else {
      const weak = validatePasswordStrength(input.password);
      if (weak) return { ok: false as const, message: weak };
      const [created] = await tx
        .insert(appUser)
        .values({
          email: invite.email,
          passwordHash: await hashPassword(input.password),
          // The link was handed over by the owner who typed the address; that
          // is the verification available without an email provider (R-78).
          emailVerifiedAt: new Date(),
        })
        .returning({ id: appUser.id, tokenVersion: appUser.tokenVersion });
      userId = created.id;
      tokenVersion = created.tokenVersion;
    }

    const [already] = await tx
      .select({ id: adminUser.id })
      .from(adminUser)
      .where(eq(adminUser.authUserId, userId))
      .limit(1);
    if (already) {
      return { ok: false as const, message: 'This account is already an admin user. Sign in instead.' };
    }

    const [admin] = await tx
      .insert(adminUser)
      .values({ authUserId: userId, email: invite.email, name, role: invite.role, status: 'active' })
      .returning({ id: adminUser.id });
    await tx
      .update(adminInvite)
      .set({ acceptedAt: new Date() })
      .where(eq(adminInvite.id, invite.id));
    await recordActionIn(tx, admin.id, {
      action: 'invite.accept',
      entityType: 'admin_invite',
      entityId: invite.id,
      after: { email: invite.email, role: invite.role, adminUserId: admin.id, linkedExisting: !!existing },
    });
    return { ok: true as const, userId, tokenVersion };
  });

  if (!committed.ok) return committed;
  return {
    ok: true,
    userId: committed.userId,
    session: await issueSession(committed.userId, 'admin', committed.tokenVersion),
  };
}

export async function setAdminRole(
  session: AdminSession,
  targetId: string,
  role: AdminRole
): Promise<void> {
  assertRole(session, 'owner');
  if (!ADMIN_ROLES.includes(role)) throw new RefusedError('Role must be owner or staff.');
  await auditedMutation(
    session,
    async (tx) => {
      const [target] = await tx.select().from(adminUser).where(eq(adminUser.id, targetId)).for('update');
      if (!target) throw new RefusedError('That admin user no longer exists.');
      if (target.role === role) throw new RefusedError(`${target.email} is already ${role}.`);
      if (role === 'staff') {
        assertAnOwnerRemains(
          await countActiveOwners(tx),
          target.role === 'owner' && target.status === 'active'
        );
      }
      await tx.update(adminUser).set({ role, updatedAt: sql`now()` }).where(eq(adminUser.id, targetId));
      return target;
    },
    (target) => ({
      action: 'user.role.set',
      entityType: 'admin_user',
      entityId: targetId,
      before: { role: target.role },
      after: { role },
    })
  );
}

export async function setAdminStatus(
  session: AdminSession,
  targetId: string,
  status: 'active' | 'disabled'
): Promise<void> {
  assertRole(session, 'owner');
  if (status === 'disabled' && targetId === session.adminUserId) {
    throw new RefusedError('You cannot disable your own account. Ask another owner to do it.');
  }
  const target = await auditedMutation(
    session,
    async (tx) => {
      const [row] = await tx.select().from(adminUser).where(eq(adminUser.id, targetId)).for('update');
      if (!row) throw new RefusedError('That admin user no longer exists.');
      if (row.status === status) throw new RefusedError(`${row.email} is already ${status}.`);
      if (status === 'disabled') {
        assertAnOwnerRemains(await countActiveOwners(tx), row.role === 'owner');
      }
      await tx.update(adminUser).set({ status, updatedAt: sql`now()` }).where(eq(adminUser.id, targetId));
      return row;
    },
    (row) => ({
      action: 'user.status.set',
      entityType: 'admin_user',
      entityId: targetId,
      before: { status: row.status },
      after: { status },
    })
  );
  // Outside the transaction on purpose: the row is already refused by
  // getAdminSession on the next request, so this is hygiene, and a failure
  // here must not undo a disable that has committed.
  if (status === 'disabled') await revokeSessionsForAudience(target.authUserId, 'admin');
}

/** End every admin session someone holds, everywhere. Their customer sessions stay. */
export async function signOutAdminEverywhere(session: AdminSession, targetId: string): Promise<number> {
  assertRole(session, 'owner');
  return auditedMutation(
    session,
    async (tx) => {
      const [row] = await tx.select().from(adminUser).where(eq(adminUser.id, targetId)).limit(1);
      if (!row) throw new RefusedError('That admin user no longer exists.');
      const n = await revokeSessionsForAudience(row.authUserId, 'admin');
      return { n, email: row.email };
    },
    (r) => ({
      action: 'user.sessions.revoke',
      entityType: 'admin_user',
      entityId: targetId,
      after: { email: r.email, sessionsEnded: r.n },
    })
  ).then((r) => r.n);
}
