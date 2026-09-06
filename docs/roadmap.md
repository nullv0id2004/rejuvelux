# Roadmap and Phasing

> **Purpose:** What gets built in what order, with dependencies, milestones, and explicit
> out-of-scope per phase.
>
> **Status: written 6 September, 2026. `PROVISIONAL`** — the phase boundaries and the
> parallel-track split are decisions made here and marked as such. Every constraint the phases
> obey is drawn from an `Accepted` ADR or an open risk row, cited inline.
>
> **Two decisions taken on 6 September, 2026** that this document is built on, both answered
> directly rather than assumed:
>
> 1. **`Money_projects/rejuvelux` is the canonical repository.** The commerce domain, the docs
>    suite and admin stage 1 are ported *into* it from `rejuvelux_old`. See **Phase 0**.
> 2. **The database is the catalogue's source of truth.** Where the live schema and the ported
>    frontend's static product list disagree, the database wins. See **Phase 1**.
>
> Both decisions contradict text in `Accepted` ADRs, which are immutable. **ADR-0010 and ADR-0011
> must be written before Phase 0 code lands** — see §7.

---

## 1. Where the project actually is

This roadmap is being written at an unusual point: the backend is not greenfield, and the
frontend is not the one the ADRs describe. Both halves exist and have never met.

### 1.1 Built and test-proven, ported from `rejuvelux_old/apps/web`

Written under [ADR-0006](adr/0006-write-the-commerce-domain.md), using Medusa v2.19.0's MIT
source as the reference implementation.

| Area | Module | Functions |
|---|---|---|
| Persistence | `lib/server/db/` | `client.ts`, `schema.ts` (Drizzle) |
| Cart | `lib/server/cart/cart.ts` | `readCart`, `addLine`, `setLineQuantity`, `removeLine` |
| Inventory | `lib/server/inventory/availability.ts` | `stockState`, `getVariantAvailability`, `getAvailability` |
| Inventory | `lib/server/inventory/reserve.ts` | `reserveForOrder`, `consumeReservations`, `releaseReservations`, `adjustStock` |
| Orders | `lib/server/orders/place.ts` | `placeOrder` |
| Orders | `lib/server/orders/state.ts` | `deriveOrderState` — the append-only event fold |
| Admin identity | `lib/server/auth/` | `getAdminSession`, `requireAdmin`, `requireRole`, `createServerClient`, `createProxyClient` |
| Admin audit | `lib/server/admin/` | `auditedMutation`, `recordAction`, `getWorklist` |
| HTTP | `app/api/` | `cart`, `cart/lines`, `cart/lines/[id]`, `checkout` |
| Admin UI | `app/admin/` | `login`, worklist (`page.tsx`) — **stage 1 of 6** |
| Guard | `proxy.ts` | Next 16 renamed the `middleware.ts` convention |
| Migrations | `drizzle/` | `0000_commerce-spine`, `0001_product-components`, `0002_admin-identity`, `seed.sql` |
| Suites | `scripts/` | `cart-api-test`, `checkout-api-test`, `inventory-race-test`, `admin-auth-test`, `bootstrap-owner` |

### 1.2 Built, native to this repository

The storefront, rebuilt from the Claude Design handoff in [`project/`](../project/). Nine
routes, a ported design system in `components/ds/`, tokens in `styles/tokens/`, and
**client-only cart state** in [`lib/cart.tsx`](../lib/cart.tsx) with a `CartDrawer`. Products are
a static array in [`lib/data.ts`](../lib/data.ts).

Absent: `/shop` index, `/cart`, `/checkout`, any server call, any database dependency.

### 1.3 Not built anywhere

- **Razorpay.** `payment` and `payment_event` exist as tables, empty and unwired.
  [features/admin.md](features/admin.md) §1 calls this "ADR-0006's marked seam".
- **Admin stages 2–6** — inventory, products/variants, orders, users, customers/audit.
- **Checkout UI.** `/api/checkout` exists; no page calls it.

### 1.4 The live database — assessed 6 September, 2026

