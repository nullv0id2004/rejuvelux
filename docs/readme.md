# docs/ — Index and Ground Rules

Every guiding document for RejuveLuxe lives here. This file says what each one owns, which
one wins when two disagree, when each must be updated, and **the order they get written in**.

---

## 1. Privacy — **rule SUSPENDED 27 August 2026, reversion planned**

> **Sayon suspended this section's rule for the duration of the build: `docs/` is tracked in
> the main repository** so other developers get the full suite with a clone. **This is
> temporary.** At end of project the suite comes off GitHub and returns to local-only, restored
> to its pre-27-Aug arrangement. The rule below the line is therefore not historical — it is
> the rule this section returns to.
>
> **The reversion, written down now so it can actually be executed then (R-67):**
>
> 1. Re-add `docs/` to `.gitignore` and `git rm -r --cached docs/`; commit. The suite leaves
>    the tip and every future clone.
> 2. **The hard caveat, stated in advance:** that removes `docs/` from the *tip only*. Every
>    commit pushed between 27 Aug and reversion day still contains the suite in the remote's
>    history. Truly erasing it from GitHub means a **history rewrite** (`git filter-repo` on
>    every path under `docs/`) plus a force-push of `main` — which `contributing.md` forbids
>    without an explicit decision. **Decide on reversion day which of the two is wanted**;
>    the repo being private makes tip-removal defensible, but that is a call, not a default.
> 3. Restore the nested repository: move `Money_projects/rejuvelux-docs-history.git` back to
>    `docs/.git`, then commit the then-current state of the suite onto it as one commit
>    ("re-absorb the tracked-period changes"). The interim outer-repo commits remain the
>    fine-grained record of the period; the nested repo resumes from the result.
> 4. Restore this section's rule, `.gitignore`'s docs block, and `CLAUDE.md`'s three privacy
>    clauses to their pre-27-Aug wording (all three are quoted in the 27 Aug work_done entry).
> 5. Verify the five SHA-256 baselines still pass, and close R-67.
>
> What the suspension changes and does not change, meanwhile:
>
> - The nested `docs/.git` repository is **retired**. Its 36 commits are preserved outside the
>   repo at `Money_projects/rejuvelux-docs-history.bundle` (verified complete) and
>   `rejuvelux-docs-history.git`. Doc edits now commit to the outer repo like any other change.
> - The GitHub repository remains **private**; "published" means visible to invited developers,
>   not to the world.
> - `brief.md` stays immutable, `base.md` stays additive-only, and the SHA-256 baselines stay
>   in force as tripwires — git history records damage, the baselines notice it.
> - **Sensitive material belongs in `docs/` only** — never in code, config, comments or commit
>   messages. Actual secrets (credentials, keys) belong in `.env*`, which stays gitignored;
>   they never go in `docs/` either. Scanned before first commit: no credential-shaped content
>   anywhere in the suite.
> - "Publishing a document" no longer means moving it out of `docs/`; the whole suite ships —
>   for the duration of the suspension.

---

*The standing rule, suspended 27 August 2026, restored at end of project:*

`docs/` is **private by default**. Everything under it is gitignored and never pushed.

Public engineering process — agent rules, git workflow, ADRs — lives *outside* `docs/` in the
tracked repo. `docs/` holds private strategy and specification. Do not mix the two.

There is deliberately **no allow-list**. Publishing a document means moving it *out* of `docs/`
as a considered act — not adding a line that is easy to add and easy to forget.

> **State, 17 August 2026:** `.gitignore` now ignores `docs/` wholesale. `docs/conventions.md`
> and `docs/adr/readme.md` were untracked with `git rm --cached` — **staged, not committed**, so
> both remain in `origin/main` until that deletion is committed and pushed. **The GitHub repo is
> private** (`gh repo view` → `isPrivate: true`), so this is untidiness rather than a leak. Git
> history retains them regardless; this stops future publication, it does not un-publish.
>
> **`docs/` is its own git repository** (`docs/.git`, first commit 17 Aug 2026). The outer repo
> ignores `docs/` wholesale and git does not recurse into a nested repo, so the two never interact
> and nothing here can reach the public remote by accident. This is the restore point the SHA-256
> baselines could only ever detect the absence of. **It has no remote** — an off-machine backup is
> still an open question.
>
> Note that root `CLAUDE.md` (public) references `docs/conventions.md` and `docs/adr/` — paths
> that are now private. The references are still correct locally; a reader of the public repo
> will not be able to follow them.

---

## 2. Reading order, starting cold

Someone joining this project reads, in this order:

1. `brief.md` — what the client actually said
2. `base.md` — what that means, and where it is unconfirmed
3. `risks.md` — what is currently blocking, and who owns each blocker
4. `product.md` — what we are building
5. `roadmap.md` — in what order
6. The relevant `features/*.md` for the task at hand

