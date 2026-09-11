# Architecture, Performance and Scalability

> **Purpose:** Module boundaries, layering, data flow, caching, performance budgets, security
> posture, and how it scales.
>
> **Status:** `PARTIAL` — **persistence, concurrency, performance and scaling only.**
>
> This document is item 13 in the build order and is formally blocked on item 11 (stack) and item 10
> (`data-model.md`). The sections below were written ahead of that because ADR-0001 and ADR-0002
> forced them: choosing an engine decides the datastores, and the datastores decide the concurrency
> and caching model. **Module boundaries, layering, data flow and security posture are still
> unwritten** and wait on `product.md` and `data-model.md`.
>
> Everything here depends on ADR-0001 and ADR-0002, both `Proposed`. **Nothing in the repo may
> depend on this document.**

---

## 1. The datastore map

| Feature | What it actually needs | Store |
|---|---|---|
| catalogue | ~6 SKUs, read-heavy, near-static | Postgres; cache the rendered page, not the query |
| product-page | 18 fixed fields (§38) + statutory | Postgres |
| **inventory** | **Atomic reservation. Kits reserve 6 components as a unit** | **Postgres, transactional. Non-negotiable** |
| cart | Short-lived, write-heavy per session | Postgres |
| checkout | Multi-step, must be idempotent | Postgres + idempotency keys |
| payments | Money, webhooks, retries, reconciliation | Postgres, append-only. Never cached |
| shipping | Rates, labels, tracking via external API | Postgres; rate lookups cached in Redis |
| orders | State machine + audit trail | Postgres, append-only event table |
| accounts | Auth, addresses, PII | Postgres; minimum PII retained |
| gifting / corporate-gifting | Bundles; B2B quote → invoice (R-19) | Postgres |
| retention | §59 "Return"; FOCUS → LEGACY progression | Postgres — purchase history is the input |
| notifications | Transactional email / SMS | Postgres **outbox table** + provider |
| policies | Static legal pages | No database |
| search | 6 SKUs + Journal + education | Postgres full-text (`tsvector`) |
| journal / tea-education | §36, §40 editorial | **Open — see R-34** |
| seo | Sitemaps, metadata | Derived. No store |
| analytics | Not yet defined | Hosted product. No warehouse |
| admin | Medusa dashboard | Same Postgres |
| *images, assets, invoices* | Binaries | Object storage + CDN |

## 2. Concurrency — the four races that cost money

Ordered by what they cost when they happen.

**1. Overselling.** Two customers, one Ritual Set. Closed by reserving stock inside a transaction
under row-level lock (`SELECT … FOR UPDATE`), never by read-then-write. A kit reserves **every**
component or fails as a unit — if the bamboo spoon is out, the kit is unavailable even with tea in
stock. Postgres runs `READ COMMITTED` by default; we take explicit row locks on the inventory path
rather than raising the isolation level globally, which would trade this race for serialisation
failures everywhere else.

**2. Double charge / double order.** A double-clicked pay button, or a gateway retrying a webhook.
Closed by **idempotency keys enforced with a unique index**. Application-level "have we seen this?"
checks are themselves a race; the database constraint is the only reliable arbiter. Every inbound
Razorpay webhook stores its event id under a unique constraint and duplicates are discarded.

**3. Out-of-order webhooks.** `captured` can arrive before `authorized`. Closed by storing every
event append-only and deriving current state, with only forward transitions legal. Never overwrite
order state from whichever webhook landed most recently.

**4. Lost cart updates.** Two browser tabs. Last-write-wins is acceptable here — this is the one
race whose cost is an annoyed customer rather than lost money or lost stock.

## 3. Performance budgets — `PROVISIONAL`

§35 requires the site to be *fast*. That is unenforceable until it has numbers, so here are numbers.

**Target device: a mid-range Android phone on Indian 4G.** Not a laptop on fibre. Every budget below
is measured on that, at the 75th percentile.

| Metric | Budget | Why |
|---|---|---|
| LCP | < 2.5 s | Core Web Vitals "good" threshold *(from memory, unverified)* |
| INP | < 200 ms | as above |
| CLS | < 0.1 | as above |
| TTFB, cached catalogue / PDP | < 500 ms | These pages are near-static; anything slower is a caching failure |
| Total page weight, PDP | < 1.5 MB | See below — this is the one most at risk |

