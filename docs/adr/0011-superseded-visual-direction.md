# ADR-0011: The Claude Design frontend supersedes the visual direction, and its palette was audited

- **Status:** **Accepted** — 2026-09-06, recording a substitution Sayon had already made and
  adopting the audit run against it the same day
- **Date:** 2026-09-06
- **Supersedes:** [ADR-0007](0007-visual-direction-change.md) — in full. Items 1–4 of that ADR
  described a system that is no longer the shipped one.
- **Related:** `design-system.md` §2.2 and §2.3 · `features/accessibility.md` · **R-62**,
  **R-75** (raised here) · [ADR-0010](0010-single-flat-repository.md)

## Context

[ADR-0007](0007-visual-direction-change.md) accepted items 1–4 of a visual direction change on
2 September 2026 and was implemented in `d59e081`: a `--{expression}--{role}` token layer,
Slight Twist's ground/type proportions, −0.026 em tracking on the display line, and 0.1 s
micro-transitions. Item 5 — substituting the ground colour — was **struck by the contrast audit
the ADR made itself conditional on**, and `#091b20` survived on the strength of that audit's
result: **0 of 11 pairs failing AA**, and gold clearing AA as text at 5.36:1.

**All of that described the old repository's frontend, which no longer ships.** The storefront in
`rejuvelux` was rebuilt from a Claude Design handoff and carries its own token system in
`styles/tokens/`. It is not a variation on the audited system; it inverts it. The old ground was
`#091b20`, a dark teal. The new ground is `--bone-200 #F3EEE4`, a warm near-white, with
`--ink-900 #141311` as type. Every measurement in `design-system.md` §2.2 and §2.3 was taken
against a palette the site no longer uses.

Under [ADR-0010](0010-single-flat-repository.md) this frontend is canonical. So a document suite
that still describes ADR-0007's system is not merely stale — it asserts accessibility properties
of a palette that is not on screen, which is the failure mode this project has already paid for
twice.

**The audit was therefore re-run on 6 September 2026**, against the semantic aliases in
`styles/tokens/colors.css` rather than against raw palette entries, because the aliases are what
actually pair on a rendered surface.

### The audit result

**13 of 18 body-text pairs pass AA at 4.5:1. Five fail.** Against the superseded system's 0 of 11,
**the new palette measures worse than the one it replaced.**

| Pair | Ratio | Verdict |
|---|---|---|
| `text-primary` / `bg-page`, `bg-page-alt`, `surface-card`, `surface-raised` | 16.06 – 18.57:1 | Pass, comfortably |
| `text-secondary` / `bg-page`, `surface-card` | 6.36:1, 6.99:1 | Pass |
| `text-inverse` / `bg-inverse`, `surface-inverse` | 16.77:1, 14.12:1 | Pass |
| `action-primary-text` / `action-primary` | 16.77:1 | Pass |
| `status-success`, `status-error`, `status-info` / their soft grounds | 5.12 – 5.40:1 | Pass |
| **`text-tertiary` / `bg-page`** | **3.88:1** | **Fail** — large-text AA only |
| **`text-tertiary` / `surface-card`** | **4.27:1** | **Fail** — a near miss |
| **`text-accent` / `bg-page`** | **4.14:1** | **Fail** — large-text AA only |
| **`link-hover` / `bg-page`** | **4.14:1** | **Fail** — same token as above |
| **`status-warning` / `status-warning-soft`** | **2.71:1** | **Fail, and worst** — misses even the 3:1 large-text floor |

Two of these matter more than their numbers suggest. **`text-accent` is `--gold-600`, and the
bracketed placeholder slots (`[ESTATE]`, `[LOT-0000]`, `[000 m]`) render in it** — the mechanism
`product.md` §4.2 relies on to make an unfilled slot read as empty rather than as fact. A
placeholder convention that is hard to read defeats its own purpose. And **`status-warning` is
the only pair that fails the large-text floor as well**, so no type size rescues it.

One earlier reading is corrected here rather than left in the record: a first pass measured
`--gold-100` on `--bone-50` at 1.18:1 and looked alarming. `--gold-100` is `--accent-soft`, a
tint, and is never a text token. The pair does not occur.

## Decision

**The Claude Design frontend and its token system are the visual direction. ADR-0007 is
superseded in full, and `design-system.md` §2.2/§2.3's contrast record is superseded by the audit
above.**