`CLAUDE.md` and `contributing.md` (repo root) are read separately and govern *how* work happens,
not *what* is being built.

---

## 3. The index

| Doc | Owns | Wins on | Update trigger |
|---|---|---|---|
| `brief.md` | The client's words, verbatim | Any dispute about what was actually specified | **Never.** Immutable. New source material becomes a new file. |
| `base.md` | Analysis of the brief; what is inference vs. fact | What the brand means and what is unconfirmed | New agreed analysis. **Additive only** — never rewritten. Re-record `.base.md.sha256` after each change. |
| `readme.md` | This index; doc ownership; build order | Which doc owns a topic | Any doc added, retired, or completed |
| `product.md` | Scope, users, sitemap, pages, flows, states | What the product does and does not do | Any scope change |
| `data-model.md` | Entities, fields, relationships, lifecycle states | The shape of data anywhere | Any entity or field change |
| `tech-stack.md` | Technology choices and their rationale | Which technology we use | A stack decision. Mirrors an ADR; the ADR is binding. |
| `architecture.md` | Module boundaries, caching, performance budgets, security | How the system is put together | Any structural change |
| `conventions.md` | Code style, testing, definition of done | How code is written | A convention decision, or a stack decision that fills a `TODO(stack)` |
| `design-system.md` | Palette, type, spacing, components, motion, imagery | Any visual question | A design decision |
| `content-style.md` | Voice, approved lines, banned words, claim safety, typography rules (§7.1 bans em and en dashes), page titles (§8) | Any wording question | A copy or claims decision |
| `compliance.md` | Indian statutory obligations and the surface satisfying each | **What the law requires.** Not page copy, not artwork, not mechanism | A new obligation, a professional's confirmation, or any change to entity, product category or market |
| `open-calls.md` | Decisions the build made **without input**, pending review | Nothing — it defers to every doc above | Any call made under a no-input instruction. Rows are retired as they are ratified or overturned. |
| `risks.md` | Blockers, unconfirmed facts, open decisions | Whether something is safe to ship | **Any doc surfacing an unknown.** Every doc feeds this one. |
| `roadmap.md` | Build order, phases, in/out of scope per phase | What we work on next | Phase change, or scope moving between phases |
| `work_done.md` | History of completed work | What was done, when, and why | **Every session that completes work.** |
| `features/*.md` | One feature each, end to end | That feature's behaviour and edge cases | Any change to that feature |
| `adr/*.md` | Decisions expensive to reverse | Architecture, stack, persistence — **binding over every doc above** | A decision that is hard to undo |

---

## 4. Conflict protocol

If two documents disagree, **stop and flag it**. Do not silently pick a winner.

The one exception: an `Accepted` ADR is binding and overrides any doc that contradicts it. If a
doc contradicts an accepted ADR, the doc is wrong and gets corrected — the ADR does not.

---

## 5. Standing rules

- **Never invent real-world facts.** Sourcing, pricing, certifications, health and legal claims,
  partnerships. If `brief.md` does not state it, it goes to `risks.md` as UNCONFIRMED with what
  would resolve it. We decide the *system*; we never invent the *facts*.
- **Cite the source.** Anything traceable to the brief cites `§n`. Anything else is labelled
  **inference** or **recommendation** so the line between known and reasoned stays visible.
- **Decide, marked PROVISIONAL.** Where a technical choice is unmade, make it — concrete values,
  concrete specs — so the docs are buildable. Tag it `PROVISIONAL` with the alternatives rejected
  and what would overturn it.
- **No placeholders.** A section that would say "TBD" is a signal to ask a question, not to write
  "TBD".
- **"Update the docs" means both.** The forward-looking doc *and* `work_done.md`. Never one alone.
- **Read before building.** The suite is analysed before code is written, and re-read when its
  topic comes up.

---

## 6. Build order

Nothing is written before the doc that defines its scope. Anything needing an external decision
surfaces as early as it can usefully be asked.

Status: `done` · `in progress` · `blocked` · `todo`

### Stage 1 — Foundation *(no decisions needed)*

| # | Item | Status | Why first |
|---|---|---|---|
| 1 | `brief.md` — paste verbatim | **done** | Everything cites `§n`; nothing can cite a file that does not exist |
| 2 | Canonicalise `base.md` | **done** | `base.concise.md` moved to `docs/archive/`; `base.md` is canonical |
| 3 | `.gitignore` — remove allow-list | **done** | `docs/` now ignored wholesale; `conventions.md` and `adr/readme.md` untracked via `git rm --cached` (staged, **not committed, not pushed**) |
| 4 | `readme.md` | **done** | This file |
| 5 | `work_done.md` — format header | **done** | Format header + first entries in place |