**The real performance risk is imagery, not code.** §29 asks for close-up tea detail, steam,
pouring, texture, premium ceramics, soft natural light — a photography-led brand. Images will
dominate page weight, and §35's "fast" and §29's visual richness pull directly against each other.
Responsive sizes, modern formats and a CDN are mandatory, not optional. **Overturned by:** the first
real photography set failing the weight budget, at which point this becomes a brand conversation,
not a technical one.

## 3.1 First measurement against those budgets — 21 August, 2026

§3 has had numbers since 17 August and nothing had ever been measured against them. This is that
measurement, taken on the live site rather than a dev server, **on the device class §3 actually
names** rather than on a laptop.

**Profile:** 360 × 640 at DPR 3, Android UA, **1.6 Mbps down / 150 ms RTT / 4× CPU throttle** —
Lighthouse's mobile defaults, which stand in for the mid-range Android on Indian 4G. Single run, so
treat these as indicative rather than as a p75 distribution.

| Budget | `/` | `/shop` | PDP | Verdict |
|---|---|---|---|---|
| **LCP < 2.5 s** | 1.12 s | **2.95 s** | **2.69 s** | **FAILS on 2 of 3** |
| CLS < 0.1 | 0 | 0.017 | 0 | passes |
| TTFB < 500 ms | 205 ms | 172 ms | 170 ms | passes |
| Page weight < 1.5 MB | 432 KB | 239 KB | 201 KB | passes, and clears the **< 500 KB stretch target** |
| Web fonts < 300 KB | 85 KB | 85 KB | 95 KB | passes with room |
| Cookies < 4 KB / < 20 | 0 | 0 | 0 | passes |
| Formats | AVIF + SVG throughout | | | §7.1 honoured |

**Eight of nine lines pass, most of them comfortably.** Page weight lands at roughly a seventh of
the ceiling, and the font budget — flagged in §7 as *"the one that bites"* — is at under a third of
its allowance, which is the payoff for two OFL faces rather than a full family.

### The one failure, and its actual mechanism

LCP on `/shop` is **2.95 s**. Traced rather than guessed:

| Stage | Timing |
|---|---|
| LCP image request starts | 279 ms |
| Server responds | +64 ms |
| **Download** | **+2,145 ms** |
| Complete | 2,488 ms |

The image is **78 KB**. The download of 78 KB taking 2.1 s is the whole story, and the cause is
visible in the waterfall: **two further product images begin downloading at 778 ms, while the LCP
image is still in flight**, and all three then share a 1.6 Mbps pipe.

Confirmed *not* to be the cause, each checked rather than assumed:

- **`priority` is working.** The HTML carries a correct `<link rel="preload" as="image">` with a full
  `imageSrcSet` and `imageSizes` for the LCP image.
- **The other images are correctly marked `loading="lazy"`.** They start early anyway, because
  Chrome's lazy-load viewport distance is deliberately generous on slow connections — so `lazy` is
  not a bandwidth guarantee on exactly the network this budget targets.
- Quality is already the `q=75` default, not the hero's 95.

**The lever is resolution, not code.** On a 360 px viewport at DPR 3 the browser picks the 1080–1200
px candidate, which is honest for that display and expensive on that network. Capping the effective
DPR for card imagery — serving nearer 2× than 3× — roughly halves the LCP payload and is the
smallest change that moves this. **That is a visual-quality trade and is not made here.**

### One honest caveat about the row that passes

`/` records **1.12 s, and it is flattering.** Its LCP element is a **paragraph**, not the hero
photograph — the headline paints quickly and the imagery fills in behind it. The page is not
genuinely twice as fast as the other two; the metric is landing on cheaper content. Do not read the
home figure as headroom.

**Re-measure after any change to imagery, and after the first real photography set** — §3 already
says that set is what tests the budget, and these numbers are the baseline it will be tested against.

---

## 4. Caching — read path and write path

The whole strategy in one line: **the read path scales by caching; the write path scales by not
needing to.**

**Read path** — catalogue, PDP, Journal, Our Story. Near-static, changes rarely, hit by everyone.
Cached at the edge with tag-based invalidation when a product or article changes. A festive spike
(§44) or a brand-film launch (§43) should land on the CDN and never reach Postgres.

**Write path** — cart, checkout, payment, order. Per-user, never cached, correctness over speed.
Even during a spike this is low volume: many thousands of people can browse while a handful check
out. Optimise it for being *right*.

**Redis** — Medusa's cache, event bus and workflow engine, plus rate limiting and shipping-rate
lookups. Per ADR-0002, authoritative for nothing.

## 5. Scaling triggers

