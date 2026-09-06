# ADR-0005: Motion stack — GSAP + ScrollTrigger and Lenis

- **Status:** **Proposed** — 2026-08-21. **Not accepted. Nothing installed. No code written.**
- **Date:** 2026-08-21
- **Depends on:** a ruling on **open-calls #20** (this contradicts `design-system.md` §6)
- **Related:** `design-system.md` §8.7 (the measured references), **R-63**, **R-62** (LCP)

## Context

Sayon asked for the storefront to reach an *"Awwwards-featured"* level of motion, named the
candidate libraries (`gsap`, `lenis`, and React Three Fiber if the design went 3D), and asked for
the direction to be researched and documented before anything was built.

Two constraints frame the decision, and they pull in opposite directions.

**The category evidence supports the libraries.** Seven live reference sites were loaded in a real
browser and measured (`design-system.md` §8.7). The two carrying Awwwards recognition are the only
two running a motion stack at all: **Done Drinks** carries GSAP *and* Lenis, **Savor** carries Lenis
plus five `<canvas>` elements. The other five — including the luxury ceiling in packaged tea, TWG —
announced no motion library. The stack under discussion is therefore what the awarded tier actually
ships, not a preference argued from taste.

**The house rules forbid it.** `design-system.md` §6 caps motion at **400 ms** and forbids
*"parallax, scroll-jacking, entrance animations on every section, autoplaying carousels with motion,
anything that delays reading."* A scroll-damping library is scroll interception by definition. §6 is
an accepted rule; this ADR does not overrule it and cannot be accepted while it stands.

Two further facts bear on the decision and were verified rather than recalled:

- **Lenis honours `prefers-reduced-motion` in its own source** — user scrolls fall to `lerp = 1`
  and programmatic scrolls to `immediate = true`, i.e. smoothing disappears and scrolling becomes
  1:1 native tracking. Under reduced motion Lenis is a pass-through, not a hijack. (Context7,
  `darkroomengineering/lenis`.)
- **Entrance animation has a measured cost.** Done Drinks' viewport was still essentially empty at
  **6 seconds** — gradient, logo, one button, no headline — because its copy is animated in. Against
  **R-62**, where LCP already fails at 2.95 s on `/shop`, that failure mode is the main risk here.

### Evidence added 1 September, 2026 — the sample is now 4 of 9

Two further references (`micha.asia`, `slight-twist.co.nz`) were measured with the same probe and
both carry **GSAP**; **MiCha carries GSAP and Lenis together** — the exact pair proposed below. The
measured sample supporting this stack moves from 2 of 7 to **4 of 9**. Full numbers in
`design-system.md` §8.8.

**This changes nothing about the blocker.** R-63 is a question about GSAP's post-Webflow commercial
licence, which is still unread; how many sites ship GSAP has no bearing on whether we are permitted
to. §6 still forbids the direction, and open-calls #20 is still unruled. The evidence strengthens the
*case*; it does not move the *gate*.

One thing worth carrying into that ruling: MiCha runs **94 live animations**, mostly infinite
`linear` backdrop rotation, and against R-62 it is a louder version of the finding-4 warning below.
Slight Twist, by contrast, runs three marquees and a **single 0.1 s transition rule** — evidence that
the awarded tier does not require motion density, only motion *craft*.

## Decision (proposed)

Adopt **two** dependencies, and refuse the third.

| Package | Role | Verdict |
|---|---|---|
| `gsap` + `ScrollTrigger` | The hero reveal timeline | **Propose** |
| `@gsap/react` | `useGSAP()` — scoping and automatic cleanup | **Propose** |
| `lenis` | Scroll damping | **Propose** |
| `@react-three/fiber` + `three` | 3D | **Reject — not proposed** |

**R3F is refused on the evidence.** Savor's canvases drive a video-texture effect on a food
subject. On a tea storefront the same machinery is decoration carrying a large entry cost, against
a page-weight budget (`architecture.md` §3) that currently passes with room to spare. If a 3D idea
later earns its place, it gets its own ADR.

### What the motion is allowed to be

- **One orchestrated moment: a per-character mask reveal of the hero statement, on load.** The
  words are server-rendered and already painted; the mask animates a transform over existing
  glyphs. First paint is never gated on a timeline.
- **Lenis for scroll damping only.** No pinning, no section snapping, no parallax, no scroll-tied
  scrubbing of layout.
- **Nothing else on the page moves** beyond what already ships (the hero crossfade and its Ken
  Burns, per §8.6.1).

### Non-negotiable conditions

1. `prefers-reduced-motion` removes the reveal entirely — not shortened. `respectReducedMotion:
   false` is **forbidden**; setting it disables Lenis's own safeguard.
2. The hero statement is readable with **JavaScript disabled** and at first paint. A reveal that
   can leave the headline invisible is a defect, not an effect.
3. **LCP is re-measured on the R-62 profile** (360×640, 1.6 Mbps, 150 ms RTT, 4× CPU) before and
   after. A regression against the current numbers reverts the change.
4. GSAP is client-only — `useGSAP()` with a `scope` ref, never executed during SSR.
5. Keyboard focus and scroll-to-anchor keep working with Lenis mounted.

## Consequences

**Accepted cost.** Three runtime dependencies where there were none; the app currently has no
animation library at all. Bundle growth must be measured, not estimated, and counted against
§3's budget.

**§6 must be amended, explicitly.** If this is accepted, §6's 400 ms cap and its scroll-jacking ban
no longer describe the system, and the amendment is a deliberate edit to an ask-first document —
not a silent drift. Note that §6 is **already** contradicted by shipped code: the session that
designed hero frame 1 recorded 500 ms and 600 ms text motion on slide change. The real question is
whether §6 gets amended on purpose or keeps being overtaken by accident.

**GSAP licensing is unverified.** GSAP's terms changed after the Webflow acquisition and this ADR
does **not** assert what they now are for a commercial storefront. That must be read from the
current licence before anything is installed. Recorded as an open item in **R-63** rather than
assumed.

**If rejected**, the fallback is not nothing: the same per-character reveal is achievable in CSS
with `@keyframes` and per-character `animation-delay`, inside §6's 400 ms cap, with no dependency
and no scroll library. It is less controllable and cannot be scroll-tied — but it is honest about
staying inside the existing rules.

## Alternatives considered

- **Motion (formerly Framer Motion)** instead of GSAP — good React ergonomics, weaker scroll
  orchestration than ScrollTrigger, and no equivalent to `contextSafe`/`scope` cleanup semantics
  for imperative timelines. Not proposed, but a reasonable substitute if GSAP's licence turns out
  to be a problem.
- **CSS-only reveal, no dependency** — see "If rejected" above. This is the status-quo-preserving
  option and the one that needs no ruling on §6.
- **ScrollSmoother** (GSAP's own smooth-scroll plugin) instead of Lenis — avoids a second vendor,
  but historically sat behind GSAP's paid Club tier, which folds an unresolved licensing question
  into a second place. Lenis is MIT and self-evidently free.
