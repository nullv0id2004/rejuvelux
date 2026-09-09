/**
 * Customers, read-only — features/admin.md §4, stage 6.
 *
 * PII (data-model.md §9.2). No editing exists here and none is planned until
 * R-41's consent and erasure work exists; an admin can look, and every look
 * is at data the order already embeds. Guest orders have no `customer` row at
 * all (checkout never creates one), so "customers" as the client team means
 * them are mostly the distinct emails on orders — `listGuestBuyers` in
 * orders.ts supplies those, and the page shows both.
 */

import { asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { address, customer, order } from '../db/schema';
import { deriveOrderState, type OrderEventType, type OrderState } from '../orders/state';

export interface CustomerRow {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  hasAccount: boolean;
  createdAt: Date;
  orderCount: number;
  lastOrderAt: Date | null;
}

export async function listCustomers(): Promise<CustomerRow[]> {
  const rows = await db
    .select({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      authUserId: customer.authUserId,
      createdAt: customer.createdAt,
      // The outer column is written out in full: interpolating `${customer.id}`
      // renders a bare "id", which binds to the inner table (see worklist.ts).
      orderCount: sql<number>`(SELECT count(*)::int FROM "order" o WHERE o.customer_id = "customer"."id")`,
      lastOrderAt: sql<Date | null>`(SELECT max(o.created_at) FROM "order" o WHERE o.customer_id = "customer"."id")`,
    })
    .from(customer)
    .orderBy(desc(customer.createdAt));
  return rows.map(({ authUserId, ...r }) => ({ ...r, hasAccount: authUserId !== null }));
}

export interface CustomerDetail extends CustomerRow {
  addresses: {
    id: string;
    recipientName: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }[];
  orders: {
    id: string;
    orderNumber: string;
    createdAt: Date;
    totalPaise: number;
    state: OrderState;
  }[];
}

export async function getCustomer(id: string): Promise<CustomerDetail | null> {
  const [c] = await db.select().from(customer).where(eq(customer.id, id)).limit(1);
  if (!c) return null;

  const [addresses, orders] = await Promise.all([
    db.select().from(address).where(eq(address.customerId, id)).orderBy(asc(address.createdAt)),
    db
      .select({
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        totalPaise: order.totalPaise,
        events: sql<string[]>`(
          SELECT coalesce(array_agg(e.type ORDER BY e.id), '{}')
          FROM order_event e WHERE e.order_id = "order"."id"
        )`,
      })
      .from(order)
      .where(eq(order.customerId, id))
      .orderBy(desc(order.createdAt)),
  ]);

  return {
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    hasAccount: c.authUserId !== null,
    createdAt: c.createdAt,
    orderCount: orders.length,
    lastOrderAt: orders[0]?.createdAt ?? null,
    addresses: addresses.map((a) => ({
      id: a.id,
      recipientName: a.recipientName,
      line1: a.line1,
      line2: a.line2,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      phone: a.phone,
    })),
    orders: orders.map(({ events, ...o }) => ({
      ...o,
      state: deriveOrderState(events.map((type) => ({ type: type as OrderEventType }))).state,
    })),
  };
}
