# Feature — Inventory

> **Purpose:** Stock truth. What exists, what is promised, what a customer may be offered, and the
> machinery that makes §32's Ritual Set unavailable the moment any one of its six components is.
>
> **Status: written 27 August 2026, `PROVISIONAL`.** First of the commerce spine (build-order item
> 18, pulled ahead of 16–17 deliberately: this is the hardest correctness problem, so it goes
> first, per ADR-0006's phasing). Schema authority: `data-model.md` §4. Concurrency authority:
> `architecture.md` §2, race 1. Algorithm provenance: Medusa v2.19.0,
> `packages/core/utils/src/product/get-variant-availability.ts` and
> `packages/core/core-flows/src/cart/steps/reserve-inventory.ts` (MIT; derived code carries the
> attribution header per ADR-0006).
>
> **Implemented and verified same day** — `lib/server/inventory/`, race test 12/12 against the
> live database (work_done.md, 27 Aug). Stock quantities in the DB are development values: R-66.

---

## 1. Scope

**In:** availability computation per variant (kit-aware) · atomic reservation at order placement ·
reservation consume/release lifecycle · stock adjustment (receiving stock, corrections) · the
storefront's three stock states.

**Out:** multi-location (seam in `data-model.md` §4.2) · batch/expiry allocation (R-43, deferred —
`risks.md` §4 note owns the trigger) · backorders (never: `reserved <= stocked` is a CHECK) ·
purchase-order / supplier workflow (no supplier exists on paper — R-01) · low-stock notifications
(`features/notifications.md`, unwritten) · admin UI (deprioritised 17 Aug 2026; adjustments happen
through a maintained script until an admin surface earns its place).

## 2. User stories

- A **buyer** sees at the catalogue — not at checkout — whether a product can be bought
  (`product.md` §6: out of stock is "shown at catalogue level, not discovered at checkout").
- A **buyer of the Ritual Set** can buy it only while *all six* components are available, and two
  buyers racing for the last set produce exactly one order (`architecture.md` §2 race 1).
- **Sayon** can receive stock and correct counts, and every movement is attributable afterwards.

## 3. Surfaces and states

Three storefront stock states, derived from availability `a` for the variant:

| State | Condition | Rendering rule |
|---|---|---|
| Available | `a >= threshold` | No count shown. **Never** "only N left" — R-16: no scarcity theatre |
| Low | `0 < a < threshold` | "Low stock", no number. Threshold `PROVISIONAL: 5`, per variant later if needed |
| Out of stock | `a = 0` (or price NULL / no links) | Product renders, purchase control disabled **with reason** (`product.md` §6: disabled is never silent) |

A variant with `price_paise` NULL renders as the storefront already does — present, priceless,
not purchasable — regardless of stock.

## 4. Behaviour

### 4.1 Availability (read path)

`availability(variant) = min over links(floor((stocked − reserved) / required_quantity))`; zero
links → 0, fail closed. Computed live from `inventory_level` — no cached availability column.
Batched for the catalogue (one query for all variants, grouped in code — Medusa's shape).

### 4.2 Reservation (write path — the point of this feature)

At **order placement**, not at add-to-cart (`data-model.md` §6.2). One transaction:

1. Resolve every `(inventory_item, required_quantity × line_quantity)` across all order lines,
   **merging duplicates** (Matcha tin appears twice if the order holds Matcha + Ritual Set — one
   lock, summed quantity).
2. `SELECT … FOR UPDATE` all affected `inventory_level` rows **ordered by `inventory_item_id`** —
   fixed lock order, no deadlock between concurrent kit checkouts.
3. Check every component satisfies the request. Any shortfall → whole transaction rolls back with
   a structured failure naming the short item (the storefront says which, honestly).
4. `reserved_quantity += n` per level; one `reservation` row (`held`) per item per order.

`NOWAIT`/`SKIP LOCKED` are **not** used: a blocked checkout should wait milliseconds for the
winner's commit, then read the truth.

### 4.3 Consume / release

- Payment captured → `held` → `consumed`: `stocked −= q`, `reserved −= q`, same transaction as the
  order event append.
- Payment failed, or expiry sweep (checkout's Cron, `data-model.md` §10) → `held` → `released`:
  `reserved −= q`.
- Both transitions are idempotent by reservation state: a second consume of a `consumed` row is a
  no-op with a warning, not a double decrement.

### 4.4 Adjustment

`stocked_quantity` changes only through `adjustStock(item, delta, reason)` — receiving stock,
damage, correction. Constraint-guarded (never below `reserved`). Reason string required; movement
logged. Direct UPDATEs outside the function are a convention violation to flag in review.

## 5. Edge cases

| Case | Behaviour |
|---|---|
| Two buyers, last Ritual Set | One commits; the other's transaction finds `reserved` raised, rolls back, buyer told which component ran short. **The exit test.** |
| Kit + component in one order (Matcha + Set) | Quantities merged before locking — one row, one lock, summed check |
| Adjustment during a checkout | Blocks on the row lock, then proceeds against the new truth |
| Stock correction below current `reserved` | Refused by CHECK; operator must resolve reservations first |
| Variant with zero links | Availability 0 — a misconfigured product cannot be bought |
| Release after consume (webhook ordering) | Refused by reservation state machine; reported |
| Threshold edge (`a` exactly at threshold) | Available (strict `<` for low) |

## 6. Data

`data-model.md` §4 owns the tables; this doc adds none. Invariants exercised here: §9.4 items 1–4.

## 7. Dependencies

Drizzle over the Supabase transaction pooler (ADR-0006; prepared statements off). No other feature
— inventory is the spine's root. Checkout (unwritten) will call `reserve`/`consume`/`release`.

## 8. Analytics

None in this pass. Stock-out *events* are worth capturing eventually (`features/analytics.md`,
unwritten) — a stock-out on a hero is a revenue event, not a log line.

## 9. Accessibility

Stock states are text, not colour alone; the disabled purchase control carries the reason
(`aria-disabled` + visible text). `features/accessibility.md` (unwritten) will own the standard;
nothing here waits on it.

## 10. Open questions

- Low-stock threshold value (PROVISIONAL 5) — Sayon's to tune, cosmetic.
- Whether `adjustStock` needs a movement-history table now or the reservation + log suffice until
  an admin exists. **PROVISIONAL: no table** — additive later; revisit at the notifications doc.
