# ADR-0006: Write the commerce domain, with Medusa's MIT source as the reference

- **Status:** **Accepted** — 2026-08-26, by Sayon, who directed building the backend ourselves and taking the implementation reference from Medusa
- **Date:** 2026-08-26
- **Supersedes:** [ADR-0004](0004-commerce-domain.md) (which never reached `Accepted`; it is now marked `Rejected`, not superseded-in-force)
- **Depends on:** [ADR-0003](0003-vercel-native-deployment.md) `Accepted`, [ADR-0002](0002-persistence.md) (the surviving half)
- **One open item below is now closed (status-line note, 2026-09-05):** the *"What this does not
  settle"* section flags the Supabase region as unverified and says that if the project turned out
  not to be in Mumbai, *"that contradicts an accepted ADR and is a finding to report"*. **It was
  reported** — raised as R-73 on 4 Sep — **and settled** by
  [ADR-0009](0009-database-region-sydney.md): the region is `ap-southeast-2` (Sydney), deliberately.
  That caveat is discharged; the text below is left unedited because accepted text is immutable.

## Context

[ADR-0003](0003-vercel-native-deployment.md) withdrew Medusa because Vercel cannot host its two
always-on Node processes, and left cart, checkout, order lifecycle, inventory, kit assembly, refunds
and payment reconciliation with no owner — **R-48**, the largest open decision in the project.
[ADR-0004](0004-commerce-domain.md) proposed closing it by buying Shopify and consuming it
headlessly.

ADR-0004 named its own strongest counter-argument and left it unresolved. Verified 18 August 2026
under **R-49**: in headless Shopify the cart lives in the Storefront API but **checkout is a redirect
to Shopify's `checkoutUrl`**, and the **thank-you page also lives on Shopify's domain**, with no
native custom redirect even on Plus. That is two seams, not one. The customer departs at §59's
*Purchase* and is still away at the start of *Receive*, so the premium-unboxing promise begins on
somebody else's page — against §26's restraint, §34's requirement that commerce and storytelling
share one surface, and §22's rule that the premium is justified by the **total** experience.

**What changed on 26 August 2026.** Sayon directed that the backend be built rather than bought,
with Medusa's implementation used as the reference. Medusa v2.19.0 is checked out locally at
`Money_projects/medusa`.

That materially alters the argument that decided ADR-0001 and that ADR-0004 used to reject
self-building. The argument was **R-36/R-37**: one developer, no CI, no staging, no second reviewer,
so the least-reviewed code would be the code that moves money. It is not eliminated. But its weight
was set by an implicit assumption that self-building meant starting from a blank file and reasoning
about concurrency unaided. A mature, widely-deployed implementation of exactly these paths, readable
in full, is a different starting position from a blank file.

Three facts were verified rather than recalled, on 26 August 2026:

- **The licence permits this.** Medusa's `LICENSE` is MIT for the repository *except* the Enterprise
  Materials enumerated in `ENTERPRISE-LICENSE.md`, and those are **only RBAC and SSO**. Every module
  bearing on this project — `inventory`, `order`, `cart`, `payment`, `pricing`, `product`,
  `promotion`, `tax`, `fulfillment` — is MIT.
- **R-30's answer is recoverable, and it is the exact code.**
  `packages/core/utils/src/product/get-variant-availability.ts` computes, per component,
  `Math.floor(availableQuantity / requiredQuantity)`, then returns `Math.min(...)` across all
  components of the variant. That is §32's six-component Ritual Set going unavailable the moment any
  one component does. ADR-0003 recorded this finding as **lost**; it is not lost.
- **Reservation is per component under a lock.**
  `packages/core/core-flows/src/cart/steps/reserve-inventory.ts` resolves a locking service and
  reserves each component's inventory item, which is `architecture.md` §2's race 1 closed the way
  §2 requires.

## Decision

**We will write the commerce domain ourselves, in TypeScript, and use Medusa v2.19.0's MIT source as
the reference implementation for its hard parts. We will not adopt Medusa as a dependency, a
framework, or a runtime.**

- **Location: one application.** The domain lives in `apps/web/lib/server/`, exposed through Next.js
  Route Handlers. There is no `apps/api`. One Vercel project, one deploy, per ADR-0003. This closes
  the `dev:api` placeholder in the root `package.json`.
- **Persistence: Supabase PostgreSQL**, project `axeadbalzanbnqgqusjx`, as the single source of
  truth. ADR-0002's surviving half is binding and unchanged: one relational store, object storage for
  binaries, no search index or warehouse at launch.
- **Access layer: Drizzle.** Chosen on one criterion, not on ergonomics — `architecture.md` §2
  requires explicit transactions with `SELECT … FOR UPDATE` on the reservation path and idempotency
  enforced by a unique index. Drizzle exposes both directly and keeps migrations as readable SQL.
  Prisma was rejected specifically because row locking is not first-class in it, so the single most
  important path in the system would drop to untyped raw SQL anyway.
- **Payments: Razorpay, integrated directly.** Checkout never leaves our domain. This is the whole
  point of the decision.
