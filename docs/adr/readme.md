# Architecture Decision Records

An ADR records **a decision that is expensive to reverse**, and — more importantly — the
alternatives that were rejected, so nobody (human or agent) re-litigates them six months later.

An ADR is not a design doc, not a spec, and not a status update. One page, maximum.

## When an ADR is required

Write one before merging code that commits to any of these:

- Choosing or replacing a language, runtime, framework, database, or hosting/deploy target.
- Adding a dependency that would be painful to rip out later (owns your data model, your auth,
  your build, or your deploy).
  <!-- TODO(stack): define the concrete threshold once a package manager exists — e.g. "any direct dependency that appears in the lockfile and is imported outside a single adapter module". -->
- Persistence and data-model boundaries: what is stored, where, and in what shape.
- Anything touching authentication, authorization, secrets handling, or user data retention.
- A public interface others will depend on: URL/route shape, API contract, CLI surface, file formats.
- Deliberately deviating from an already-accepted ADR.
- Deciding **not** to do something obvious, when the question will otherwise keep coming back.

Rule of thumb: if "why is it like this?" would take more than five minutes to reconstruct from the
code in six months, it needs an ADR.

## When an ADR is overkill

- Anything one person can reverse in under a day.
- File layout, naming, formatting, directory structure.
- Implementation details behind a single call site.
- Work that merely *executes* an already-accepted ADR — that is implementation, not a decision.
- "I tried X and it didn't work" — that belongs in the commit message or PR description.

When in doubt, do not write one. A directory of thirty ADRs is a directory nobody reads.

## Where they live and how they are numbered

- Location: `docs/adr/`. This README is the index; it is never itself an ADR.
- Filename: `NNNN-kebab-case-title.md` — e.g. `0002-primary-datastore.md`.
- `NNNN` is zero-padded, monotonic, and **never reused**, not even for a rejected or deleted ADR.
  The next number is one higher than the highest in the index table, including reserved rows.
- A number may be reserved in the index before the file exists (see ADR-0001). The index table is
  the source of truth for what numbers are taken.
- ADRs are referenced as `ADR-0007` in commit messages, code comments, and other ADRs.

## Lifecycle

| Status | Meaning |
| --- | --- |
| `Open` | Number reserved; the decision is known to be needed but has not been made. No file required yet. |
| `Proposed` | Written down, not yet committed to. Nothing in the codebase may depend on it. |
| `Accepted` | Binding. Code may rely on it. |
| `Rejected` | Considered and declined. Keep the file — the reasoning is the whole point. |
| `Superseded by ADR-NNNN` | Replaced. Keep the file; add the pointer at the top. |

Rules:

- **Accepted text is immutable.** Changed your mind? Write a new ADR and mark the old one
  superseded. Only typos, broken links, and status lines may be edited in place.
- **Superseding ADRs must name what they replace** and say what changed since — the new ADR's
  Context section carries that, not a diff of the old file.
- **Sleep on it once.** With one developer, the delay *is* the review. An ADR may go `Proposed` →
  `Accepted` in the session it was drafted only if the decision is reversible in under a week.
  Anything heavier waits until the next working session. A night is cheaper than a migration.
- Update the index table in the same commit that adds or re-statuses an ADR.
  <!-- TODO(stack): once a task runner / CI exists, add a check that every docs/adr/NNNN-*.md file has a matching index row and status, and fail the build on drift. Until then this is manual. -->

## Index

