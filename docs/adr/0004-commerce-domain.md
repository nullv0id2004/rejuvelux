# ADR-0004: Commerce domain — buy it, do not write it

- **Status:** **Rejected** — 2026-08-26. See [ADR-0006](0006-write-the-commerce-domain.md)
- **Date:** 2026-08-18

> **Why this file is kept.** `readme.md` requires a rejected ADR to be retained, because the
> reasoning is the point. Sayon chose on 26 August 2026 to write the commerce domain rather than buy
> it. **Two things below remain load-bearing and are worth not losing.** First, the fee arithmetic:
> Shopify's cut stacks on Razorpay's because Shopify Payments is unavailable in India, and the
> premium is 0.6–2 % of revenue forever, scaling with success — that is the number to weigh if
> self-building ever proves too expensive to maintain. Second, **R-49's verified finding**, which is
> what actually decided against this ADR: headless Shopify takes the customer off our domain to pay
> *and* keeps the thank-you page on Shopify's domain, so the seam is two surfaces wide.

## Context

[ADR-0003](0003-vercel-native-deployment.md) withdrew Medusa in favour of a Vercel-only deployment.
That left cart, checkout, order lifecycle, inventory, kit assembly, refunds and payment
reconciliation with no owner — recorded as **R-48**, the largest open decision in the project.

The constraints have not changed. India only, INR, Razorpay. A catalogue of roughly six items. §32's
**Matcha Ritual Set is six stock-tracked components sold as one item** and must become unavailable
the moment any single component does. §49 and §50 bar discounting outright, so a coupon engine is
not needed but bundling and access control are. And per `CLAUDE.md` and R-36 there is **one
developer, no CI, no staging, no second reviewer** — the money-handling paths would be written and
reviewed by the same person.

ADR-0001 made the argument that still governs, and it survives its own rejection: hand-rolling this
"puts payments, refunds and order transitions into unreviewed code."

## Decision

**Adopt a hosted commerce backend — Shopify — consumed headlessly through its Storefront API, with
the Next.js storefront on Vercel.** We write the storefront. We do not write the commerce domain.

The kit question, which is the one that has twice decided this project's architecture, is answered
natively: Shopify's product bundles compute availability from the **lowest-stock component**, and a
bundle is marked unavailable if any one component is out of stock. That is the same semantics R-30
verified in Medusa's source, from a different vendor.

## Consequences

**What we stop owning.** Cart, checkout, order state machine, inventory and reservation, bundle
availability, refunds, payment reconciliation, and the retry and idempotency behaviour around
gateway webhooks. `architecture.md` §2's four races become the vendor's problem rather than ours.
For a solo developer with no staging environment, this is the whole point.

**What it costs, and this is the sharp edge.** Shopify Payments is **not available in India**, so a
third-party gateway fee stacks on top of Razorpay's own charge:

| | Shopify fee | Razorpay | Combined |
|---|---|---|---|
| Basic | 2 % | ~2.36 % (2 % + 18 % GST) | **~4.36 %** |
| Grow | 1 % | ~2.36 % | ~3.36 % |
| Advanced | 0.6 % | ~2.36 % | ~2.96 % |

Writing it ourselves would cost Razorpay's ~2.36 % alone. **The platform premium is roughly 0.6–2 %
of revenue, forever, and it scales with success** where a hosting bill does not. On an illustrative
₹4,00,000 month that is ₹2,400–₹8,000. *(Illustrative arithmetic on verified rates — not a forecast;
no revenue projection exists.)*

**What we give up, and it is not only money — verified 18 August 2026 (R-49).** In headless Shopify
the cart lives in the Storefront API, but **checkout is a redirect to Shopify's `checkoutUrl`**. The
customer leaves our pages to pay. Worse, the **thank-you page also lives on Shopify's domain** — a
custom post-checkout redirect to an external domain is not natively supported *even on Plus*, short
of `checkout.liquid`.

**That is two seams, not one.** The customer departs at §59's *Purchase* and is still away at the
start of *Receive* — so the premium-unboxing promise begins on somebody else's page. For a brand
whose §26 is restraint, whose §34 wants commerce and storytelling on one surface, and whose §22 says
the premium must be justified by the **total** experience, this is the sharpest cost in the decision.
A `checkout.rejuveluxe.*` subdomain may narrow the seam; that is **unverified** and would not close
it. **This is the strongest argument against this ADR and it remains unresolved.**

**Lock-in.** Products, orders, customers and inventory live in Shopify. Leaving means migrating all
of it. Reversal is cheap now and expensive after launch.

**Unverified, and to be closed before this is `Accepted`:** Shopify India plan prices; whether a
compliant Indian **GST tax invoice** (R-31) can be produced without a third-party app; whether
Razorpay's Shopify integration supports the webhook idempotency guarantees `architecture.md` §2
assumes; and whether a headless storefront can keep the customer on our domain through checkout at
non-Plus tiers.

## Alternatives rejected

- **Write the commerce domain ourselves** on Vercel primitives (Cron, Queues, Workflow) plus Supabase
  — no platform cut, total control, and a checkout that never leaves our pages, which is the one
  thing §26/§34/§35 most want. **Rejected on R-36 and R-37:** with no CI, no staging and no second
  reviewer, the code that would be least reviewed is the code that moves money. Would win if the
  checkout seam proves unacceptable to the brand, or if the fee premium becomes material at volume.
- **Medusa Cloud** — keeps the domain model R-30 verified without self-hosting. Reintroduces a vendor
  and a fee anyway, and its regions were found to top out at Singapore, 88 ms from Mumbai. Not
  evaluated in depth; the closest thing to a reversal of ADR-0003 that does not reverse it.
- **Swell / Commerce Layer / Saleor Cloud** — API-first, would keep checkout on our own pages.
  **Indian payment support is unverified for all three**, and Razorpay support is the gating
  requirement. Worth checking before this ADR is accepted if the checkout seam is the deciding factor.