Supabase project `smigkfogyebokiedhdeu`, region `ap-southeast-2` (Sydney) per
[ADR-0009](adr/0009-database-region-sydney.md). **18 tables, 5 products, 9 inventory items,
zero orders.**

**Verdict: every table is retained. Nothing is dropped.** The schema is purpose-built for this
brand and is the source of truth ADR-0006 designates. Evidence it is not generic scaffolding:

- Money is `bigint` paise; `currency` is `CHECK (currency = 'INR')`; `pincode` is
  `CHECK (pincode ~ '^[0-9]{6}$')`; `payment.provider` is `CHECK (provider = 'razorpay')`.
- `product.territory` is `CHECK` -constrained to `FOCUS` / `ELEGANCE` / `LEGACY` — the brief's
  three expressions.
- `variant_inventory_item.required_quantity` is the six-component Ritual Set. This is the
  modelling question ADR-0003 recorded as lost and ADR-0006 recovered from Medusa's
  `packages/core/utils/src/product/get-variant-availability.ts`.
- `order_event` and `payment_event` are append-only with `CHECK` -constrained type vocabularies;
  `admin_action` carries `before`/`after` jsonb.

**One advisory finding that is not a defect.** The Supabase security advisor flags all 18 tables
as `rls_enabled_no_policy` (INFO). This is the intended design — `data-model.md` §9.1 specifies
deny-all RLS with the domain layer connecting as `postgres` as the only reader. **Do not add
policies to silence the linter.**

**One advisory finding that is real.** `auth_leaked_password_protection` is disabled (WARN).
It now matters, because admin login exists. Fixed in Phase 0.

---

## 2. What Medusa is, and is not, in this project

Recorded here because it is the single easiest thing for a future session to get wrong, and
because the local checkout at `Money_projects/medusa` invites the mistake.

**Medusa v2.19.0 is a reference implementation that is read. It is never installed, imported,
deployed, or run.** [ADR-0006](adr/0006-write-the-commerce-domain.md): *"We will not adopt Medusa
as a dependency, a framework, or a runtime."* [ADR-0003](adr/0003-vercel-native-deployment.md)
withdrew it because Vercel cannot host its two always-on Node processes, and that is `Accepted`
and binding.

Three consequences that bind every phase below:

1. **The licence boundary is a hard rule, not a preference.** Medusa's `LICENSE` is MIT for the
   repository *except* the Enterprise Materials in `ENTERPRISE-LICENSE.md`, which are **RBAC and
   SSO only**. `packages/modules/rbac/`, `core-flows/src/rbac/`, `api/admin/rbac/` and the
   role-assignment workflows are **not read for reference, not ported, not adapted**
   ([ADR-0008](adr/0008-admin-for-a-client-team.md)). Every module that bears on this project —
   `inventory`, `order`, `cart`, `payment`, `pricing`, `product`, `promotion`, `tax`,
   `fulfillment` — is MIT and is fair reference.
2. **Attribution is a build rule.** Any file whose content derives from Medusa carries an MIT
   attribution header naming the upstream path and version. MIT requires the notice be retained.
3. **The admin is ours.** ADR-0008 rejected extracting Medusa's dashboard: it is built against
   Medusa's module APIs, data shapes and query layer, none of which we run, so the port would
   exceed writing the screens — and it meets the RBAC boundary at the first roles screen. Its
   **MIT** route decomposition (`routes/orders/order-detail/`,
   `routes/inventory/inventory-stock/`) remains fair reference for shape.

Any note anywhere in the suite implying Medusa supplies an admin is false; `architecture.md` §1's
`admin | Medusa dashboard` row was already marked void on 27 August 2026.

---

## 3. Phase 0 — Consolidation

**Nothing runs in parallel with this phase.** Every other track depends on one repository that
builds.

### 3.1 Sequence

