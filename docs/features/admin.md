# Feature — Admin and Operations

> **Purpose:** What the client team can change without a developer, and the surface that lets them
> do it without being able to break anything the domain layer guarantees.
>
> **Status: written 2 September 2026, `PROVISIONAL`.** Written under
> [ADR-0008](../adr/0008-admin-for-a-client-team.md) (`Accepted`), which resolved **R-22** — the
> operating model is a **non-technical client team**. Schema authority: `data-model.md`.
> Domain authority: `features/inventory.md`, `features/cart.md`, `features/checkout.md`.
> Reference: Medusa v2.19.0's **MIT** admin surfaces only — its RBAC is Enterprise and out of
> bounds (ADR-0008, and ADR-0006's boundary rule).

---

## 1. Scope

**In:** admin authentication and session · products and variants (including the price field that
resolves R-04) · inventory counts (the cure for R-66) · orders — list, detail, and the fulfilment
transitions the state fold already permits · customers, read-mostly · admin users and the two
roles · an audit trail over every mutation.

**Out, and each for a stated reason:**

| Not building | Why |
|---|---|
| Payments, refunds screens | Razorpay is not integrated (ADR-0006's marked seam). A refund button with no gateway behind it is a lie |
| Discount / coupon management | §49 and §50 bar discounting. There is no discount column by design (`data-model.md` §7.1) — this is the one absence that must **never** be filled by an admin screen |
| Editorial content (Journal, Our Story, education) | R-34 keeps content in the repo. ADR-0008 notes one of its three arguments weakened but did not re-decide it |
| Shipping-rate configuration | R-65: the rate is not decided, `shipping_paise` is a placeholder. `features/shipping.md` decides before a screen exposes it |
| Per-resource permissions, dynamic policies, field-level filtering | Medusa's RBAC is Enterprise and unavailable; two fixed roles are deliberate, not a first draft (ADR-0008) |
| Analytics dashboards | Nothing is measured yet (`features/analytics.md`, unwritten). A chart of invented numbers is worse than no chart |
| Gift-box / kit composition editing | Kit links are a schema-level concern and R-12's contents are undecided. Managed by migration until it earns a screen |

## 2. Users

**The client team member.** Non-technical, uses this a few times a week, will not read
documentation, and will click the wrong thing eventually. Needs to accomplish: correct a stock
count, set or change a price, mark an order shipped, check what was ordered.

**Sayon.** Everything above plus admin-user management. Distinguished by role, not by a separate
surface.

## 3. The two roles

| Role | May do |
|---|---|
| `owner` | Everything, including inviting and removing admin users and changing roles |
| `staff` | Everything operational: products, prices, stock, orders, customers. **Not** admin-user management |

Checked in exactly two places — the middleware guard and one `requireRole()` helper — so the whole
model is auditable by reading two files. No dynamic policies. Escalation is an `owner` action and
is audited like any other mutation.

## 4. Surfaces

Each is a list → detail → edit shape, the decomposition Medusa's MIT dashboard uses and the one
that suits dense operational data.

| Route | Does | Notes |
|---|---|---|
| `/admin/login` | Supabase Auth sign-in | The only unguarded admin route |
| `/admin` | Today: orders needing attention, low stock, unpriced products | A worklist, not a dashboard. Every row is a thing to *do* |
| `/admin/products` | List; create; edit name, description, brewing, territory, status, sort order | Slug editable only while `draft` — a live slug is a URL customers hold |
| `/admin/products/[id]/variants` | SKU, **price**, net quantity, status | The price field closes R-04. Setting a price makes a product purchasable — stated on screen, because it is the single most consequential edit here |
| `/admin/inventory` | Per-item stocked / reserved / available | Available is computed, never editable |
| `/admin/inventory/[id]/adjust` | `adjustStock()` with a mandatory reason | The cure for R-66. Reason is required by the domain function already |
| `/admin/orders` | List, filtered by derived state | State comes from the fold, not a column |
| `/admin/orders/[id]` | Full detail: lines, snapshots, shipping, gift, reservations, event history | The event history is shown as-is — it is the audit trail the fold reads |
| `/admin/orders/[id]/fulfil` | Append `shipped`, then `delivered` | Only transitions the fold permits are offered. An illegal one is not a disabled button, it is an absent one |
| `/admin/customers` | List and detail, read-only | PII (`data-model.md` §9.2). No editing until R-41's consent and erasure work exists |
| `/admin/users` | Admin users and roles | `owner` only |
| `/admin/audit` | The action log, filterable | Read-only, append-only, never editable from the UI |

## 5. States

`product.md` §6's inventory applies unchanged. Two additions specific to this surface:

- **Refused** — a mutation the domain layer rejected, shown as a sentence naming the rule, never a
  raw constraint name. *"Stock cannot go below the 3 units currently reserved for open orders"*, not
  `inventory_level_no_oversell_check`.
- **Stale** — the row changed under the editor since the form loaded. Detected by comparing
  `updated_at`; the edit is refused and re-presented rather than overwriting silently.

## 6. Behaviour rules

1. **The domain layer is the only writer.** Screens call `adjustStock()`, the reservation functions,
   the order-event appender. No raw SQL in a route handler, ever. This is what keeps
   `data-model.md` §9.4's ten invariants true with non-technical hands on the controls.
2. **Every mutation writes an `admin_action` row** in the same transaction as the change. If the
   audit write fails, the change fails.
3. **Destructive and consequential actions confirm**, naming the consequence: retiring a product,
   changing a price, adjusting stock downward, removing an admin user.
4. **Nothing is hard-deleted.** Products and variants retire; orders never delete (`order_line`'s
   `ON DELETE RESTRICT` already enforces it).
5. **Refusals explain.** Every domain error maps to a sentence a non-developer can act on.
6. **Admin code never reaches a public bundle.** Route-group isolation plus server components;
   verified by inspecting the built client chunks, not assumed.

## 7. Data — what this feature adds

Three tables, specified here and to be folded into `data-model.md` when built:

**`admin_user`** — `id` · `auth_user_id` (uuid, NOT NULL, UNIQUE, FK → `auth.users` ON DELETE
CASCADE) · `email` · `name` · `role` (CHECK in `owner`,`staff`) · `status` (CHECK in
`active`,`disabled`) · timestamps. No password column, deliberately (ADR-0008).

**`admin_action`** — `id` (bigint identity) · `admin_user_id` (FK, ON DELETE **RESTRICT** — an
audit row outlives the person) · `action` · `entity_type` · `entity_id` · `before` (jsonb) ·
`after` (jsonb) · `created_at`. Append-only; no update or delete path exists in code.

**`admin_invite`** — `id` · `email` · `role` · `token_hash` · `expires_at` · `accepted_at` ·
`invited_by`. Tokens are stored hashed; the plaintext exists only in the emailed link.

RLS: deny-all like every other table (`data-model.md` §9.1) — the domain layer connects as
`postgres` and is the only reader.

## 8. Build order

Strict, each stage usable before the next begins:

| # | Stage | Exit criterion |
|---|---|---|
| 1 | Auth + `admin_user` + proxy guard + audit table | A seeded owner signs in; every other `/admin` route 302s to login when signed out. Verified by test. **Substantially met 5 Sep 2026 — 15 of 17 checks pass** (`scripts/admin-auth-test.ts`) against the new database: owner row seeded via `scripts/bootstrap-owner.ts`, all seven guarded routes redirect, the `?next=` destination survives, the login page renders and ships no token in its markup. **The remaining two are the sign-in itself and the signed-in worklist render, SKIPPED not passed** — they need the owner's password, which deliberately lives in Supabase Auth and nowhere else (ADR-0008). Run `ADMIN_TEST_PASSWORD=… npx tsx --env-file=.env.local scripts/admin-auth-test.ts` to close them. The guard file is `proxy.ts`, not `middleware.ts` — Next 16 renamed the convention |
| 2 | Inventory: list and adjust | **R-66 becomes closable** — real counts enterable with reasons, audited |
| 3 | Products and variants, incl. price | **R-04 becomes closable by the client**, not by a developer |
| 4 | Orders: list, detail, fulfil | An order placed through the storefront can be shipped and delivered from the admin, and the fold agrees |
| 5 | Users, invites, roles | An owner invites a staff member who can do 2–4 but not 5 |
| 6 | Customers (read) + audit viewer | — |

Stage 1 is the only one that must precede the others. 2 and 3 are ordered by which open risk they
close first.

## 9. Dependencies

Supabase Auth (new; first use in the project) · the inventory, order and catalogue domain modules
(all built) · `design-system.md` for the visual language — the admin is functional and dense, but it
is not exempt from the brand's typography and palette.

## 10. Open questions

- **Admin accessibility standard.** `features/accessibility.md` excludes the admin surface on the
  grounds that it was deprioritised; ADR-0008 makes that exclusion indefensible. Needs a decision on
  the conformance target for an internal daily-use tool. **Raised as R-74.**
- **Invite email delivery.** Stage 5 needs to send a link, and no email provider exists
  (`features/notifications.md`, unwritten; a provider is an ask-first dependency). Until one exists,
  invites are created and the link handed over manually.
- **Session lifetime and re-authentication for consequential actions** — PROVISIONAL: standard
  Supabase session, no step-up. Revisit if the team grows past a handful of people.
- Whether `admin_action` needs retention limits under DPDP (R-41). Deferred with the rest of R-41.