- **What we take from Medusa** is algorithm and schema shape for: variant availability across kit
  components, inventory reservation under lock, and order state as an append-only event sequence.
  **Any file whose content is derived from Medusa carries an MIT attribution header naming the
  upstream path and version.** MIT requires the notice be retained; this is a build rule, not a
  courtesy.
- **The Enterprise Materials are out of bounds.** `packages/modules/rbac/`, the SSO paths, and every
  other path listed in `ENTERPRISE-LICENSE.md` are not read for reference, not ported, and not
  adapted. We need neither.

### Deliberately deferred, on instruction, 26 August 2026

GST invoice numbering and credit notes (**R-45**), FSSAI residual shelf life and per-batch expiry
(**R-43**), and DPDP consent records (**R-41**) are **not** built in the first pass. `compliance.md`
calls these schema-shaped and expensive to retrofit, and that is correct **after live orders exist**
— its own worked example is that fixing invoice numbering after a hundred live invoices means
reissuing them. There are no orders, no invoices and no customers, and the site is not going live on
this pass, so each is an ordinary migration today. Recorded here so that it stays a decision with a
date on it rather than an omission nobody chose. Carried as a row in `open-calls.md`.

The one place this is not free: inventory must pick a shape now, either flat
`inventory_level(item, location, quantity)` or batch-tracked
`stock_unit(item, location, batch, expiry, quantity)`. We build the flat shape and mark the seam in
the migration, because that is the cheaper direction to grow.

## Consequences

**Easier, and these are the reasons.** The checkout seam closes: the customer never leaves our pages
to pay, and the thank-you page is ours, which is what §22, §26 and §34 all wanted and what ADR-0004
could not deliver. No platform cut — ADR-0004 measured the Shopify premium at roughly **0.6–2 % of
revenue, forever, scaling with success**, on top of Razorpay's ~2.36 %; we now pay Razorpay alone. No
vendor holds our products, orders, customers or inventory. And **R-30 is recovered**: the hardest
modelling question in the project has a verified answer again, in readable MIT source, which
ADR-0003 had written off as lost.

**Harder, and this is the real cost — it is not mitigated away.** `architecture.md` §2's four races
are now ours to close: overselling, double charge, out-of-order webhooks, lost cart updates. ADR-0001
said hand-rolling this "puts payments, refunds and order transitions into unreviewed code", and
**that sentence is still true**. Reading a good implementation reduces the risk of designing the
wrong thing. It does not review our code, and R-36 still records that no independent review control
exists. Every money path needs a test that fails before it passes, because nothing else will catch
it.

**More work than either alternative.** Buying it was one integration. This is a schema, a
reservation path, an idempotency layer, an event-sourced order lifecycle and a payment
reconciliation loop, each of which Shopify would have supplied finished.

**Locked in.** Our own schema, and our own bugs. Reversal is cheap today — nothing is built — and
expensive after launch, when reversing means migrating live orders and customers to a platform.

**A licence obligation we now carry.** MIT attribution on derived files, and a boundary around the
Enterprise Materials that has to be respected by every future session, not just this one.

**What this does not settle.** ADR-0002 is still `Proposed` and still half-void. `data-model.md` is
still a stub and gates every feature document. The Supabase project's **region is unverified** — the
MCP server is configured but not yet authorised, and ADR-0003 fixes Supabase to Mumbai
`ap-south-1`. If the project was created elsewhere, that contradicts an accepted ADR and is a finding
to report, not something to quietly accept.

## Alternatives rejected

- **Hosted Shopify, headless — [ADR-0004](0004-commerce-domain.md)'s proposal.** Rejected on the
  checkout seam (R-49) rather than on price: the customer leaves our domain to pay and stays away
  through the thank-you page, which is the surface §22 says the premium has to be earned on. The fee
  premium is the second argument, not the first. **Would win** if the money-handling code proves
  beyond one developer to get right, which is the failure mode to watch for.
- **Medusa as a dependency, self-hosted.** Ruled out by [ADR-0003](0003-vercel-native-deployment.md),
  which is `Accepted` and binding: Vercel cannot run its two always-on processes, and Sayon chose a
  single vendor with the cost stated in advance. Note the distinction this ADR rests on — reading
  MIT-licensed source is not adopting a runtime.
- **Medusa Cloud.** Keeps the domain model without self-hosting, but reintroduces a vendor and a
  per-month cost, and its regions were found to top out at Singapore, 88 ms from Mumbai. Still the
  closest thing to a reversal of ADR-0003 that does not reverse it.
- **Swell, Commerce Layer, or Saleor Cloud.** API-first, and would have kept checkout on our pages.
  **Razorpay support is unverified for all three** and Razorpay is the gating requirement, so none
  was evaluable without research this decision no longer needs.
- **Prisma as the access layer.** Best-known developer experience of the three considered, and the
  worst fit for the one path that matters: no first-class row locking, so the reservation transaction
  would drop to `$queryRaw` and lose its types exactly where correctness is most expensive.
