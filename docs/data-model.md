# Data Model

> **Purpose:** Every entity, field, relationship, constraint and lifecycle state in the commerce
> domain. Any migration that disagrees with this document is wrong, or this document is stale —
> either way that is a finding, not a shrug.
>
> **Status: written 26 August 2026, `PROVISIONAL` throughout.** Written under
> [ADR-0006](adr/0006-write-the-commerce-domain.md) (we write the domain; Medusa v2.19.0's MIT
> source is the reference), [ADR-0003](adr/0003-vercel-native-deployment.md) (Supabase PostgreSQL;
> region amended to Sydney by [ADR-0009](adr/0009-database-region-sydney.md)) and ADR-0002's
> surviving half (one relational store; the three concurrency rules).
> Decisions taken 26 August 2026 with Sayon: **Supabase Auth in the first pass**, catalogue reads
> move to the database now, migrations applied through the Supabase MCP.
>
> Sources: `product.md` §1/§2/§5/§6, `architecture.md` §1–§2, `brief.md` §12–§15/§32/§38,
> `lib/catalogue.ts` (the current product facts), Medusa v2.19.0 source where named.
>
> **Implemented 27 August 2026** — Supabase migrations `commerce_spine` + `product_components`
> (repo copies: `drizzle/0000`, `0001`; seed in `seed.sql`). §9.4's invariants 1–5 and
> 7–9 are now constraint- or test-backed: the inventory race test (12/12) exercises 1–4, the
> checkout test (28/28) exercises 5 and 7–9, and 3/8/10 are database CHECKs. Invariant 6
> (webhook uniqueness) has its constraint in place and its caller arrives with the payment phase.

---

## 1. Principles, before the tables

1. **Money is integer paise, everywhere.** `bigint`, never floating point, never `numeric` with
   decimals for storage. Open call #9, already shipped in the frontend. Display formatting is the
   frontend's job.
2. **Anything the customer was shown at purchase is snapshotted onto the order.** Product name,
   unit price, address. An order is evidence, not a join — editing a product must never rewrite
   history.
3. **State that arbitrates money is append-only and derived.** Order and payment state are event
   sequences; "current state" is a computation with only forward transitions legal
   (`architecture.md` §2, race 3).
4. **Unknown facts are absent, not placeholdered.** A field blocked on R-01/R-03/R-28/R-29 does not
   exist as a column yet. Adding a nullable column is one migration on the day the data exists;
   removing a placeholder that leaked to a customer is an apology.
5. **A kit is a link, not an entity.** The Ritual Set is one purchasable variant linked to six
   inventory items with a `required_quantity` on each link. Availability and reservation fall out
   of that shape — no bundle table, no composite product. (Medusa:
   `product_variant_inventory_item`; algorithm in `get-variant-availability.ts`.)
6. **The database enforces what must be true; the application enforces what should be true.**
   Idempotency, non-negative stock, one order per cart — constraints. Business flow — code.

---

## 2. Entity map

```
auth.users (Supabase)                     product ──< product_variant
     │ 1:0..1                                              │
 customer ──< address                                      │ >──< variant_inventory_item >──┐
     │ 0..1                                                │      (required_quantity)       │
     └──< cart ──< cart_line >── product_variant           │                         inventory_item
     │        (unit price snapshot)                        │                                │ 1:1
     └──< order ──< order_line (full snapshot)             │                         inventory_level
              │──< order_event      (append-only)          │                                │
              │──< payment ──< payment_event (append-only, │                          reservation >──┘
              │                unique provider_event_id)   │                          (per component)
              └── shipping address, gift fields (embedded snapshot)
```

Fifteen tables. Everything else in `architecture.md` §1's map (journal, education, policies, search)
is either repo-authored content (R-34) or derived, and owns no tables in this pass.

---

## 3. Catalogue

### 3.1 `product`

