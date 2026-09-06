# ADR-0008: Build an admin for a non-technical client team

- **Status:** **Accepted** — 2026-09-02, by Sayon, answering the operating-model question directly
- **Date:** 2026-09-02
- **Resolves:** **R-22** (operating model), open and self-contradictory since 17 August 2026
- **Depends on:** [ADR-0003](0003-vercel-native-deployment.md), [ADR-0006](0006-write-the-commerce-domain.md), both `Accepted`

## Context

**R-22 has been open and contradicted for sixteen days.** Two sessions recorded opposite answers to
the same question on 17 August 2026 — one *"not decided yet"*, one *"a non-technical client team
manages products, prices, content and orders"* — and the conflict protocol froze it rather than
picking a winner. Everything downstream inherited the ambiguity: `features/admin.md` is a five-line
stub, `product.md` §1.2 deferred admin customisation, and build-order item 35 put the doc last.

**The deferral had a sound reason that has now expired.** Sayon deprioritised the admin on 17 August
so the storefront could ship first. It did: the storefront is live, and as of 27 August the commerce
spine underneath it — inventory, cart, checkout, order events — is built and test-proven.

**Three facts make the absence expensive rather than merely untidy:**

- **Nothing will provide an admin.** ADR-0001 assumed Medusa's dashboard arrived free with the
  engine; ADR-0003 withdrew Medusa and ADR-0006 replaced it with a domain we wrote. Every remaining
  "Medusa ships an admin regardless" note in the suite is therefore false, and `architecture.md`
  §1's `admin | Medusa dashboard` row was already marked void on 27 August.
- **R-66 has no cure without a surface.** The database holds invented development stock quantities.
  They can only be corrected through `adjustStock()`, which today means a developer at a terminal.
- **R-04 has a cheaper cure than it looks.** Silver Needle's price is unconfirmed and blocks
  purchase by design (invariant 9). A client with a price field resolves it in a minute; a client
  without one raises a ticket.

On 2 September 2026 Sayon answered the operating-model question directly: **a non-technical client
team, from the start** — not an operator-only surface for himself, and not a permanently
developer-operated system.

## Decision

**We will build an admin for a non-technical client team, as a route group inside the existing
application.**

- **Location: `apps/web/app/(admin)/`**, server-rendered, middleware-guarded. One deployable, per
  ADR-0006. The admin imports `lib/server` directly — no HTTP hop, no second API surface to keep in
  sync.
- **Identity: Supabase Auth plus an `admin_user` table.** This mirrors Medusa's own split, verified
  in its source: the auth module holds credentials, the user module holds a profile (`user.ts` is
  id, name, email, avatar, metadata — **no password column**). We already use that shape for
  `customer.auth_user_id`; the admin repeats it. **No password ever enters our tables.**
- **Roles: `owner` and `staff`, designed by us.** See the licensing constraint below — this is the
  one area where Medusa cannot be the reference.
- **The domain layer stays the only writer.** Admin screens call `adjustStock()`, `placeOrder()`'s
  siblings and the inventory functions; they never issue raw SQL and never bypass an invariant.
  Everything `data-model.md` §9.4 guarantees stays guaranteed with a client team clicking buttons.
- **Every mutation is audited.** An `admin_action` table records who did what, to which entity, with
  before and after values. A non-technical team will make mistakes; the question is only whether
  they are reconstructable.
- **Guardrails are the product, not decoration.** Confirmations on destructive actions, refusal with
  an explanation rather than a raw constraint violation, and no screen that can put the database in
  a state the domain layer would reject.

### The licensing constraint, stated prominently because it is easy to violate

**Medusa's RBAC is Enterprise Edition, not MIT** — `ENTERPRISE-LICENSE.md` lists
`packages/modules/rbac/`, `core-flows/src/rbac/`, `api/admin/rbac/`, the role-assignment workflows
and the roles API among the Enterprise Materials. ADR-0006 put those out of bounds: *"not read for
reference, not ported, and not adapted."*

**So the single feature a multi-person client admin most needs is precisely the part of Medusa we
may not look at.** Our role model is therefore designed independently and deliberately kept far
simpler than Medusa's policy engine: two fixed roles, checked in one middleware and one helper, with
no dynamic policies, no field-level filtering and no per-resource grants. That simplicity is a
licensing consequence, and it is also the right size for a team of this scale.

Medusa's **MIT** admin surfaces remain fair reference — the route decomposition
(`routes/orders/order-detail/`, `routes/inventory/inventory-stock/`), the list/detail/edit shapes,
and the identity/profile split above.

## Consequences

**R-22 closes.** After sixteen days, the operating model is decided and the documents that hedged it
can be corrected.

**Two documented positions are reversed, on purpose.** `product.md` §1.2's *"Admin customisation —
deprioritised, revisit after launch"* and `readme.md` build-order item 35's *"Last, and now
deliberately so… covers customising one, not building one"* no longer describe the plan. Both are
corrected in this session rather than left to contradict this ADR.

**R-34 loses one of its three legs, and is not re-decided here.** Editorial content lives in the
repo partly because *"the admin is deprioritised, so there is no editing surface to extend."* An
admin now exists to extend. The other two arguments — most content cannot be written yet (R-29), and
§26/§35 want the control repo content gives — still stand, so **R-34 stays `accepted` and this ADR
does not disturb it.** Flagged so the next person does not mistake silence for oversight.

**This is the largest single feature the project has taken on**, larger than checkout. A
client-grade CRUD surface over products, variants, inventory, orders and users, with guardrails and
an audit trail, is several sessions of work — not one.

**Authentication is new attack surface, and R-36 applies most sharply here.** No CI, no staging, no
second reviewer, and now a login that guards the ability to change prices and stock. Using Supabase
Auth rather than writing session handling is the main mitigation; the second is that admin routes
are guarded in middleware, in one place, rather than per-page.

**Accessibility scope grows.** `features/accessibility.md` currently excludes the admin surface on
the grounds that it was deprioritised. A client team using it daily makes that exclusion
indefensible; the doc's scope note needs revisiting when the admin's own accessibility standard is
set. Not resolved here.

**Reversal cost: low today, high after the client is trained.** Nothing is built. Once a team is
using it daily, replacing it is a retraining exercise, not just a rewrite — which is why the
operating-model question deserved an answer before the first screen.

## Alternatives rejected

- **Operator-only admin, for Sayon alone.** Far less work: no roles, no audit trail, no guardrail
  UX, dense screens that assume the reader wrote the schema. **Rejected by Sayon's answer.** Would
  win if the client team turns out not to exist in practice — and note that this ADR's surface is a
  superset, so that outcome costs guardrail work, not a rebuild.
- **Scripts and SQL forever.** Zero build cost; already how `adjustStock()` works. Rejected because
  it makes every price change, stock count and fulfilment a developer task, and R-66 and R-04 then
  stay open indefinitely for want of a text field.
- **A third-party admin over the same Postgres** (Retool, Forest, Directus). Fastest path to CRUD
  screens. Rejected on three counts: it would be the first vendor since ADR-0003 chose a single
  one; connecting a generic tool to the database means **writes that bypass the domain layer**,
  which is exactly how `data-model.md` §9.4's invariants get broken; and per-seat pricing for a
  client team recurs forever. Worth revisiting only if the build stalls.
- **Medusa's dashboard, extracted and pointed at our schema.** Superficially attractive — it is
  MIT, mature, and we already read its source. Rejected because it is built against Medusa's module
  APIs, its data shapes and its query layer, none of which we run; the port would be larger than
  writing the screens, and it would drag in the RBAC boundary problem at the first roles screen.