Nothing here gets added before its trigger fires. Adding early is the more common failure.

| Add | Trigger |
|---|---|
| Connection pooling (PgBouncer) | Server + worker + storefront connection count approaching Postgres `max_connections` |
| Postgres read replica | Read load measurably contending with writes |
| Search index | Catalogue past ~500 items, or content search generating real complaints |
| Analytics warehouse | Analytical queries measurably slowing the transactional database |
| Horizontal app scaling | Sustained CPU saturation on the Node process — note the worker already runs separately in production |

Realistic launch load for a premium tea brand is hundreds of orders a month. Postgres on a modest
instance handles orders of magnitude more. **The risk is spikes, not volume** — and spikes are
answered by the cache, not the database.

## 6. Durability

With money in the database and one developer, this is not a footnote.

- Point-in-time recovery on Postgres, retention **PROVISIONAL** at 30 days.
- **A restore must be tested before launch.** An untested backup is not a backup, and there is no
  second person who will discover this for us.
- Redis needs no backup by construction — ADR-0002 requires that losing it costs only performance.
- Object storage versioned, so a bad overwrite of product photography is recoverable.

## 7. Frontend delivery budget — `PROVISIONAL`

§3 sets outcome budgets (LCP, INP, CLS). These are the delivery constraints that produce them, so a
failure is diagnosable rather than just observable. Numbers adapted from the roadmap.sh frontend
performance checklist; the *applies-here* column is ours.

| Constraint | Budget | Applies here because |
|---|---|---|
| Total page weight | **< 1.5 MB**, target < 500 KB | Already in §3. The binding constraint on a photography-led brand |
| Time to first byte | **< 1.3 s** | Tighter than §3's 500 ms only for uncached routes; cached catalogue/PDP keeps the 500 ms figure |
| **Total web-font payload** | **< 300 KB** | **This is the one that bites.** `design-system.md` wants a high-contrast display serif; four weights of one easily exceeds this alone |
| Cookies | < 4 KB total, < 20 count | Every cookie rides on every request. Analytics and consent tooling is how this budget gets spent without anyone deciding to |
| Compression | Brotli, GZIP fallback | Free |
| JavaScript | `async`/`defer`, minified, non-blocking | |
| CSS | Critical CSS inlined, rest non-blocking, unused removed | |
| Images | **WebP baseline, AVIF where negotiable, SVG for anything vector** — sized near display size, `width`/`height` always set, offscreen lazy-loaded, never Base64. See §7.1 | `width`/`height` is what holds §3's CLS < 0.1; format is what holds the 1.5 MB page weight |
| Fonts | WOFF2 only, `preconnect`, `font-display` set so text is never invisible | A flash of invisible text on a brand statement is a brand failure, not only a performance one |

**Font budget is a design constraint, not a technical one.** `design-system.md` already flags that
its unchosen display serif must be weighed against §35's "fast". 300 KB is the number that flag
resolves against: it typically permits **two weights of a display serif plus two of a text face**,
not a full family. Record the chosen faces and their real payload as an ADR.

### 7.1 Image formats — decided

**Every photographic asset ships as WebP.** JPEG and PNG are not served to browsers that can take
WebP, which at this point is all of them. This is the single largest lever on §3's 1.5 MB page-weight
budget, because §29's photography-led direction means images dominate the page and nothing else on
the budget is close.

| Content | Format | Why |
|---|---|---|
| Product and editorial photography | **WebP** — quality ~80, responsive `srcset` | Baseline. Typically 25–35% smaller than equivalent JPEG |
| Same, where the pipeline can negotiate | **AVIF**, with WebP fallback | Smaller again, but slower to encode and marginally less universal. A bonus, never the only format |
| **The logo, and any icon or rule** | **SVG** | Already vector (`design-system.md` §1.1), 110 KB, no font dependency. Rasterising it to WebP throws away infinite scaling *and* usually costs more bytes at hero size |
| Anything needing transparency at photo quality | WebP | It does alpha; JPEG does not. This is why PNG is not the fallback for cut-outs |
| Source masters | Whatever the photographer delivers | Never served. Derivatives are generated; originals stay in object storage |

**Rules.** Never hand-convert — format and size derivatives come from the image pipeline so the
originals stay untouched and re-processable. Always `srcset` with real widths so a 360 px phone
never downloads a 1440 px file; §4's mobile-first baseline makes that the common case, not the edge
case. Never Base64-inline a photograph. Set `width`/`height` on every `<img>` regardless of format —
that is a layout-stability rule and is unrelated to bytes.