The thing with a story. Not the thing with a price — that is the variant.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `slug` | `text` | NOT NULL, UNIQUE | URL identity; `product.md` §3.1 scheme |
| `name` | `text` | NOT NULL | "Silver Needle Assam", never "White tea" (open call #10) |
| `territory` | `text` | NULL, CHECK in (`FOCUS`,`ELEGANCE`,`LEGACY`) | Only the three heroes carry one (§13) |
| `tea_type` | `text` | NOT NULL | §38 |
| `origin` | `text` | NOT NULL | `'Assam, India'` only, until R-03 validates deeper (open call #11) |
| `short_description` | `text` | NOT NULL | |
| `ingredients` | `text` | NOT NULL | |
| `brewing_leaf` | `text` | NULL | Trio present together or not at all (app-enforced) |
| `brewing_water` | `text` | NULL | |
| `brewing_time` | `text` | NULL | |
| `is_hero` | `boolean` | NOT NULL, default `false` | Drives `listHeroes()` |
| `components` | `text[]` | NULL | **Kit contents as display copy** (§32's list). Distinct from the inventory linkage, whose item names describe physical stock units. NULL for non-kits. Added 27 Aug (migration 0001) when the catalogue swap surfaced it |
| `status` | `text` | NOT NULL, default `'active'`, CHECK in (`draft`,`active`,`retired`) | `retired` never deletes — order lines point here forever |
| `standin_src` | `text` | NULL | Interim stock art (R-57); replaced wholesale when photography lands |
| `standin_alt` | `text` | NULL | Held to copy standards (`content-style.md` §8) |
| `sort_order` | `integer` | NOT NULL, default 0 | Catalogue ordering is editorial, not alphabetical |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

**Deliberately absent columns** — the same list `catalogue.ts` carries, for the same reasons:
`taste_notes` (R-29), `processing_story` (R-01), `statutory_fssai` (R-28), sub-state origin (R-03).
Each is one additive migration on the day its data exists.

### 3.2 `product_variant`

The thing with a price and stock. Today every product has exactly one; the layer exists because gift
boxes, pack sizes and the Ritual Set all live here without touching `product`.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `product_id` | `uuid` | NOT NULL, FK → `product`, ON DELETE RESTRICT | |
| `sku` | `text` | NOT NULL, UNIQUE | Ours to mint; stable forever once an order names it |
| `name` | `text` | NULL | NULL while 1:1 with the product ("50 g" later, if sizes appear) |
| `price_paise` | `bigint` | NULL, CHECK (`price_paise` IS NULL OR `price_paise` >= 0) | **NULL = unconfirmed** (R-04, Ritual Set). Open call #4: never estimated |
| `net_quantity` | `text` | NOT NULL | §38 / Legal Metrology display duty (R-44) |
| `status` | `text` | NOT NULL, default `'active'`, CHECK in (`draft`,`active`,`retired`) | |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL | |

**Invariant: a variant with `price_paise` NULL is not purchasable.** It renders (the storefront
already shows price-absent products), but `add to cart` refuses it. Enforced in the domain layer;
the column being NULL is the single source of that fact.

### 3.3 What is *not* modelled

- **CTC tea** — excluded from the catalogue entirely (R-52, open call #3). No row, no flag.
- **Gift boxes** — in scope at launch (`product.md` §1.1) and expressible today as a product +
  variant + kit links, but their contents are blocked on R-12's arithmetic (four teas vs three).
  **The schema is ready; the rows wait for the decision.**
- Reviews, wishlist, subscriptions, corporate gifting — out at launch (`product.md` §1.2).

---

## 4. Inventory — the tables that close race 1

Shape ported from Medusa (`inventory_item` / `inventory_level` / reservations / the variant link),
simplified where our constraints allow, and the simplifications are listed with their seams.

### 4.1 `inventory_item`

One row per *physical thing that runs out*. The Ritual Set contributes none itself — its six
components do: Assam Matcha tin, bamboo whisk, bamboo spoon, strainer, ceramic bowl, whisk stand.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `sku` | `text` | NOT NULL, UNIQUE |
| `name` | `text` | NOT NULL |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL |

### 4.2 `inventory_level`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `inventory_item_id` | `uuid` | NOT NULL, FK → `inventory_item`, **UNIQUE** | UNIQUE = single location, structurally |
| `stocked_quantity` | `integer` | NOT NULL, default 0, CHECK >= 0 | |
| `reserved_quantity` | `integer` | NOT NULL, default 0, CHECK >= 0 | |
| | | **CHECK (`reserved_quantity` <= `stocked_quantity`)** | No backorder — §50 has drops and early access, never oversell |
| `updated_at` | `timestamptz` | NOT NULL | |

Available = `stocked_quantity - reserved_quantity`, computed, never stored — a stored copy is a
second source of truth that will drift.

**Two deliberate simplifications, with seams:**

- **Single location.** One warehouse is the operating reality. The UNIQUE constraint on
  `inventory_item_id` *is* the decision; multi-location later = drop the constraint, add a
  `stock_location` table and a `location_id` column. Medusa's location layer is the reference when
  that day comes.
- **No batch/expiry.** R-43 (FSSAI residual shelf life) is deferred by ADR-0006's recorded
  decision. The seam: batch tracking replaces this table's single row per item with one per
  `(item, batch)`, and allocation gains an expiry predicate. The note in `risks.md` §4 owns the
  trigger — **the first real order, not a date**.

### 4.3 `variant_inventory_item` — the kit link

The most important table in the schema. Medusa: `product_variant_inventory_item`.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `variant_id` | `uuid` | NOT NULL, FK → `product_variant` | |
| `inventory_item_id` | `uuid` | NOT NULL, FK → `inventory_item` | |
| `required_quantity` | `integer` | NOT NULL, default 1, CHECK > 0 | |
| | | PK (`variant_id`, `inventory_item_id`) | |

- Assam Matcha variant → 1 link (its tin, `required_quantity` 1).
- Ritual Set variant → **6 links**, one per component. Nothing else distinguishes a kit.

**Availability** (ported from Medusa's `get-variant-availability.ts`, verified in source 26 Aug):

```
variant availability = min over links ( floor( (stocked − reserved) / required_quantity ) )
```

A variant with zero links has **no availability** (not infinite — fail closed). This is §32's rule
made arithmetic: the Ritual Set is unavailable the moment any one component is.

### 4.4 `reservation`

Stock committed to a checkout before payment settles. The audit trail for `reserved_quantity` —
every unit of `reserved_quantity` is the sum of live reservation rows for that item, and a
mismatch is a bug.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `inventory_item_id` | `uuid` | NOT NULL, FK → `inventory_item` | |
| `order_id` | `uuid` | NOT NULL, FK → `order` | Created at order placement, per component |
| `quantity` | `integer` | NOT NULL, CHECK > 0 | line quantity × `required_quantity` |
| `state` | `text` | NOT NULL, default `'held'`, CHECK in (`held`,`consumed`,`released`) | |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL | |

**The reservation transaction** (race 1, `architecture.md` §2 — the code this schema exists for):

```
BEGIN;
SELECT … FROM inventory_level WHERE inventory_item_id IN (components) FOR UPDATE;  -- lock all
-- check floor((stocked − reserved) / required_quantity) ≥ requested, for EVERY component
-- any failure → ROLLBACK; the kit reserves all six or none
UPDATE inventory_level SET reserved_quantity = reserved_quantity + n … ;           -- each
INSERT INTO reservation …;                                                          -- each
COMMIT;
```

Component rows are locked **in a fixed order (by `inventory_item_id`)** so two concurrent kit
checkouts cannot deadlock. Lifecycle: `held` → `consumed` (payment captured: stocked −= qty,
reserved −= qty) or `held` → `released` (payment failed/expired: reserved −= qty). Forward-only.

---

## 5. Customer and address

### 5.1 `customer`

Supabase Auth owns credentials; this table owns the commerce identity. Decision of 26 Aug 2026:
auth ships in this pass, **and guest checkout survives it** (`product.md` §5.1 is explicit).

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `auth_user_id` | `uuid` | NULL, **UNIQUE**, FK → `auth.users` ON DELETE SET NULL | NULL = guest record; SET NULL keeps orders when an auth account is erased |
| `email` | `text` | NOT NULL | Guests get a customer row too — one shape, not two |
| `name` | `text` | NULL | |
| `phone` | `text` | NULL | Shipping needs it; account does not |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL | |

Guest → registered later: the guest row gains an `auth_user_id`. Order history follows for free.
No UNIQUE on `email` — two guests may share one (a repeat guest buyer is two rows until they
register, which is correct: we cannot verify a guest's email is *theirs*).

### 5.2 `address`

The account address book. **Orders do not reference this table** — they embed a snapshot (§1
principle 2); this exists so a registered customer types an address once.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `customer_id` | `uuid` | NOT NULL, FK → `customer`, ON DELETE CASCADE |
| `recipient_name` | `text` | NOT NULL |
| `line1` | `text` | NOT NULL |
| `line2` | `text` | NULL |
| `city` | `text` | NOT NULL |
| `state` | `text` | NOT NULL — India state list validated in app, not enum (list changes) |
| `pincode` | `text` | NOT NULL, CHECK 6 digits |
| `phone` | `text` | NOT NULL |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL |

India-only per R-23: no country column at all. Adding one is the international migration's problem.

---

## 6. Cart

### 6.1 `cart`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | Also the browser's claim ticket (httpOnly cookie) |
| `customer_id` | `uuid` | NULL, FK → `customer` | NULL until known |
| `status` | `text` | NOT NULL, default `'open'`, CHECK in (`open`,`completed`,`abandoned`) | `completed` is terminal, set in the order-placement transaction |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL | |

Race 4 (two tabs): last-write-wins, accepted by `architecture.md` §2 — no version column.

### 6.2 `cart_line`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `cart_id` | `uuid` | NOT NULL, FK → `cart`, ON DELETE CASCADE | |
| `variant_id` | `uuid` | NOT NULL, FK → `product_variant` | |
| | | UNIQUE (`cart_id`, `variant_id`) | Same variant twice = quantity bump |
| `quantity` | `integer` | NOT NULL, CHECK > 0 AND <= 10 | Cap: D2C, no B2B path (R-19); zero = delete the row |
| `unit_price_paise` | `bigint` | NOT NULL, CHECK >= 0 | **Display snapshot** at add time |
| `created_at` / `updated_at` | `timestamptz` | NOT NULL | |

**Price policy, stated so checkout can enforce it:** `unit_price_paise` is what the customer saw.
At order placement it is compared with the variant's current price; a mismatch **re-quotes and
informs** — never silently charges either figure. A NULL-priced variant never reaches a cart line
(§3.2 invariant), so this column is NOT NULL.

Carts do not reserve stock. Reservation happens at order placement (§4.4) — a cart is intent, and
§50's drops make cart-hoarding an attack, not an edge case.

---

## 7. Order — append-only, the spine's terminus

### 7.1 `order`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `order_number` | `text` | NOT NULL, UNIQUE | Human-facing: `RJ-` + zero-padded sequence (`order_number_seq`). **Not a GST invoice number** — that series is R-45's, deferred, separate |
| `cart_id` | `uuid` | NOT NULL, FK → `cart`, **UNIQUE** | **Checkout idempotency** (race 2): one cart, one order, enforced by the constraint, not by code |
| `customer_id` | `uuid` | NULL, FK → `customer` | |
| `email` | `text` | NOT NULL | Contact snapshot — order works if customer row is erased |
| `phone` | `text` | NOT NULL | |
| `ship_name` / `ship_line1` / `ship_line2` / `ship_city` / `ship_state` / `ship_pincode` | `text` | NOT NULL except `ship_line2` | Embedded snapshot, never an FK |
| `is_gift` | `boolean` | NOT NULL, default false | `product.md` §5.2 |
| `gift_message` | `text` | NULL | NULL unless `is_gift` (app-enforced) |
| `subtotal_paise` / `shipping_paise` / `total_paise` | `bigint` | NOT NULL, CHECK >= 0 | CHECK (`total_paise` = `subtotal_paise` + `shipping_paise`) — no other arithmetic exists (§49: no discounts, so **no discount column**; adding one would be building the mechanic §49 bans) |
| `currency` | `text` | NOT NULL, default `'INR'`, CHECK = `'INR'` | R-23 as a constraint |
| `created_at` | `timestamptz` | NOT NULL | No `updated_at` — nothing here ever updates |

Gift behaviour beyond the flag (price-suppressed parcel) is fulfilment's, and the packing-slip vs
tax-invoice conflict is R-46's — **flagged, not resolved here**.

### 7.2 `order_line`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `order_id` | `uuid` | NOT NULL, FK → `order` | |
| `variant_id` | `uuid` | NOT NULL, FK → `product_variant`, ON DELETE **RESTRICT** | Why `retired` exists instead of DELETE |
| `product_name` | `text` | NOT NULL | Snapshot |
| `variant_name` | `text` | NULL | Snapshot |
| `quantity` | `integer` | NOT NULL, CHECK > 0 | |
| `unit_price_paise` | `bigint` | NOT NULL, CHECK >= 0 | The settled price |
| `line_total_paise` | `bigint` | NOT NULL, CHECK = `quantity` × `unit_price_paise` | |

### 7.3 `order_event` — where order state actually lives

| Column | Type | Constraints |
|---|---|---|
| `id` | `bigint` | PK, `GENERATED ALWAYS AS IDENTITY` — insertion order is the order |
| `order_id` | `uuid` | NOT NULL, FK → `order` |
| `type` | `text` | NOT NULL, CHECK in the list below |
| `payload` | `jsonb` | NOT NULL, default `'{}'` |
| `created_at` | `timestamptz` | NOT NULL |

**No `status` column exists on `order`.** State is derived by folding events; a status column is
exactly the overwritable cell race 3 exploits.

```
placed ──► payment_captured ──► shipped ──► delivered
   │              │
   └► payment_failed ──► cancelled          payment_captured ──► refunded
                                            (post-ship refunds: R-45's credit-note
                                             work owns the paper trail; deferred)
```

Legal transitions only — the fold **rejects** an event illegal for the current state and reports
it (`payment_captured` after `cancelled` is a reconciliation incident, not an update). Terminal:
`delivered`, `cancelled`, `refunded`. Shipping detail (AWB, courier) rides in `shipped`'s payload
until a shipping integration earns its own table.

---

## 8. Payment — Razorpay, append-only

### 8.1 `payment`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `order_id` | `uuid` | NOT NULL, FK → `order`, **UNIQUE** | One payment intent per order; a retry is a new Razorpay attempt on the same intent |
| `provider` | `text` | NOT NULL, CHECK = `'razorpay'` | Honest about there being exactly one |
| `provider_order_id` | `text` | NOT NULL, UNIQUE | Razorpay's `order_id`, minted at placement |
| `amount_paise` | `bigint` | NOT NULL, CHECK >= 0 | Razorpay speaks paise natively — no conversion anywhere |
| `created_at` | `timestamptz` | NOT NULL | |

No `status` column — same argument as `order`. State folds from `payment_event`.

### 8.2 `payment_event` — race 2 and race 3 closed in one table

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `bigint` | PK, identity | |
| `payment_id` | `uuid` | NOT NULL, FK → `payment` | |
| `provider_event_id` | `text` | NOT NULL, **UNIQUE** | **The webhook idempotency constraint.** Razorpay's event id (`evt_…`); a redelivered webhook violates it and is discarded. The database is the arbiter (`architecture.md` §2) — an application-level "seen it?" check is itself a race |
| `type` | `text` | NOT NULL | Razorpay's `payment.authorized`, `payment.captured`, `payment.failed`, `refund.processed` |
| `provider_payment_id` | `text` | NULL | Razorpay `pay_…` |
| `payload` | `jsonb` | NOT NULL | Verbatim verified webhook body — the reconciliation record |
| `created_at` | `timestamptz` | NOT NULL | |

Out-of-order delivery (`captured` before `authorized`) lands as-is; the **fold** derives the
furthest-forward legal state, so arrival order cannot regress anything. Signature verification
happens before insert; an unverifiable webhook is logged and dropped, never stored as an event.

---

## 9. Cross-cutting

### 9.1 Access model and RLS

The domain layer (`lib/server/`) talks to Postgres **directly via Drizzle** over the
Supabase connection pooler — transaction mode, with prepared statements off, which is the pooling
mode Vercel functions need. It is the only writer.

**Every table above gets RLS enabled with no policies — deny-all.** The direct connection connects
as the `postgres` role and bypasses RLS; the point is that Supabase's auto-generated PostREST API
(`anon` key) sees **nothing**. We use Supabase Auth for identity, not PostgREST for data access.
Any future decision to let the browser read a table (e.g. product catalogue via anon key) is a
deliberate policy added to this document first. `get_advisors` is run after every migration and its
RLS findings are expected to read "enabled, no policies" — that is the design, not an oversight.

### 9.2 PII register

| Data | Where | Class |
|---|---|---|
| Email, name, phone | `customer`, `order` | PII |
| Address | `address`, `order.ship_*` | PII |
| Gift message | `order.gift_message` | PII — often names a third party (the recipient) |
| Payment instrument details | **nowhere** | Razorpay's PCI scope, never ours (C-9). We store ids and events, no card data |
| Credentials | `auth.users` (Supabase) | Not our tables |

**Retention is deliberately undefined in this pass** — that is R-41's consent-and-erasure work,
deferred by ADR-0006's recorded decision. What this schema already guarantees: erasing a customer
(`auth.users` delete → `auth_user_id` SET NULL; customer row deletable after anonymising `order`
contact columns) never destroys the financial record, because orders embed their snapshots.

### 9.3 Deliberately absent, in one place

| Absent | Owned by | Trigger |
|---|---|---|
| Consent records | R-41 | First real order (see `risks.md` §4 note) |
| Batch/expiry stock units | R-43 | Same |
| GST invoice + credit-note series | R-45 | Same |
| Multi-location inventory | §4.2 seam | A second warehouse |
| Discount/coupon columns | **Never** — §49/§50 | A change of brand, not of schema |
| International (country, multi-currency) | R-23 | Post-launch decision |
| Reviews, wishlist, subscriptions, corporate | `product.md` §1.2 | Their own docs |
| Taste notes, processing story, FSSAI columns | R-29 / R-01 / R-28 | Data existing |

### 9.4 Invariants — the list a test suite is built from

1. Kit availability = `min(floor((stocked − reserved) / required_quantity))` across links; zero
   links → not available.
2. A reservation transaction locks all component levels (fixed order) and reserves all or none.
3. `reserved_quantity` ≤ `stocked_quantity`, both ≥ 0 — database CHECK, not convention.
4. Σ live (`held`) reservations per item = that item's `reserved_quantity`.
5. One order per cart — UNIQUE(`cart_id`).
6. One stored event per Razorpay delivery — UNIQUE(`provider_event_id`).
7. Order/payment state: fold of events, forward-only; illegal events rejected and reported.
8. `total_paise` = `subtotal_paise` + `shipping_paise`; `line_total_paise` = `quantity` ×
   `unit_price_paise` — database CHECK.
9. NULL price ⇒ never in a cart line, never in an order line.
10. All money `bigint` paise ≥ 0.

---

## 10. Open questions (mirrored into `risks.md` where new)

- **Shipping rates**: `shipping_paise` exists; what computes it is `features/shipping.md`'s, unwritten.
  Flat-rate vs courier API changes no schema here.
- **Reservation expiry**: a `held` reservation whose payment never resolves must eventually release.
  Razorpay orders expire; the sweep job (Vercel Cron per ADR-0003) and its timeout belong to
  `features/checkout.md`.
- **R-46** (gift price suppression vs tax invoice) — flagged, unresolved, owned by compliance.
- **Order number format** `RJ-00001` is PROVISIONAL and cosmetic; the sequence is the commitment.
