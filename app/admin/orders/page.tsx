/**
 * /admin/orders — the list, filtered by derived state (features/admin.md §4,
 * stage 4). State comes from the fold, not a column; the filter is applied
 * after folding, which `listAdminOrders` explains.
 */

import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth/session';
import { ORDER_STATES, STATE_LABEL, listAdminOrders } from '@/lib/server/admin/orders';
import type { OrderState } from '@/lib/server/orders/state';
import { formatDateTime, rupees } from '../format';
import { one, readNotice, type SearchParams } from '../form';
import { Notices } from '../notices';
import shell from '../admin.module.css';
import ui from '../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Orders' };

const PAGE_SIZE = 50;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const stateParam = one(sp, 'state');
  const state = ORDER_STATES.includes(stateParam as OrderState)
    ? (stateParam as OrderState)
    : undefined;
  const email = one(sp, 'email')?.trim() || undefined;
  const page = Math.max(1, Number.parseInt(one(sp, 'page') ?? '1', 10) || 1);

  const result = await listAdminOrders({ state, email, page, pageSize: PAGE_SIZE });
  const pages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  const query = (p: number) => {
    const q = new URLSearchParams();
    if (state) q.set('state', state);
    if (email) q.set('email', email);
    if (p > 1) q.set('page', String(p));
    const s = q.toString();
    return s ? `/admin/orders?${s}` : '/admin/orders';
  };

  return (
    <>
      <h1 className={shell.pageTitle}>Orders</h1>
      <p className={shell.pageIntro}>
        Every order, newest first. The state is worked out from what has
        happened to the order, never edited directly. Open one to see its
        items, address and history, and to mark it sent or delivered when that
        is allowed.
      </p>

      <Notices notice={readNotice(sp)} />

      <form className={ui.toolbar} method="get" action="/admin/orders">
        <label className={ui.field}>
          <span className={ui.label}>State</span>
          <select className={ui.select} name="state" defaultValue={state ?? ''}>
            <option value="">All</option>
            {ORDER_STATES.map((s) => (
              <option key={s} value={s}>
                {STATE_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span className={ui.label}>Email</span>
          <input className={ui.input} type="email" name="email" defaultValue={email ?? ''} />
        </label>
        <div className={ui.actions} style={{ marginTop: 0 }}>
          <button className={`${ui.secondary}`} type="submit">
            Filter
          </button>
          {state || email ? (
            <Link className={ui.link} href="/admin/orders">
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {result.rows.length === 0 ? (
        <p className={ui.empty}>
          {result.total === 0 && !state && !email
            ? 'No orders have been placed yet.'
            : 'No orders match that filter.'}
        </p>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Placed</th>
                <th scope="col">Customer</th>
                <th scope="col">State</th>
                <th scope="col" className={ui.num}>Items</th>
                <th scope="col" className={ui.num}>Total</th>
                <th scope="col">
                  <span className={ui.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((o) => (
                <tr key={o.id}>
                  <td className={ui.primaryCell}>
                    <Link className={ui.link} href={`/admin/orders/${o.id}`}>
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className={ui.muted}>{formatDateTime(o.createdAt)}</td>
                  <td>
                    {o.shipName}
                    <span className={ui.sub}>{o.email}</span>
                  </td>
                  <td>
                    <span
                      className={`${ui.badge} ${
                        o.state === 'payment_captured' ? ui.badgeStrong : ''
                      }`}
                    >
                      {STATE_LABEL[o.state]}
                    </span>
                    {o.rejectedEvents > 0 ? (
                      <span className={ui.sub}>
                        {o.rejectedEvents} event{o.rejectedEvents === 1 ? '' : 's'} out of order
                      </span>
                    ) : null}
                  </td>
                  <td className={ui.num}>{o.lineCount}</td>
                  <td className={ui.num}>{rupees(o.totalPaise)}</td>
                  <td className={ui.rowActions}>
                    <Link className={ui.link} href={`/admin/orders/${o.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <nav className={ui.pager} aria-label="Pages">
          {page > 1 ? (
            <Link className={ui.link} href={query(page - 1)}>
              Newer
            </Link>
          ) : null}
          <span>
            Page {page} of {pages} · {result.total} order{result.total === 1 ? '' : 's'}
          </span>
          {page < pages ? (
            <Link className={ui.link} href={query(page + 1)}>
              Older
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
