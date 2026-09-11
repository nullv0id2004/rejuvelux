/**
 * /admin/customers/[id] — one customer, read-only (features/admin.md §4).
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth/session';
import { getCustomer } from '@/lib/server/admin/customers';
import { STATE_LABEL } from '@/lib/server/admin/orders';
import { formatDate, formatDateTime, rupees } from '../../format';
import shell from '../../admin.module.css';
import ui from '../../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Customer' };

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const c = await getCustomer(id);
  if (!c) notFound();

  return (
    <>
      <h1 className={shell.pageTitle}>{c.name ?? c.email}</h1>
      <p className={shell.pageIntro}>
        Customer since {formatDate(c.createdAt)} · <Link href="/admin/customers">All customers</Link>
      </p>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Contact</h2>
        <div className={ui.card}>
          <dl className={ui.kv}>
            <dt>Email</dt>
            <dd>{c.email}</dd>
            <dt>Phone</dt>
            <dd>{c.phone ?? <span className={ui.muted}>None</span>}</dd>
            <dt>Sign-in</dt>
            <dd>{c.hasAccount ? 'Has an account' : 'No sign-in yet'}</dd>
          </dl>
        </div>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Addresses</h2>
        {c.addresses.length === 0 ? (
          <p className={ui.muted} style={{ margin: 0 }}>
            None saved. Orders carry their own delivery address.
          </p>
        ) : (
          c.addresses.map((a) => (
            <div key={a.id} className={ui.card} style={{ marginBottom: 12 }}>
              {a.recipientName}
              <br />
              {a.line1}
              {a.line2 ? <>, {a.line2}</> : null}
              <br />
              {a.city}, {a.state} {a.pincode}
              <br />
              <span className={ui.muted}>{a.phone}</span>
            </div>
          ))
        )}
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Orders</h2>
        {c.orders.length === 0 ? (
          <p className={ui.muted} style={{ margin: 0 }}>None yet.</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Placed</th>
                  <th scope="col">State</th>
                  <th scope="col" className={ui.num}>Total</th>
                </tr>
              </thead>
              <tbody>
                {c.orders.map((o) => (
                  <tr key={o.id}>
                    <td className={ui.primaryCell}>
                      <Link className={ui.link} href={`/admin/orders/${o.id}`}>
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className={ui.muted}>{formatDateTime(o.createdAt)}</td>
                    <td>
                      <span className={ui.badge}>{STATE_LABEL[o.state]}</span>
                    </td>
                    <td className={ui.num}>{rupees(o.totalPaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
