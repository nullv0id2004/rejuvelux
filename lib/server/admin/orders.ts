/**
 * Orders, as the admin sees and fulfils them — features/admin.md §4, stage 4.
 *
 * State is never a column (data-model.md §7.3). Every list and detail here
 * folds `order_event` through `deriveOrderState`, and the only transitions the
 * admin may append are the two fulfilment events, offered exactly when the
 * fold permits them: `shipped` from `payment_captured`, `delivered` from
 * `shipped`. Payment events belong to the payment integration (Phase 3), never
 * to a button here; a cancellation or refund without a gateway behind it would
 * be a lie (§1).
 */

import { and, asc, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { db } from '../db/client';
import {
  customer,
  inventoryItem,
  order,
  orderEvent,
  orderLine,
  reservation,
} from '../db/schema';
import type { AdminSession } from '../auth/session';
import { appendOrderEvent, loadOrderEvents, type OrderEventRow } from '../orders/events';
import {
  deriveOrderState,
  legalEventsFrom,
  type OrderEventType,
  type OrderState,
} from '../orders/state';
import { auditedMutation } from './audit';
import { RefusedError, StaleError } from './refusal';

/** The events an admin may append, and the words for them. */
export const FULFILMENT_EVENTS = ['shipped', 'delivered'] as const;
export type FulfilmentEvent = (typeof FULFILMENT_EVENTS)[number];

export const STATE_LABEL: Record<OrderState, string> = {
  none: 'Incomplete',
  placed: 'Awaiting payment',
  payment_captured: 'Paid, to be sent',
  payment_failed: 'Payment failed',
  cancelled: 'Cancelled',
  shipped: 'Sent',
  delivered: 'Delivered',
  refunded: 'Refunded',
};

export const ORDER_STATES: readonly OrderState[] = [
  'placed',
  'payment_captured',
  'shipped',
  'delivered',
  'payment_failed',
  'cancelled',
  'refunded',
];

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  createdAt: Date;
  email: string;
  shipName: string;
  totalPaise: number;
  lineCount: number;
  state: OrderState;
  /** Events the fold rejected — a reconciliation incident, shown, never hidden. */
  rejectedEvents: number;
}

export interface OrderListQuery {
  state?: OrderState;
  /** Exact match on the order's contact email, lowercased. */
  email?: string;
  customerId?: string;
  page: number;
  pageSize: number;
}

/**
 * Newest first, filtered by DERIVED state.
 *
 * Because state is a fold, filtering happens in code after folding, which is
 * O(orders) per page. That is the right trade today (zero real orders) and
 * stays right into the hundreds; the trigger for a materialised state is an
 * order list that takes visibly long to load, and it is noted here rather
 * than pre-built.
 */
export async function listAdminOrders(q: OrderListQuery): Promise<{
  rows: AdminOrderSummary[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const where = [];
  if (q.email) where.push(eq(sql`lower(${order.email})`, q.email.toLowerCase()));
  if (q.customerId) where.push(eq(order.customerId, q.customerId));

  const orders = await db
    .select({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      email: order.email,
      shipName: order.shipName,
      totalPaise: order.totalPaise,
    })
    .from(order)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(order.createdAt));

  if (orders.length === 0) return { rows: [], total: 0, page: q.page, pageSize: q.pageSize };

  const ids = orders.map((o) => o.id);
  const events = await db
    .select({ orderId: orderEvent.orderId, type: orderEvent.type })
    .from(orderEvent)
    .where(inArray(orderEvent.orderId, ids))
    .orderBy(asc(orderEvent.id));
  const lines = await db
    .select({ orderId: orderLine.orderId, n: sql<number>`count(*)::int` })
    .from(orderLine)
    .where(inArray(orderLine.orderId, ids))
    .groupBy(orderLine.orderId);

  const eventsByOrder = new Map<string, { type: OrderEventType }[]>();
  for (const e of events) {
    const arr = eventsByOrder.get(e.orderId) ?? [];
    arr.push({ type: e.type as OrderEventType });
    eventsByOrder.set(e.orderId, arr);
  }
  const linesByOrder = new Map(lines.map((l) => [l.orderId, l.n]));

  const folded: AdminOrderSummary[] = orders.map((o) => {
    const fold = deriveOrderState(eventsByOrder.get(o.id) ?? []);
    return {
      ...o,
      lineCount: linesByOrder.get(o.id) ?? 0,
      state: fold.state,
      rejectedEvents: fold.rejected.length,
    };
  });

  const filtered = q.state ? folded.filter((o) => o.state === q.state) : folded;
  const start = (q.page - 1) * q.pageSize;
  return {
    rows: filtered.slice(start, start + q.pageSize),
    total: filtered.length,
    page: q.page,
    pageSize: q.pageSize,
  };
}

