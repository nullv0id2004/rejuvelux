# Feature — Accessibility

> **Purpose:** Target conformance level, per-component requirements, and how it is tested.
>
> **Status: written 1 September, 2026, `PROVISIONAL`.** Build-order item **14**, which
> `docs/readme.md` places *before* `design-system.md` precisely so the conformance target could
> constrain the palette — and which was skipped. It is written now because **ADR-0007** re-opens the
> ground colour and the contrast audit it requires has nothing to measure against until this exists.
> That is the retrofit item 14 was ordered to prevent; writing it late does not undo the ordering
> error, it only stops it compounding (**R-69**).
>
> **This document sets a target and derives rules from it. It does not audit the current site** —
> §2.1 and §2.2 of `design-system.md` hold the only contrast measurements taken so far, and §4.1
> holds the one defect found by measurement.

---

## 1. Scope

**In:** the conformance target and its justification · the constraints that target places on any
palette, type scale and focus treatment · per-component requirements for what ships today · motion
and reduced-motion obligations · how each of these is verified.

**Out:** the statutory question — `compliance.md` owns what the law requires and currently says
**nothing** about accessibility (see §2.1 below) · assistive-technology support matrices for specific
screen-reader/browser pairs (not decidable without a testing budget) · accessibility of the admin
surface (**this exclusion's reason is void as of 2 Sep 2026** — ADR-0008 puts the admin in scope for
a non-technical client team who will use it daily; the target is not yet decided, tracked as
**R-74**, and this doc's scope note is corrected the moment it is) · accessibility statement page copy
(`content-style.md` owns wording; `features/policies.md` owns the page).

---

## 2. The target

**WCAG 2.2, Level AA, as a product decision — `PROVISIONAL`.**

AA rather than AAA because AAA's 7:1 body-text contrast forecloses design choices across the whole
palette for a benefit AA already largely delivers, and because WCAG itself does not recommend AAA as
a general policy for entire sites. 2.2 rather than 2.1 because 2.2 is the current recommendation and
its additions (focus appearance, target size, dragging alternatives) are cheap on a storefront that
has no drag interactions and few dense controls.

### 2.1 The statutory position is unowned — do not infer one from this document

`compliance.md` owns *"what the law requires"* and contains **no accessibility obligation of any
kind** — no WCAG reference, no RPwD reference, nothing. Searched 1 September 2026.

`docs/readme.md`'s standing rule is *"never invent real-world facts"*, and what a private Indian
e-commerce company owes on digital accessibility is exactly such a fact. **This document therefore
sets AA as our own standard and asserts nothing about the law.** Filed as **R-70**. If the statutory
floor turns out to be higher, this target moves; it does not get to be the answer by default.

---

## 3. What the target constrains — the part ADR-0007 is waiting on

These are the rules a candidate palette must satisfy **before** it is adopted, not after.

| # | Rule | Source |
|---|---|---|
| 1 | Body text and any text under 18.66 px regular / 24 px bold: **≥ 4.5:1** against its actual background | WCAG 1.4.3 |
| 2 | Large text (≥ 24 px, or ≥ 18.66 px bold): **≥ 3:1** | WCAG 1.4.3 |
| 3 | UI component boundaries, control states, and meaningful graphics: **≥ 3:1** | WCAG 1.4.11 |
| 4 | The focus indicator: **≥ 3:1** against *both* the focused control and the surface behind it | WCAG 2.4.11 / 2.4.13 |
| 5 | Colour is never the only carrier of meaning — stock state, validation, and link identity each need a second signal | WCAG 1.4.1 |
| 6 | Text resizes to **200 %** via the browser's font-size setting, not only via page zoom | WCAG 1.4.4 |
| 7 | Content reflows at **320 CSS px** with no horizontal scrolling | WCAG 1.4.10 |
| 8 | Interactive targets **≥ 24 × 24 CSS px**, with 44 × 44 preferred on the primary purchase path | WCAG 2.5.8 |

**Rule 1 is the one that decides ADR-0007.** The current ground passes **11 of 11** AA pairs (§2.2).
A candidate palette that cannot match that is not "a different look" — it is a regression against a
measured baseline, and §9's filter has no question that catches it. This document is that question.

**Rule 3 has a consequence the current system already relies on:** `design-system.md` §2.2 measured
the two dark grounds only **1.36:1** apart, so alternating them is a tonal shift and never a
boundary. Any replacement palette inherits that obligation — bands need a rule, an edge, or a
photograph, never a background change alone.

**Rule 5 has teeth against a specific temptation.** `features/inventory.md` defines three storefront
stock states. If a new palette encodes those as colour alone, it fails — regardless of contrast.

**On the gold rule.** §5 caps the accent under 1 % of rendered area and never as text. §2.2 measured
gold at **2.26:1 / 3.07:1 / 3.94:1** — failing as text on every ground. That rule is now *also* an
accessibility rule, not only a taste one, and it survives any direction change: an accent that fails
1.4.3 is ornament whatever the palette around it.

---

## 4. Per-component requirements, for what ships today

- **Site header.** The nav is `display: none` below 960 px with nothing replacing it, and
  `/collection` and `/gifting` are reachable from no other link — **R-61**. This is a 2.4.5 failure
  (multiple ways to locate a page) on the viewport §4 declares primary, not merely a UX gap.
- **Hero slideshow.** Auto-advancing content needs a pause/stop control (2.2.2) and must not be the
  only route to the information it carries. §8.6.1 already requires controls; this is the
  conformance reason as well as the design reason.
- **Focus.** `globals.css` sets `:focus-visible { outline: 2px solid var(--accent) }`. Against rule 4
  this must be re-measured on **both** surfaces once a palette changes — a focus ring that passes on
  the ground and fails on a button is a 2.4.11 failure that looks fine in a screenshot.
- **Forms (cart, checkout).** Every field needs a persistent visible label — placeholder-as-label
  fails 3.3.2. Errors identify the field in text, never by colour or position alone (3.3.1).
  Checkout is the surface §4 already names as where mobile failures cost money.
- **Images.** Decorative imagery takes `alt=""`; product photography carries alt text that describes
  the product, and **must not assert provenance the photograph cannot support** — §16, R-15, R-17.
- **Language.** `<html lang>` set correctly (3.1.1); it is one attribute and it is free.

---

## 5. Motion

`design-system.md` §6 caps motion at 400 ms and bans scroll-jacking; **ADR-0005** proposes breaching
both and is blocked on open-calls #20 and R-63. This document adds one requirement that holds either
way:

**`prefers-reduced-motion: reduce` must remove motion, not shorten it.** `globals.css` already has
the media query. ADR-0005's condition 1 says the same thing, and its condition 2 — that the hero
statement is readable with JavaScript disabled and at first paint — is a 1.4.2/2.2.2 obligation as
much as a performance one.

Marquees and infinite `linear` animation, which `design-system.md` §8.8 measured on both new
references, are **auto-playing motion that never resolves**: under 2.2.2 they need a stop control if
they run more than five seconds. Slight Twist's run 40 s and 80 s.

---

## 6. How this is verified

Nothing here is satisfied by reading the markup.

1. **Contrast** — computed from the token values, every foreground against every ground it can land
   on, as §2.2 did. A script, not an eyedropper. It runs before a palette is adopted.
2. **Keyboard** — every interactive element reachable and operable by keyboard alone, in a visible
   order, with no trap. Manual, per surface.
3. **Font-size resize** — root at 16/20/24 px, computed sizes recorded. **This currently fails**:
   §4.1 measured every size unchanged across all three, because `body { font-size: 16px }` discards
   the root preference and the clamps carry no `rem` term (**R-55**). Rule 6 is not met today.
4. **Reflow** — 320 CSS px, no horizontal scroll. Part of the §4.1 viewport matrix already.
5. **Automated sweep** — an axe-core pass per route as a floor. It catches roughly a third of issues
   and proves nothing on its own; a green axe run is not a conformance claim.

Wire 1, 3, 4 and 5 into the check command (`readme.md`, Development) once the repo has one. Until
then they are scripts in the session scratchpad and their output is recorded with a date, per §4.1's
precedent.

---

## 7. Known defects, open

| Ref | Defect | Effect |
|---|---|---|
| **R-55** | Type scale ignores the browser font-size setting | 1.4.4 fails outright — the most common accommodation there is |
| **R-61** | No navigation below 960 px; two routes orphaned | 2.4.5 fails on the primary viewport |
| ~~R-69~~ | ~~Palette change re-opened before this document existed~~ | **Resolved 1 Sep 2026** — this document set the target, the §2.3 audit then vetoed the ground change. The baseline held |
| **R-70** | Statutory accessibility position unowned | The target above may be below a legal floor nobody has checked |

**None of these is closed by this document existing.** It defines the target; the defects are the
distance from it.
