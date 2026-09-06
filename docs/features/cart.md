# Feature — Cart

> **Purpose:** Intent, held honestly. What a visitor has decided to buy, at the price they were
> shown, with nothing reserved and nothing promised until checkout commits it.
>
> **Status: written 27 August 2026, `PROVISIONAL`.** Second of the commerce spine, after
> `features/inventory.md`. Schema authority: `data-model.md` §6. This phase builds the **domain
> layer and HTTP API only** — cart UI and the add-to-cart control are frontend work, deliberately
> deferred to a storefront pass (Sayon directed backend-first, 27 Aug 2026).
>
> **Implemented and verified same day** — `lib/server/cart/` + `/api/cart*`, 19/19 over HTTP
> (work_done.md, 27 Aug). The `priceChanged`/`unavailable` read paths are exercised by checkout's
> tests, not cart's.

---

## 1. Scope

**In:** cart identity via httpOnly cookie · add line (by product slug) · change quantity · remove
line · read cart with price honesty and stock states · subtotal.

**Out:** reservation (checkout's, at placement — `data-model.md` §6.2 states why: §50's drops make
cart-hoarding an attack) · shipping and totals beyond subtotal (checkout's) · merging a guest cart
into an account (auth phase) · saved-for-later, wishlist (`product.md` §1.2) · abandoned-cart
email (`features/retention.md`, unwritten — and §49 constrains what it could say) · cart UI.

## 2. Behaviour

### 2.1 Identity

- Cookie `rj_cart`: the cart's uuid, `httpOnly`, `SameSite=Lax`, `Secure` in production, 30 days.
  The uuid is the claim ticket (`data-model.md` §6.1) — unguessable, no session machinery.
- **Reads never create.** `GET` with no cookie (or a dead one) returns the empty shape and sets
  nothing. A cart row is created on the **first write**, which is when the cookie is set. No junk
  rows from crawlers.
- A cookie pointing at a `completed`/`abandoned`/missing cart is treated as absent: next write
  starts a fresh cart. Completed carts are checkout's terminal state, never reopened.

### 2.2 Add line — the gate where invariants bite

By product **slug** (the storefront's vocabulary; variants are 1:1 today, the domain resolves it).

Refused, with a structured error naming why (`product.md` §6: errors say what happened and what
to do):

| Refusal | Code | Why |
|---|---|---|
| Price is NULL | `NOT_PURCHASABLE` | Invariant 9 (`data-model.md` §9.4): unconfirmed price is never sold (R-04, open call #4) |
| Product/variant not `active` | `NOT_FOUND` | Retired products stay renderable in order history, not buyable |
| Quantity would exceed 10 | `QUANTITY_LIMIT` | D2C cap (R-19); the DB CHECK backs the code |
| Quantity < 1 | `BAD_REQUEST` | Zero is "remove", and only `PATCH` says remove |

Same variant added again = **atomic quantity merge** (`ON CONFLICT` upsert on
`UNIQUE(cart_id, variant_id)` — two tabs adding concurrently produce one line, summed). A merge
that would pass 10 is refused whole, not clamped: silently changing the number a customer chose
fails §22's honesty cheaper than an error does.

`unit_price_paise` snapshots the price shown at add time. **Stock is not checked at add** — the
catalogue already shows stock states; the cart taking a line it may not be able to fulfil is
resolved at checkout, where reservation is truth.

### 2.3 Read — price honesty and stock states

`GET` returns lines joined live to product and variant, each carrying:

- the **snapshot** price (`unitPricePaise`, what they agreed to) and the **current** price
  (`currentPricePaise`), with `priceChanged: true` when they differ — surfaced, never silently
  substituted; checkout re-quotes on mismatch (`data-model.md` §6.2);
- `stockState` from `features/inventory.md` §3 (`available` / `low` / `out_of_stock`), computed
  live in one availability query for the whole cart;
- a line whose variant has gone non-`active` since add: returned with `unavailable: true` so the
  UI can say so — removing a customer's line silently is the one thing worse than refusing it.

Subtotal = Σ snapshot line totals. No shipping, no other arithmetic (§49: there is none).

### 2.4 Change and remove

`PATCH` quantity 1–10 (same refusals as add); quantity `0` deletes the line. `DELETE` deletes.
Both 404 on a line not in *this* cart — the cookie's cart is the only reachable one.

Race 4 (two tabs): last-write-wins, accepted (`architecture.md` §2). The one exception is the
add-merge above, which is atomic because it must be.

## 3. HTTP surface

Route Handlers, all dynamic, all JSON. Errors: `{ error: CODE, message }`, statuses 400/404/409.

| Route | Does |
|---|---|
| `GET /api/cart` | Read (§2.3). Never creates |
| `POST /api/cart/lines` | `{ slug, quantity }` → add/merge (§2.2). Creates cart + cookie on first write. 201 |
| `PATCH /api/cart/lines/:id` | `{ quantity }` 1–10, or 0 to remove |
| `DELETE /api/cart/lines/:id` | Remove |

## 4. Edge cases

| Case | Behaviour |
|---|---|
| Two tabs add the same variant at once | One line, quantities summed atomically (upsert); over-10 → whole request refused |
| Cookie for a completed cart | Treated as no cart; write starts fresh. The old cart is checkout's record |
| Price changes while in cart | Line flags `priceChanged`, both prices returned; checkout re-quotes |
| Variant retired while in cart | Line returned `unavailable: true`; excluded from subtotal; checkout refuses it |
| Stock runs out while in cart | `stockState: out_of_stock` on read; checkout's reservation is the arbiter |
| Cookie tampered to another uuid | Unguessable uuid or 404s — no enumeration surface, no cross-cart reach |
| Line id from another cart in PATCH/DELETE | 404 — lookups always scope to the cookie's cart |

## 5. Data

`data-model.md` §6 owns the tables; nothing added. Invariants exercised: 9 (NULL price never in a
cart line), the 1–10 CHECK, `UNIQUE(cart_id, variant_id)`.

## 6. Dependencies

Inventory read path (stock states on read). Nothing else. Checkout (unwritten) consumes the cart
and sets `status = completed` inside its placement transaction.

## 7. Analytics · 8. Accessibility

None in this pass · UI-phase concerns; the API contributes structured errors a UI can voice.

## 9. Open questions

- Cookie lifetime 30 days — PROVISIONAL, cosmetic.
- Whether an `abandoned` sweep (open carts past N days → `abandoned`) is worth a Cron before any
  retention feature exists. **PROVISIONAL: not yet** — rows are cheap, and §49 constrains what an
  abandoned-cart contact could even say. Revisit at `features/retention.md`.
