/**
 * The order state fold — features/checkout.md §2.6, data-model.md §7.3.
 *
 * There is no status column anywhere. State is derived by folding the
 * append-only order_event rows, and ONLY forward transitions are legal:
 *
 *   placed → payment_captured → shipped → delivered
 *   placed → payment_failed → cancelled       payment_captured → refunded
 *
 * An illegal event is rejected with a reason, never applied — out-of-order
 * webhook delivery (architecture.md §2, race 3) lands in the table as-is, and
 * the fold refuses to let it regress anything. Rejections are reconciliation
 * incidents for the caller to report, not silent skips.
 */

export type OrderEventType =
  | 'placed'
  | 'payment_captured'
  | 'payment_failed'
  | 'cancelled'
  | 'shipped'
  | 'delivered'
  | 'refunded';

/** 'none' = no events yet — an order row without its placed event is mid-transaction. */
export type OrderState = 'none' | OrderEventType;

export const TERMINAL_STATES: ReadonlySet<OrderState> = new Set([
  'delivered',
  'cancelled',
  'refunded',
]);

/** state → events legal from it. Exactly the diagram, nothing more. */
const LEGAL: Record<OrderState, readonly OrderEventType[]> = {
  none: ['placed'],
  placed: ['payment_captured', 'payment_failed'],
  payment_captured: ['shipped', 'refunded'],
  payment_failed: ['cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  refunded: [],
};

export interface RejectedEvent {
  index: number;
  type: OrderEventType;
  reason: string;
}

export interface FoldResult {
  state: OrderState;
  /** Non-empty = a reconciliation incident to report, never to ignore. */
  rejected: RejectedEvent[];
}

export function deriveOrderState(
  events: readonly { type: OrderEventType }[]
): FoldResult {
  let state: OrderState = 'none';
  const rejected: RejectedEvent[] = [];

  events.forEach((event, index) => {
    if (LEGAL[state].includes(event.type)) {
      state = event.type;
    } else {
      rejected.push({
        index,
        type: event.type,
        reason: `'${event.type}' is not legal from '${state}'`,
      });
    }
  });

  return { state, rejected };
}
