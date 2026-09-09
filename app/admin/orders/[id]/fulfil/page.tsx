/**
 * /admin/orders/[id]/fulfil — append `shipped`, then `delivered`
 * (features/admin.md §4, stage 4).
 *
 * This page is the confirmation step (§6.3): the detail page's button brings
 * the person here, the consequence is stated, and submitting appends the
 * event. It is offered only for an event the fold permits right now; asking
 * for any other event shows the reason instead of a form.
 */

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth/session';
import {
  FULFILMENT_EVENTS,
  STATE_LABEL,
  fulfilOrder,
  getAdminOrder,
  type FulfilmentEvent,
} from '@/lib/server/admin/orders';
import { explainRefusal } from '@/lib/server/admin/refusal';
import { backTo, carry, initial, one, readNotice, text, type SearchParams } from '../../../form';
import { Notices } from '../../../notices';
import shell from '../../../admin.module.css';
import ui from '../../../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Fulfil order' };

const FIELDS = ['courier', 'trackingReference', 'note'] as const;

async function submit(formData: FormData) {
  'use server';
  const session = await requireAdmin();
  const orderId = text(formData, 'orderId');
  const event = text(formData, 'event') as FulfilmentEvent;
  const path = `/admin/orders/${orderId}/fulfil`;
  const carried = carry(formData, FIELDS);
  carried.set('event', event);

  const rawLast = text(formData, 'lastEventId');
  const lastEventId = rawLast === '' ? null : Number.parseInt(rawLast, 10);

  let refused: string | null = null;
  try {
    await fulfilOrder(
      session,
      orderId,
      event,
      {
        courier: text(formData, 'courier'),
        trackingReference: text(formData, 'trackingReference'),
        note: text(formData, 'note'),
      },
      lastEventId
    );
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  if (refused) redirect(backTo(path, { refused, carry: carried }));

  redirect(
    backTo(`/admin/orders/${orderId}`, {
      done: event === 'shipped' ? 'Marked as sent.' : 'Marked as delivered.',
    })
  );
}

export default async function FulfilPage({
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

  const eventParam = one(sp, 'event');
  const event = FULFILMENT_EVENTS.includes(eventParam as FulfilmentEvent)
    ? (eventParam as FulfilmentEvent)
    : null;
  const allowed = event !== null && o.nextFulfilment.includes(event);
  const v = (name: string) => initial(sp, name, '');

  return (
    <>
      <h1 className={shell.pageTitle}>
        {event === 'delivered' ? 'Mark as delivered' : 'Mark as sent'}: {o.orderNumber}
      </h1>
      <p className={shell.pageIntro}>
        Currently <strong>{STATE_LABEL[o.state]}</strong>. For {o.shipping.name},{' '}
        {o.shipping.city} {o.shipping.pincode}.{' '}
        <Link href={`/admin/orders/${o.id}`}>Back to the order</Link>
      </p>

      <Notices notice={readNotice(sp)} />

      {!allowed ? (
        <p className={ui.notice} role="alert">
          {event === null
            ? 'Choose an action from the order page.'
            : `This order cannot be marked ${event === 'shipped' ? 'sent' : 'delivered'} while it is "${STATE_LABEL[o.state]}".`}
        </p>
      ) : (
        <form className={ui.form} action={submit}>
          <input type="hidden" name="orderId" value={o.id} />
          <input type="hidden" name="event" value={event} />
          <input type="hidden" name="lastEventId" value={o.lastEventId ?? ''} />

          <p className={ui.hint} style={{ fontSize: 14, marginBottom: 20 }}>
            {event === 'shipped'
              ? 'This records that the parcel has left. It cannot be undone; the next step after this is "delivered".'
              : 'This records that the parcel reached the customer and closes the order. It cannot be undone.'}
          </p>

          {event === 'shipped' ? (
            <>
              <label className={ui.field}>
                <span className={ui.label}>Courier</span>
                <span className={ui.hint}>Optional, e.g. Delhivery, Blue Dart, India Post.</span>
                <input className={ui.input} name="courier" maxLength={80} defaultValue={v('courier')} autoFocus />
              </label>
              <label className={ui.field}>
                <span className={ui.label}>Tracking reference</span>
                <span className={ui.hint}>Optional. Recorded on the order for anyone who asks.</span>
                <input className={ui.input} name="trackingReference" maxLength={120} defaultValue={v('trackingReference')} />
              </label>
            </>
          ) : (
            <label className={ui.field}>
              <span className={ui.label}>Note</span>
              <span className={ui.hint}>Optional, e.g. "signed for by the customer".</span>
              <input className={ui.input} name="note" maxLength={200} defaultValue={v('note')} autoFocus />
            </label>
          )}

          <div className={ui.actions}>
            <button className={ui.primary} type="submit">
              {event === 'shipped' ? 'Yes, it has been sent' : 'Yes, it was delivered'}
            </button>
            <Link className={ui.link} href={`/admin/orders/${o.id}`}>
              Cancel
            </Link>
          </div>
        </form>
      )}
    </>
  );
}
