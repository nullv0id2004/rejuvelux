/**
 * The order-event appender — the write side of the fold in `state.ts`.
 *
 * `placeOrder` writes the first event inline because it is part of the
 * placement transaction. Every later event goes through here, so that the one
 * rule the fold enforces on read (forward-only, `LEGAL` transitions) is also
 * enforced on write: an event the fold would reject is refused before it lands,
 * not appended and then reported as a reconciliation incident.
 *
 * The payment phase will call this for `payment_captured` and friends; the admin
 * calls it for `shipped` and `delivered` (features/admin.md §4).
 */

import { asc, eq } from 'drizzle-orm';
import { db, type Tx } from '../db/client';
import { orderEvent } from '../db/schema';
import { deriveOrderState, legalEventsFrom, type FoldResult, type OrderEventType } from './state';

export interface OrderEventRow {
  id: number;
  type: OrderEventType;
  payload: unknown;
  createdAt: Date;
}

/** Every event for one order, oldest first — the fold's input. */
export async function loadOrderEvents(orderId: string, tx?: Tx): Promise<OrderEventRow[]> {
  const q = tx ?? db;
  const rows = await q
    .select({
      id: orderEvent.id,
      type: orderEvent.type,
      payload: orderEvent.payload,
      createdAt: orderEvent.createdAt,
    })
    .from(orderEvent)
    .where(eq(orderEvent.orderId, orderId))
    .orderBy(asc(orderEvent.id));
  return rows.map((r) => ({ ...r, type: r.type as OrderEventType }));
}

export type AppendResult =
  | { ok: true; eventId: number; state: FoldResult['state'] }
  | { ok: false; reason: string; state: FoldResult['state'] };

/**
 * Append one event if the fold permits it from the order's current state.
 *
 * Reads the history inside the caller's transaction so two concurrent appends
 * cannot both see the same "current" state: the caller is expected to hold a
 * lock on the order row (`SELECT ... FOR UPDATE`) when the outcome matters,
 * which the admin does.
 */
export async function appendOrderEvent(
  orderId: string,
  type: OrderEventType,
  payload: Record<string, unknown>,
  tx?: Tx
): Promise<AppendResult> {
  const run = async (t: Tx): Promise<AppendResult> => {
    const events = await loadOrderEvents(orderId, t);
    const { state } = deriveOrderState(events);
    if (!legalEventsFrom(state).includes(type)) {
      return { ok: false, reason: `'${type}' is not legal from '${state}'`, state };
    }
    const [row] = await t
      .insert(orderEvent)
      .values({ orderId, type, payload })
      .returning({ id: orderEvent.id });
    return { ok: true, eventId: row.id, state: type };
  };
  return tx ? run(tx) : db.transaction(run);
}
