/**
 * The admin audit trail — features/admin.md §6.2 and §7.
 *
 * "Every mutation writes an admin_action row in the same transaction as the
 * change. If the audit write fails, the change fails."
 *
 * That rule is only true if it is structurally hard to skip, so this module
 * exports `auditedMutation()`, which opens the transaction, runs the change and
 * writes the audit row together. A mutation that forgets to audit is one that
 * did not use this helper — which is a reviewable fact, not an invisible one.
 *
 * Append-only: there is deliberately no update or delete exported here, and
 * none anywhere else in the codebase.
 */

import { db, type Tx } from '../db/client';
import { adminAction } from '../db/schema';
import type { AdminSession } from '../auth/session';

/** Dotted verb, past-tense-neutral: 'stock.adjust', 'variant.price.set'. */
export type AuditAction = string;

export interface AuditEntry {
  action: AuditAction;
  entityType: string;
  entityId: string;
  /** Null for a create. Keep it small — the changed fields, not whole rows. */
  before?: unknown;
  /** Null for a delete. */
  after?: unknown;
}

/**
 * Run a mutation and record it, atomically.
 *
 * The audit entry is built AFTER the mutation runs, from its result, so
 * `after` reflects what was actually written rather than what was intended.
 * Either both land or neither does.
 */
export async function auditedMutation<T>(
  session: AdminSession,
  mutate: (tx: Tx) => Promise<T>,
  describe: (result: T) => AuditEntry
): Promise<T> {
  return db.transaction(async (tx) => {
    const result = await mutate(tx);
    await recordActionIn(tx, session.adminUserId, describe(result));
    return result;
  });
}

/**
 * The audit write itself, inside a transaction the caller owns.
 *
 * Exists for the one case `auditedMutation` cannot express: a mutation whose
 * actor is created by the mutation. Accepting an invitation inserts the
 * `admin_user` row and must record that acceptance against the row it just
 * made, so the actor id is only known mid-transaction. Prefer auditedMutation
 * everywhere else; this is a primitive, not a shortcut.
 */
export async function recordActionIn(
  tx: Tx,
  adminUserId: string,
  entry: AuditEntry
): Promise<void> {
  await tx.insert(adminAction).values({
    adminUserId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    before: entry.before === undefined ? null : entry.before,
    after: entry.after === undefined ? null : entry.after,
  });
}

/**
 * Record an action whose "mutation" is not a database write — a sign-in, an
 * export, an invite email sent. Rare; prefer auditedMutation.
 */
export async function recordAction(
  session: AdminSession,
  entry: AuditEntry
): Promise<void> {
  await db.insert(adminAction).values({
    adminUserId: session.adminUserId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    before: entry.before === undefined ? null : entry.before,
    after: entry.after === undefined ? null : entry.after,
  });
}
