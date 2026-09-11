# Feature — Checkout

> **Purpose:** The moment intent becomes commitment. One transaction turns an open cart into an
> order: snapshots taken, stock reserved under lock, the `placed` event appended — or nothing at
> all happens.
>
> **Status: written 27 August 2026, `PROVISIONAL`.** Third of the commerce spine. Schema:
> `data-model.md` §6–§7. Races: `architecture.md` §2 (this feature is race 1's caller and race 2's
> owner). **Payment is deliberately absent from this pass** — Sayon deferred Razorpay on
> 27 Aug 2026. The seam is marked in §2.4: placement completes and stops at `placed`; minting the
> payment intent is the next phase's single insertion point.
>
> **Implemented and verified same day** — `lib/server/orders/` + `/api/checkout`, 28/28
> (work_done.md, 27 Aug; the sequential-retry idempotency path was a caught-and-fixed bug).
> Consequential risks raised: R-64 (unpaid orders pin stock until the payment phase's sweep),
> R-65 (shipping ₹0 is a placeholder, not a decision).

---

## 1. Scope

**In:** placement — validate, re-quote, snapshot, reserve, complete the cart, append `placed` ·
checkout idempotency (double submit, double click, retry) · the order state fold (full transition
table, used by every later phase) · contact/address/gift capture.

**Out (this pass):** payment intent + webhooks (Razorpay phase; §2.4 seam) · **reservation-expiry
sweep** — deliberately shipped WITH payment, not before it: expiry exists to free stock from
orders whose payment never resolved, and until a payment can resolve, expiring anything would be
guessing at a timeout with nothing to time (noted in `data-model.md` §10) · shipping-rate
computation (`features/shipping.md`, unwritten — see §2.3) · order-read API and history (accounts
phase) · confirmation email (`features/notifications.md`, unwritten).

## 2. Behaviour

### 2.1 Input and validation

`POST /api/checkout` against the cookie's cart:

```
{ contact: { email, phone },
  shipping: { name, line1, line2?, city, state, pincode },
  gift?: { isGift: true, message? } }
```

Refusals (all pre-transaction, structured `{ error, message }`):

| Refusal | Code | Rule |
|---|---|---|
| No open cart / empty cart | `EMPTY_CART` | Nothing to commit |
| A line's variant no longer `active` | `UNAVAILABLE` | Named per line; customer removes it — never auto-removed (`features/cart.md` §2.3) |
| A line's price now NULL | `UNAVAILABLE` | Invariant 9 holds at every gate |
| Malformed email / phone not 10 digits / pincode not 6 digits / empty required field | `BAD_REQUEST` | India-only formats (R-23); the pincode CHECK backs the code |
| `gift.message` without `isGift` | `BAD_REQUEST` | data-model.md §7.1's app-enforced pair |

**Phone and email are format-validated only** — no OTP, no verification (nothing exists to send
with; `features/notifications.md` is unwritten).

### 2.2 Re-quote — the price-honesty gate

For every line, current variant price is compared with the cart snapshot. Any difference:

- **No order is created.** Response `409 REQUOTED`, listing each changed line with old and new
  price.
- The cart's snapshots are **updated to current** in the same request — so the customer sees the
  new numbers in their cart, and a *knowing* resubmit succeeds at them.
- Neither price is ever silently charged (`data-model.md` §6.2).

### 2.3 The placement transaction

All inside one `db.transaction`, in order:

1. **Re-read the cart's lines** (fresh, inside the transaction).
2. **Insert the order**: `order_number` = `'RJ-' || lpad(nextval('order_number_seq'), 5, '0')`;
   contact, shipping and gift fields embedded; `subtotal` = Σ snapshot×qty;
   **`shipping_paise` = 0, `PROVISIONAL`** — the one number here not from a document. Charging an
   invented rate would be worse than charging nothing; `features/shipping.md` owns the real
   answer and this line is its trigger. Total CHECK holds either way.
3. **Insert order lines** — name, variant name, unit price, line total, all snapshots.
4. **Reserve** via `reserveForOrder(orderId, lines, tx)` — the inventory feature's transaction,
   joined to this one. Shortfall → **the entire placement rolls back** and the response is
   `409 OUT_OF_STOCK` naming the short products (mapped from inventory items to catalogue names).
   The customer learns at checkout, with names — never a mystery failure after payment.
5. **Complete the cart** — `status = 'completed'`, the terminal state; the cookie is cleared in
   the response. A completed cart is never reopened (`features/cart.md` §2.1).
6. **Append `placed`** to `order_event` — the order's first and, this pass, only event.

### 2.4 The payment seam — what the next phase inserts, and nothing else

Between steps 5 and 6 the Razorpay phase will: create the `payment` row, mint the provider order,
and return `providerOrderId` for the client-side checkout. Nothing built this pass needs to
change. **Until then a placed order holds its reservations indefinitely** — acceptable solely
because no real orders exist; the expiry sweep ships with payment (§1).

### 2.5 Idempotency — race 2, closed by the constraint

`UNIQUE(cart_id)` on `order` is the arbiter. A second placement of the same cart — double click,
retry, two tabs — hits the constraint; the handler catches the violation, reads the existing
order, and returns it as **`200` (not `201`) with the same order number**. The response is
indistinguishable in content from the first, which is the definition of idempotent. No
application-level "already placed?" pre-check exists — that check is itself a race
(`architecture.md` §2).

### 2.6 The order state fold

`deriveOrderState(events)` — pure function, written this pass because every later phase folds:

```
placed → payment_captured → shipped → delivered
placed → payment_failed → cancelled          payment_captured → refunded
```

Illegal events are **rejected with a reason, never applied** — `payment_captured` after
`cancelled` is a reconciliation incident to report (race 3). Terminal: `delivered`, `cancelled`,
`refunded`. The fold is the only reader of `order_event`; nothing ever writes a status column,
because there isn't one.

## 3. Response

`201` (or idempotent `200`): `{ orderNumber, orderId, subtotalPaise, shippingPaise, totalPaise,
lines: [{ name, quantity, unitPricePaise }], state: 'placed' }` — enough for a confirmation
surface that says what was bought and for how much (`product.md` §6: success confirms
specifically). Payment status arrives with the payment phase.

## 4. Edge cases

| Case | Behaviour |
|---|---|
| Double submit (sequential or concurrent) | Same order returned both times; one `placed` event, one set of reservations — `UNIQUE(cart_id)` |
| Price changes between cart and checkout | `REQUOTED`, snapshots updated, knowing resubmit succeeds (§2.2) |
| Stock vanishes between cart and checkout | `OUT_OF_STOCK` naming the products; nothing created, cart stays open |
| Kit component short (bowl gone, tea in stock) | Same as above — the set fails as a unit, named honestly |
| Variant retired mid-checkout | `UNAVAILABLE` naming the line; cart stays open for the customer to remove it |
| Placement succeeds, response lost (network) | Client retries → idempotent `200`, same order |
| Cart cookie dead/completed | `EMPTY_CART` — a completed cart is checkout's record, not reopenable |

## 5. Data

Tables from `data-model.md` §6–§7; nothing added. Invariants exercised: 1–5, 7, 8, 9
(§9.4) — this feature is where most of the schema earns its constraints.

## 6. Dependencies

Inventory (`reserveForOrder` joins this transaction) · cart (consumed and completed) ·
**provides to:** payments (the seam, §2.4), orders/notifications/accounts (the fold and the rows).

## 7. Analytics · 8. Accessibility

None this pass · API-level: structured errors name products, not codes alone.

## 9. Open questions

- `shipping_paise = 0 PROVISIONAL` — resolved by `features/shipping.md`; also listed in
  `data-model.md` §10.
- Reservation-expiry timeout value — decided in the payment phase, where Razorpay's own order
  expiry (regenerable) anchors it.
- Order-number padding width (5) — cosmetic, PROVISIONAL (`data-model.md` §10).
