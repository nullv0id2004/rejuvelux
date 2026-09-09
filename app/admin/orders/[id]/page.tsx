/**
 * /admin/orders/[id] — the full order (features/admin.md §4, stage 4): lines
 * with their price snapshots, the address, the gift, the reservations, and
 * the event history shown as-is, because it is the audit trail the fold reads.
 *
 * The fulfilment buttons are exactly the transitions the fold permits now.
 * When none is permitted, the page says why in a sentence rather than
 * showing a disabled control.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth/session';
import { STATE_LABEL, getAdminOrder } from '@/lib/server/admin/orders';
import type { OrderState } from '@/lib/server/orders/state';
import { formatDateTime, rupees } from '../../format';
import { readNotice, type SearchParams } from '../../form';
import { Notices } from '../../notices';
import shell from '../../admin.module.css';
import ui from '../../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Order' };

const EVENT_LABEL: Record<string, string> = {
  placed: 'Placed',
  payment_captured: 'Payment captured',
  payment_failed: 'Payment failed',
  cancelled: 'Cancelled',
  shipped: 'Sent',
  delivered: 'Delivered',
  refunded: 'Refunded',
};

function whyNothing(state: OrderState): string {
  switch (state) {
    case 'placed':
      return 'Waiting for payment. Sending becomes available once payment is captured, which the payment integration records; it is not marked by hand.';
    case 'payment_failed':
      return 'Payment failed. The payment integration cancels the order and releases its stock; nothing is done from here.';
    case 'delivered':
      return 'Delivered. Nothing further to do.';
    case 'cancelled':
      return 'Cancelled. Nothing further to do.';
    case 'refunded':
      return 'Refunded. Nothing further to do.';
    case 'none':
      return 'This order has no events, which means its placement did not complete. Ask a developer to look.';
    default:
      return '';
  }
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const o = await getAdminOrder(id);
  if (!o) notFound();

  return (
    <>
      <h1 className={shell.pageTitle}>Order {o.orderNumber}</h1>
      <p className={shell.pageIntro}>
        Placed {formatDateTime(o.createdAt)} · <Link href="/admin/orders">All orders</Link>
      </p>

      <Notices notice={readNotice(sp)} />

      {o.rejected.length > 0 ? (
        <p className={ui.notice} role="alert">
          {o.rejected.length} event{o.rejected.length === 1 ? ' was' : 's were'} recorded out of
          order and ignored when working out the state. This needs a developer to reconcile;
          the history below shows them.
        </p>
      ) : null}

      <dl className={ui.facts}>
        <div>
          <dt>State</dt>
          <dd style={{ fontSize: 16 }}>{STATE_LABEL[o.state]}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{rupees(o.totalPaise)}</dd>
        </div>
        <div>
          <dt>Items</dt>
          <dd>{o.lines.reduce((n, l) => n + l.quantity, 0)}</dd>
        </div>
        <div>
          <dt>Gift</dt>
          <dd style={{ fontSize: 16 }}>{o.isGift ? 'Yes' : 'No'}</dd>
        </div>
      </dl>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>What to do</h2>
        {o.nextFulfilment.length > 0 ? (
          <div className={ui.actions}>
            {o.nextFulfilment.map((e) => (
              <Link
                key={e}
                className={ui.secondary}
                href={`/admin/orders/${o.id}/fulfil?event=${e}`}
              >
                {e === 'shipped' ? 'Mark as sent' : 'Mark as delivered'}
              </Link>
            ))}
          </div>
        ) : (
          <p className={ui.muted} style={{ margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
            {whyNothing(o.state)}
          </p>
        )}
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Items</h2>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col" className={ui.num}>Qty</th>
                <th scope="col" className={ui.num}>Unit price</th>
                <th scope="col" className={ui.num}>Line total</th>
              </tr>
            </thead>
            <tbody>
              {o.lines.map((l) => (
                <tr key={l.id}>
                  <td>
                    {l.productName}
                    {l.variantName ? <span className={ui.sub}>{l.variantName}</span> : null}
                  </td>
                  <td className={ui.num}>{l.quantity}</td>
                  <td className={ui.num}>{rupees(l.unitPricePaise)}</td>
                  <td className={ui.num}>{rupees(l.lineTotalPaise)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className={ui.muted}>Subtotal</td>
                <td className={ui.num}>{rupees(o.subtotalPaise)}</td>
              </tr>
              <tr>
                <td colSpan={3} className={ui.muted}>Shipping</td>
                <td className={ui.num}>{rupees(o.shippingPaise)}</td>
              </tr>
              <tr>
                <td colSpan={3} className={ui.primaryCell}>Total</td>
                <td className={`${ui.num} ${ui.primaryCell}`}>{rupees(o.totalPaise)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={ui.footnote} style={{ marginTop: 8 }}>
          Prices are as they were when the order was placed. A later price change does not alter them.
        </p>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Deliver to</h2>
        <div className={ui.card}>
          <dl className={ui.kv}>
            <dt>Name</dt>
            <dd>{o.shipping.name}</dd>
            <dt>Address</dt>
            <dd>
              {o.shipping.line1}
              {o.shipping.line2 ? <>, {o.shipping.line2}</> : null}
              <br />
              {o.shipping.city}, {o.shipping.state} {o.shipping.pincode}
            </dd>
            <dt>Phone</dt>
            <dd>{o.phone}</dd>
            <dt>Email</dt>
            <dd>{o.email}</dd>
            <dt>Account</dt>
            <dd>
              {o.customer ? (
                <Link className={ui.link} href={`/admin/customers/${o.customer.id}`}>
                  {o.customer.name ?? o.customer.email}
                </Link>
              ) : (
                <span className={ui.muted}>Guest checkout, no account</span>
              )}
            </dd>
            {o.isGift ? (
              <>
                <dt>Gift message</dt>
                <dd>{o.giftMessage ? o.giftMessage : <span className={ui.muted}>None</span>}</dd>
              </>
            ) : null}
          </dl>
        </div>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Stock held for this order</h2>
        {o.reservations.length === 0 ? (
          <p className={ui.muted} style={{ margin: 0 }}>None.</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col" className={ui.num}>Qty</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {o.reservations.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.itemName}
                      <span className={ui.sub}>{r.itemSku}</span>
                    </td>
                    <td className={ui.num}>{r.quantity}</td>
                    <td>
                      <span className={ui.badge}>{r.state}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className={ui.footnote} style={{ marginTop: 8 }}>
          Held stock is promised and not sellable to anyone else. It becomes consumed when payment
          is captured and released if payment fails.
        </p>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>History</h2>
        <ol className={ui.timeline}>
          {o.events.map((e) => {
            const rejected = o.rejected.some((r) => r.index === o.events.indexOf(e));
            const payload =
              e.payload && typeof e.payload === 'object' && Object.keys(e.payload).length > 0
                ? JSON.stringify(e.payload, null, 1)
                : null;
            return (
              <li key={e.id}>
                <time dateTime={e.createdAt.toISOString()}>{formatDateTime(e.createdAt)}</time>
                <div>
                  <strong>{EVENT_LABEL[e.type] ?? e.type}</strong>
                  {rejected ? <span className={ui.muted}> (out of order, ignored)</span> : null}
                  {payload ? <pre className={ui.code}>{payload}</pre> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
