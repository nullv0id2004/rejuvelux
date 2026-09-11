/**
 * The audit viewer's read side — features/admin.md §4, stage 6.
 *
 * `admin_action` is append-only and nothing here can change it: this module
 * has no write. Keyset pagination on the identity id, newest first, so the
 * page a person is looking at does not shift when a new action lands.
 */

import { and, desc, eq, lt, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { adminAction, adminUser } from '../db/schema';

export interface AuditRow {
  id: number;
  createdAt: Date;
  action: string;
  entityType: string;
  entityId: string;
  before: unknown;
  after: unknown;
  actorId: string;
  actorEmail: string;
  actorName: string | null;
}

export interface AuditQuery {
  action?: string;
  entityType?: string;
  entityId?: string;
  actorId?: string;
  /** Rows with an id below this one — the "older" cursor. */
  before?: number;
  limit: number;
}

export async function listActions(q: AuditQuery): Promise<{ rows: AuditRow[]; nextBefore: number | null }> {
  const where = [];
  if (q.action) where.push(eq(adminAction.action, q.action));
  if (q.entityType) where.push(eq(adminAction.entityType, q.entityType));
  if (q.entityId) where.push(eq(adminAction.entityId, q.entityId));
  if (q.actorId) where.push(eq(adminAction.adminUserId, q.actorId));
  if (q.before !== undefined) where.push(lt(adminAction.id, q.before));

  const rows = await db
    .select({
      id: adminAction.id,
      createdAt: adminAction.createdAt,
      action: adminAction.action,
      entityType: adminAction.entityType,
      entityId: adminAction.entityId,
      before: adminAction.before,
      after: adminAction.after,
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: adminUser.name,
    })
    .from(adminAction)
    .innerJoin(adminUser, eq(adminUser.id, adminAction.adminUserId))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(adminAction.id))
    .limit(q.limit + 1);

  const page = rows.slice(0, q.limit);
  return {
    rows: page,
    nextBefore: rows.length > q.limit ? page[page.length - 1].id : null,
  };
}

/** The distinct values the filters offer, drawn from what has actually happened. */
export async function listActionFacets(): Promise<{
  actions: string[];
  entityTypes: string[];
  actors: { id: string; email: string }[];
}> {
  const [actions, entityTypes, actors] = await Promise.all([
    db.selectDistinct({ v: adminAction.action }).from(adminAction).orderBy(adminAction.action),
    db.selectDistinct({ v: adminAction.entityType }).from(adminAction).orderBy(adminAction.entityType),
    db
      .select({ id: adminUser.id, email: adminUser.email })
      .from(adminUser)
      // Outer column written in full: `${adminUser.id}` would render as a bare
      // "id" and bind to admin_action.id inside the subquery (see worklist.ts).
      .where(sql`EXISTS (SELECT 1 FROM admin_action a WHERE a.admin_user_id = "admin_user"."id")`)
      .orderBy(adminUser.email),
  ]);
  return {
    actions: actions.map((r) => r.v),
    entityTypes: entityTypes.map((r) => r.v),
    actors,
  };
}
