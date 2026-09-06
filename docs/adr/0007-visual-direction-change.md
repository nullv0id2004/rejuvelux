# ADR-0007: Change the visual direction toward the reference tier

- **Status:** `Accepted` — 2026-09-02, **items 1–4 only**. Item 5 remains struck by the contrast
  audit (`design-system.md` §2.3), which vetoed the ground substitution and supported the rest.
  Superseded status line: `Proposed` — 2026-09-01, awaiting Sayon.
- **How it was accepted, recorded because it was not a written sign-off:** Sayon asked on
  2026-09-02 for the site to be rebuilt and deployed inside the hour, with the direction applied,
  because stakeholders needed to see movement. That instruction is the decision this ADR was
  waiting on, and the sentence below — *"nothing in the codebase may depend on it until he makes
  it"* — is discharged by it. It was **not** a separate explicit "accept ADR-0007". If that reads
  as further than intended, items 1–4 are close to reversible in a day, as this ADR itself argues,
  and `d59e081` is the single commit to revert.
- **Implemented:** `d59e081`, 2026-09-02 — the first time this ADR touched shipped code.
- **Date:** 2026-09-01
- **Related:** `design-system.md` §8.8 (the measurements), §2 / §2.1 / §2.2, §3, §5, §6, §9 · **open-calls #18** and **#20** · **R-62**, **R-63**, **R-68**, **R-69** · ADR-0005

## Context

Sayon supplied two references — `micha.asia` and `slight-twist.co.nz` — and ruled that they are a
**change of visual direction**, not a source of individual devices to graft onto the current system.
Both were measured rather than described; the numbers are in `design-system.md` §8.8.

The current system was not arrived at casually, which is what makes this expensive. `#091b20` was
adopted after a contrast audit in which **0 of 11 pairs fail AA** (§2.2) — the best-measuring ground
this project has had. §3 fixes a high-contrast display serif. §5 caps the single accent under 1 % of
rendered area and never as text, a rule independently confirmed when Ladurée measured at 0.4 %
(§8.4). §1 permits exactly one decorative move per surface. All of it is shipped and live.

The two references disagree with that system in different amounts, and the measurement is what
separates them. **Slight Twist is mechanically more disciplined than the current site**: one ground
at 11.0 M px², one type colour, a single transition rule at 0.1 s, three animations. **MiCha is not**:
five saturated hues at large area, 94 live animations dominated by infinite `linear` backdrop
rotation, and an arrowed carousel. Against **R-62** — LCP already failing at 2.95 s on `/shop` —
those two references carry opposite risk.