| # | Step | Detail |
|---|---|---|
| 0.1 | **Docs first** | Port `rejuvelux_old/docs/` to `rejuvelux/docs/` before any code moves. This is the standing workflow rule and it is also practical: the ADRs are the only record of why the code is shaped as it is. `docs/` stays **tracked**, per the temporary suspension of the private-by-default rule (procedure in `readme.md` §1, R-67) |
| 0.2 | **Write ADR-0010 and ADR-0011** | See §7. Both must exist before code lands, because both decisions contradict immutable accepted text |
| 0.3 | **Dependencies** | Add `@supabase/ssr`, `@supabase/supabase-js`, `drizzle-orm`, `postgres`; dev `drizzle-kit`. Settle the version skew: this repo is `next@^16.3.4` / `react@19.1.1`, the old is `next@16.3.1` / `react@19.2.8`. **Take the higher of each** and pin exactly — `next@16.3.4`, `react@19.2.8` |
| 0.4 | **Port the domain** | `lib/server/**` verbatim. Rewrite imports from `apps/web/lib/...` to `@/lib/...`. **No behavioural edit during the port** — a port and a refactor in one commit cannot be reviewed |
| 0.5 | **Port migrations** | `drizzle/` including `meta/` and `seed.sql`, plus `drizzle.config.ts`. The journal must stay intact or `drizzle-kit` will regenerate history |
| 0.6 | **Port the guard** | `proxy.ts` at repo root. Note the Next 16 convention: **`proxy.ts`, not `middleware.ts`** |
| 0.7 | **Port the suites** | `scripts/` — all five. Add `npm run test:*` entries so they are discoverable |
| 0.8 | **Environment** | `.env` already holds `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `VERCEL_OIDC_TOKEN`. **Verify `DATABASE_URL` resolves to `smigkfogyebokiedhdeu`** and not the dead project ADR-0006 names (`axeadbalzanbnqgqusjx`, unreachable since 28 Aug, R-72). `.env` is gitignored as of this session |
| 0.9 | **Enable leaked-password protection** | Supabase Auth → the WARN in §1.4. One toggle |

### 3.2 Exit criteria

All must pass before Phase 1 opens.

- `npm run build` green; `npm run typecheck` clean.
- The four suites pass against the live database at their recorded counts: **cart 19/19,
  checkout 28/28, inventory race 12/12, admin auth 15/17** (the 2 skipped need the owner
  password, which lives only in Supabase Auth by design).
- `/admin/login` renders; all seven guarded routes 302 to it when signed out; `?next=` survives.
- No admin code in a public client chunk — verified by inspecting built chunks, per
  [features/admin.md](features/admin.md) §6.6, not assumed.

### 3.3 Explicitly out of scope in Phase 0

Behavioural changes of any kind; catalogue reconciliation; any admin screen beyond stage 1; any
frontend edit. Phase 0 moves code and changes nothing.

---

## 4. The tracks — what can run in parallel after Phase 0

Once Phase 0 lands, three tracks are genuinely independent. **R-36 records one developer, no CI,
no staging, no second reviewer**, so "parallel" here means *these do not block one another and
may be re-ordered*, not that they should be attempted simultaneously by one person.

```
Phase 0  Consolidation  ────┬──────────────────────────────────────────────
   (blocking)               │
                            ├─► Track A  Storefront on the database
                            │     P1 Catalogue ─► P2 Cart+Checkout ─► P3 Payments
                            │
                            ├─► Track B  Admin stages 2–6
                            │     S2 Inventory ─► S3 Products ─╮
                            │                                  ╰─► S4 Orders (needs P2)
                            │                                      S5 Users ─► S6 Customers+Audit
                            │
                            └─► Track C  Client decisions  (zero dev time, weeks of lead time)
                                  START IMMEDIATELY — see §8