**Not yet decided:** which pipeline generates the derivatives. `tech-stack.md` §7 carries Cloudflare
Images as `PROVISIONAL` with a **hard free-tier transformation cap** — a cap, not an overage, so it
fails closed. That row must be costed against the real asset count before launch.

Measure with Lighthouse and PageSpeed Insights on the §3 target device, WebPageTest for a real
Indian network profile, and Bundlephobia before adding any frontend dependency.

## 8. Backend operational practices

Most of the standard backend performance checklist is already answered above — caching in §4,
connection pooling and replicas in §5, indexes and query shape implied by §1. What follows is the
part that is not, plus the parts we are deliberately **not** doing.

**Applies now:**

- **Deploy in an Indian region.** Launch is India-only (R-23), so hosting the app and Postgres in
  `ap-south-1`/Mumbai or equivalent removes a round-trip nobody can optimise away later. This is a
  concrete input to R-32, which is still unresearched.
  > **Half-honoured as of 5 September 2026, deliberately.** The application is in Mumbai (`bom1`);
  > **the database is in Sydney** — [ADR-0009](adr/0009-database-region-sydney.md). The sentence
  > above stays because its reasoning is correct: that round-trip genuinely cannot be optimised
  > away, and we are now paying it on purpose. The practical consequence is that §4's caching stops
  > being a nicety for the read path, and that the write path (cart, checkout, reservation) carries
  > the full cost with no mitigation available. Measured latency and the accepted trade are in
  > ADR-0009; the reversal trigger is **the first real order**.
- **Pagination and payload limits on every list endpoint**, from the first one. Retrofitting
  pagination after a client depends on an unbounded list is a breaking change.
- **Never `SELECT *`** on the order and payment paths — fetch the columns needed. These tables are
  append-only and will be the widest in the schema.
- **Slow-query logging on from day one.** It costs nothing and is the only way the first real
  performance problem gets diagnosed rather than guessed at.
- **Background jobs for anything not owed to the customer synchronously** — email, invoice
  generation, webhook fan-out. Medusa's worker process already exists per ADR-0001; the outbox table
  in §1 is the mechanism.
- **Timeouts and bounded retries on every external call** — Razorpay, courier APIs, email. A retry
  without a cap and without idempotency turns a slow dependency into a double charge; §2's
  idempotency keys are what make retries safe.
- **Rate limiting** on auth, checkout and any public form. Redis is already in the stack for it.
- **Dependencies kept current**, per the `conventions.md` Dependencies checklist.

**Deliberately not doing, at this scale:**

| Practice | Why not |
|---|---|
| Database sharding | Six SKUs and hundreds of orders a month. Sharding solves a problem we will never have |
| Read replicas, denormalisation | Already in §5 as *triggered* additions. Adding either now buys complexity and no speed |
| Microservices / service decomposition | One developer, no CI. A distributed system multiplies the failure modes of the thing §5 says is not under load |
| Go or Rust for hot paths | There are no hot paths. This is a catalogue and a checkout |
| Self-hosted Prometheus / Grafana / ELK | Real operational cost for one person. **Instead:** a hosted error tracker plus whatever the deploy platform gives — that is the monitoring budget until something demands more |
| Message broker | Postgres-backed jobs are sufficient at this volume, and are one fewer system to run |

**Monitoring that is actually required before launch:** uncaught errors reaching a place a human
sees, payment webhook failures alerting loudly, and stock-reservation failures logged with enough
context to reconstruct the race. Nothing else is worth the setup cost yet. Logging follows
`conventions.md` — structured, one event per line, never in a hot loop, never carrying secrets or
personal data.

**Performance testing** is a pre-launch checkpoint, not a habit yet: run the §3 budgets against a
real build with real photography before going live. That is also the moment R-37's regression gap
gets its first real test.

## 9. Design and architecture patterns — what applies at this scale

The standard software-design roadmap is a menu, not a checklist, and most of it is a trap for a
six-SKU store with one developer. Recorded here so the question is settled rather than re-litigated.

**Adopt:**

- **YAGNI, DRY, composition over inheritance, small focused units.** Already enforced by
  `conventions.md` — no abstraction for a second caller that does not exist.
- **Boundaries, coupling and cohesion.** `conventions.md` already requires directories grouped by
  capability with one entry point each. That *is* the architectural principle applied.
