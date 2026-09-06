# ADR-0009: The database lives in Sydney, not Mumbai

- **Status:** **Accepted** — 2026-09-05, by Sayon, confirming the region as a deliberate choice
- **Date:** 2026-09-05
- **Amends in part:** [ADR-0003](0003-vercel-native-deployment.md) — one row only, the database
  region. Everything else in ADR-0003 stands, including Vercel `bom1` for the application.

## Context

[ADR-0003](0003-vercel-native-deployment.md) (`Accepted`, 18 August 2026) states *"Database:
Supabase PostgreSQL, Mumbai (`ap-south-1`)"*, and `tech-stack.md` §7 records the region as a
decided row whose availability was verified on 17 August. The reasoning was never elaborate: an
India-only brand (R-23) served from Vercel `bom1` should keep its database in the same city.

On 28 August 2026 the original project became unreachable — free-tier Supabase pauses after roughly
a week idle, and the pause is silent (**R-72**). Rather than recover it, Sayon created a replacement
project, `smigkfogyebokiedhdeu`. **Its region is `ap-southeast-2`, Sydney.**

That was found on 4 September 2026 by reading the project through the Supabase API, not by being
told, and raised as **R-73** under the conflict protocol — flagged rather than resolved, because a
running system contradicting an accepted ADR is not a thing an agent gets to settle.

On 5 September 2026 Sayon confirmed the region is deliberate and stated the reason: **the
replacement project was created in Sydney without the region being a considered choice at the time,
and now that the database exists he would rather keep it than rebuild.**

Two facts belong in this Context because the decision is easier to re-litigate without them.

**The latency is real and was measured, not estimated.** Median round-trip **458 ms** over seven
samples (397–704 ms). **That figure is not the production number** — it was taken from a consumer
connection in India, not from `bom1`. Mumbai to Sydney is roughly 150 ms of baseline round-trip. The
defensible claim is *materially worse than an in-region hop*, not "458 ms in production".

**The reversal cost today is low, and this ADR does not pretend otherwise.** The database holds 18
tables, 5 products and **zero orders**, and three migrations plus `seed.sql` rebuild it exactly —
verified on 4 September, when all three exit suites (12/12, 19/19, 28/28) passed against this very
database after `0002` was applied to it. Recreating in `ap-south-1` would cost minutes of work and
no data. The "rather keep it than rebuild" reasoning is therefore a preference about effort and
disruption rather than a constraint, and it is recorded as such.

## Decision

**The database region is `ap-southeast-2` (Sydney), and ADR-0003's `ap-south-1` row is superseded
on that single point.**

- Supabase project `smigkfogyebokiedhdeu`, region `ap-southeast-2`.
- The application stays on **Vercel `bom1` (Mumbai)** — unchanged, and not up for reconsideration
  here. Every query therefore crosses the Indian Ocean by design.
- Every other clause of ADR-0003 is untouched: Vercel-only, no second host, Medusa withdrawn,
  Redis withdrawn.

## Consequences

**Accepted cost, stated plainly.** Cross-region latency on every database round trip. It compounds
rather than appearing once: a page render issues several queries, `architecture.md` §3 sets
performance budgets, and **R-62 already records LCP failing at 2.95 s on `/shop`** against a
< 2.5 s target. This decision does not cause R-62, but it makes it harder to close, and anyone
attacking R-62 later should know the region is a fixed input rather than a bug to find.

**A mitigation that now matters more than it did.** `architecture.md` §4's caching guidance stops
being a nicety. The catalogue is ~6 SKUs and near-static, so caching rendered output rather than
querying per request removes most of the cost for the read path — which is the path a customer
feels. The write path (cart, checkout, reservation) cannot be cached and keeps the full penalty;
that is the part to watch, and checkout is where slowness costs money rather than patience.

**This decision has a shelf life, and the expiry is nameable.** Its justification is that rebuilding
is not worth the disruption. That is true while the database holds five products and no orders; it
stops being true the moment real orders, real customers and real GST records exist, at which point
moving becomes a data migration under compliance constraints rather than a re-run of `seed.sql`.
**If the region is ever going to change, it changes before the first real order** — the same trigger
R-41, R-43 and R-45 already use.

**`architecture.md` §8 now contains an argument this ADR contradicts.** It reasons that co-locating
the database with the application *"removes a round-trip nobody can optimise away later"*. That
sentence stays true; we are choosing to pay the round-trip anyway. Corrected in place with a
pointer here rather than deleted, because the reasoning was sound and is worth keeping visible.

**No compliance consequence has been assessed, and none is claimed.** `compliance.md` §3 covers
DPDP; whether personal data of Indian customers residing on Australian infrastructure carries any
obligation is **not** something this ADR answers, and it is not an accessible fact from the desk.
The DPDP work is deferred anyway (R-41, ADR-0006), so this rides with it — but it is named here so
that whoever picks up R-41 knows to ask, rather than discovering the region then.

## Alternatives rejected

- **Recreate the project in `ap-south-1`.** Cheapest it will ever be — minutes of work, no data at
  risk, and the migrations and seed in the repo rebuild the schema exactly. **Rejected by Sayon on
  5 September 2026** in favour of keeping the working database rather than repeating setup that has
  already been done twice this fortnight. Would win if latency proves to bite the checkout path, or
  if R-62 cannot be closed with caching alone.
- **Move the application to Sydney instead, to re-co-locate.** Restores locality by giving up
  proximity to customers — the wrong half to move for an India-only brand whose visitors are all in
  India. Trades a database round-trip the server pays once per query for a network round-trip every
  visitor pays on every request.
- **Read replica in Mumbai, primary in Sydney.** Would genuinely fix the read path. Rejected as
  premature: it is a paid Supabase feature, adds a second thing to reason about for a six-SKU
  catalogue, and `architecture.md` §4's caching is the cheaper answer to the same problem. Revisit
  if caching proves insufficient and the region is still Sydney.