### Stage 2 — Known constraints *(no new decisions)*

| # | Item | Status | Why here |
|---|---|---|---|
| 6 | `risks.md` | **done** | Pulls base.md §8–9 blockers into a tracked list. Must exist before other docs so they have somewhere to send unknowns. **Its output is a list for other people — long lead times, start chasing immediately.** |
| 7 | `content-style.md` | **done** | Derivable from §6/§19/§20/§45–47. Independent of stack and product; governs copy in every doc below |

### Stage 3 — Definition spine

| # | Item | Status | Why here |
|---|---|---|---|
| 8 | `product.md` | **done — `PROVISIONAL`** | Written 17 Aug 2026, 326 lines: scope in/out, explicit non-goals, four users, sitemap + URL scheme, page specs, flows, state inventory. **Scope calls are this document's, not the client's**, and eight items in its section 7 wait on `risks.md`. Unblocks items 9, 10 and every feature doc |
| 9 | `roadmap.md` — provisional pass | todo | Rough phasing, to decide which feature docs matter first |
| **9a** | **`compliance.md`** | **done — `researched`, needs professionals** | Inserted 18 Aug 2026, **ahead of `data-model.md` deliberately.** Statutory obligation had no owner in this suite, so ~74 researched Indian requirements were stranded in `work_done.md` — a history file. Several duties are schema-shaped and cannot be retrofitted: DPDP consent records, GST invoice numbering, per-batch expiry for FSSAI residual shelf life. Every row carries a confidence marker; nothing here is settled by the doc existing |
| 10 | `data-model.md` | **done — `PROVISIONAL`**, 26 Aug 2026 | Entities fall out of product.md's flows. Gates every feature doc's data section. **[ADR-0006](adr/0006-write-the-commerce-domain.md) is what unblocks it**: the commerce domain is ours, on Supabase PostgreSQL with Drizzle. The kit question is answered by algorithm rather than by a vendor's entity — availability is `min(floor(available / required_quantity))` across components, ported from Medusa's MIT source, so a kit is a link table carrying `required_quantity`, **not** a bespoke composite entity and **not** a Medusa Inventory Kit. `compliance.md` §3, §5, §6 and §8 describe four obligations that land as fields; **three of them (R-41, R-43, R-45) are deliberately deferred out of the first pass** — see the note at the end of `risks.md` §4 |

### Stage 4 — Requires a decision from Sayon