- **Repository/mapper thinking at exactly one seam** — our own thin interface over Razorpay, per the
  Dependencies checklist's exit-cost question and R-33, which makes that provider ours to maintain.
- **Value objects for money and quantity.** Prices are rupees at ₹999–₹4,999 with GST on top; a
  bare `number` for money is how rounding errors ship. `conventions.md` already requires the unit in
  the name — this is the type-level version.
- **Append-only events for order state.** Already decided in §2, and the correct scope for it.

**Do not adopt:**

- **Full DDD with bounded contexts, CQRS, or event sourcing as an architecture.** The global
  `~/CLAUDE.md` suggests these as defaults; they are wrong here and this is the deliberate
  deviation `conventions.md` requires be documented. Medusa already imposes a domain model, and
  layering a second one on top means maintaining two. §2's append-only order events are event
  *logging* for a specific correctness reason, not event sourcing as a system-wide pattern.
- **Design patterns applied speculatively.** A pattern earns its place by removing a duplication
  that already exists twice.
- **A layered architecture invented on top of the framework's.** Fighting Medusa's structure costs
  more than accepting it; where we disagree with it, that is an ADR, not a quiet parallel layer.

## 10. Not covered yet — **part-closed 27 August 2026**

> **What ADR-0006 and the first build settled**, recorded here because §1 and this section were
> written for a Medusa world that no longer exists:
>
> - **Module map, as built.** One application. `lib/server/` is the domain layer —
>   `db/` (schema + the single Drizzle client over the transaction pooler), `inventory/`
>   (availability, reserve/consume/release/adjust), `cart/`, `orders/` (placement + the state
>   fold, and since 9 Sep 2026 `events.ts`, the appender that enforces the fold on write).
>   Next.js Route Handlers (`app/api/*`) are the only HTTP surface for the storefront; pages
>   import `lib/catalogue.ts`, which is the commerce boundary and the only module pages may touch.
>   **Dependency direction: pages → catalogue/API → lib/server → db. Nothing imports upward.**
> - **Admin, as built 2–9 Sep 2026** (ADR-0008, ADR-0012). `lib/server/auth/` is identity and
>   sessions; `lib/server/admin/` is the admin's domain — `audit.ts` (`auditedMutation`, the
>   structural audit rule), `refusal.ts` (domain errors as sentences, stale detection),
>   `inventory.ts`, `products.ts`, `orders.ts`, `customers.ts`, `users.ts`, `audit-log.ts`,
>   `worklist.ts`. Screens under `app/admin/` are server components with server-action forms
>   and import these modules directly — no HTTP hop, no client bundle. Two guards only:
>   `proxy.ts` (token) and `lib/server/auth/session.ts` (row, role). **Direction: admin pages →
>   lib/server/admin → lib/server/{inventory,orders,auth} → db.**
> - **§1 corrections.** The "admin: Medusa dashboard" row is void — there is no admin
>   (ADR-0006). The shipping row's "rate lookups cached in Redis" is void — **no Redis exists
>   anywhere in the system**; ADR-0002's amendment already said nothing requires it, and nothing
>   built uses it.
> - **§2 status.** Races 1 and 2 are no longer design intent — they are **closed and test-proven**
>   (race 1: inventory race test 12/12; race 2: checkout test 28/28, both idempotency paths).
>   Race 3's fold is implemented with its full transition table; its webhook caller arrives with
>   payments. Race 4 accepted as designed.
> - **Data flow, critical path (purchase):** page → `POST /api/cart/lines` → `POST /api/checkout`
>   → one transaction (order + lines + `reserveForOrder` + cart completed + `placed` event).
>   All server-side; the browser never holds commerce state beyond the httpOnly cart cookie.
> - **Secrets, as built:** `DATABASE_URL` in `.env` (gitignored) locally and
>   Vercel env vars in deployment. RLS deny-all on all 15 tables; the anon key reads nothing.
>
> **Still genuinely uncovered:** security posture beyond RLS (rate limiting on the API routes,
> CSRF posture for the mutating handlers), auth and session handling (lands with the accounts
> phase), and the storefront rendering strategy for post-cart surfaces. §8's monitoring gaps
> stand.

Module boundaries and layering, data flow between storefront and Medusa, security posture,
authentication and session handling, secrets management, and the storefront's rendering strategy.
These wait on `product.md` and `data-model.md`, and this document should not be treated as complete
until they land. §8 closes the monitoring, rate-limiting and error-tracking gaps at the level of
*what is required*; the specifics still belong to the security posture section that has not been
written.