- **What survives from ADR-0007, in substance rather than in form.** Item 1 — product-scoped
  colour families — **is present and is stronger than the version ADR-0007 specified**:
  `--tea-{expression}-tin` / `--tea-{expression}-ink` pairs exist for all six expressions, each
  sampled from the physical tin. Items 2, 3 and 4 (ground/type proportions, −0.026 em tracking,
  0.1 s transitions) were measurements against Slight Twist and a different type scale; they are
  **moot**, not rejected, and nothing should be re-derived from them.
- **Three token corrections are required, and they clear all five failures.** Verified by
  computation, hue preserved, each a small darkening:

  | Token | Now | Becomes | Clears |
  |---|---|---|---|
  | `--ink-500` | `#7D766B` | **`#726B61`** | 4.55:1 on `bg-page`, 5.00:1 on `surface-card` |
  | `--gold-600` | `#8E6D34` | **`#866731`** | 4.54:1 on `bg-page`, 4.99:1 on `surface-card` |
  | `--status-warning` | `#B8862B` | **`#886320`** | 4.55:1 on `status-warning-soft` |

- **They are not applied in Phase 0.** `roadmap.md` §3.3 fixes Phase 0 as a move that changes
  nothing behavioural, and a palette edit is a behavioural change. **Raised as R-75** and applied
  as its own commit, before any surface carrying these tokens is shown to a client.
- **The audit is re-run whenever a colour token changes.** The script is three lines of WCAG
  relative-luminance arithmetic; there is no excuse for a palette change landing unmeasured, and
  this project has now been saved twice by measuring instead of describing.

## Consequences

**A documented accessibility regression, stated rather than discovered later.** The site is
currently less conformant than the system it replaced. That is the honest reading and it is worth
carrying in the open: the substitution was made for design reasons and the accessibility cost was
not measured at the time. It is measured now, and it is three token values wide — small, but real
until the commit lands.

**`design-system.md` needs more than a correction.** §2 through §2.3 document a palette the site
does not use, including a contrast matrix and a gold-as-text justification that no longer apply.
This ADR supersedes the record; rewriting the document is Phase 1 work and is not attempted here.

**`features/accessibility.md`'s conformance target now has something to measure again.** It was
written on 1 September specifically so a palette question could be settled against a stated
target, and it did settle one. It settles this one too.

**R-62 is untouched and still failing.** LCP at 2.95 s on `/shop`. Nothing in this ADR helps —
the new frontend has not been measured on the R-62 profile at all, which is its own gap.

**What this ADR deliberately does not decide.** The display face (R-68's question, inherited
unanswered from ADR-0007), the motion tier (§6 still forbids it, open-calls #20 still open, R-63
still unread), and whether the new system satisfies `design-system.md` §9's filter — question 2,
*"is it specific to this product, or could it be any premium tea?"*, is a judgement nobody has
made about this frontend.

**One process failure is recorded, not hidden.** The ADR index still lists ADR-0007 as
`Proposed` — "blocked on the re-run contrast audit" — while the file itself has read `Accepted`
since 2 September. The index drifted from the ADR for four days, in exactly the way
`adr/readme.md`'s own TODO anticipates and asks a future CI check to catch. Corrected in the same
commit as this ADR.

## Alternatives rejected

- **Revert to the audited system.** `#091b20` measured 0 of 11 failing and is the best-measuring
  ground this project has had, so on accessibility alone this wins outright. **Rejected because
  the storefront was rebuilt deliberately and is the half being kept** (ADR-0010) — and because
  the gap is three token values, not a palette. Would win if the corrections above prove
  unacceptable to the brand, which is a two-minute conversation rather than a rebuild.
- **Apply the corrections during Phase 0, while the tokens are already open.** Tempting and
  cheap. Rejected because Phase 0's whole discipline is that it moves code and changes nothing;
  the first exception is how that guarantee stops being worth anything.
- **Accept the five failures as within tolerance**, on the grounds that four of the five clear
  the 3:1 large-text floor and the type using them is small and secondary. Rejected because
  `text-accent` carries the placeholder convention, `status-warning` fails even that floor, and
  `features/accessibility.md` sets a target rather than a preference. "Nearly passes" is not a
  conformance level.
- **Keep ADR-0007 alive alongside this one**, treating the new frontend as a second direction.
  Rejected: two accepted ADRs describing incompatible visual systems is precisely the ambiguity
  that R-22 cost this project sixteen days over.
