/**
 * /admin/audit — the action log, filterable (features/admin.md §4, stage 6).
 * Read-only, append-only, never editable from the UI. Every row is one
 * `admin_action`, written in the same transaction as the change it records.
 */

import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth/session';
import { listActionFacets, listActions } from '@/lib/server/admin/audit-log';
import { formatDateTime } from '../format';
import { one, type SearchParams } from '../form';
import shell from '../admin.module.css';
import ui from '../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Audit' };

const PAGE = 50;

/** Where an entity can be opened, when the admin has a page for it. */
function entityHref(type: string, id: string): string | null {
  switch (type) {
    case 'product':
      return `/admin/products/${id}`;
    case 'inventory_item':
      return `/admin/inventory/${id}/adjust`;
    case 'order':
      return `/admin/orders/${id}`;
    case 'admin_user':
    case 'admin_invite':
      return '/admin/users';
    default:
      return null;
  }
}

function pretty(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'object' && Object.keys(v as object).length === 0) return null;
  return JSON.stringify(v, null, 1);
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const filter = {
    action: one(sp, 'action') || undefined,
    entityType: one(sp, 'entityType') || undefined,
    entityId: one(sp, 'entityId')?.trim() || undefined,
    actorId: one(sp, 'actor') || undefined,
  };
  const beforeRaw = one(sp, 'before');
  const before = beforeRaw && /^\d+$/.test(beforeRaw) ? Number.parseInt(beforeRaw, 10) : undefined;

  const [facets, result] = await Promise.all([
    listActionFacets(),
    listActions({ ...filter, before, limit: PAGE }),
  ]);

  const olderHref = (() => {
    if (result.nextBefore === null) return null;
    const q = new URLSearchParams();
    if (filter.action) q.set('action', filter.action);
    if (filter.entityType) q.set('entityType', filter.entityType);
    if (filter.entityId) q.set('entityId', filter.entityId);
    if (filter.actorId) q.set('actor', filter.actorId);
    q.set('before', String(result.nextBefore));
    return `/admin/audit?${q.toString()}`;
  })();
  const filtering = Object.values(filter).some(Boolean);

  return (
    <>
      <h1 className={shell.pageTitle}>Audit</h1>
      <p className={shell.pageIntro}>
        Every change made through the admin, by whom, with the values before
        and after. Recorded with the change itself: if this could not be
        written, the change did not happen. Nothing here can be edited.
      </p>

      <form className={ui.toolbar} method="get" action="/admin/audit">
        <label className={ui.field}>
          <span className={ui.label}>Action</span>
          <select className={ui.select} name="action" defaultValue={filter.action ?? ''}>
            <option value="">All</option>
            {facets.actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span className={ui.label}>Record type</span>
          <select className={ui.select} name="entityType" defaultValue={filter.entityType ?? ''}>
            <option value="">All</option>
            {facets.entityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span className={ui.label}>Who</span>
          <select className={ui.select} name="actor" defaultValue={filter.actorId ?? ''}>
            <option value="">Anyone</option>
            {facets.actors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.email}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span className={ui.label}>Record id</span>
          <input className={ui.input} name="entityId" defaultValue={filter.entityId ?? ''} />
        </label>
        <div className={ui.actions} style={{ marginTop: 0 }}>
          <button className={ui.secondary} type="submit">
            Filter
          </button>
          {filtering ? (
            <Link className={ui.link} href="/admin/audit">
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {result.rows.length === 0 ? (
        <p className={ui.empty}>
          {filtering ? 'Nothing matches that filter.' : 'No changes have been made yet.'}
        </p>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Who</th>
                <th scope="col">Action</th>
                <th scope="col">Record</th>
                <th scope="col">Before</th>
                <th scope="col">After</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r) => {
                const href = entityHref(r.entityType, r.entityId);
                const before = pretty(r.before);
                const after = pretty(r.after);
                return (
                  <tr key={r.id}>
                    <td className={ui.muted} style={{ whiteSpace: 'nowrap' }}>
                      {formatDateTime(r.createdAt)}
                      <span className={ui.sub}>#{r.id}</span>
                    </td>
                    <td>
                      {r.actorName ?? r.actorEmail}
                      {r.actorName ? <span className={ui.sub}>{r.actorEmail}</span> : null}
                    </td>
                    <td className={ui.primaryCell}>{r.action}</td>
                    <td>
                      {r.entityType}
                      <span className={ui.sub}>
                        {href ? (
                          <Link className={ui.link} href={href}>
                            {r.entityId}
                          </Link>
                        ) : (
                          r.entityId
                        )}
                      </span>
                    </td>
                    <td>{before ? <pre className={ui.code}>{before}</pre> : <span className={ui.muted}>None</span>}</td>
                    <td>{after ? <pre className={ui.code}>{after}</pre> : <span className={ui.muted}>None</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {olderHref ? (
        <nav className={ui.pager} aria-label="Pages">
          <Link className={ui.link} href={olderHref}>
            Older
          </Link>
        </nav>
      ) : null}
    </>
  );
}
