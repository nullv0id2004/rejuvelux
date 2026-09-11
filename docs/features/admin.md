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
>
> **Built — all six stages, 9 September 2026.** Identity moved to the self-built stack on the
> same day ([ADR-0012](../adr/0012-self-built-auth.md)); every "Supabase Auth" below now reads
> `app_user`. §11 records what was built and where it departs from the plan.

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
| `/admin/login` | Sign-in on the self-built stack (ADR-0012), minting an admin-audience session | One of exactly two unguarded admin routes |
| `/admin/invite/[token]` | Accept an invitation: choose a password (or prove an existing account's), become an admin, signed in | The other unguarded route. The token is verified against `admin_invite` by hash; the page is what admits the invitee, not a session |
| `/admin` | Today: orders needing attention, low stock, unpriced products | A worklist, not a dashboard. Every row is a thing to *do* |
| `/admin/products` | List, every status | The "No price" cell is R-04 in a table |
| `/admin/products/new` | Create: product fields plus the first variant | Created as `draft`, with a stock item at zero behind the variant, so three visible steps stand between "created" and "on sale" |
| `/admin/products/[id]` | Edit name, description, brewing, territory, status, sort order | Slug editable only while `draft` — a live slug is a URL customers hold. `active` never returns to `draft`; retire instead, and retiring confirms |
| `/admin/products/[id]/variants` | SKU, **price**, net quantity, status; add a variant | The price field closes R-04. Setting a price makes a product purchasable — stated on screen and confirmed, because it is the single most consequential edit here |
| `/admin/inventory` | Per-item stocked / reserved / available | Available is computed, never editable |
| `/admin/inventory/[id]/adjust` | `adjustStock()` with a mandatory reason | The cure for R-66. Reason is required by the domain function already |
| `/admin/orders` | List, filtered by derived state | State comes from the fold, not a column |
| `/admin/orders/[id]` | Full detail: lines, snapshots, shipping, gift, reservations, event history | The event history is shown as-is — it is the audit trail the fold reads |
| `/admin/orders/[id]/fulfil` | Append `shipped` (courier, tracking), then `delivered` | Only transitions the fold permits are offered. An illegal one is not a disabled button, it is an absent one — and the page says why nothing is offered. Payment events are never appended by hand |
| `/admin/customers` | List and detail, read-only | PII (`data-model.md` §9.2). No editing until R-41's consent and erasure work exists. Guest buyers, who have no `customer` row, are listed by the email on their orders |
| `/admin/users` | Admin users, roles, invitations | `owner` only. Staff who arrive see the reason, not an error |
| `/admin/audit` | The action log, filterable by action, record type, actor and record id | Read-only, append-only, never editable from the UI |

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

**`admin_user`** — `id` · `auth_user_id` (uuid, NOT NULL, UNIQUE, FK → `app_user` ON DELETE
CASCADE since migration 0003; was `auth.users`) · `email` · `name` · `role` (CHECK in
`owner`,`staff`) · `status` (CHECK in `active`,`disabled`) · timestamps. No password column, still
deliberately: the credential lives in `app_user` (ADR-0012), the commerce identity here.

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
| 2 | Inventory: list and adjust | **R-66 becomes closable** — real counts enterable with reasons, audited. **Met 9 Sep 2026** — `scripts/admin-inventory-test.ts` 18/18: the list, kit components knowing what uses them, the audit row landing atomically with the change and a failed audit rolling the change back, a missing reason refused, a count below what is reserved refused and shown as a sentence |
| 3 | Products and variants, incl. price | **R-04 becomes closable by the client**, not by a developer. **Met 9 Sep 2026** — `scripts/admin-stages-test.ts` §2: create as draft with a stock item behind it, stale edit refused and unaudited, slug free while draft and locked once live, `active` never back to `draft`, price set audited as `variant.price.set` with before and after |
| 4 | Orders: list, detail, fulfil | An order placed through the storefront can be shipped and delivered from the admin, and the fold agrees. **Met 9 Sep 2026** — §3 of the same test: nothing offered while `placed`, exactly `shipped` after capture, then exactly `delivered`, then nothing; a stale form refused; the fold agrees; the list filters by derived state |
| 5 | Users, invites, roles | An owner invites a staff member who can do 2–4 but not 5. **Met 9 Sep 2026** — §4: staff cannot invite; the token is stored hashed; the link works once; an existing account is linked by its own password rather than overwritten; the last active owner cannot be removed; disabling ends admin sessions and leaves customer sessions alone |
| 6 | Customers (read) + audit viewer | **Met 9 Sep 2026** — §5: customer list and detail; the audit log filters by actor and action and pages by keyset |

Stage 1 is the only one that must precede the others. 2 and 3 are ordered by which open risk they
close first. **All six are built; §11 records the shape of the build.**

## 9. Dependencies

The self-built auth stack (`lib/server/auth/`, ADR-0012; was Supabase Auth) · the inventory, order
and catalogue domain modules (all built) · `design-system.md` for the visual language — the admin is
functional and dense, but it is not exempt from the brand's typography and palette.

## 10. Open questions

- **Admin accessibility standard.** `features/accessibility.md` excludes the admin surface on the
  grounds that it was deprioritised; ADR-0008 makes that exclusion indefensible. Needs a decision on
  the conformance target for an internal daily-use tool. **Raised as R-74.** What was built meets
  the obvious floor — every control labelled, 44 px targets, focus rings, colour never the only
  signal — without a target to measure against.
- **Invite email delivery** — **answered for now, not closed.** No email provider exists (R-78), so
  the link is shown to the owner once, on `/admin/users`, straight after it is created, and handed
  over by hand. A provider replaces that block with a send; nothing else changes.
- **Session lifetime and re-authentication for consequential actions** — **decided by ADR-0012:**
  12 h idle, 7 d absolute. No step-up; consequential actions confirm in the form instead (§11).
- Whether `admin_action` needs retention limits under DPDP (R-41). Deferred with the rest of R-41.

## 11. As built — 9 September 2026

What the six stages are, mechanically, and where the build departed from the plan above.

**No client JavaScript, by construction.** Every screen is a server component; every mutation is a
`<form>` posting to a server action; the answer is a redirect. This is how §6.6 is satisfied
without vigilance: there is no admin bundle to inspect. The cost is that a form cannot hold state,
so three things travel in the query string, named in one place (`app/admin/form.ts`):
`?done=` and `?refused=` carry a sentence, `?confirm=1` marks the second submit of a consequential
action, and `?f.<name>=` carries the submitted fields back so a refused or unconfirmed form
re-renders with what the person typed.

**Refusals are sentences (§5, §6.5).** `lib/server/admin/refusal.ts` holds `RefusedError`, raised
by the domain before the database is touched, and `explainRefusal()`, which also translates the
constraint violations that reach Postgres (the CHECKs and UNIQUE indexes stay as the backstop). It
walks Drizzle's `cause` chain to the driver error, because a one-level read fell through to a 500
in stage 2. A `null` from it means a bug, which surfaces loudly rather than being explained away.

**Stale is real (§5).** Product and variant forms carry the `updated_at` they were rendered from
and the domain compares it under `SELECT … FOR UPDATE`; the fulfilment form carries the latest
`order_event.id`; the stock form carries the count it showed. A mismatch refuses and re-presents.

**Confirmations (§6.3), as built:** a price change (setting, changing, or removing), retiring a
product, demoting or promoting an admin, disabling an admin, a downward stock count, and both
fulfilment events (the fulfil page *is* the confirmation). Raising a count does not confirm;
lowering one does, and the sentence names the drop. All on the same `?confirm=1` mechanism.

**Products.** Created as `draft` with the first variant, a stock item `INV-<SKU>` at zero, and a
single link — a variant with no link is unsellable by design, so the create path never produces
one. Status moves `draft → active → retired`, `retired → active`, never `active → draft`. Origin is
fixed at "Assam, India" (R-03); hero flag and set contents are read-only and say who changes them.
Catalogue mutations call `revalidatePath('/', 'layout')` so the shop's hourly ISR does not have to
elapse.

**Orders.** State is folded from `order_event` on every read; the list filters after folding
(O(orders), fine into the hundreds, noted in code). `lib/server/orders/events.ts` is the
appender the plan named: it enforces the fold's transition table on write, and the admin offers
exactly `shipped` (with optional courier and tracking) and `delivered` (with an optional note),
only when legal. **No payment event is ever appended by hand** — a `placed` order shows "waiting
for payment" and no button, because capture is the payment integration's to record along with
consuming the reservations (§1, Phase 3).

**Users.** `owner` only, checked by `assertRole()` in `session.ts` so the rule still lives in two
files. Invitations: token stored as SHA-256, shown once as a link, seven days, single use; accepting
creates `app_user` + `admin_user` together, or links an existing `app_user` after proving its
password; the acceptance is audited against the admin it creates (`recordActionIn`, the one
documented use of the primitive beneath `auditedMutation`). Guards: nobody disables themselves; the
last active owner is neither demoted nor disabled (a pure rule, `assertAnOwnerRemains`, tested
without arranging a database with one owner). Disabling ends the person's admin-audience sessions
and leaves their customer sessions alone. Nothing is deleted.

**Customers.** Two lists: `customer` rows (none exist until accounts ship) and guest buyers grouped
by the email on their orders, which today is the whole customer base. Read-only throughout.

**Audit viewer.** Keyset pagination on `admin_action.id`, newest first, filters drawn from the
distinct values that actually exist. Records link to their screens where one exists.

**Two shell defects found and fixed on the way.** The admin stylesheets referenced the *old*
frontend's tokens (`--ground`, `--ink`, `--line`), which this repository never defined, so the
shell had rendered unstyled since it was ported; every admin stylesheet now uses the semantic
aliases in `styles/tokens/colors.css`, which is also what makes the admin follow the light/dark
theme. And the root layout wrapped `/admin` in the storefront's nav, footer and cart drawer;
`components/site/Chrome.tsx` now renders bare under `/admin`. The proper long-term shape is a
route group with its own root layout (ADR-0008's "route-group isolation"); that is a storefront
move and is left for a session that can look at the result. It has a second reason now: the root
layout still resolves the catalogue and serialises it into every admin page's payload for
`Chrome`, one cross-region query per admin request and the whole storefront catalogue riding
along in the HTML. Nothing renders from it, but it is there — which is how stage 2's whole-page
dash check found R-79 (resolved the same day) in copy the admin never shows.

**Tests.** `scripts/admin-inventory-test.ts` (stage 2, 18 checks) and `scripts/admin-stages-test.ts`
(stages 3–6 and the shell, 111 checks, 19 of them driving the screens over HTTP against a dev
server and SKIPPED without one). Both self-clean, including on failure.