```

**Track B's stages 2 and 3 need only Phase 0.** Both call domain functions that already exist
(`adjustStock`, and the variant price field). Neither waits on the storefront. **Stage 4 is the
one true cross-track dependency** — an orders screen needs orders, which needs Phase 2.

**Recommended ordering for one developer:** Phase 1 → Admin stage 2 → Admin stage 3 → Phase 2 →
Admin stage 4 → Phase 3 → Admin stages 5–6. This front-loads the two stages that close open
risks (R-66, R-04) at the cost of one context switch, and it defers payments — the riskiest
work — until the paths it depends on are exercised.

---

## 5. Track A — the storefront on the database

### 5.1 Phase 1 — Catalogue

The join between the two halves. This is where "the database wins" is applied.

**The field split, decided here and `PROVISIONAL`.** The frontend's `Product` type and the
`product` table overlap only partly. The rule: **commerce data lives in the database and is
client-editable; presentation and editorial live in the repository.** This follows
[features/admin.md](features/admin.md) §4 — which scopes admin editing to name, description,
brewing, territory, status, sort order, and the variant's SKU/price/net quantity — and **R-34**,
which keeps editorial content in the repo.

| Field | Home | Why |
|---|---|---|
| `name`, `short_description`, `brewing_*`, `territory`, `status`, `sort_order`, `slug` | **Database** | Admin-editable (features/admin.md §4) |
| `sku`, `price_paise`, `net_quantity` | **Database** (`product_variant`) | The price field is what closes R-04 |
| `tin`, `ink`, `image`, `photos{dryLeaf,liquor,wetLeaf,lot}` | **Repo** | Colourways and art direction; no admin screen exists or is planned |
| `descriptor`, `tagline`, `why`, `bullets`, `faqs` | **Repo** | Editorial — R-34 |
| `body`, `brisk`, `cups` | **Repo, provisionally** | Sensory scales are blocked by **R-29** and must not be invented. Held in repo until a written lexicon exists, then reconsidered for the database |

Keyed by slug. No migration is required for Phase 1 — this is deliberate, and it is the cheaper
direction to grow.

**Steps.**

1. Replace [`lib/data.ts`](../lib/data.ts)'s `PRODUCTS` array with a `lib/catalogue.ts` that
   resolves from Drizzle and merges the repo-side presentation map. The old repo's
   `lib/catalogue.ts` is the reference for this exact swap.
2. **Adopt the database slugs.** `/shop/silver` becomes `/shop/silver-needle-assam`;
   `matcha` → `assam-matcha`; `golden` → `assam-golden-tips`; `green` → `green-tea`. The database
   is truth and a slug is a public URL. Nothing is live under the current slugs.
3. **Delete the dummy price.** `PRICE = 1250` and the `*` marker go. Real values render:
   Assam Matcha **₹999**, Assam Golden Tips **₹4,999**, Green Tea **₹599**.
4. **Silver Needle has no price and must not be purchasable.** `price_paise` is `NULL`; this is
   **R-04**, a launch blocker, and invariant 9 already blocks purchase on it. The product page
   renders with an explicit unpriced state — not a hidden product, not a zero.
5. **`ctc` and `ube` are withdrawn from the rendered catalogue.** Neither is in the database.
   `ctc` is **R-52**, an open launch blocker whose row states CTC "must not share a shelf, a page
   module or a gift box with the heroes". `ube` appears in no document in the suite. **Their
   assets and copy stay in the repository, unreferenced**, so a client decision can restore
   either in an afternoon. Raised to Track C.
6. **The Matcha Ritual Set gains a product page.** It is in the database, it is the six-component
   kit, and its availability must compute from the lowest-stock component via
   `getVariantAvailability`. It is also unpriced — same treatment as Silver Needle.
7. Add the missing **`/shop` index route**. It does not exist in this repo.
8. Wire `stockState` so the product page shows real availability.

**Exit criteria.** `/shop` and every `/shop/[slug]` render from the database with no static
product array remaining. Real prices display. Silver Needle and the Ritual Set render unpriced
and cannot be added to a cart. `ctc` and `ube` return 404. The Ritual Set's availability drops to
zero when any one component does — **verified by a test that fails first**.

**Out of scope.** Any price change (client-owned, R-04); any sensory copy (R-29); admin editing
of any of it (that is Track B stage 3).

### 5.2 Phase 2 — Cart and checkout

**Steps.**

1. Replace [`lib/cart.tsx`](../lib/cart.tsx)'s client-only state with calls to the ported
   `/api/cart` routes. `CartDrawer` keeps its markup; only its data source changes.
2. Cart identity: an anonymous `cart` row keyed by an httpOnly cookie. The `cart` table already
   allows `customer_id` to be `NULL`.
3. Build the **`/checkout` page** — it does not exist. Address form against the `order` table's
   shipping columns, including the `^[0-9]{6}$` pincode constraint and the gift fields.
4. Wire `placeOrder`, which reserves inventory under lock via `reserveForOrder`.
5. Order confirmation page. **On our own domain** — this is the entire reason ADR-0004 was
   rejected and ADR-0006 accepted, and it is the phase where that decision either pays off or is
   quietly thrown away.
6. `FREE_SHIPPING_AT` is a placeholder and **R-65** records that the shipping rate is undecided.
   Render shipping as a named unresolved value; do not invent a rate.

**Exit criteria.** A cart survives a page reload and a browser restart. Checkout produces an
`order` row, `order_line` rows with price snapshots, a `reservation` per component, and an
`order_event` of type `placed`. `deriveOrderState` agrees. The existing `checkout-api-test` and
`inventory-race-test` still pass, plus new coverage for the UI path.

**Out of scope.** Payment of any kind — the order is placed unpaid, which is Phase 3's starting
state. Guest-to-account conversion (`features/accounts.md`). Shipping-rate configuration (R-65).

### 5.3 Phase 3 — Payments, Razorpay

**The highest-risk phase in the project.** ADR-0006 states plainly that hand-rolling this "puts
payments, refunds and order transitions into unreviewed code", and that **that sentence is still
true**. R-36 records that no independent review control exists.

`architecture.md` §2 names four races. **Race 1 (overselling) is already closed** by
`reserveForOrder` under lock, following Medusa's
`packages/core/core-flows/src/cart/steps/reserve-inventory.ts`. **Races 2, 3 and 4 are this
phase's whole content.**

| Race | Closed by |
|---|---|
| 2 — double charge | One `payment` row per order; idempotent create keyed on `order_id` |
| 3 — out-of-order webhooks | **A unique index on `payment_event.provider_event_id`**, plus a state fold that is order-independent rather than sequence-dependent |
| 4 — lost cart updates | Cart is server-side from Phase 2; the cart is frozen at checkout |

**Steps.** Razorpay order creation against the `payment` row → the checkout widget, embedded, on
our domain → webhook handler writing `payment_event` idempotently → `payment_captured` /
`payment_failed` appended to `order_event` → `consumeReservations` on capture,
`releaseReservations` on failure or expiry → a reconciliation pass for webhooks that never
arrive.

**Exit criteria.** Every money path has **a test that fails before it passes** — ADR-0006's
requirement, not a preference. A replayed webhook changes nothing. An out-of-order pair
(`captured` arriving after `failed`) produces the correct derived state. A capture consumes
exactly the reservations the order holds.

**Out of scope.** Refunds — no admin screen for them ([features/admin.md](features/admin.md) §1)
and no decided policy. Any payment method Razorpay does not settle in INR. Saved cards.

---

## 6. Track B — the admin, stages 2–6

The build order is **already specified** in [features/admin.md](features/admin.md) §8 and is
adopted here unchanged. It is not restated in full; what follows is the phasing that surrounds
it.

| Stage | Content | Exit criterion | Depends on |
|---|---|---|---|
| ~~1~~ | ~~Auth, `admin_user`, guard, audit~~ | **Substantially met 5 Sep 2026, 15/17** | — |
| 2 | Inventory: list and adjust | **R-66 becomes closable** — real counts entered with mandatory reasons, audited | Phase 0 |
| 3 | Products and variants, incl. price | **R-04 becomes closable by the client** rather than by a developer | Phase 0 |
| 4 | Orders: list, detail, fulfil | An order placed through the storefront is shipped and delivered from the admin, and the fold agrees | **Phase 2** |
| 5 | Users, invites, roles | An owner invites a staff member who can do 2–4 but not 5 | Stage 3 |
| 6 | Customers (read) + audit viewer | — | Stage 5 |

**Four rules that bind every stage** ([features/admin.md](features/admin.md) §6, ADR-0008):

1. **The domain layer is the only writer.** Screens call `adjustStock()`, the reservation
   functions and the event appender. **No raw SQL in a route handler, ever.** This is what keeps
   `data-model.md` §9.4's ten invariants true with non-technical hands on the controls.
2. **Every mutation writes an `admin_action` row in the same transaction.** If the audit write
   fails, the change fails. `auditedMutation` already implements this.
3. **Refusals explain.** *"Stock cannot go below the 3 units currently reserved for open
   orders"* — never `inventory_level_no_oversell_check`.
4. **Two roles, checked in exactly two places** — the `proxy.ts` guard and `requireRole()`. No
   dynamic policies, no field-level filtering, no per-resource grants. **This simplicity is a
   licensing consequence** of the RBAC boundary in §2, and it is also the right size here.

**Stage 5 has an unmet dependency.** Invites need to send a link and no email provider exists
(`features/notifications.md` is unwritten; a provider is an ask-first dependency). Until one
exists, invites are created and the link is handed over manually. This is stated in
[features/admin.md](features/admin.md) §10 and is not a new finding.

**Out of scope across all stages**, each for a reason already recorded: payments and refunds
screens; **discount and coupon management — §49 and §50 bar discounting, there is no discount
column by design, and this is the one absence that must never be filled by an admin screen**;
editorial content (R-34); shipping-rate configuration (R-65); per-resource permissions; analytics
dashboards; kit composition editing (R-12).

---

## 7. Governance — what must be written before Phase 0 code lands

ADRs are immutable once `Accepted`; only status lines, typos and broken links may be edited. Two
decisions taken on 6 September 2026 contradict accepted text, so each needs its own ADR rather
than an edit.

**ADR-0010 — the single flat repository.** ADR-0006 fixes the domain at `apps/web/lib/server/`
and ADR-0008 fixes the admin at `apps/web/app/(admin)/`. This repository is flat: there is no
`apps/`. The substance of both ADRs is unaffected — one application, one deploy, no `apps/api`,
the admin importing `lib/server` directly with no HTTP hop — but the paths in accepted text no
longer resolve. ADR-0010 amends the path rows only. It should also record what happens to
`rejuvelux_old`: **keep it, do not delete it**, as the git history of the commerce spine and the
provenance of every ported file.

**ADR-0011 — the visual direction is superseded by the Claude Design handoff.**
[ADR-0007](adr/0007-visual-direction-change.md) accepted items 1–4 of a direction change —
product-scoped colour families, ground/type proportions, −0.026 em display tracking, 0.1 s
micro-transitions — implemented in `d59e081` **against the old frontend**. This repository's
frontend came from a different source entirely and carries its own token system in
`styles/tokens/`. ADR-0011 must state which of ADR-0007's four items survive in the new system
and which are moot. **Until it is written, no claim about the site's visual direction in the docs
suite is reliable.** Open, and needing an answer rather than an assumption: whether the contrast
audit that produced `#091b20` (`design-system.md` §2.2, 0 of 11 pairs failing AA) has been re-run
against the new palette. If it has not, that is a launch-blocking accessibility gap, not a
cosmetic one.

