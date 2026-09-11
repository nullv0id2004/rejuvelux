# ADR-0001: Tech stack — TypeScript, Medusa, PostgreSQL, Next.js

- **Status:** **Rejected** — 2026-08-18. See [ADR-0003](0003-vercel-native-deployment.md)
- **Date:** 2026-08-17

> **Why this file is kept.** `docs/adr/readme.md` requires a rejected ADR to be retained, because the
> reasoning is the point. Sayon chose a Vercel-only deployment on 18 August 2026, and Vercel cannot
> run the two always-on Node processes Medusa requires. The stack below was never accepted and
> nothing depends on it. **Two things in it remain true and are worth not losing:** the argument that
> hand-rolling cart, checkout, refunds and order transitions puts money-handling code beyond review
> for a solo developer; and R-30's verified finding that Medusa's Inventory Kits model §32's
> six-component Ritual Set natively. Both now fall to ADR-0004.

## Context

RejuveLuxe is a direct-to-consumer commerce build for the Indian market — ₹ only, with
international deliberately out of scope (R-23). The brief requires commerce, storytelling and
product education on one surface (§34); a fast, mobile-friendly, editorially disciplined site
(§35); a fifteen-destination sitemap including a Journal and a three-page Our Story (§36); and an
eighteen-field product page carrying statutory FSSAI information (§38). Promotion is constrained
to bundles, limited editions, gift-with-purchase and early access, with discounting barred
outright (§49, §50) — so what is needed is kit assembly and access control, not a coupon engine.

The build posture was decided on 17 August 2026: custom — no hosted platform — but starting from an
open-source engine we self-host and own, optimising for **solo maintainability**: one developer, no
CI, no staging, no second reviewer.

**Correction to the first draft of this ADR.** It rested on R-22 being resolved — a non-technical
client team managing products, prices, content and orders, which would have made an admin a launch
deliverable. That is no longer load-bearing. R-22's *who* is contradicted in the record and has been
reopened, and the admin has since been deprioritised outright: **the storefront ships first.** The
decision below is unchanged, because the admin was never its strongest support — the order state
machine, inventory and payment handling were. Medusa's admin is now a free option we are not yet
exercising, rather than a requirement being satisfied.

The catalogue is small: three heroes, possibly Green Tea (R-05), gift boxes and the Ritual Set. The
cost is not in the catalogue. It is in the kits, the order lifecycle and the admin.

## Decision

We will build on **TypeScript end to end**.

- **Runtime:** Node.js LTS, pinned explicitly. Medusa documents v20.19.0+ or v22.12.0+, LTS only.
- **Commerce engine:** **Medusa v2** — **open-core, not wholly MIT** (see Consequences), self-hosted. Supplies the order state machine, carts,
  inventory, fulfilment and an admin dashboard served at `/app`. We run it as our own code in our
  own repository, not as a service.
- **Persistence:** **PostgreSQL**, required by Medusa.
- **Storefront:** **Next.js**, written by us against Medusa's Store API. We do not adopt the starter
  theme — §26, §34 and §35 need full markup and rendering control.
- **Payments:** **Razorpay**, integrated through a payment-provider module **we write and own**.
- **Package manager:** **pnpm**; Medusa's documentation recommends yarn or pnpm over npm.
- **Deploy target:** **PROVISIONAL — the least-researched element here.** Medusa needs a
  long-running Node process and a managed Postgres, which rules out serverless-only hosting for the
  backend. Overturned by a costed comparison of VPS against Railway or Render.

## Consequences

**Easier.** One language and one dependency graph for a solo developer. The admin arrives with the
engine rather than being built. Order lifecycle, refunds and inventory become solved code instead of
ours to get right without review.

**Harder.** Two deployables instead of one. Medusa's data model shapes ours — §32's six-component
Ritual Set has to be expressed in its product, variant and inventory abstractions, and whether it
models kits natively is **unverified**.

**Locked in.** Medusa's module and workflow architecture. Reversing means rewriting the commerce
domain, though the storefront survives any backend change because it talks over HTTP.

**The payment decision is the sharp edge.** Both community Razorpay plugins are pre-stable —
`@devx-commerce/razorpay` at `6.0.0-beta.0`, and `medusa-plugin-razorpay-v2` at `0.1.4`, last
published 2025-12-31. Depending on either puts the least forgiving component in the system on
unmaintained pre-1.0 code. Writing the provider ourselves against Medusa's documented interface is
more work up front and is the cheaper mistake: a bounded module we understand, rather than an outage
we cannot debug at 2am with no staging environment.

Carried to `risks.md` unresolved: GST invoicing, Indian shipping-provider integration, FSSAI field
modelling, and native bundle support.

## Alternatives rejected

- **Hosted platform (Shopify or equivalent)** — ruled out by the operating-model and build-posture
  decisions. Would win if the client wanted zero infrastructure ownership. Costs the editorial
  control §34 and §35 require, and §50's mechanics arrive as third-party apps, which fights §56.
- **Hand-rolled commerce domain** — our own cart, order state machine, inventory and admin.
  Rejected on solo maintainability: it puts payments, refunds and order transitions into unreviewed
  code. Would win if Medusa's data model proves unable to express the kits or the promotion rules.
- **Admin-first framework (Django, Payload)** — a production admin and content modelling for free,
  commerce written on top. Django loses on language split — Python backend against a TypeScript
  storefront — measured against the solo-maintainability criterion. Would win if content management
  outweighed commerce complexity.
- **Vendure or Saleor** — comparable open-source engines. Medusa was taken on licence, Node and
  TypeScript alignment, and Indian payment precedent. **This is the weakest-researched rejection in
  this ADR** and must be closed before it moves to `Accepted`.