| # | Item | Status | Why here |
|---|---|---|---|
| 11 | `tech-stack.md` → ~~ADR-0001~~ **ADR-0003 + ADR-0006** | **done — `Accepted`**, 18 + 26 Aug 2026 | ADR-0001 was `Rejected`, not accepted; the stack question resolved through ADR-0003 (Vercel/Next.js/Supabase, by Sayon) and ADR-0006 (commerce domain ours, Drizzle, single app, Medusa's MIT source as reference). `tech-stack.md` §2 carries the as-built table, 27 Aug |
| 12 | `conventions.md` — fill 14 `TODO(stack)` | **unblocked 26 Aug 2026, waiting on Sayon** | The stack the TODOs waited on now exists. `conventions.md` is an ask-first file (`CLAUDE.md`), so filling it needs an explicit go-ahead. One answer already exists in practice: the check command is `npx tsc --noEmit && npm run lint && npm run build` at the repo root (readme, Development) |
| 13 | `architecture.md` | **partial** — persistence, concurrency, performance, scaling written 17 Aug 2026; **module map, data flow and secrets added 27 Aug 2026** (§10) | Races 1–2 are now test-proven, not just designed. Still open: security posture beyond RLS, auth/session (accounts phase), monitoring |

### Stage 5 — Design *(runs parallel to Stage 4)*

| # | Item | Status | Why here |
|---|---|---|---|
| 14 | `features/accessibility.md` | **done — `PROVISIONAL`**, 1 Sep 2026 | **Before** design-system — the conformance target sets contrast ratios and focus-state rules that constrain the palette. Writing it later means retrofitting. **It was written later**, two items out of order, when ADR-0007 re-opened the ground colour and the required contrast audit had no target to measure against. Sets **WCAG 2.2 AA** as a product standard and explicitly asserts nothing about the law (`compliance.md` carries no accessibility obligation at all — **R-70**). Its §3 is what the audit in `design-system.md` §2.3 ran against, and that audit then vetoed the palette change — the ordering rule earning its keep late rather than not at all |
| 15 | `design-system.md` | **done** | Assigns roles and proportions to §28's eight colours ("a list of eight colours is not yet a system"). Unblocks every UI feature doc |

### Stage 6 — Commerce spine *(strict order — each references the one before)*

> **Order note, 27 Aug 2026:** the build ran 18 → 19 → 20 ahead of 16–17, deliberately —
> hardest-correctness-first, per ADR-0006's phasing. The "strict order" held for what was built;
> the two skipped docs cover surfaces that already ship and should be written before the UI pass
> touches them.

| # | Item | Status | Note |
|---|---|---|---|
| 16 | `features/catalogue.md` | todo | Three-expression architecture; Green Tea held separate from the heroes. **The catalogue itself is built** (DB-served via `lib/catalogue.ts`); this doc still owed before the UI pass |
| 17 | `features/product-page.md` | todo | Most pre-specified doc in the suite — §38 lists its fields outright. PDP ships; doc owed |
| 18 | `features/inventory.md` | **done — `PROVISIONAL`**, 27 Aug 2026 | Written before its code. Kit availability + reservation under lock **built and race-tested 12/12** |
| 19 | `features/cart.md` | **done — `PROVISIONAL`**, 27 Aug 2026 | Domain + HTTP API built, **19/19 over HTTP**. Cart UI deliberately deferred (backend-first) |
| 20 | `features/checkout.md` | **done — `PROVISIONAL`**, 27 Aug 2026 | Placement transaction built, **28/28** incl. both idempotency paths. Payment seam marked (§2.4) |
| 21 | `features/payments.md` | todo — **next in the spine** | Blocked on Razorpay account/keys (Sayon, 27 Aug). The state fold and `consume`/`release` already exist and are its callers' contract |
| 22 | `features/shipping.md` | todo | **Now load-bearing:** checkout charges `shipping_paise = 0 PROVISIONAL` until this doc decides the real rate (R-65) |
| 23 | `features/orders.md` | todo | Last of the spine — its lifecycle is what notifications, policies and admin hang off. The event fold it will document already runs |

### Stage 7 — Everything else

| # | Item | Status | Note |
|---|---|---|---|
| 24 | `features/accounts.md` | todo | |
| 25 | `features/gifting.md` | todo | Business pillar (§32), not a seasonal add-on |
| 26 | `features/corporate-gifting.md` | todo | Named a pillar in §2 but undeveloped in the brief — expect more risks.md rows than answers |
| 27 | `features/retention.md` | todo | §59's Return stage, the weakest link. Must solve replenishment without discounts (§49) |
| 28 | `features/notifications.md` | todo | Needs orders + accounts |
| 29 | `features/policies.md` | todo | Needs shipping, returns and payments settled |
| 30 | `features/search.md` | todo | |
| 31 | `features/journal.md` | todo | |
| 32 | `features/tea-education.md` | todo | §33/§40; ties to the Matcha Ritual Set |
| 33 | `features/seo.md` | todo | URL scheme is decided in product.md; this documents the rest |
| 34 | `features/analytics.md` | todo | What is measured depends on the features above |
| 35 | `features/admin.md` | **done — `PROVISIONAL`**, 2 Sep 2026. **Built, all six stages, 9 Sep 2026** — §11 of the doc is the as-built record | **This row's every claim expired.** It said the admin was last and deprioritised, that Medusa would ship one regardless, and that the doc would cover *customising* rather than building. ADR-0003/0006 removed Medusa, so **nothing ships an admin**; the storefront that justified deferring it has shipped; and [ADR-0008](adr/0008-admin-for-a-client-team.md) resolved **R-22** — a non-technical client team operates it. The doc specifies a build in six stages, and stages 2 and 3 are ordered to close **R-66** (invented stock) and **R-04** (unconfirmed price) first |

### Stage 8 — Close the loop

| # | Item | Status | Why last |
|---|---|---|---|
| 36 | `roadmap.md` — final pass | todo | Real sequencing is only possible once every feature's scope and dependencies are known |

### Continuous

- `work_done.md` — updated every session that completes work
- `risks.md` — updated by every doc that surfaces an unknown

---

## 7. Known bottlenecks

| Bottleneck | Item | Blocked on |
|---|---|---|
| ~~Stack undecided~~ **RESOLVED 26–27 Aug 2026** | 11 | ADR-0003 + ADR-0006 (`Accepted`) settle language, persistence, access layer, app shape and deploy. **The `TODO(stack)` markers are now fillable and still unfilled** — `conventions.md` and `CLAUDE.md` are ask-first files, so filling them needs Sayon's go-ahead (item 12) |
| Launch-blocking brand facts | 6 | Third parties — supplier verification, origin-term validation, legal review, price confirmation. Weeks of lead time; unblocked only by asking now |
| Operating model | 35 | Undecided: whether a non-technical team manages content and orders, or every change ships through the repo |