Three constraints sat under this decision when it was drafted. **`features/accessibility.md` had
never been written** (`docs/readme.md` item 14) even though the build order puts it *before*
`design-system.md` precisely so the conformance target could constrain the palette — it was written
in this session, to give the audit below something to measure against. **§6 already forbids the
motion tier** (open-calls #20), independently of this ADR and still unresolved. And **Nanjaune,
Slight Twist's actual display face, is not a Google font** — verified, HTTP 400 — so it is a
commercial licence nobody has priced (**R-68**).

## Decision

We will change the visual direction, and we will take **Slight Twist's structural model rather than
MiCha's surface**. Specifically:

1. **Product-scoped colour families over one shared ground.** A `--{expression}--{role}` token layer,
   as Slight Twist does with `--mai-tai--green-200` / `--cherry-sling--pink-100`. This is the part of
   the reference that is architecture rather than appearance, and it is what
   `features/catalogue.md` needs for three expressions with Green Tea held separate (R-05, R-52).
2. **One dominant saturated ground and one type colour**, in the proportion measured on Slight Twist
   (ground ≈ 85 % of rendered area, type colour ≈ 10 %, every accent under 3 %).
3. **Tight negative tracking on the display line** — Slight Twist runs −0.026 em at 88 px. This
   transfers to a serif and is independent of the face.
4. **Micro-transitions at 0.1 s**, replacing the current 0.5 s-era values. Note this moves *toward*
   §6's cap, not away from it.
5. ~~**The ground colour itself is re-opened**, which is what overturns open-calls #18.~~
   **STRUCK 1 September 2026 by the audit this ADR made itself conditional on** — see below.
   `#091b20` stands, and **open-calls #18 is therefore not overturned after all.**

### The audit result — run the same day, and it changes item 5

`design-system.md` §2.3 carries the full matrix. Body-text AA passes out of 8 foregrounds:
**`#091b20` 7/8** · `#00382f` 6/8 · `#004953` 6/8 · `#005f5b` 5/8 · `#14574b` 5/8 ·
**Slight Twist's own `#0a6a66` 4/8** · MiCha's band `#eb373e` 1/8 · MiCha's ground `#fff1f1` 1/8.

The current ground wins by a clear margin against every candidate including both references' own,
and it is the only one on which **gold clears AA as text** (5.36:1) — the re-justification §2.2 asked
for. Two findings about the references themselves came out of the same pass: **MiCha's 15 px
navigation is a 1.4.3 failure as shipped** (white on `#eb373e` = 4.08:1), and Slight Twist's
`--ink-quiet` equivalent misses AA by 0.01 on its own ground.

**The win that survives:** Slight Twist's warm type colours measure **better on our ground than on
theirs** — butter `#fff8b5` at **16.27:1** and cream `#fffce4` at **17.07:1** on `#091b20`, against
5.92:1 and 6.21:1 on `#0a6a66`. The warmth that gives the reference its character is available
without the palette migration, the rework, or the accessibility risk.

So the direction change proceeds on **items 1–4**, which is where its substance was anyway: the
token architecture, the proportions, the tracking and the transition speed are what make Slight Twist
feel considered. The ground was the expensive part and the measurement does not support paying for it.

**On same-session acceptance.** As first drafted this ADR could not be accepted the same day —
`adr/readme.md` allows that only for decisions reversible inside a week, and a ground substitution
reworks every shipped surface. **Striking item 5 removes that objection**: what remains is a token
addition, a tracking value and a transition timing. This is now a short call rather than a deferred
one. It is still Sayon's, and **nothing in the codebase may depend on it until he makes it.**

**What this ADR deliberately does not decide:** the display face. Items 1–4 leave §3's serif in
place; R-68 opens the question of whether a new face is wanted at all, and that is a separate
decision with its own licensing cost.

## Consequences

**The audit ran, and it vetoed the palette — which is the process working, not failing.**
`features/accessibility.md` was written first to set the target (build-order item 14, two items
overdue, **R-69**), then the matrix was computed against it. The direction change fails on
accessibility for the ground and passes for everything else. That is the correct way for a design
question to be settled here, and it cost one session rather than a rebuild.

**§2, §2.1 and §2.2 stand unchanged.** With item 5 struck there is nothing to supersede: `#091b20`,
the contrast tables and the gold rule survive intact, and §2.3 extends the record rather than
replacing it. **§3 and §5 are still in play** — items 1–4 touch typography and the accent, and the
display-face question R-68 raises is genuinely open.

**Rework, now much smaller than first written.** Items 1–4 need `apps/web/app/globals.css` (a
`--{expression}--{role}` token layer, warmer type colours, transition timings) and the type scale's
tracking. **They do not need a palette migration**, so `hero-slideshow`, `site-header`,
`site-footer` and the routes are touched only where they hardcode a timing or a tint. The
"expensive to reverse" test that justified this ADR applied to the ground substitution; with that
struck, what remains is close to reversible in a day.

**LCP risk moves in the wrong direction.** R-62 is open and failing. Taking Slight Twist's model adds
little (three marquees, 0.1 s transitions); taking MiCha's would add a great deal. Re-measure on the
R-62 profile (360×640, 1.6 Mbps, 150 ms RTT, 4× CPU) before and after, and treat a regression as a
revert trigger — the same condition ADR-0005 already imposes.

**This does not unblock the motion work.** §6 still forbids the tier, open-calls #20 is still open,
and **R-63** — GSAP's post-Webflow commercial licence, still unread — is unaffected by the fact that
both new references carry GSAP. §8.8 strengthens ADR-0005's evidence from 2 of 7 to 4 of 9 sites and
changes nothing about whether we are permitted to install it.

**A typeface decision is now pending.** Nanjaune cannot be used without a commercial licence (R-68).
Passion One, Be Vietnam Pro and Bricolage Grotesque are all served by Google Fonts, so all three are
obtainable — but adopting any of them replaces §3's serif, which is a second decision this ADR
raises and does not make.

**§9's filter still applies and is the acceptance test.** Question 2 — *"is it specific to this
product, or could it be any premium tea?"* — is the one this direction is most likely to fail, since
both references are mass-market beverage brands. Question 4, *"exactly one decorative move"*, is what
rules MiCha's model out.

## Alternatives rejected

- **Take MiCha's surface too — multi-hue, high ornament density.** Rejected on measurement, not
  taste. Five saturated hues at large area cannot coexist with §5's accent discipline, and 94
  animations dominated by infinite rotation is §1's opposite while R-62 is open and failing. It also
  fails §9 question 2 hardest: MiCha reads as mass-market FMCG, which is the register §48 explicitly
  rules out.
- **Named devices only, keep the current system** — the option Sayon was offered and declined, which
  would have kept `#091b20`, the serif and the gold rule while taking Slight Twist's token
  architecture and its 0.1 s transitions. **Worth being honest: with item 5 struck, the audit has
  converged this ADR most of the way onto that option.** The difference that survives is one of
  intent rather than diff size — the direction change is deliberate and documented, where "named
  devices" would have treated the current system as the default to defend. It is recorded here
  because the outcomes are now close enough that a reader deserves to know they nearly met.
- **Adopt the direction and skip the contrast re-audit**, on the grounds that the references are
  live sites and evidently legible. Rejected, and the audit shows why it would have been costly:
  **neither reference is fully conformant.** MiCha's 15 px navigation measures 4.08:1 — a 1.4.3
  failure — and Slight Twist's decorative pink and cyan are large-text-only on its own ground.
  "It ships and it looks fine" would have imported those defects along with the look.
- **Defer entirely until `features/accessibility.md` was written.** Rejected in favour of writing
  that document immediately instead, which is what happened. Deferring would have parked the ruling
  behind an unrelated backlog item; writing it took one pass and turned the blocker into the tool
  that settled the question.