**Documents needing correction during Phase 0**, because they will otherwise assert things that
are false: `architecture.md` (paths, and §1's void admin row), `tech-stack.md` (the as-built
table), `data-model.md` (paths), `readme.md` (build order), and `work_done.md` (a new entry at
the top, per its own ordering rule).

---

## 8. Track C — client decisions, start immediately

**Zero developer time and the longest lead times in the project.** Several cannot be resolved
from the desk. These should be raised the day Phase 0 starts, not when a phase blocks on them.

| Risk | Question for the client | Blocks |
|---|---|---|
| **R-04** | Confirm the Silver Needle price. Earlier material gives ₹1,499/50 g | Phase 1 completion; the SKU is unbuyable until answered |
| **R-52** | Is CTC 250 g in the range, in a separate line, or excluded? Its row forbids sharing a shelf with the heroes | Whether `ctc` returns to the catalogue |
| **ube** | The sixth expression has a confirmed tin and colourway but no copy, weight, cups, intensity or brew figures | Whether `ube` returns to the catalogue |
| **R-05** | Green Tea at ₹599/200 g anchors the range downward — confirm it stays | Catalogue architecture |
| **R-12** | Regular Gift Box contents say "four tea variants" against three heroes | Ritual Set and gifting |
| **R-29** | **Formal cupping and a written sensory lexicon per SKU.** Closed by tasting, not by writing | Every product page; `body`/`brisk`/taste copy |
| **R-28** | A definitive list of FSSAI statutory declarations for pre-packaged tea | Product-page layout, packaging |
| **R-01 / R-02** | Written supplier confirmation of the matcha process — the *name* is exposed, not just the description | PDP copy, packaging, naming |
| **R-65** | The shipping rate | Checkout totals, free-shipping threshold |
| **R-07** | Domain purchase — `rejuveluxe.com` is not available; `.in` unverified at GoDaddy | `NEXT_PUBLIC_SITE_URL`, link previews, print |

