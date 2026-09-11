# ADR-0003: Vercel-native deployment; Medusa withdrawn

- **Status:** **Accepted** — 2026-08-18, by Sayon ("vercel nextjs supabase confirmed").
  **Amended in part 2026-09-05 by [ADR-0009](0009-database-region-sydney.md): the database region
  is `ap-southeast-2` (Sydney), not the `ap-south-1` this document's Decision names.** One row
  only — the application stays on Vercel `bom1`, and every other clause below stands. The text is
  left unedited because accepted text is immutable (`readme.md`, Lifecycle); this pointer is the
  status-line amendment that rule allows.
- **Date:** 2026-08-18
- **Supersedes:** ADR-0001 (which never reached `Accepted`; it is marked `Rejected`, not superseded-in-force)

## Context

ADR-0001 proposed a self-hosted **Medusa v2** commerce engine with a hand-written Next.js storefront.
It was never accepted. On 17 August 2026 the storefront was confirmed to **Vercel** (Mumbai `bom1`)
and PostgreSQL to **Supabase** (Mumbai). That left one open row: where Medusa's **two always-on Node
processes** — a server and a worker running scheduled jobs, workflow execution and event subscribers
— would run.

Vercel cannot host that row. Its functions are request-scoped and cap at **300 seconds** (800 with
Fluid Compute), and its own guidance is to push work outliving a response onto an external worker.
The consequence was put to Sayon explicitly: keeping Medusa means a second host alongside Vercel;
choosing Vercel-only means Medusa goes. **On 18 August 2026 Sayon chose Vercel-only**, with the cost
stated in advance.

The pre-existing build-posture decision — *custom build, no hosted platform, start from an
open-source engine we self-host and own* — does not survive this intact, and neither does R-30's
verified finding that Medusa's Inventory Kits already model §32's six-component Ritual Set natively.
Both are recorded as consequences below rather than quietly dropped.

## Decision

**Everything we operate runs on Vercel.** No second application host, no server we patch.

- **Storefront and application:** Next.js on **Vercel**, region `bom1` (Mumbai).
- **Database:** **Supabase** PostgreSQL, Mumbai (`ap-south-1`). Unchanged.
- **Medusa is withdrawn.** It is not deployed, not self-hosted, and not a dependency.
- **Redis is withdrawn as a requirement.** It existed in ADR-0002 only because Medusa mandated it in
  production. Nothing else in the stack currently needs it.
- **Background and long-running work** uses Vercel's own primitives — Cron, Queues, Workflow —
  rather than a resident worker process.

**What provides the commerce domain is NOT decided by this ADR.** Withdrawing Medusa leaves cart,
checkout, order lifecycle, inventory, kit assembly and payment reconciliation without an owner. That
is a decision of equal weight to this one and gets **ADR-0004**. Until it is accepted, no feature
document may assume a commerce implementation.

## Consequences

**Easier.** One vendor for compute, one deploy, no OS to patch, no worker to keep alive, no Redis to
run. For a solo developer with no CI and no staging, the operational surface is the smallest it has
been in any option considered.

**Harder, and this is the substantive cost.** The commerce domain was the reason Medusa was chosen.
ADR-0001's own words: hand-rolling it "puts payments, refunds and order transitions into unreviewed
code". That risk is now live again and is not mitigated by this decision — only relocated into
ADR-0004.

**Lost.** R-30 was resolved by reading Medusa's shipped source: `getVariantAvailability` computes
`Math.min` across components of `floor(available / required_quantity)`, and `reserveInventoryStep`
reserves per component under lock. That was a verified answer to the hardest modelling question in
the project — the Ritual Set going out of stock when any one of six components does. **It no longer
applies.** Whatever replaces Medusa must answer it again, and may not answer it as well.

**Unresolved by implication.** `architecture.md`'s concurrency rules survive, because they are
properties of PostgreSQL rather than of Medusa: row-level locking on inventory, idempotency enforced
by unique constraint, append-only order state. They now have to be implemented by us rather than
inherited.

**Reversal cost.** Low today, high later. Nothing is built. Reversing after the commerce domain is
written means rewriting it.

## Alternatives rejected

- **Keep Medusa, add a second host** (Azure Mumbai, AWS Lightsail Mumbai, Railway, or a VPS) —
  rejected by Sayon on 18 August 2026 in favour of a single vendor. Would win if operational
  simplicity mattered less than not writing a commerce domain from scratch. This was the option the
  documentation was written for, and the option ADR-0001 argued.
- **Vercel plus Medusa Cloud** — keeps Medusa's domain model without self-hosting, but reintroduces a
  vendor and a per-month cost, and its regions were found to top out at Singapore, 88 ms from Mumbai.
  Not evaluated in depth; should be if ADR-0004 struggles.
