/**
 * /admin/customers — read-only (features/admin.md §4, stage 6).
 *
 * Two lists, because "customers" means two things until accounts exist:
 * people with a customer row, and people who checked out as guests, who are
 * known only by the email on their orders. The second group is the whole
 * customer base today. PII throughout (data-model.md §9.2); nothing here
 * edits, and R-41 decides erasure.
 */

import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth/session';
import { listCustomers } from '@/lib/server/admin/customers';
import { listGuestBuyers } from '@/lib/server/admin/orders';
import { formatDate } from '../format';
import shell from '../admin.module.css';
import ui from '../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Customers' };

export default async function CustomersPage() {
  await requireAdmin();
  const [accounts, guests] = await Promise.all([listCustomers(), listGuestBuyers()]);

  return (
    <>
      <h1 className={shell.pageTitle}>Customers</h1>
      <p className={shell.pageIntro}>
        Who has bought, and what they ordered. Read only: customer details are
        personal data and are changed only by the customer, never here.
      </p>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Guest buyers</h2>
        {guests.length === 0 ? (
          <p className={ui.empty}>No orders have been placed yet.</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Name on last order</th>
                  <th scope="col" className={ui.num}>Orders</th>
                  <th scope="col">Last order</th>
                  <th scope="col">
                    <span className={ui.srOnly}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g.email}>
                    <td className={ui.primaryCell}>{g.email}</td>
                    <td>{g.name}</td>
                    <td className={ui.num}>{g.orderCount}</td>
                    <td className={ui.muted}>{formatDate(new Date(g.lastOrderAt))}</td>
                    <td className={ui.rowActions}>
                      <Link
                        className={ui.link}
                        href={`/admin/orders?email=${encodeURIComponent(g.email)}`}
                      >
                        Orders
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className={ui.footnote} style={{ marginTop: 8 }}>
          Guest checkout keeps no customer record; each row is the address on
          the orders themselves. An address is grouped as typed and is not
          verified.
        </p>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Accounts</h2>
        {accounts.length === 0 ? (
          <p className={ui.empty}>
            No customer accounts exist yet. Sign-up on the shop is not built (features/accounts.md).
          </p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Phone</th>
                  <th scope="col" className={ui.num}>Orders</th>
                  <th scope="col">Last order</th>
                  <th scope="col">Since</th>
                  <th scope="col">
                    <span className={ui.srOnly}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className={ui.primaryCell}>{c.name ?? c.email}</span>
                      {c.name ? <span className={ui.sub}>{c.email}</span> : null}
                      {!c.hasAccount ? <span className={ui.sub}>No sign-in yet</span> : null}
                    </td>
                    <td>{c.phone ?? <span className={ui.muted}>None</span>}</td>
                    <td className={ui.num}>{c.orderCount}</td>
                    <td className={ui.muted}>
                      {c.lastOrderAt ? formatDate(new Date(c.lastOrderAt)) : 'Never'}
                    </td>
                    <td className={ui.muted}>{formatDate(c.createdAt)}</td>
                    <td className={ui.rowActions}>
                      <Link className={ui.link} href={`/admin/customers/${c.id}`}>
                        Open
                      </Link>
                    </td>
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
