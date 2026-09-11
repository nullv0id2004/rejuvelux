# ADR-0002: Persistence — one relational store, plus operational Redis

- **Status:** Proposed — **partly void as of 2026-08-18**
- **Date:** 2026-08-17

> **Amendment, 18 August 2026 — [ADR-0003](0003-vercel-native-deployment.md) withdraws Redis.**
> Redis appears throughout this ADR only because Medusa mandated it in production for its cache,
> event bus and workflow engine. With Medusa withdrawn, **nothing in the stack currently requires
> Redis**, and every Redis clause below should be read as lapsed rather than binding. R-38, which
> questioned whether Medusa's workflow engine made Redis partially authoritative, is moot for the
> same reason.
>
> **What survives intact, and is the more important half:** PostgreSQL as the single source of truth;
> object storage for binaries; no search index, document store, warehouse or vector store at launch,
> each with a named trigger; and the three concurrency rules — inventory reserved under row-level
> lock, idempotency enforced by a unique database constraint, order and payment state append-only
> with forward-only transitions. Those are properties of PostgreSQL, not of Medusa. **They now have
> to be implemented by us rather than inherited**, which makes them more load-bearing, not less.

## Context

ADR-0001 selects Medusa v2, which fixes **PostgreSQL** as the primary datastore and requires
**Redis** in production for the cache, event bus and workflow engine. What it does not settle is
everything else: whether a search index, a document store, an analytics warehouse or a vector store
belongs in the system. That question recurs in every ecommerce build and is cheapest to answer once,
in advance, with named trigger conditions — otherwise it returns as an argument every quarter.

Three facts about *this* project decide it.

The catalogue is tiny: three heroes, possibly Green Tea (R-05), gift boxes and the Ritual Set. Load
is **spiky rather than sustained** — a Dussehra activation (§44), a limited edition or exclusive drop
(§50), a brand film landing (§43) — against an otherwise quiet store. And inventory correctness is
the highest-stakes property in the system: §32's Ritual Set is six physical components sold as one
purchasable thing, so a single sale must decrement six rows atomically or the brand ships an
incomplete gift.

## Decision

**PostgreSQL is the single source of truth for all business data.** Products, inventory, carts,
orders, payments, customers, addresses, gifting and content metadata.

**Redis is operational only.** Cache, event bus, workflow engine, rate limiting, transient
shipping-rate lookups. **Nothing is authoritative in Redis.** The test: losing Redis entirely must
cost performance and nothing else — no lost cart, no lost order, no lost money.

**Object storage** (S3-compatible) for all binaries — product photography, insert-card artwork,
generated invoices. Binaries never go in the database.

**Nothing else ships at launch.** No search index, no document store, no analytics warehouse, no
vector store. Each is deferred against a named trigger recorded in `architecture.md`.

Three concurrency rules are binding, not advisory:

1. **Inventory is reserved under row-level lock** inside one transaction. Never read-then-write. A
   kit reserves every component or fails as a unit.
2. **Idempotency is enforced by a unique constraint in the database**, not by application logic —
   on checkout completion and on every inbound payment webhook.
3. **Order and payment state is append-only.** Current state is derived from the event sequence, and
   only forward transitions are legal, because gateway webhooks arrive out of order.

## Consequences

**Easier.** One place to look, back up and restore. Transactions actually span the things that need
to be consistent — a cart, its line items and the stock they reserve — which is impossible once that
data is spread across stores. One technology for a solo developer to be good at.

**Harder.** Postgres does jobs a specialist would do better: full-text search is weaker than a
dedicated index, and analytical queries will eventually compete with transactional ones. We accept
both, and the triggers in `architecture.md` say when to stop accepting them.

**Locked in.** Very little. Adding a search index or a warehouse later is additive — they become
derived read paths fed from Postgres, not new sources of truth. That is the property this ADR is
really protecting: **there is one source of truth, and everything else is a projection of it.**

**The cost we are choosing to carry.** Redis is a second piece of infrastructure to run, monitor and
pay for, contradicting the "fewest moving parts" instinct behind ADR-0001's solo-maintainability
criterion. It is not optional — Medusa requires it in production — so it is a constraint we are
recording rather than a trade we are making.

## Alternatives rejected

- **A search index at launch (Meilisearch, Typesense, Elasticsearch)** — rejected at six SKUs.
  Postgres full-text covers the catalogue and the Journal. Wins when the catalogue passes roughly
  500 items, or content search draws real complaints.
- **Document store for product attributes (MongoDB)** — the attributes are not variable; §38
  enumerates them. Adopting it would trade away the row-level locking that prevents selling the same
  Ritual Set twice, which is the one thing this system cannot get wrong. Wins if product schemas ever
  genuinely diverge per SKU.
- **Redis-backed carts** — a common "for speed" choice. Redis is eviction-based: an evicted cart is a
  lost sale that never appears in any log. At this volume Postgres is not the bottleneck.
- **Analytics warehouse at launch** — nothing to analyse yet. A hosted analytics product covers it.
  Wins when analytical queries measurably slow the transactional database.