| ADR | Title | Status | Date |
| --- | --- | --- | --- |
| [0001](0001-tech-stack.md) | Tech stack — TypeScript, Medusa, PostgreSQL, Next.js | **`Rejected`** — see ADR-0003 | 2026-08-17 |
| [0002](0002-persistence.md) | Persistence — one relational store, plus operational Redis | `Proposed` — **partly void**, Redis withdrawn by ADR-0003 | 2026-08-17 |
| [0003](0003-vercel-native-deployment.md) | Vercel-native deployment; Medusa withdrawn | **`Accepted`** | 2026-08-18 |
| [0004](0004-commerce-domain.md) | Commerce domain — buy it, do not write it (Shopify headless) | **`Rejected`** — see ADR-0006 | 2026-08-18 |
| [0005](0005-motion-stack.md) | Motion stack — GSAP + ScrollTrigger and Lenis | `Proposed` — blocked on open-calls #20 (contradicts `design-system.md` §6) | 2026-08-21 |
| [0006](0006-write-the-commerce-domain.md) | Write the commerce domain, with Medusa's MIT source as the reference | **`Accepted`** | 2026-08-26 |
| [0007](0007-visual-direction-change.md) | Change the visual direction toward the reference tier | **`Superseded by ADR-0011`** — was `Accepted` items 1–4 on 2026-09-02; this row read `Proposed` until 6 Sep, four days adrift of the file | 2026-09-01 |
| [0008](0008-admin-for-a-client-team.md) | Build an admin for a non-technical client team | **`Accepted`** — resolves R-22 | 2026-09-02 |
| [0009](0009-database-region-sydney.md) | The database lives in Sydney, not Mumbai | **`Accepted`** — amends ADR-0003's region row; closes R-73 | 2026-09-05 |
| [0010](0010-single-flat-repository.md) | One flat repository, and `rejuvelux_old` is kept as provenance | **`Accepted`** — amends ADR-0006 and ADR-0008 path rows only | 2026-09-06 |
| [0011](0011-superseded-visual-direction.md) | The Claude Design frontend supersedes the visual direction, and its palette was audited | **`Accepted`** — supersedes ADR-0007; raises R-75 | 2026-09-06 |
| [0012](0012-self-built-auth.md) | Write authentication ourselves, with KORUM's mechanism as the reference | **`Accepted`** — supersedes ADR-0008's identity clause only; raises R-78 | 2026-09-09 |

`Open` rows are unlinked; a link appears when the file does.

**The stack is no longer open, and this paragraph used to say it was.** It instructed every document,
script and config to stay stack-neutral until ADR-0001 was `Accepted`. ADR-0001 was `Rejected`
instead, and the decisions it was holding have since been made elsewhere: ADR-0003 fixes Next.js on
Vercel with Supabase PostgreSQL, and ADR-0006 fixes TypeScript, a single application, Drizzle and a
commerce domain we write. Corrected 26 August 2026 rather than left standing, because a session
reading it would have been told not to write the code two accepted ADRs now require.

What remains genuinely open is narrower: ADR-0002 is still `Proposed` and half-void, and ADR-0005
is `Proposed` and blocked. Nothing in the codebase may depend on either.

**This paragraph used to name ADR-0007 as a third open item, "waiting on a contrast audit that has
not been run". Both halves of that were wrong by 6 September 2026** and it is corrected rather
than deleted, because the drift is the lesson. The audit *was* run — on 1 September, and it struck
item 5 while ADR-0007 was accepted on items 1–4 the next day. The index row was never updated. A
second audit, against the Claude Design frontend that has since replaced that system, was run on
6 September and is carried by [ADR-0011](0011-superseded-visual-direction.md), which supersedes
ADR-0007 in full. The `TODO` above — a CI check that every ADR file's status matches its index row
— is what would have caught this four days earlier.

## Template

Copy into `docs/adr/NNNN-title.md`. Delete the guidance in parentheses. If a section is empty, the
decision probably isn't ready — except Alternatives, which is never legitimately empty.

```markdown
# ADR-NNNN: <short imperative title>

- **Status:** Proposed | Accepted | Rejected | Superseded by ADR-NNNN
- **Date:** YYYY-MM-DD
- **Supersedes:** ADR-NNNN (omit if none)

## Context

(What forces this decision now? Constraints, requirements, and what breaks if we keep deferring.
Facts only — no advocacy. 3-8 sentences.)

## Decision

(What we are doing, in the active voice: "We will ...". Specific enough that a reader can tell
whether a given piece of code complies.)

## Consequences

(What becomes easier, what becomes harder, what we are now locked into, and the cost of reversing
this later. Include the bad parts — an ADR with only upsides is marketing.)

## Alternatives rejected

- **<Option>** — why not. What would have to change for this to win.
- **<Option>** — why not.
```

## Working with Claude Code

- If a task requires a decision listed under **When an ADR is required**, stop and draft the ADR
  as `Proposed` first. Do not pick silently and bury the choice in an implementation commit.
- Before proposing anything architectural, read the index and any `Accepted` ADR it touches. If a
  proposal conflicts with an accepted ADR, say so explicitly and propose superseding it rather
  than quietly working around it.
- Do not open ADRs for routine implementation choices — that is the failure mode this directory
  is most likely to die of.