---

## 9. Phase 4 — before the first real order

Three items were deferred by decision in ADR-0006, on the reasoning that they are schema-shaped
and expensive to retrofit **after live orders exist** — and that today there are none. That
reasoning has an expiry, and it is the same trigger for all of them.

| Item | Risk | Why it cannot wait past the first order |
|---|---|---|
| GST invoice numbering and credit notes | **R-45** | `compliance.md`'s own worked example: fixing numbering after a hundred live invoices means reissuing them |
| FSSAI residual shelf life, per-batch expiry | **R-43** | Inventory was built flat with the seam marked in the migration; growing to `stock_unit(item, location, batch, expiry, quantity)` is cheap only while empty |
| DPDP consent records | **R-41** | Consent cannot be reconstructed retroactively |
| **Database region** | **ADR-0009** | The ADR names its own expiry: *if the region is ever going to change, it changes before the first real order*. After that it is a data migration under compliance constraints rather than a re-run of `seed.sql` |

**R-62 is open and failing** — LCP 2.95 s on `/shop` against a < 2.5 s target, measured at
360×640 / 1.6 Mbps / 150 ms RTT / 4× CPU. ADR-0009 makes it harder to close: the Sydney region
is a **fixed input**, not a bug to find. `architecture.md` §4's caching is the stated mitigation
and it only helps the read path — **the write path (cart, checkout, reservation) carries the full
cross-region cost with no mitigation available**, and checkout is where slowness costs money
rather than patience.

