# ADR-0010: One flat repository, and `rejuvelux_old` is kept as provenance

- **Status:** **Accepted** — 2026-09-06, by Sayon, who directed that the backend be ported into
  the new repository rather than the frontend into the old one
- **Date:** 2026-09-06
- **Amends in part:** [ADR-0006](0006-write-the-commerce-domain.md) and
  [ADR-0008](0008-admin-for-a-client-team.md) — **the path rows only.** Every other clause of
  both stands, unchanged and binding.

## Context

The project is split across two working directories, and has been since the storefront was
rebuilt from a Claude Design handoff.

- `Money_projects/rejuvelux_old` holds the documentation suite, the commerce domain built under
  ADR-0006 (cart, inventory with reservation-under-lock, event-sourced orders), three Drizzle
  migrations, five test suites, and **admin stage 1 of 6**, exercised on 5 September at 15 of 17
  checks.
- `Money_projects/rejuvelux` holds a storefront rebuilt from a design handoff — nine routes, a
  transliterated design system, its own token layer — and **no backend of any kind**: no
  database dependency, no server call, a client-only cart, and products as a static array.

Neither half is disposable. The old repository has the money-handling code and every ADR that
explains it; the new one has the storefront that is actually going to ship.

**The paths in two `Accepted` ADRs no longer resolve.** ADR-0006 fixes the domain at
`apps/web/lib/server/` and closes "the `dev:api` placeholder in the root `package.json`";
ADR-0008 fixes the admin at `apps/web/app/(admin)/`. Both assume the monorepo layout of the old
repository. The new repository is flat — there is no `apps/`, no workspace root, one
`package.json`.

On 6 September 2026 Sayon answered the direction directly: **the backend ports into
`rejuvelux`**, not the frontend into `rejuvelux_old`.

## Decision

**`Money_projects/rejuvelux` is the canonical repository, it is flat, and the commerce domain
lives at `lib/server/` with the admin at `app/admin/`.**

- **The substance of ADR-0006 and ADR-0008 is untouched.** One application. One Vercel project,
  one deploy. No `apps/api` and no second API surface. The admin imports `lib/server` directly
  with no HTTP hop. Supabase PostgreSQL as the single source of truth, Drizzle as the access
  layer, Razorpay integrated directly, checkout never leaving our domain. **Only the directory
  prefix changes:** `apps/web/lib/server/` → `lib/server/`, `apps/web/app/` → `app/`.
- **The port is verbatim.** Domain code moves with its imports rewritten and nothing else. A port
  and a refactor in the same commit cannot be reviewed, and R-36 records that no second reviewer
  exists.
- **`rejuvelux_old` is kept, not deleted.** It is the git history of the commerce spine and the
  provenance of every ported file — including the MIT attribution trail ADR-0006 requires. It
  becomes read-only in practice on the day Phase 0's exit criteria pass.
- **The MIT boundary travels with the code.** Attribution headers on Medusa-derived files are
  part of the file and are not stripped in the port. The Enterprise Materials remain out of
  bounds; nothing about this ADR touches that.

## Consequences

**The two halves can finally meet.** Until now the storefront could not read a price and the
admin could not be reached from the site anyone will actually visit. This is the precondition
for every phase in `roadmap.md`.

**Documentation drift, and it is not small.** Four documents assert `apps/web/...` paths that
will not resolve: `architecture.md`, `data-model.md`, `tech-stack.md` and `readme.md`. They are
corrected during Phase 0. The ADRs themselves are **not** edited — accepted text is immutable,
and this ADR is the amendment.

**A version skew has to be settled rather than discovered.** The new repository runs
`next@^16.3.4` / `react@19.1.1`; the old runs `next@16.3.1` / `react@19.2.8`. Phase 0 takes the
higher of each and pins exactly. This is the kind of detail that costs an afternoon if it is
found by a failing build instead of a decision.

**Git history for the backend does not come with it.** A file copy carries no commits, so
`git blame` on `lib/server/**` will show one port commit rather than the sessions that wrote it.
This is the real cost of the direction chosen, and it is why `rejuvelux_old` is retained rather
than deleted. Recoverable later as a bundle, the way `rejuvelux-docs-history.bundle` already is.

**Reversal is cheap now and gets expensive quickly.** Today this is a directory copy. Once the
catalogue resolves from the database and admin stages 2–3 exist in the new tree, reversing means
moving live work back, and the old repository's frontend has already been superseded
([ADR-0011](0011-superseded-visual-direction.md)).

## Alternatives rejected

- **Port the frontend into `rejuvelux_old` instead.** Preserves the backend's git history and the
  `apps/web/...` paths every accepted ADR already names, so no amendment would be needed.
  **Rejected by Sayon on 6 September 2026.** It would mean refitting a freshly built storefront
  into an older app shell whose own frontend it replaces — moving the larger, newer, more
  finished half to accommodate the layout of the half that is being superseded. Would win if the
  backend's commit history turns out to matter more than the storefront's integrity.
- **Keep both repositories: `rejuvelux` as storefront, `rejuvelux_old` as admin and API.** Two
  deploys, two Vercel projects, an HTTP hop between the admin and the domain layer. **Rejected
  because it contradicts ADR-0003 and ADR-0008 in substance, not merely in path** — one
  deployable and a direct import are the decisions, and this would reverse both while pretending
  to be a layout choice.
- **Rebuild the backend fresh in `rejuvelux`, keeping only the database.** Would discard a tested
  reservation path, an event-sourced order lifecycle and four passing suites, and would re-incur
  every risk ADR-0006 accepted with none of the work already done. Rejected on cost and on R-36:
  the least-reviewed code would be rewritten for no gain.