export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  createdAt: Date;
  email: string;
  phone: string;
  shipping: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
  isGift: boolean;
  giftMessage: string | null;
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  customer: { id: string; email: string; name: string | null } | null;
  lines: {
    id: string;
    productName: string;
    variantName: string | null;
    quantity: number;
    unitPricePaise: number;
    lineTotalPaise: number;
  }[];
  reservations: { id: string; itemName: string; itemSku: string; quantity: number; state: string }[];
  events: OrderEventRow[];
  state: OrderState;
  rejected: { index: number; type: OrderEventType; reason: string }[];
  /** The fulfilment events the fold permits right now. Often empty. */
  nextFulfilment: FulfilmentEvent[];
  /** The id of the latest event: the form's staleness token. */
  lastEventId: number | null;
}

export async function getAdminOrder(id: string): Promise<AdminOrderDetail | null> {
  const [o] = await db.select().from(order).where(eq(order.id, id)).limit(1);
  if (!o) return null;

  const [lines, reservations, events, cust] = await Promise.all([
    db.select().from(orderLine).where(eq(orderLine.orderId, id)).orderBy(asc(orderLine.id)),
    db
      .select({
        id: reservation.id,
        itemName: inventoryItem.name,
        itemSku: inventoryItem.sku,
        quantity: reservation.quantity,
        state: reservation.state,
      })
      .from(reservation)
      .innerJoin(inventoryItem, eq(inventoryItem.id, reservation.inventoryItemId))
      .where(eq(reservation.orderId, id))
      .orderBy(asc(inventoryItem.name)),
    loadOrderEvents(id),
    o.customerId
      ? db
          .select({ id: customer.id, email: customer.email, name: customer.name })
          .from(customer)
          .where(eq(customer.id, o.customerId))
          .limit(1)
      : Promise.resolve([]),
  ]);

  const fold = deriveOrderState(events);
  const legal = legalEventsFrom(fold.state);
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt,
    email: o.email,
    phone: o.phone,
    shipping: {
      name: o.shipName,
      line1: o.shipLine1,
      line2: o.shipLine2,
      city: o.shipCity,
      state: o.shipState,
      pincode: o.shipPincode,
    },
    isGift: o.isGift,
    giftMessage: o.giftMessage,
    subtotalPaise: o.subtotalPaise,
    shippingPaise: o.shippingPaise,
    totalPaise: o.totalPaise,
    customer: cust[0] ?? null,
    lines: lines.map((l) => ({
      id: l.id,
      productName: l.productName,
      variantName: l.variantName,
      quantity: l.quantity,
      unitPricePaise: l.unitPricePaise,
      lineTotalPaise: l.lineTotalPaise,
    })),
    reservations,
    events,
    state: fold.state,
    rejected: fold.rejected,
    nextFulfilment: FULFILMENT_EVENTS.filter((e) => legal.includes(e)),
    lastEventId: events.length ? events[events.length - 1].id : null,
  };
}

export interface FulfilmentPayload {
  courier?: string;
  trackingReference?: string;
  note?: string;
}

/**
 * Append `shipped` or `delivered`. The order row is locked so two people
 * marking the same order at once cannot both succeed; the form's
 * `lastEventId` must still be the latest event or the submit is stale.
 */
export async function fulfilOrder(
  session: AdminSession,
  orderId: string,
  type: FulfilmentEvent,
  payload: FulfilmentPayload,
  expectedLastEventId: number | null
): Promise<{ eventId: number; state: OrderState }> {
  if (!FULFILMENT_EVENTS.includes(type)) {
    throw new RefusedError('Only "sent" and "delivered" can be recorded from the admin.');
  }
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (typeof v === 'string' && v.trim()) cleaned[k] = v.trim().slice(0, 200);
  }

  return auditedMutation(
    session,
    async (tx) => {
      const [row] = await tx
        .select({ id: order.id })
        .from(order)
        .where(eq(order.id, orderId))
        .for('update');
      if (!row) throw new RefusedError('That order no longer exists.');

      const events = await loadOrderEvents(orderId, tx);
      const lastId = events.length ? events[events.length - 1].id : null;
      if (lastId !== expectedLastEventId) throw new StaleError();

      const result = await appendOrderEvent(orderId, type, cleaned, tx);
      if (!result.ok) {
        throw new RefusedError(
          `This order cannot be marked ${type === 'shipped' ? 'sent' : 'delivered'} while it is "${STATE_LABEL[result.state]}".`
        );
      }
      return { eventId: result.eventId, state: result.state, previous: lastId };
    },
    (r) => ({
      action: type === 'shipped' ? 'order.ship' : 'order.deliver',
      entityType: 'order',
      entityId: orderId,
      before: { lastEventId: r.previous },
      after: { eventId: r.eventId, type, ...cleaned },
    })
  ).then((r) => ({ eventId: r.eventId, state: r.state }));
}

/** Distinct contact emails on orders with no customer row — the guest buyers. */
export async function listGuestBuyers(): Promise<
  { email: string; name: string; orderCount: number; lastOrderAt: Date }[]
> {
  return db
    .select({
      email: sql<string>`lower(${order.email})`,
      name: sql<string>`max(${order.shipName})`,
      orderCount: sql<number>`count(*)::int`,
      lastOrderAt: sql<Date>`max(${order.createdAt})`,
    })
    .from(order)
    .where(isNull(order.customerId))
    .groupBy(sql`lower(${order.email})`)
    .orderBy(desc(sql`max(${order.createdAt})`));
}