---

## 10. Sizing, stated honestly

No estimate in hours is given, because none would be defensible. What the suite already records:

- ADR-0008 calls the admin **"the largest single feature the project has taken on, larger than
  checkout"** — a client-grade CRUD surface with guardrails and an audit trail, *"several
  sessions of work — not one"*. Five of its six stages remain.
- ADR-0006 calls the self-built domain **"more work than either alternative"** — a schema, a
  reservation path, an idempotency layer, an event-sourced order lifecycle and a payment
  reconciliation loop. Roughly half of that list is built.

Relative sizing, largest first: **Phase 3 (payments) ≈ Admin stages 2–6 > Phase 2 > Phase 1 >
Phase 0.** Phase 0 is the smallest and gates all of them.

---

## 11. Open questions this document does not settle

Named rather than deferred silently, per the suite's own rule.

1. **Does the Phase 1 field split survive contact with the admin?** Stage 3 lets a client edit
   name and description but not tagline, `why` or FAQs, because those are editorial and R-34
   keeps them in the repo. A client who can edit half a product page and not the other half may
   find that arbitrary. Revisit at stage 3, not before.
2. **`body` and `brisk` are in the repo pending R-29.** If the sensory lexicon arrives per-SKU
   and the client wants to maintain it, these move to the database and Phase 1's split changes.
3. **The admin's accessibility standard is undecided — R-74.**
   `features/accessibility.md` excludes the admin on the grounds that it was deprioritised;
   ADR-0008 makes that exclusion indefensible and did not replace it.
4. **Whether the new frontend's palette has been contrast-audited.** See ADR-0011 in §7. This is
   the one open question here that could be launch-blocking.
5. **`rejuvelux_old`'s disposal.** Kept through the port as provenance. Whether it is archived to
   a bundle (as `rejuvelux-docs-history.bundle` already was) or kept as a working directory is
   unanswered, and should be decided once Phase 0's exit criteria pass and nothing further is
   needed from it.
