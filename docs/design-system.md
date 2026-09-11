# Design System

> Owns palette, type, spacing, components, motion and imagery direction. Wins on any visual
> question. Wording belongs to `content-style.md`.
>
> Colour values, type scale and spacing below are **PROVISIONAL** — the brief gives a palette
> *territory* (§28) without hierarchy, proportion or values, and `base.md` records that "a list
> of eight colours is not yet a system". These are concrete proposals so the docs are buildable;
> overturn any of them freely.
>
> **Not designed here:** packaging artwork (blocked on dielines — `risks.md` R-11).
> **The logo is supplied, not designed here** — see §1.1. It arrived 18 August 2026 and is a fixed
> input to this document, not an output of it.

---

## 1. The governing principle

§26 asks for "Minimal. Premium. Uncluttered." §28 specifies an ornate premium crest. §48 lists
"overly ornate" under what the brand is *not*. Read carelessly these contradict; they do not.

**The unresolved question is not *whether* to be ornate but *where* ornament is permitted** —
and the brief never sets that threshold. The resolution this system adopts (`risks.md` R-15):

> **One ornate element, alone on a near-empty field.** The crest keeps its full richness;
> restraint is produced by everything *around* it. This satisfies §26 and §27 simultaneously —
> the crest is "the life of the box" precisely *because* nothing competes with it.

**The failure mode to guard against is ornament *repetition*:** crest + border + pattern + foil +
illustration. Each addition is individually defensible and collectively fatal. Any screen or
surface gets **one** decorative move. That is the rule the rest of this document enforces.

---

## 1.1 The logo — supplied 18 August 2026

Numbered `1.1` rather than inserted as a new §2 because `architecture.md`, `content-style.md` and
`readme.md` already cite this document's sections by number; renumbering would break them.

Delivered via the §55 shared Drive as `Rejuveluxe LOgo.svg` and `Rejuveluxe-LOgo.png`. **This is the
"one ornate element" §1 exists to protect.** It is no longer hypothetical, and everything §1 says
about restraint now has a concrete referent.

### What was supplied — measured, not described

| Property | Value |
|---|---|
| Vector master | `.svg`, 110 KB, Illustrator export, **159 paths, 57 linear gradients** |
| Raster | `.png`, 1440 × 1440, RGBA, transparent |
| Artwork ratio | viewBox `1253.7 × 1345.06` → **0.932, portrait** |
| Text | **Converted to outlines** — no `font-family` reference anywhere in the file |
| Embedded raster | **None.** It is true vector throughout |

Two consequences worth stating plainly. **The logo has no font dependency**, so it renders
identically everywhere and is unaffected by the §3 typeface decision. And **the artwork is portrait
while the PNG canvas is square** — the 1440×1440 raster is padded, so anything measuring the mark
from the PNG will get its clear space wrong.

### What it contains

A scalloped cartouche in gold outline on a cream ground, holding: a **crown**; a teacup and saucer
with steam; **tea leaves** in sage-to-olive gradient; a **fleur-de-lis** on the cup face; the
**REJUVELUXE** wordmark in a high-contrast serif; a rule with a leaf ornament; the line
**EARNED NOT INDULGED** in letterspaced gold caps; and a scroll flourish beneath.

### Its actual colours, against our PROVISIONAL palette

Extracted from the SVG, not sampled from a screenshot:

| Role | Logo's value | §2's PROVISIONAL value | Verdict |
|---|---|---|---|
| Gold | `#af8746` | `#B08D4F` | **Effectively the same** — RGB delta (−1, −6, −9). §2 guessed well |
| Wordmark green | `#363a26` | `#26382A` (deep olive) | **Materially different** — the logo's is warmer and yellower; RGB delta (+16, +2, −4) |
| Cream ground | `#fff8ea` / `#fef6ea` | `#FBF8F2` (ivory) | Close; the logo's is warmer |

**Recommendation, `PROVISIONAL`:** adopt the logo's values as canonical for gold and the ground,
since a client-supplied fixed asset should not be asked to match a palette we invented. The green is
the real decision — `#363a26` is the wordmark's own colour, and a page setting headings in `#26382A`
beside the logo will read as two different greens rather than one system.

### The gold rule survives contact with reality

`#af8746` on the logo's own cream measures **3.12:1** — still below the 4.5:1 floor. §2's rule that
**gold is never body text** therefore holds against the real asset, not merely the guessed one.

The distinction to keep: *inside the logo*, gold **is** used for the "EARNED NOT INDULGED" line. That
is legitimate — it is a graphic, sized and spaced as artwork, not running text. It is not a licence
to set gold type on a page. The wordmark green at **11.1:1** on cream is the only part of the mark
that would pass as text.

### Placement rules (§27 — "the life of the box")

- **Clear space:** minimum one crown-height on every side, measured from the cartouche outline. The
  cartouche is the boundary, not the wordmark.
- **Minimum size:** `PROVISIONAL` — 32 mm wide in print, 120 px wide on screen. Below that the
  letterspaced "EARNED NOT INDULGED" line and the flourish fill in. **Needs proof at print
  resolution before it is relied on** — nothing has been test-printed.
- **Never** recolour, re-proportion, add effects, place on a busy field, or rebuild the mark from
  parts. The crest is used whole or not at all.
- **Never pair the logo with the tagline set separately.** The line is *inside* the mark; repeating
  it beside the mark is the ornament repetition §1 bans, and it reads as a stutter.
- **Never rasterise the logo to WebP or PNG for the web.** It is vector; ship the SVG. See
  `architecture.md` §7.

### Two conflicts — flagged, not resolved

**§30 bans "clichéd royalty imagery". The logo contains a crown and a fleur-de-lis.** §48 also lists
"overly ornate" under what the brand is *not*. This is not a small tension: it is the client's own
identity asset contradicting the client's own imagery rule, and §1's ornament-repetition ban makes
it sharper — if the crest already spends the royalty budget, no other surface may add to it.
Recorded as `risks.md` R-50 for Sayon and the client. **This document does not resolve it.**

**The logo sets the line as `EARNED NOT INDULGED`** — no comma, no full stop. §5 and §62 both give it
as **"EARNED, NOT INDULGED."** Punctuation inside a fixed vector asset cannot be changed without
re-artworking, so the question is whether body copy follows the logo or the brief. `risks.md` R-51.

---

## 2. Palette

§28 lists eight colours with no hierarchy or proportion. Assigning **roles** and **proportion**
is what turns the list into a system. "Refined rather than shiny" (§28) is read here as a
**quantity** instruction as much as a finish instruction.

### Roles and values — PROVISIONAL

> ## ⚠ SUPERSEDED FOR GROUND, INK AND ACCENT — READ §2.1 FIRST
>
> On 20 August 2026 Sayon inverted the system: the ground is now **dark**, not ivory, and text is
> **pure white**. §2.1 carries the values actually implemented. The table below is kept because
> §1.1, `features/accessibility.md` and several other sections cite its reasoning, and because the
> *proportions* and the gold and sage constraints all still hold. **Its Ground, Ink and Accent
> values do not.**

> **Read §1.1 before using two of these values.** The supplied logo (18 Aug 2026) carries its own
> gold `#af8746` and wordmark green `#363a26`. The gold is effectively identical to the value below.
> **The green is not:** §1.1 records that a page setting headings in `#26382A` beside the logo "will
> read as two different greens rather than one system", and recommends adopting the logo's value as
> canonical. That recommendation is **not yet ratified**, so the table below still states the
> original. Do not implement `#26382A` as the accent without checking whether §1.1's recommendation
> has been accepted — this is the one place in this document where two sections give different
> answers, deliberately, pending a decision.

| Role | Name | Value | Proportion | Use |
|---|---|---|---|---|
| **Ground** | Ivory | `#FBF8F2` | ~70% of any surface | Default page and pack background |
| Ground, alt | Cream | `#F4EFE6` | ~10% | Section separation, cards, quiet bands |
| Ground, bright | Warm white | `#FEFCF8` | as needed | Product cut-out backgrounds, lightboxes |
| **Ink** | Charcoal | `#2A2A27` | ~15% | All body text, most headings |
| Ink, maximum | Black | `#0B0B0A` | sparing | Display type where weight is wanted; never a large field |
| **Accent** | Deep olive | `#26382A` | ~5% | Full-bleed feature panels, primary buttons, the one colour move per screen |
| Accent, quiet | Muted sage | `#A8B5A0` | <2% | Dividers, inactive states, subtle fills. **Decorative only** |
| **Ornament** | Antique gold | `#B08D4F` | **<1% by area** | Rules, crest, small marks. Never a fill, never a large field |

### Hard constraints

- **Antique gold is never text.** `#B08D4F` on ivory is ≈2.8:1 contrast — below the 4.5:1 floor
  for body copy. It is a rule, a hairline, a crest colour. Not a headline, not a link, not a
  price. This is where "refined rather than shiny" becomes enforceable rather than aspirational.
- **Muted sage is never text** for the same reason (≈2.1:1 on ivory).
- **Charcoal on ivory ≈13:1**, deep olive on ivory ≈10:1, ivory on deep olive ≈10:1 — all pass
  comfortably. These three pairings carry every piece of readable content.
- **Gold and sage never appear on the same surface as each other** — two decorative colours is
  ornament repetition.

> Conformance target and the full contrast matrix live in `features/accessibility.md`, which is
> written *before* this document is finalised precisely because it constrains these values.

---

## 2.1 The dark inversion — 20 August, 2026

Numbered `2.1` rather than rewritten into §2 for the same reason §1.1 exists: other documents cite
this one by section number, and §2's reasoning about proportion, gold and sage is still correct.
**What changed is which end of the value scale the system sits at.**

Sayon: *"instead of a white based background on our website, we can have these two colours as the
base with white pure white text on it."* Then, when an interim build broke: *"keep the texts white
man, but background the hexcodes i mentioned."*

### The implemented values

| Role | Token | Value | Use |
|---|---|---|---|
| **Ground** | `--ground` | `#006241` | Default page ground, ~70% of any surface |
| Ground, alt | `--ground-alt` | `#004953` | Alternating bands, photo wells, quiet panels |
| Ground, deep | `--ground-deep` | `#00382f` | Footer, hero base, dark placeholder wells |
| **Ink** | `--ink` | `#ffffff` | All body text and headings. Pure white, as instructed |
| Ink, quiet | `--ink-quiet` | `#c9dcd2` | Secondary copy, labels, meta |
| **Accent** | `--accent` | `#ffffff` | The one light move: pill fills, focus ring |
| Accent, on | `--accent-on` | `#004953` | Type sitting **on** a light fill |

### Contrast — computed, not assumed

| Foreground | on `#006241` | on `#004953` | on `#00382f` |
|---|---|---|---|
| `#ffffff` white | **7.44:1** AAA | **10.11:1** AAA | 12.9:1 AAA |
| `#c9dcd2` ink-quiet | 5.19:1 AA | 7.05:1 AAA | 9.12:1 AAA |
| `#af8746` gold | **2.26:1 FAIL** | **3.07:1 FAIL** | 3.94:1 fails body |
| `#a8b5a0` sage | 3.46:1 fails body | 4.71:1 AA | 6.09:1 AA |

**Three things follow, and they are not cosmetic.**

1. **The user's two colours are a genuinely strong choice.** Both clear AAA against white. This is
   an accessibility *improvement* on the ivory system, not a compromise made for taste.
2. **§2's gold rule now has teeth.** Gold fails as text on every ground, not merely "below the floor
   on ivory". It is ornament, full stop, and the palette no longer makes that a judgement call.
3. **Two hardcoded tints had to be removed.** `#8fa492`, used seven times for 12 px labels, measured
   **2.80:1** on the green — a real regression introduced by the inversion, caught by computing
   rather than by looking. Both it and `#cbd6c9` were collapsed into `--ink-quiet`.

### What the inversion cost elsewhere

- **`--accent` did double duty** as text colour *and* as a dark surface fill (footer, hero base,
  product header). Flipping it to white would have turned the footer white. Those five surfaces now
  point at `--ground-deep`.
- **`color: var(--ground)` meant "cream text on a dark surface"** in nine places. With the ground
  now dark those became dark-on-dark. All nine moved to `--ink`.
- **`.pill--inverse` was deleted.** The base pill is already the light move on a dark ground, so an
  inverse variant had nothing left to invert.

**The two grounds sit only 1.36:1 apart.** Alternating them is a tonal shift, not a division, so
bands still need a rule or a photograph to separate them — do not rely on the colour change alone.

**Still open:** §2's proportions were written for a light system where the ground was the restful
surface. A dark ground at ~70% is a different perceptual load, and §1's "one ornate element on a
near-empty field" may read differently on it. Not resolved here. See `open-calls.md` #16.

---

## 2.2 The ground is `#091b20` — 21 August, 2026

Sayon, supplying two swatches: *"replace the first colour throughout the website with the second
colour."* Scope confirmed as **`#006241` only** — `--ground-alt` `#004953` and `--ground-deep`
`#00382f` are untouched and are still green.

**The ground is now near-black with a blue-green cast**, luminance **0.0095** against the green's
0.0912. This is the third ground this system has had in three days: ivory `#FBF8F2` (§2), green
`#006241` (§2.1), now `#091b20`.

### Every foreground improves, several by a lot

| Foreground | Role | on `#006241` | on `#091b20` | Change |
|---|---|---|---|---|
| `#ffffff` | all body text and headings | 7.44:1 AAA | **17.66:1 AAA** | more than doubles |
| `#c9dcd2` | secondary copy, labels, meta | 5.19:1 AA | **12.32:1 AAA** | AA → AAA |
| `#a8b5a0` sage | decorative | 3.46:1 (large only) | **8.23:1 AAA** | now usable as text |
| `#af8746` gold | ornament | 2.26:1 **FAIL** | **5.36:1 AA** | now passes |

### Measured on the page, not on the token

Shop page at 1366×900, walking every text node to its first non-transparent ancestor background:
**0 of 11 distinct text/background pairs fail WCAG AA.** The lowest ratio anywhere on the page is
**9.12:1** — the footer, on the unchanged `--ground-deep` green. Body copy, nav, prices and the
header wordmark all sit at 17.66:1.

For comparison, the green ground it replaced had `--ink-quiet` at 5.19:1 and gold failing outright.
**This is the most legible the site has been.**

### ⚠ The gold rule needs re-justifying, not repealing

Gold measured **2.26:1** on the green and **5.36:1** here. It now *passes* AA as text. The contrast
argument that has been enforcing "gold is never text" since §2 **no longer holds**, and anyone
citing the old number will find it out of date.

**The rule stands regardless**, on the ground it always actually rested on: §2's proportion — gold
is under 1% by area — and §1's ban on ornament repetition. Gold is ornament because it is ornament,
not because it was unreadable. `globals.css` carries this note inline so the passing ratio is not
read as permission. The visible consequence is benign and welcome: **the gold sparkle mark is
properly visible for the first time.**

### The bands still separate

`--ground-alt` and `--ground-deep` stayed green, which could have left them muddy against a
near-black page. Measured, they do not:

| Pair | Ratio |
|---|---|
| `#091b20` vs `#004953` | 1.75:1 |
| `#091b20` vs `#00382f` | 1.35:1 |
| `#004953` vs `#00382f` *(for scale)* | 1.29:1 |

Both are wider than the separation the two greens had between *themselves*, so §2.1's warning that
alternating bands need a rule or a photograph to divide them is **eased, not removed**.

### One correction on the record

`#2596be` was implemented first, from a hex given before the swatch was re-checked. It is a mid
azure rather than a near-black, and it **failed AA at every reading size** — white body text at
3.40:1, `--ink-quiet` at 2.37:1, gold at 1.03:1, five of eleven rendered pairs failing. Sayon
corrected the value to `#091b20` the same day. Recorded because the failing state was measured and
briefly live in the working tree, and because it is the reason `risks.md` R-58 exists at all.

**The lesson worth keeping:** a ground colour cannot be judged from a swatch. The two candidates
looked like the same decision and differed by a factor of 27 in luminance.

---

## 2.3 The candidate audit — 1 September, 2026

**ADR-0007** re-opened the ground colour on Sayon's direction ruling and made itself conditional on
this audit. It has now been run: every foreground the system uses or might adopt, against every
candidate ground including both references' own, computed per WCAG 2.x against the thresholds
`features/accessibility.md` §3 sets. Script in the session scratchpad; method identical to §2.1.

**Body-text AA passes, out of 8 foregrounds tested:**

| Ground | Source | AA @ 4.5:1 |
|---|---|---|
| **`#091b20`** | current `--ground` | **7 / 8** |
| `#00382f` | current `--ground-deep` | 6 / 8 |
| `#004953` | current `--ground-alt` | 6 / 8 |
| `#005f5b` | Slight Twist, second ground | 5 / 8 |
| `#14574b` | Slight Twist `--mai-tai--green-100` | 5 / 8 |
| `#0a6a66` | **Slight Twist's dominant ground** | **4 / 8** |
| `#eb373e` | MiCha header band | 1 / 8 |
| `#fff1f1` | MiCha body ground | 1 / 8 |

**`#091b20` wins, and not narrowly.** Its only failure is black, which nothing in this system puts on
it. White reaches 17.66:1, `--ink-quiet` 12.32:1, sage 8.23:1 — and **gold reaches 5.36:1, clearing
AA as text**, which is the re-justification §2.2 said the gold rule needed. Gold fails on every other
candidate ground tested (1.95:1 on Slight Twist's, 1.24:1 on MiCha's band).

### The references do not measure as well as they look

- **Slight Twist's own ground manages 4 of 8.** `--ink-quiet` lands at **4.49:1** — short of AA by
  0.01 — and sage fails at 2.99:1. Its shipped type does pass: butter `#fff8b5` at 5.92:1 and cream
  `#fffce4` at 6.21:1. Its decorative colours do not: pink 3.44:1, cyan 4.28:1, both large-text-only.
- **MiCha's navigation fails as shipped.** White on its `#eb373e` header band is **4.08:1**, and that
  nav is set at **15 px** — body size. That is a 1.4.3 failure on the primary navigation of the
  reference, found by computing rather than by looking at it.
- **MiCha's ground is unusable for this system.** 1 of 8: only black passes. Adopting it would mean
  discarding the entire existing foreground set, not adjusting it.

### The finding worth acting on

**Slight Twist's warm type colours are portable, and they land better on our ground than on theirs.**

| Foreground | on Slight Twist's `#0a6a66` | on our `#091b20` |
|---|---|---|
| butter `#fff8b5` | 5.92:1 AA | **16.27:1 AAA** |
| cream `#fffce4` | 6.21:1 AA | **17.07:1 AAA** |

So the warmth that makes the reference feel the way it does is available **without** taking its
ground, at nearly three times the contrast. That is the cheapest real win in this whole exercise: it
needs no palette migration, no rework, and no accessibility risk.

**Consequence for ADR-0007:** the audit supports the direction change on type, tracking, transitions
and token architecture, and **vetoes the ground substitution specifically**. Recorded in that ADR
rather than decided here — §2 does not overrule an ADR.

**Updated 2 September 2026:** that ADR is no longer `Proposed`. Items 1–4 were accepted and shipped
in `d59e081`; item 5, the ground substitution this section vetoed, stays struck.

**The expression accents, and the first attempt that failed.** As first shipped they were
`--sage` `#a8b5a0`, `--ink-quiet` `#c9dcd2` and butter `#fff8b5` — all AAA, all measured, and **on
screen they read as three slightly different greys**. ELEGANCE was `--ink-quiet` itself, the site's
default quiet ink, so that expression had no identity at all. **Nothing in a contrast table can
catch this**: the failure was hue separation, and the numbers only describe luminance. It was caught
by rendering the pages and looking at them, which is the argument for doing that as a step rather
than as a courtesy.

Revised the same day to separate by hue — green, cool silver, warm:

| Expression | Token | Value | `#091b20` | `--ground-deep` | `--ground-alt` |
|---|---|---|---|---|---|
| FOCUS | `--focus--accent` | `#8fd4a3` | 10.19 | 7.54 | 5.83 |
| ELEGANCE | `--elegance--accent` | `#bfd7ea` | 11.88 | 8.79 | 6.80 |
| LEGACY | `--legacy--accent` | `#fff8b5` | 16.27 | 12.04 | 9.31 |

`--ground-alt` is the weakest ground any of them sits on, and every value clears the 4.5:1 body
threshold there — the threshold that applies, since these are used at 12 px micro-caps rather than
at large-text size.

**LEGACY was deliberately not changed.** Butter already reads warm and distinct and is the one value
§2.3 explicitly endorsed. Richer ambers measured fine (`#ffe9a3` 14.66, `#f7dd8f` 13.20) but walk
toward gold, and §2 bans `--gold` as text whatever it measures. **Reopening that is a palette
decision, not a legibility one**, so it is left for a decision rather than taken here.

---

## 3. Typography — PROVISIONAL

The reference analysis (§7 below) points clearly at a high-contrast display serif for names and
headlines, with a quiet companion for everything else.

> **Tracking, added 2 September 2026 (ADR-0007 item 3, shipped in `d59e081`).** Large type now
> carries negative tracking: **`-0.026em` on `.display`**, the value measured on the reference at
> 88 px, easing to `-0.02em` at `.h1` and `-0.012em` at `.h2`. The home page's hero line sits
> outside this scale by design and carries `-0.026em` explicitly in `page.module.css`.
>
> **Nothing below `.h2` is tracked negatively**, and `.micro` keeps its `+0.12em` — the two move in
> opposite directions on purpose. Tracking that reads as considered at 84 px reads as broken at
> 24 px, which is why this is a curve and not one value.
>
> This is independent of the face. The display serif question (§3.2, R-68) stays open, and the
> tracking transfers to whatever answers it.

| Level | Face | Size / line-height | Use |
|---|---|---|---|
| Display | High-contrast serif | 64–96px / 1.05 | Product name as hero, homepage statement |
| H1 | Same serif | 40–56px / 1.1 | Page titles |
| H2 | Same serif | 28–36px / 1.2 | Section headings |
| H3 | Sans, medium | 18–20px / 1.3 | Sub-sections, field labels |
| Body | Sans, regular | 16–17px / 1.6 | All prose. Never below 16px |
| Small | Sans, regular | 14px / 1.5 | Statutory, captions, metadata |
| Micro | Sans, letterspaced caps | 12px / 1.4, +0.08em | Eyebrows, territory labels (FOCUS / ELEGANCE / LEGACY) |

**Rules.** Two families maximum — a third is ornament repetition. Body text is never justified,
never below 16px, never lighter than charcoal. Letterspacing is for micro-caps only; never on
body copy. Measure caps at ~68 characters.

**Candidates — `PROVISIONAL`, from the reference extraction in §8.4 and §8.5.1.** The faces are no
longer abstract: the closest reference names its own, and a directly comparable premium brand exposes
its serif in public.

**DECIDED 18 August 2026 — free typefaces only.** Sayon: *"we use free fonts btw."* R-39 closed.

| Role | Face | Licence | Why |
|---|---|---|---|
| Display | **Libre Caslon Display** | **SIL OFL — free** | The face Ladurée runs, found in its own `--font-laduree` token (§8.4). High-contrast serif that holds at hero scale, which is what §8.5.3's full-width product name needs |
| Body | **Nunito Sans** | **SIL OFL — free** | Ladurée's measured body face at 16px/24px. Humanist sans that stays quiet under a loud serif, per the two-family rule below |

**Editorial New is not licensed and must not be used** — it is a paid commercial release (Pangram
Pangram, from $40) and the free-fonts decision rules it out. It remains recorded in §8.5.1 only as
what the *reference concept* used, never as ours. Manrope, also free, is the fallback body face if
Nunito Sans proves wrong in use.

**Licensing — checked, 17 August 2026 (R-39).**

- **Manrope: free.** SIL Open Font License, confirmed at `google/fonts` → `ofl/manrope/OFL.txt`. It
  ships as a **single variable file**, `Manrope[wght].ttf`, so every weight costs one download — a
  direct win against the 300 KB budget rather than four separate static cuts.
- **Libre Caslon Display: free.** Also SIL OFL, at `ofl/librecaslondisplay/`.
- **Editorial New: paid.** Pangram Pangram releases it free for *personal use only*. Commercial use —
  which this is — **requires a purchased licence, from $40**. The foundry does **not publish its web
  licence terms**: whether that tier covers webfont embedding, and whether it bands by pageviews or
  domains, is unstated and needs a direct enquiry.

So the choice is a **$40-ish purchase and one email**, not a blocker. If the web terms turn out
restrictive or expensive, the fallback pairing is already fully open-licence and costs nothing.

**Still unmeasured:** actual WOFF2 payload for either pairing against `architecture.md` §7's 300 KB
ceiling. Measure before the ADR, not after.

Whichever wins must fit the **300 KB total web-font budget** in `architecture.md` §7 — roughly two
weights of display plus two of text. Record as an ADR when picked.

**The font budget is now a number.** `architecture.md` §7 sets **total web-font payload under
300 KB**, which typically permits *two weights of a display serif plus two of a text face* — not a
full family. Delivery rules that come with it: WOFF2 only, `preconnect` to the font origin, and
`font-display` set so text is never invisible while loading. That last one is a brand rule as much
as a technical one — a flash of invisible text on "EARNED, NOT INDULGED." is the brand statement
failing to appear. Subset to Latin plus the currency glyph; if a face is chosen whose display cut
alone breaks 300 KB, the choice is between a lighter face and using it only as an image in the one
or two places it is truly the hero.

---

## 3.1 The wordmark face — a third typeface, for one lockup only

Numbered `3.1` to preserve §4. Added 20 August 2026 after Sayon asked that the header wordmark be
set the way the crest sets it rather than in the site's general display face.

### The logo's own typeface is unidentified, and that is a finding, not a gap in effort

**Verified, not assumed:** both the shipped `logo.svg` and the un-optimised original in
`docs/assets/` contain **zero** `font-family` declarations, **zero** `<text>` elements, no XMP block
and no Illustrator `FontSet`. §1.1 recorded the text as outlined; that now holds for the original
too, so the name cannot be recovered from the file by any means. Anything beyond this is inference.

### What the artwork shows — measured from a high-resolution crop

- **Very high stroke contrast** — heavy stems against near-hairline thins
- **Small-caps setting**: full-height `R`, remainder at roughly **72%** of cap height
- **The `R` is the identifying mark** — a long, sweeping, outward-curving leg finishing in an
  upward flick, extending well past the bowl
- `J` descends below the baseline; `U` has a full right-hand stem (Roman construction)
- Serifs are fine, sharp and lightly bracketed — **not** the flat unbracketed slabs of a true Didone

### The candidates, rendered rather than recalled

Prata, Playfair Display, Cormorant Garamond, Libre Caslon Display, Gilda Display and Cinzel were all
rendered against the crop at matched size. **None matches.** Cinzel and Playfair are clearly out —
their `R` legs are short and straight. Cormorant and Gilda are too light.

**Prata is the closest**, on stroke contrast, stem weight and Roman construction. Its `R` leg is
still shorter and does not sweep. The absence of that leg from any tested open-source serif suggests
the original is a **commercial or bundled display face**, not a Google Font.

### The decision

**Prata, weight 400, Google Fonts, for the header lockup and nothing else.** Body copy and headings
stay on §3's Libre Caslon Display. This is the single place the site runs a third typeface, and the
reason is that the wordmark sits **beside the crest** — it has to answer to the artwork, not to the
page.

Set in the crest's own construction: the CSS `font-size` is the *small-cap* size and the `R` scales
from it at `1.39em` (`1 / 0.72`), so the two stay locked at every viewport. Tracking is `0.03em`,
because the artwork is tightly set; the `0.13em` of the earlier all-caps version read as a different
lockup entirely. The DOM text stays `Rejuveluxe` — the split is presentational, so screen readers
and copy/paste get an ordinary word.

**This is an approximation and must not be recorded as a match.** Two ways to close it properly:
run the saved wordmark crop through WhatTheFont or Fontspring Matcherator, or simply **ask whoever
supplied the logo** — it arrived via the §55 shared Drive on 18 August and that is a one-line
question for the client list.

**If the real face turns out to be commercial**, matching it becomes a licensing and web-font cost,
not a style pick. `risks.md` R-39 tracks font licensing and this belongs to it.

### IDENTIFIED — 21 August 2026. It is Bizantheum, and it is not licensed for this.

Sayon named the face. It is **Bizantheum**, a display serif by Linggar Sundoro, published by
**Aluyeah Studio**. Byzantine-architecture inspired, 130+ alternates. That resolves the open
question above and confirms the inference: it is not a Google Font, which is why no free serif
tested had that sweeping `R` leg.

**It cannot be used as things stand, and this is a licensing constraint, not a preference:**

- **Free for personal use only.** Commercial use requires a purchased licence.
- **A web licence is priced separately from desktop.** Buying the desktop font does not permit
  `@font-face` on a storefront.
- Nothing matching it exists on the build machine, and it is absent from Google Fonts, so
  `next/font` cannot fetch it.

**Prata therefore remains in place as a stand-in**, and the gap between them is the `R`. Downloading
Bizantheum from a free-font aggregator and shipping it would put an unlicensed commercial face on a
client storefront; that is not a shortcut, it is exposure, and it was refused rather than taken.

**Three ways out**, in the order they cost least: the client already owns a licence and can supply
the files; buy a **webfont** licence; or accept Prata and stop treating the crest as matchable.
Recorded as `open-calls.md` #19. `risks.md` R-39 owns the money and the licence trail.

A high-resolution crop of the artwork's own wordmark is kept at `assets/wordmark-crop.png` for
comparison against whatever gets licensed.

---

## 4. Mobile first — a build rule, not a breakpoint

**Every surface is designed and built at 360px first, then enhanced upward. Never designed at
desktop and shrunk.** This is a hard rule, applied from the first component, because retrofitting
mobile is the single most expensive kind of rework in a storefront — it changes layout, component
structure, image strategy and checkout flow all at once, and it always lands late.

Three reasons it is the baseline here rather than a consideration:

1. **§35 names mobile-friendly explicitly**, alongside "spacious" and "fast" — three requirements
   that are easy to satisfy on a wide screen and only meaningfully tested on a narrow one.
2. **The buyer arrives from social.** §42 makes social a launch pillar and §57 puts social icons
   among the first assets. Traffic from Instagram is mobile in-app traffic. At these price points
   the discovery moment and the purchase moment are the same session on the same phone.
3. **`architecture.md` §3 already targets a mid-range Android on Indian 4G.** If the design
   baseline were desktop, the performance budget and the design would be measuring different
   products. They must agree, and the phone is the honest one.

### Breakpoints

**360 (baseline — design and build here first)** · 480 · 768 (tablet) · 1024 · 1440 · 1920+.

Layout decisions are made *at* 360 and relaxed as space allows. If something only works once there
is room for it, it is a desktop enhancement and must degrade cleanly, not a requirement.

### Non-negotiable at 360

| Rule | Why |
|---|---|
| **No horizontal page scroll, ever** | Only deliberate carousels and wide tables scroll, each inside its own container |
| Touch targets **≥ 44px**, with **≥ 8px** between adjacent ones | Already required of fields in §5; it applies to every interactive element, including nav and variant pills |
| **No hover-only affordance** | Anything discoverable only on hover does not exist on a phone. Hover is decoration; tap is the contract |
| Form inputs **≥ 16px** | Below that, iOS Safari zooms on focus and the layout jumps mid-checkout |
| Correct `inputmode` / `autocomplete` / `type` on every field | Numeric keypad for pincode, phone and card; autofill for name and address. This is the cheapest checkout conversion work there is, and it is invisible if skipped |
| Primary action reachable in the lower half of the screen | Thumb reach. §5's full-width primary button is the mobile pattern, not a compromise |
| `width` and `height` on every image | Holds §3's CLS budget; a shifting layout on a phone is worse than on a desktop because the target moves under the thumb |
| Sticky elements budgeted | At most one persistent bar. Two sticky elements on a 360×640 viewport consume the page |
| Modals are full-screen sheets | Centred desktop modals trap and clip on small viewports |

### Checkout is the surface where this actually costs money

Browsing badly on mobile loses interest; checking out badly on mobile loses the order — and at
₹999–₹4,999 an abandoned cart is not a rounding error. Checkout is therefore specified mobile-first
before its desktop layout exists: one field per row, no multi-column forms, address autofill,
numeric keypads, errors adjacent to their field and never only at the top, and no step that
requires horizontal scrolling or a hover to discover.

### How it is verified

DevTools responsive mode is a first check, not evidence. Before a surface is called done it is
opened **on a real mid-range Android phone**, on a real network — the same device class
`architecture.md` §3 budgets against. That check is a line in `conventions.md`'s Definition of done
so it cannot be quietly skipped.

### Spacing and grid

**Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
Whitespace is a §26 material, not leftover space — when in doubt, go one step up the scale. The
scale is shared across breakpoints; mobile uses its lower half, and §26's restraint is *harder* to
hold at 360px, which is exactly why the narrow view is where the design is judged.

**Grid:** single column at 360 with 20px outer margins. 12 columns, 24px gutters and a 1280px max
content width from 1024 up, with ≥64px outer margins. Editorial sections may break to full-bleed;
text never runs edge to edge.

---

## 4.1 The laptop band — measured 20 August 2026

§4 above is about the narrow end and it holds. This section is about the band nobody looked at:
**1024 to 1920**, where almost every desktop visitor actually is. It exists because the storefront
was reported as looking right on the author's screen and cramped on smaller laptops, and that turned
out to be true, reproducible, and caused by a single mechanism.

### How this was measured

Real Chromium (Playwright, `chromium-1228`) against the running dev server, four routes — home,
shop, collection, PDP — at eleven viewport widths from 1024 to 2560. Heights are the **CSS viewport
after browser chrome**, not the screen height: a 1366×768 laptop gives the page roughly 1366×658,
and measuring against 768 would flatter every result. Probed per viewport: computed styles,
bounding boxes, `scrollWidth` vs `clientWidth`, resolved grid tracks, and character-measure via a
rendered reference glyph. Nothing here is estimated from the CSS by reading it.

### The response curve

Home page. Every column is a computed value, not a declared one.

| Viewport | Content (`.wrap`) | Outer margin | `.display` | `h2` | Card | Gap | Section pad |
|---|---|---|---|---|---|---|---|
| 1024 | 922 | 51 | 71.7 | 47.1 | 287 | 30.7 | 92.2 |
| 1152 | 1037 | 58 | 80.6 | 52 | 324 | 32 | 103.7 |
| 1280 | 1152 | 64 | 84 | 52 | 363 | 32 | 104 |
| **1366** | **1238** | **64** | 84 | 52 | 391 | 32 | 104 |
| 1440 | 1280 | 80 | 84 | 52 | 405 | 32 | 104 |
| 1536 | 1280 | 128 | 84 | 52 | 405 | 32 | 104 |
| 1600 | 1280 | 160 | 84 | 52 | 405 | 32 | 104 |
| 1728 | 1280 | 224 | 84 | 52 | 405 | 32 | 104 |
| 1920 | 1280 | 320 | 84 | 52 | 405 | 32 | 104 |
| 2160 | 1280 | 440 | 84 | 52 | 405 | 32 | 104 |
| 2560 | 1280 | **640** | 84 | 52 | 405 | 32 | 104 |

**Read the last six rows.** From 1440 to 2560 — a 78% increase in viewport width — every design
variable is frozen. Type, cards, gaps, section padding, content width: identical. The design has
exactly **one degree of freedom above 1440px, and it is the outer margin**, which moves 8× across
that range.

That single free variable is the one carrying §26's "whitespace is a material" and §35's "spacious".
So the brand's core visual quality is, above 1440, the *only* thing that varies — and it varies
enormously.

### The mechanism, stated plainly

Two independent controls set the horizontal frame, and they hand over at ~1408px:

- **Below ~1408** the content cap is never reached, so the margin is `--page-x`, which tops out at
  **64px** (`clamp(20px, 5vw, 64px)`). Content keeps growing toward a fixed gutter.
- **Above ~1408** `.wrap`'s `max-width: 1280px` binds, and margin becomes `(viewport − 1280) ÷ 2`,
  which grows without limit.

Expressed as the ratio the eye actually reads — content width against the margin beside it:

| Viewport | Content : margin | Reads as |
|---|---|---|
| 1280 | **18 : 1** | tight |
| **1366** | **19.3 : 1** | **tightest point on the entire curve** |
| 1536 | 10 : 1 | tight |
| 1920 | 4 : 1 | comfortable |
| 2304 (1920 @ 80% zoom) | **2.5 : 1** | airy, editorial — *the view the design was approved in* |

The design was judged at roughly 2.5:1 and ships at 19.3:1. Nothing is broken, nothing overflows —
the proportion simply inverts, and proportion is the whole argument of this brand.

**A second-order effect worth knowing:** capped content and full-bleed sections diverge as the
viewport widens. The home page's ritual split is full-bleed, so its two panels measure 640px each at
1280 and **1152px each at 2304** — each panel alone then being wider than the entire capped content
column above it, while the copy inside stays pinned at `42ch`. The page's rhythm is not merely
looser on a wide screen; it is differently composed.

### Why 1366 is both the worst case and the most likely one

Statcounter, **desktop screen resolution, India, July 2026**:

| Resolution | Share | Note |
|---|---|---|
| **1366×768** | **7.06%** | #1 desktop resolution in India |
| 393×870 | 6.35% | mobile, counted in the desktop feed |
| **1536×864** | **6.15%** | 1920×1080 at 125% Windows scaling |
| 360×800 | 5.36% | mobile |
| **1920×1080** | 5.22% | below both of the above |

India-only matters here, because R-23 fixes the market as India at launch. The two most common true
desktop viewports in this market — 1366×768 and 1536×864 — are **both below the 1440 point where
this design stops responding**, and 1366 sits exactly at the tightest point of the curve. The wide
viewport the design reads best in is a minority case.

Note these are *screen* resolutions; the browser viewport is smaller again by the chrome, and
smaller still for anyone at a non-100% zoom.

### The vertical half of the same problem

The hero is `min-height: min(72vh, 620px)`. Because `72vh` binds on short laptops and the `620px`
cap binds on tall ones, the hero's share of the first screen *rises* as the laptop gets smaller:

| Viewport | Hero | % of fold | Left for everything else |
|---|---|---|---|
| 1280×800 | 497 | 72% | **193px** |
| **1366×768** | 474 | **72%** | **184px** |
| 1536×864 @125% | 543 | 72% | 211px |
| 1920×1080 | 620 | 64% | 350px |
| 2304 (zoomed out) | 620 | **54%** | **538px** |

At 1366 the first element below the hero is the section *wrapper* — the collection heading, the
ghost header and all three cards are below the fold. At 2304 the ghost header, "Three expressions.
One origin." and the tops of all three cards are visible on first paint. **These are two different
first impressions of the same page**, and the first impression is what decides whether anyone
scrolls. The author sees the good one.

### The process defect underneath the CSS defect

The CSS is fixable in an afternoon. The reason it shipped is not.

**A zoomed-out browser reports a larger CSS viewport.** At 80% zoom a 1920 screen presents as 2304
CSS px. Every judgement made in that window — is this spacious, is the type too big, does the hero
breathe — was made at the extreme wide end of a curve that is flat there and steep below. The design
was never wrong on the author's screen; the author's screen was never the reader's.

This is the desktop mirror of §4's mobile rule. §4 already says a surface is judged at 360 and not
at whatever the developer's window happens to be. The same discipline was missing at the wide end,
so:

> **The desktop reference viewport is 1366×768 (≈1366×658 of CSS viewport), at 100% zoom.**
> A surface is judged there, not on the author's monitor. If it reads spacious at 1366 it reads
> spacious everywhere above; the converse is false, and the converse is what happened here.

Checking the browser's own zoom indicator before judging any layout is part of this. So is the fact
that a screenshot pasted from a zoomed-out window is not evidence about the design.

### Rules

1. **Judged at 1366.** Per the box above. 1280×800 is the secondary check — it is the shortest
   laptop fold in common use and the tightest horizontal case after 1366.
2. **The supported desktop band is 1024 → 2560.** Below 1024 is §4's territory. Above 2560 is not
   designed for and must merely not break.
3. **Outer margin is a designed value across the whole band, not a leftover.** The content cap and
   the gutter must be chosen *together* so that one always binds; the ~1408px handover where neither
   does is what produces the 19.3:1 pinch. Stated as a testable invariant: **the content-to-margin
   ratio must stay inside a declared band from 1280 to 2560.** The specific numbers are a design
   call and are **not settled here** — see R-54.
4. **Nothing may be frozen across more than one screen-size class.** If a variable is identical at
   1440 and at 2560, that is a decision to be made deliberately and written down, not a clamp
   ceiling nobody revisited.
5. **The fold carries evidence, at every supported viewport.** The next section's heading must be
   visible above the fold at 1366×658 — not just at the author's viewport. The hero's `vh` figure is
   the lever; its current `72vh` fails this and the replacement value is PROVISIONAL pending R-54.
6. **Full-bleed sections declare their own maximum.** A full-bleed band that keeps growing past
   ~1600 while the content column is capped changes the page's composition rather than just its
   scale. Either cap the band's inner content or accept the divergence explicitly.
7. **`clamp()` slopes are chosen against the band, not against 320→1920.** A clamp whose ceiling is
   reached at 1200 is a fixed value everywhere a laptop actually is.
8. **Every `clamp()` preferred value carries a `rem` term.** Pure `px`+`vw` math is immune to the
   user's font-size preference — see the defect below. `clamp(2rem, 1rem + 3vw, 5.25rem)`, not
   `clamp(32px, 4.6vw, 84px)`.
9. **Viewport height uses `dvh`/`svh`, not `vh`,** wherever a mobile browser bar can collapse over
   it. *(Support is near-universal but this project has no declared browser baseline — see R-56.)*

### What already passes — do not "fix" these

Reported honestly, because four plausible suspects were measured and cleared, and rewriting them
would be churn:

| Checked | Result |
|---|---|
| Horizontal overflow, all four routes, 320 / 360 / 640 / 1024 → 2560 | **None anywhere.** `scrollWidth` equals `clientWidth` at every width tested |
| **WCAG 1.4.10 Reflow** — 320 CSS px (= 1280 @ 400% zoom) | **Passes**, home and PDP, no two-dimensional scrolling |
| **WCAG 1.4.4 Resize text** — 640 CSS px (= 1280 @ 200%) | **Passes**, structurally |
| Header nav crowding across 1280 → 2304 | **No crowding.** 658px of slack at the tightest; the nav folds at 960 as designed |
| "Add to cart" above the fold on the PDP | **Visible at every laptop viewport**, top at 524px in all cases |
| Body copy line length | 31–62ch — inside the readable range and under `--measure`'s 68ch |

The fluid foundation is sound. `clamp()` is used throughout, grids are `minmax(0, 1fr)`, and nothing
overflows. The problem is a ceiling set too low and a band never reviewed — not a broken layout.

### One accessibility defect, found while measuring

**The type scale does not respond to the user's browser font-size setting.** With the root font size
raised 16px → 20px → 24px, every computed size on the home page is unchanged:

| Root | `.display` | `h2` | body | `.body-lg` | `.micro` | `.pill` |
|---|---|---|---|---|---|---|
| 16px | 84 | 52 | 16 | 17 | 12 | 12 |
| 20px | 84 | 52 | 16 | 17 | 12 | 12 |
| 24px | 84 | 52 | 16 | 17 | 12 | 12 |

Two causes, both in `globals.css`: `body { font-size: 16px }` discards the inherited preference at
the root, and every clamp below it is `px` + `vw` with no `rem` term, so nothing downstream recovers
it. A visitor who has enlarged their default text — the most common accommodation there is — gets no
change at all. Page zoom still works; the font-size preference does not. Tracked as **R-55**, and
rule 8 above is its fix.

### How this is verified

The viewport matrix is a measurement, not an eyeball. It reruns against a dev server and reports
computed values, and it belongs in the check command once one exists (`readme.md`, Development).
Until then it is a script in the session scratchpad and this section records its output and date.

Minimum matrix for any surface before it is called done: **360 · 1024 · 1280 · 1366 · 1536 · 1920**,
plus **320 CSS px** for reflow. Real-device checking on a mid-range Android stays as §4 requires it —
this matrix supplements that check, it does not replace it.

---

## 5. Components and their states

Every interactive component defines all of: **default, hover, focus-visible, active, disabled,
loading, error**. A component missing a focus state is incomplete, not merely unpolished.

| Component | Notes |
|---|---|
| Primary button | Deep olive fill, ivory label. Full-width on mobile; generous on desktop. The reference's full-width buy button is a good pattern |
| Secondary button | Charcoal hairline, transparent fill |
| Text link | Charcoal with a 1px underline offset. **Never gold** |
| Product card | Packshot on warm white, name in serif, territory in micro-caps, price in body. No badges, no ribbons, no "sale" affordance — none should ever exist |
| Variant selector | Pill row for weight (50 g). Sold-out state is visible, not hidden |
| Quantity stepper | Plain numeric |
| Field | 44px minimum touch target, label above, error below in charcoal — **not red**; a red error state would be the loudest colour on the page |
| Accordion | For PDP secondary fields (ingredients, storage, statutory) so §38's long field list does not crush the page |
| Notice / banner | One reserved slot, sitewide. Never used for promotion |
| Nav | Two tiers — primary range, secondary story/gifting. See `features/search.md` |

**Components deliberately not in this system:** countdown timers, urgency badges, "only N left",
discount ribbons, spinning offers, exit-intent modals. §49/§50 rule out the commercial mechanic;
building the component at all invites its use.

---

## 6. Motion

§35 is explicit: *do not overload pages with animations or decorative effects that reduce
usability.*

| Rule | Value |
|---|---|
| Durations | 120ms micro (hover, focus) · 240ms standard (reveal) · 400ms maximum |
| Easing | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Permitted | Opacity, small translate (≤16px), image cross-fade |
| Forbidden | Parallax, scroll-jacking, entrance animations on every section, autoplaying carousels with motion, anything that delays reading |
| `prefers-reduced-motion` | Honoured — all non-essential motion removed, not merely shortened |

Restraint in motion is the same argument as restraint in ornament: one move, not five.

### 6.1 The hero is a named exception to this table — 21 August, 2026

**The table above governs the site. The homepage hero no longer obeys it, on instruction, and that
is recorded here rather than left as a silent contradiction between the docs and the code.**

Three separate directions from Sayon built this up, each one asked for after seeing the compliant
version and finding it too quick or too static:

| Element | Value | Which rule it breaks |
|---|---|---|
| Copy reveal on load | 850ms, staggered 200/400ms | 400ms ceiling |
| Copy arrival per slide change | 950ms in, 220ms out | 400ms ceiling |
| Frame 1 Ken Burns loop | `scale(1.05)`↔`1`, 6s legs, infinite | 400ms ceiling; scale is not a permitted property |
| All of the above, repeating | every 6s, forever | "autoplaying carousels with motion" |

**What did NOT bend, and must not.** `prefers-reduced-motion` still removes every one of these
outright rather than shortening them. That is checked in code and not left to the global rule in
`globals.css`, which is **insufficient**: it sets `animation-duration: 0.01ms` and leaves
`animation-delay` untouched, so a delayed element holds its transparent start state for the full
delay and then snaps in. The hero sets `animation: none` and `transition: none` explicitly and pins
its fade phase to "in".

**The easing is still this table's**, except the Ken Burns loop, which is a symmetric
`cubic-bezier(0.45, 0, 0.55, 1)`. The reason is worth keeping: the loop uses `alternate`, so under
the table's front-loaded curve — or under `linear` — the scale reaches each turning point at full
speed and reverses instantly. Easing symmetrically makes the reversal the quietest moment of the
animation instead of the sharpest.

**The asymmetry rule that came out of this.** The copy's exit is 220ms while its arrival is 950ms.
Symmetrical durations were tried and rejected: a slow exit leaves the OUTGOING words legible for
half a second after the image has begun changing, which reads as the text lagging the picture.
**Leaving should be quick; arriving can take its time.**

**This exception is the hero's alone.** Nothing else on the site may cite it. If a second surface
wants motion past 400ms, that is a new decision, not a precedent already set.

---

## 7. Imagery direction

**Required (§29):** quiet luxury · tactile materials · close-up tea detail · preparation rituals ·
premium ceramics · steam · pouring · texture · soft natural light · controlled shadows · rich but
restrained environments.

**Forbidden (§30):** mountains and Himalayan scenery · generic tea plantations unrelated to
sourcing · mass-market chai · overly rustic wooden settings · excessive Indian motifs · clichéd
royalty imagery · wellness stock · unverified estate photography.

**Why the mountain ban is a truth rule, not a taste rule** (*inference*, and worth preserving as
such): Assam tea comes from the Brahmaputra valley — floodplain and low adjacent hills, not
mountains. Mountain imagery misrepresents the origin the brand is staking its story on, and the
informed buyer will notice. It is a provenance-credibility matter that happens to look like an
aesthetic note.

**Unverified estate photography** is the same failure in a different medium: a photograph asserts
a sourcing claim as surely as a sentence does. §16's prohibition applies to images.

---

## 7.1 The stand-in set — 21 August, 2026

Numbered `7.1` for the reason §1.1 and §2.1 are: other documents cite this one by section number.

The client needs to see a populated storefront before a shoot exists, so the placeholders are now
filled with **licensed stock**. This section records what was chosen, what was refused, and the one
rule that decided both.

### The rule that governs every choice

> **A stand-in may show the tea, the making of it, or the vessel. It may never show a place.**

That falls straight out of §7 above. Leaf, steam, foam, a whisk, a cup — these are *material*
photography, and they assert nothing that could later turn out to be false. A garden, a hillside, a
plantation or a picker is **provenance** photography: it shows a real place that is not our
supplier, so publishing it makes a sourcing claim in exactly the way §30 forbids and R-01/R-03 say
we cannot support. Stock cannot fix that, because the problem is not the picture's quality.

The corollary matters as much: **no people.** Beyond the sourcing claim, a stock photograph of an
identifiable person implies a relationship to the brand that does not exist, and depends on a model
release we have never seen. Hands preparing tea are fine; faces are not.

### What is in the set

Seven files, `public/stock/`, **528 KB total**, WebP throughout per `architecture.md` §7.1.

| File | Subject | Used for | KB |
|---|---|---|---|
| `hero-steam.webp` | Dark bowl, steam, warm backlight | Home hero, full bleed | 33 |
| `matcha.webp` | Bamboo whisk on whisked green foam | Assam Matcha | 182 |
| `silver-needle.webp` | Steam off a pale cup, soft daylight | Silver Needle Assam | 23 |
| `golden-tips.webp` | Dry black leaf, macro | Assam Golden Tips | 120 |
| `green-tea.webp` | Leaves standing in a glass, dry leaf beside | Green Tea | 62 |
| `ritual-set.webp` | Matcha whisked in a bowl, tools beside | The Matcha Ritual Set | 41 |
| `ritual-band.webp` | Same frame, landscape crop | Home ritual band | 58 |

The Ritual Set and the ritual band share one source deliberately: it is the same product, and a
second, different photograph would imply a second set.

### Provenance

All Unsplash. The **Unsplash Licence** grants an irrevocable worldwide licence to use images
commercially with **no attribution required**; it forbids only selling the image itself unmodified
and building a competing stock service. Neither applies. *(Checked against `unsplash.com/license`
on 21 August 2026.)*

| File | Unsplash ID |
|---|---|
| `hero-steam.webp` | `photo-1635811831672-179f83a049be` |
| `matcha.webp` | `photo-1589698272390-0501a07619bb` |
| `silver-needle.webp` | `photo-1596098823457-74e360fcd023` |
| `golden-tips.webp` | `photo-1713084875210-4167712dde80` |
| `green-tea.webp` | `photo-1641997827830-12fa1d1a238d` |
| `ritual-set.webp`, `ritual-band.webp` | `photo-1746932451426-209444cd613a` |

Sources are fetched at `?w=1400&q=80&fm=jpg`, cropped with attention-based cover to the ratio the
slot actually uses, and re-encoded WebP q78–80. Recorded so the set can be rebuilt byte-for-byte
rather than re-chosen.

### What was refused, and why

Reviewed by eye, not by keyword — every one of these passed a text search and failed on sight:

| Rejected | Why |
|---|---|
| `hero.jpg`, the terraced hillside **that was live on the home page** | Mountains behind a plantation. §30 bans "mountains and Himalayan scenery" *and* "generic tea plantations unrelated to sourcing". Terraced hillside tea is also characteristically Vietnamese or Chinese; **Assam is Brahmaputra floodplain**, so the frame contradicts the origin as well as the rule |
| `garden-assam.jpg` — women in mekhela chador in a garden | Unverified estate photography, and five identifiable people implying a relationship to the brand that does not exist |
| `pexels-ali-123-…jpg` — pickers with conical hats and green baskets | Same, and the dress and baskets read Southeast Asian rather than Assamese |
| A gold plate with **rose petals** scattered on it | Would imply a flavoured botanical blend. Every product in the catalogue is unflavoured whole leaf |
| Two otherwise good cups, each with a **tea bag and paper tag** in frame | A tea bag is a mass-market signal and §48 puts "not mass market" in writing |
| A Japanese tea ceremony set on tatami | Beautiful, and the wrong culture's ritual for an Assam brand |
| Teapots on weathered wood boards | §30 bans "overly rustic wooden settings" |

### Verified, not assumed

Measured on the production build at 1366×658:

- **Page weight** — home 281 KB, shop 370 KB, collection 288 KB, PDP 294 KB, all formats WebP.
  Against `architecture.md` §7's 1.5 MB product-page budget, the PDP is at **20%**.
- **Hero legibility** — the white headline sampled against the 79,730 pixels actually behind it:
  worst single pixel **4.72:1**, mean 11.2:1. Large text needs 3:1, so it clears the *body* floor
  with room. This is measured on the rendered composite, filter and gradient included.
- **Alt text** — every image has an `alt`; none contains an em or en dash, per `content-style.md`
  §7.1.

### Standing conditions

1. **This set is temporary and is not a look.** It is competent stock chosen to be inoffensive to
   the rules. It is not art direction, and it should not be shown to the client as the visual
   answer — only as proof the layout works with photography in it.
2. **It must not survive contact with a real shoot.** Replace the whole set at once; a page that is
   half real photography and half stock reads worse than either. `risks.md` **R-57**.
3. **Nothing in this set may be used on packaging, in advertising, or in any printed surface.** The
   licence permits it; the brand rules do not, and print is where an unverified image becomes
   permanent.
4. **A new stand-in follows the same rule or it does not go in.** Tea, making, vessel. Never a
   place, never a face.

---

## 8. Reference analysis

Three sites were supplied as concepts and reviewed directly (screenshots captured 17 August, 2026 —
not recalled from memory).

### Ladurée India — `laduree.in`

**Take:** centred gold serif wordmark with generous clear space (a working example of §27's
"life of the box"); a dedicated gifting tier in the navigation rather than a seasonal add-on,
which matches §32; the "compose your box" customisation pattern, directly relevant to the
Regular Gift Box; neutral ground with product photography carrying all the colour.

**Avoid:** it has **no working cart or checkout** — it is a storefront that pushes you in-store.
It is an art-direction and gifting-architecture reference, not a commerce reference, which is the
opposite of what we are building. Also a five-slot hero carousel; §35's "spacious, fast" argues
for one considered statement over five rotating ones.

### KitKat — `kitkat.com`

**Take:** full-bleed single-brand-colour fields as section dividers — the structural device
translates well to deep olive even though the register could not be further from ours; and the
three-up "what makes it different" module (unique shape / crispy wafers / crush-and-spread), each
with a product cut-out on a circle. That module is a **craft explainer**, and it maps almost
exactly onto §12's process territory and §39's "How is it made?".

**Avoid:** essentially all of its visual language — loud red, heavy condensed uppercase, playful
register. Everything in §48's "is not" column. Take the structure, discard the voice.

### "Harmony of Taste" — Behance concept *(closest of the three)*

**Take:** deep green on cream/ivory, which is §28's territory already working at scale; a
high-contrast display serif setting the product name as a full-width typographic hero; the
packshot floating alone on a solid colour field — a direct execution of "one element on a
near-empty field"; oversized ghost-text section headers as a distinctive editorial device;
attribute rows (country, article number, character meters) that map onto §38's field list; weight
variant pills; a "similar tastes" grid answering §38's Related Products; and responsive
treatments shown at 320 / 640 / 1920.

**Avoid — and this one is specific:** its stat pills include **"20% off the first order"**.
That single module violates §49 and §50 outright. It is recorded here because it sits inside the
reference we are otherwise following most closely, which is exactly how a discount mechanic gets
built without anyone deciding to build one.

### 8.4 Measured extraction — 17 August, 2026

§8 above is the qualitative reading. This is what was **machine-extracted** from the live sites:
computed styles, `@font-face` declarations, CSS custom properties and a colour census weighted by
rendered area. Headless Chromium at 1440×900. Not recalled, not eyeballed.

**Ladurée India — extraction succeeded.**

The site exposes its own brand token: `--font-laduree: 'Libre Caslon Text', serif`. That is the
single most useful thing in this section — a directly comparable premium confectionery brand naming
its display face in public, and **Libre Caslon Text is an open-licence family**, which speaks to the
licensing-cost worry in §3.

| Role | Measured |
|---|---|
| Display / brand | `Libre Caslon Text` (token); `georgiaBold` serif in practice, 32px/700 |
| Body | `Nunito Sans` 16px / 24px line-height (1.5), weight 400 |
| Navigation | `georgia`, 14px, **uppercase** |
| Loaded families | Libre Caslon Text (400, 700) · Nunito Sans (200–900) |

Colour census, ranked by rendered area — and this is the finding that matters:

| Measured | Hex | Area | §28 equivalent |
|---|---|---|---|
| `rgb(227,230,209)` | **#E3E6D1** | 943,538 px² — dominant ground | muted sage |
| `rgb(255,255,255)` | #FFFFFF | 820,846 px² | warm white |
| `rgb(238,246,232)` | #EEF6E8 | 465,840 px² | ivory, green-cast |
| `rgb(209,229,188)` | #D1E5BC | 133,920 px² | muted sage, lighter |
| `rgb(132,117,78)` | **#84754E** | 5,850 px² — **0.4% of area** | **antique gold** |
| `rgb(81,68,52)` | #514434 | headings | deep olive / brown |
| `rgb(59,59,59)` | #3B3B3B | body text, 32 elements | charcoal |

**The gold discipline is empirically confirmed.** §5's rule caps antique gold at *under 1% by area
and never text*. Ladurée measures at **0.4%** — a real premium brand independently landing inside the
constraint this document set from first principles. That rule is no longer just an argument.

**KitKat — extraction FAILED.** `kitkat.com` returned Nestlé's *"This site is temporarily
unavailable"* interstitial: zero `@font-face`, zero loaded fonts, Arial fallback, one white
background. §8's KitKat take stands on the earlier screenshot session; **nothing in it is confirmed
by this pass** and it should not be treated as measured.

**"Harmony of Taste" — read from the source boards**, since a Behance concept is images and carries
no extractable CSS. Seven boards at 1400px pulled and read directly.

Typography: an **uppercase high-contrast display serif at hero scale with tight leading**, set cream
on deep green or green on cream; a neutral sans for body; and **letterspaced uppercase micro-caps**
for eyebrows and labels (`ONLINE STORE`, `OUR ASSORTMENT`) — the same device §3 assigns to
FOCUS / ELEGANCE / LEGACY.

Its product page is worth naming field by field, because it is §38's list already laid out:

- Breadcrumb → product name as **full-width display-serif hero**, uppercase
- Packshot alone, centred, on a flat colour field — §26's restraint, executed
- Left rail: variant pills (250 / 500 / 1000 gr), price, one pill-shaped **BUY NOW**
- Right rail: description, Country, Article number, then **attribute meters** — filled-dot rows for
  roasting, richness, acidity
- Below: related grid with wishlist hearts; reviews with star rating, name, date, pagination
- Oversized **ghost-text section headers** sitting behind the content
- Shown responsive at 320 / 640 / 1920

**The attribute meters are the borrowed pattern to flag.** They map exactly onto §38's Taste and
Aroma Notes and §39's *"What does it taste like?"* — and they are **unbuildable today**, because
R-29 records that no sensory vocabulary exists for any RejuveLuxe product and §16 forbids inventing
one. The pattern is right; it stays empty until cupping fills it. A meter rendered with invented
values would be exactly the failure §16 exists to prevent.

---

### 8.5 Full UI specification read from the Harmony of Taste boards

Sayon: *"read it from Behance and we will replicate that, every detail every motion every note."*
All seven project boards were pulled at 1400px and read directly, 17 August 2026. This section is
what they actually show.

**Two caveats before the detail, because they change what "replicate" can mean.**

First — this is a published student concept by a named designer (Олеся Богачева, UPROCK). Interface
*patterns* are freely reusable and that is what this section records. A pixel-level copy of another
designer's published composition is a different thing, and it would also be wrong for us: §48 puts
RejuveLuxe in a different register, and the concept sells coffee and confectionery to a mass-premium
audience. **Take the structure and the discipline; the brand has to be ours.**

Second — the concept contains commercial mechanics we are **forbidden** to copy. Listed in §8.5.7.

### 8.5.1 What the concept declares about itself

Board 5 is the concept's own type-and-colour sheet, so these are stated, not inferred:

| | |
|---|---|
| Display / headings | **Editorial New** |
| Body | **Manrope** |
| Warm cream | `#E6DCCB` |
| Delicate sand | `#F8F4ED` |
| Fresh emerald | `#2E5C2A` |
| Deep chocolate | `#3E2723` |

Its own stated rationale: *"the versatile sans-serif Manrope for body text and the elegant Editorial
New for headings"*, with a palette meant to convey *"the aroma of luxury tea and coffee, the
naturalness of the ingredients."*

**This maps onto §28 almost exactly** — cream, warm white, deep olive, charcoal. Fresh emerald
`#2E5C2A` is brighter and bluer than §28's *deep olive*, and that difference is the one real
divergence to resolve, not paper over.

**Licensing, flagged not assumed:** Manrope is widely distributed as an open-licence family;
**Editorial New is a commercial release and is believed to require a paid web licence.** Both are
**unverified** and both must be confirmed against §3's 300 KB web-font budget before either is
adopted. Recorded as R-39.

### 8.5.2 Global chrome

**Header** — cream bar, full width. Text nav left (`Catalog · Delivery · Contact · About us`),
**brand mark centred**, icon cluster right: search, account, wishlist heart, cart bag. Small sans,
sentence case. On mobile the text nav collapses to a hamburger at right and the mark stays centred.

**Buttons** — one primary shape only: a **full-radius pill**, emerald fill, cream label, letterspaced
uppercase on the strongest calls (`CHECKOUT`) and sentence case on softer ones (`See collection`,
`Choose your favorite`). Section-level CTAs run nearly full width; inline ones hug their content.

**Links** — underlined, in place, no button styling: `Open the tea collection`, `Read an article`,
`Remove`. The underline *is* the affordance.

**Pills as a system**, used for four different jobs and visually distinguished:
- *Category filters* — active is emerald fill with cream text; inactive is cream with an emerald hairline
- *Variant selectors* — `250 gr / 500 gr / 1000 gr`
- *Content tags* — `Articles about tea`
- *Stat capsules* — emerald fill, large display-serif number over a small sans label

### 8.5.3 Page anatomy

**Home.** Full-bleed product photography behind a centred display-serif headline in emerald, set
**sentence case** here rather than uppercase; small centred sans subcopy; one pill CTA. Then *Our
collection* — a 2×2 category grid, hairline-ruled, each cell a serif title plus image plus underlined
link. Then *Who are we* — copy beside four stat capsules. Then *Aromatic chronicles* — the editorial
module, cards with image, tag pill, title, excerpt, `Read an article`. Then *Flavors that conquer* —
a mosaic mixing rounded rectangles, arch/pill shapes and circles at varying aspect ratios, with
✳-bulleted sensory lines, closing on a full-width pill CTA.

**Collection.** Page title in **uppercase display serif**, left-aligned, with intro paragraph and two
small inset images. Category filter pills, then `FILTER ⌄` left and `SORT BY: Default ⌄` right in
micro-caps. The grid is **deliberately asymmetric** — a row of four small tiles, then two large, then
four small — not a uniform grid. Every tile: image on cream, wishlist heart top-right, name bottom-left
in serif, price bottom-right. Hairline rules between cells. Pagination `← 1 2 3 … 10 →`.

**Product.** Breadcrumb, then the **product name as a full-width uppercase display-serif hero**, cream
on emerald. Packshot alone, centred, on the flat colour field. Left rail: variant dropdown, size pills,
price, one pill `BUY NOW`. Right rail: description, `Country`, `Article` (SKU), then **attribute
meters** — filled-dot rows scoring roasting, richness, acidity. Below: related grid with hearts;
reviews with star rating, reviewer, date and pagination.

**Cart** — a slide-over panel, cream, rounded, over a dimmed page. Header `CART (3)` in serif with a
`Close` link. Each line: heart, thumbnail, name, price, `Article:` number, `Size:` pill, a `− 1 +`
stepper, and `Remove`. Hairline between lines. Footer `Total:` and the figure, then a full-width
emerald `CHECKOUT` pill.

### 8.5.4 The two signature devices

**Oversized ghost headers.** Every section carries its title twice: once enormous, uppercase and in a
pale tint of the ground, sitting *behind*; once at readable size in emerald, in front. `OUR
COLLECTION`, `AROMATIC CHRONICLES`, `FROM SHOPPING CART TO ORDER`. This is the concept's single most
distinctive move and it costs nothing but restraint.

**Four-pointed sparkle.** A thin star sitting at page corners and at grid-rule intersections. It is
the *only* decorative element in the entire concept — which is precisely why it works, and precisely
how §5's ornament-repetition ban stays satisfied.

### 8.5.5 Motion

**No motion is demonstrable from static boards.** The concept is images; it contains no prototype,
no video and no annotations describing transitions. Anything written here about easing, duration or
hover behaviour would be invention.

What the boards *do* constrain: the responsive frames at 320 / 640 / 1920 show layout reflow only,
and §6 already governs motion for this project. **Motion must be specified from §6 and §35, not
borrowed from this reference.** Treat this as an open gap, not a documented answer.

### 8.5.6 Responsive

Three frames are drawn: **320 px mobile**, **640 px tablet**, **1920 px desktop** — matching §4's
breakpoints. Grids collapse 4-up → 2-up → 1-up. Stat capsules go full width and stack. The PDP moves
from two rails to a single column, hero name shrinking but staying uppercase serif. Cart is a full
sheet on mobile and a right-hand panel on desktop.

### 8.5.7 What we must NOT take

- **`20 % off the first order`**, set as a stat capsule with equal weight to the others. Violates §49
  and §50 outright. It sits inside the reference we follow most closely, which is exactly how a
  discount mechanic gets built without anyone deciding to build one.
- **`from 50 $ free delivery`** as a headline promise — a threshold incentive, same family of
  mechanic. §50 permits gift-with-purchase and early access, not spend-thresholds.
- **`99 % positive reviews` / `5000+ satisfied clients`** — social-proof claims. For RejuveLuxe these
  would be fabricated facts, which §16 forbids and R-06 governs.
- **The attribute meters, for now.** The pattern is right and maps onto §38's Taste and Aroma Notes —
  but R-29 records that **no sensory vocabulary exists for any product** and §16 forbids inventing
  one. Build the component; leave it unpopulated until cupping fills it. A meter rendered with
  invented values is the exact failure §16 exists to prevent.

### 8.5.8 Ideas worth taking from the other two references

From **Ladurée** (measured, §8.4): the gifting tier as a permanent navigation item rather than a
seasonal banner, matching §32; the *compose your own box* pattern, which is the Regular Gift Box; and
its restraint with gold — 0.4% of rendered area.

From **KitKat** (§8 only — the live site is blocked and unverified): the three-up craft-explainer
module, each step a cut-out on a circle. It maps onto §12's process territory and §39's *"How is it
made?"*. Take the structure, discard everything else about it.

### 8.5.9 Ownership note

Page-level composition — sitemap, page order, flows and states — belongs to `product.md`, which is not
yet written. This section documents **components, devices and the reference's anatomy** so that
`product.md` can reference it rather than restate it. Where the two eventually disagree, `product.md`
owns the page and this document owns the part.

---

## 8.6 Vita Travels — the transparent glass header and the full-bleed hero

Numbered `8.6` so §9 keeps its number. Reference supplied by Sayon on 20 August 2026:
`vita-travel.webflow.io`. **Measured in a live browser, not described from a screenshot** — the same
standard §8.4 used for Ladurée, and the reason §8.5.5 could not specify motion.

### What Vita actually does — measured

| Property | At page top | After scrolling |
|---|---|---|
| `position` | `fixed`, `top: 0`, `z-index: 1000` | unchanged |
| Height | **72 px**, full width | unchanged |
| `background-color` | `rgba(0, 0, 0, 0)` | `rgba(0, 0, 0, 0)` |
| `backdrop-filter` | `none` | **`blur(12px)`** |

The bar gains an `is-active` class on scroll; the only thing that changes is the blur. **The tint
never changes because it never has one** — Vita's page ground is dark throughout, so an untinted
blur stays readable over everything.

### What we take

Since §2.1 made our ground dark too, we can now take this **whole**, which we could not have done
on the cream ground: fixed, `top: 0`, `z-index: 1000`, **72 px**, `background: transparent`, and
`backdrop-filter: blur(10px)`. No tint. The bar simply blurs whatever passes beneath it.

**One state, never switching.** An interim version flipped between a transparent bar over the hero
and a cream bar once scrolled, because on a cream ground white marks would have vanished below the
fold. Sayon rejected that outright — *"the glass navbar disappears and becomes white on background
as we scroll. this should not happen rather, navbar must remain glass throughout"* — and the dark
ground removes the need for it. Marks are pure white everywhere. There is no scroll listener and no
route check, so the header is a **server component**.

There is a `@supports not (backdrop-filter)` fallback to an opaque `--ground-deep` bar, because a
transparent bar without blur is unreadable.

### The hero

Full first viewport: `min-height: 100svh`, pulled under the fixed bar with a negative margin equal
to `--header-h`. **`svh`, not `vh`** — on mobile browsers `vh` is the *largest* viewport, so a
`100vh` hero is clipped by the address bar on load.

**Image treatment.** Sayon's brief across three passes: *"more vibrant but darker"*, then *"warmer,
increase saturation and then slightly more darker"*, then *"make the images darker"*. Resolved as:

```
sepia(0.28) saturate(1.85) hue-rotate(-12deg) contrast(1.08) brightness(0.4)
```

**The order is the whole trick**, because each stage feeds the next:

| Stage | Why it sits here |
|---|---|
| `sepia` | pushes the image warm, but flattens colour doing it |
| `saturate` | brings colour back, now warmed rather than neutral |
| `hue-rotate` | nudges the greens back from the yellow sepia leaves them at |
| `contrast` | restores the depth sepia costs |
| `brightness` | darkens **last**, so darkening does not eat the saturation |

Darkening before saturating takes the greens to grey, which is the one thing the brief says to keep.

**No colour wash over the photograph.** An interim version tinted the hero scrim in the two base
greens; Sayon: *"the image is covered by green dust remove that the image should be clean"*. What
remains is neutral and only where it earns its place — a light darkening at the very top so the
transparent header's white marks are not fighting the brightest part of the frame, and at the foot
so the image does not end on a hard line against the green ground. **The middle, where both the
subject and the headline sit, is untouched.**

### 8.6.1 Motion — the hero crossfade, and the controls it requires

The hero is a **crossfading slideshow** again, after a period as a single still. The history is
kept because the reasoning outlived each reversal.

**Pacing: a 6s slot per frame, of which 2s is the crossfade — so each frame is alone on screen for
4s.** Three frames, wrapping, an 18s loop.

**State the slot and the "alone" figure separately, because they are not the same number and the
difference is where mistakes happen.** The fade overlaps the start of the next slot, so shortening
the slot without touching the transition silently eats the time a frame is actually legible. The
two values live in `hero-slideshow.tsx` (`HOLD_MS`) and `hero-slideshow.module.css`
(`transition`), and they are a pair.

**The pacing has moved twice and the reasoning is worth keeping.** It began at 6s/1.6s, which read
as changing "a little too fast"; it went to 9s/2s, which was unhurried but made a visitor wait to
see the range; it now sits at 6s/2s. The current setting is not a return to the first — the fade is
longer, so the change still registers as something you notice *having happened* rather than a cut,
which is what §35's "spacious" protects. **A short fade reads as a slideshow; a long one reads as
the ground shifting.**

**This paragraph described the hero until 21 August 2026 and no longer does. Kept, struck, and
replaced below, because the reasoning it contains is still the reasoning anyone should have to
answer before widening this further.**

> ~~**This is not the carousel §35 warns against.** A carousel rotates competing *messages* and
> makes the reader wait for the one that matters. Here the statement never moves; only the ground
> behind it changes. One statement, several grounds. That distinction is the whole licence for this
> device, and it stops holding the moment any frame carries its own copy.~~

**What is true now: frame 1 carries its own treatment, and its own supporting sentence.** On
instruction — *"each frame and the text along with it is different"*, *"we will only be designing
this frame and slide now"* — the hero became per frame:

| | hero-table (frame 1) | hero-cup, hero-rows |
|---|---|---|
| Headline | "Earned, not indulged." | identical |
| Supporting sentence | "Three teas from Assam, selected for character…" | "Premium Assam tea, presented through contemporary luxury." |
| Ink | `--ground` `#091b20` | white |
| Position | left, into the empty wall | centred |
| CTA | filled `--ground`, white label | white pill |
| Grading | `saturate(1.2) brightness(1.05) contrast(1.08)` | untouched / `brightness(0.6)` |

**The headline is still one statement across all three frames.** That much of the old paragraph
survives, and it is the part worth defending: the line that carries the brand does not rotate, so a
visitor never waits to see the message that matters. What rotates is the *supporting* sentence and
the treatment around it.

**§35's cost is real and is being paid, not argued away.** A reader who arrives on frame 2 sees a
different supporting sentence than one who arrives on frame 1, and neither sees the other's. That is
acceptable only while the headline and the CTA stay constant, because those are what the page is
actually asking the reader to do. **If a future frame ever wants its own CTA, that is where this
stops** — a rotating call to action is the carousel §35 forbids, with none of the mitigation above.

**Exactly one supporting sentence is ever visible.** Both are rendered and CSS shows one, so
`content-style.md` §8's "one line plus at most one supporting sentence" holds at every moment,
including mid-crossfade. That was verified by sampling, not assumed.

### Controls are mandatory, not decorative

**WCAG 2.2.2 requires a pause mechanism for anything that auto-advances for more than five
seconds.** The hero was non-conformant for as long as it ran without one. Three glass buttons sit
bottom right: previous, pause/play, next.

- **Glass, matching the header** — transparent, `blur(10px)`, hairline border — so the two read as
  one system rather than two takes on the same idea.
- **Outside the `aria-hidden` frame container.** Controls nested inside it would be invisible to a
  screen reader, which defeats the point of adding them.
- **Labels state the action, `aria-pressed` states the state.** "Pause slideshow" flips to "Play
  slideshow"; the label alone would not announce what changed.
- **Next and previous restart the countdown**, so a manual step does not leave a half-elapsed timer
  that flips again a moment later.
- **The focus ring is white with a dark outer shadow**, not the accent token: the frames are
  photographic and unpredictable, and the accent could land on a pale area and vanish.
- **Play and pause crossfade rather than cut.** Both icons are always rendered in one grid cell and
  toggled by opacity. A ternary swap replaces the DOM node, and **CSS cannot transition between two
  different elements** — the change lands in a single frame, which is exactly how it looked.

**Reduced motion.** The slideshow **starts paused** rather than being disabled outright: no motion
happens unasked, and the control still works for the people most likely to want it. The preference
is read with `useSyncExternalStore` — the right primitive for external state, SSR-safe through its
server-snapshot argument. An explicit press then overrides the system preference.

---


## 8.7 The motion tier — seven references, measured — 21 August, 2026

Sayon asked for three to four real references for this kind of screen, an "Awwwards-featured"
level of motion, and the direction written down before anything is built. **Nothing in this
section was built.** This is the direction and the evidence for it.

### How these were gathered, and what failed

The house workflow names **Mobbin** for shipped-product references and **Context7** for current
library APIs. Only one of those worked.

| Tool | Purpose | Result |
|---|---|---|
| **Mobbin MCP** (`search_sections`, `search_screens`) | Shipped-product reference | ❌ **`requires a paid plan`** — returned nothing |
| **Firecrawl MCP** (`firecrawl_search`) | Fallback reference discovery | ❌ **free-tier rate limit hit** — returned nothing |
| **WebSearch** | Fallback discovery | ✅ produced *candidate names only* |
| **Context7 MCP** (`resolve-library-id`, `query-docs`) | Current GSAP / Lenis API | ✅ worked; findings below |
| **Playwright** (chromium 1228, driven from a sibling project) | Actually looking at the sites | ✅ all seven loaded and measured |

**No reference below is described from a listicle.** WebSearch produced only names; every fact in
the table was read off the live page in a real browser at 1440×900. That distinction earned its
keep immediately: a search summary described OFFBLAK as having *"a dark, moody colour scheme"*
and its measured ground is **`rgb(255,255,255)`** — plain white. Had that gone in unverified it
would have become a false premise for a palette argument.

### The measurements

Loaded at 1440×900, desktop UA, sampled 5–6 s after `domcontentloaded`.

| Site | Ground | Display face | Motion stack detected |
|---|---|---|---|
| **[savor.it](https://savor.it/)** — Awwwards SOTD | `#FFF9EB` body / **near-black video hero** | cream serif | **Lenis** (on `<html>`), **5 × `<canvas>`** |
| **[donedrinks.com](https://donedrinks.com/)** — Awwwards Honorable Mention | `#FFF6EE` | Rocaone, **88 px** | **GSAP + Lenis** (Webflow `w-mod-ix`) |
| **[dishoom.com](https://www.dishoom.com/)** | `#F0ECE0` | Cheltenham BT, 32 px | none detected |
| **[twgtea.com](https://twgtea.com/)** | `#FFFEF1` | Amiri / DM Sans | none detected |
| **[o5tea.com](https://o5tea.com/)** | `#FFFFFF` | Karla 36 px w700 | none detected |
| **[offblak.com](https://offblak.com/)** | `#FFFFFF` | Druk Wide / Gotham | none detected |
| **[vahdam.com](https://www.vahdam.com/)** | `#FFFFFF` | Proxima Nova | none detected |

**"None detected" is not "none present."** The probe looks for `window.gsap` / `window.Lenis`,
known class hooks and script-URL matches. A bundled, tree-shaken library that never touches a
global would be invisible to it. Read the column as *"nothing announced itself"*, not as proof.

### Four things the measurements actually establish

**1. The whole category is cream, and that is the argument *for* `#091b20`, not against it.**
Six of the seven grounds are cream or white; the two awarded sites are `#FFF9EB` and `#FFF6EE`.
This is worth stating plainly because it looks at first like evidence that open-calls #18 went
the wrong way. It is the opposite. Cream-plus-serif is simultaneously the tea category's default
**and** one of the three looks that reads as machine-generated on sight. Six of seven references
converging on it makes `#091b20` a differentiator that costs nothing — the contrast audit already
showed it is the best-measuring ground this system has had (0 of 11 pairs fail AA).

**2. The two awarded sites run exactly the stack Sayon proposed.** Done Drinks carries GSAP *and*
Lenis; Savor carries Lenis plus five canvases. That is empirical support for the proposed
dependencies rather than a preference — see **ADR-0005**.

**3. Savor is the structural reference, and it is the only one worth copying.** Its hero is a
near-black full-bleed video with warm cream serif type over it, and the headline reveals **per
character behind a mask** — the screenshot caught it mid-reveal, with `Feel good f…` / `fro…`
still clipped. Quiet 6-link nav top-right, lowercase serif wordmark top-left. **That is our hero,
structurally, already** — dark ground, full-bleed photography, serif statement, restrained nav.
The gap between RejuveLuxe and an awarded site is not the layout. It is the type reveal.

**4. Done Drinks demonstrates the cost, by accident.** At six seconds its viewport was
**essentially empty** — a pink gradient, a logo, one `SHOP NOW` button, and no headline, because
the copy is entrance-animated in. This was not a slow connection; it is what the design does.
Against **R-62** — LCP already failing at 2.95 s on `/shop` — that is the single most important
warning in this section. **Entrance animation moves the LCP element later by construction.**
Whatever we build must animate copy that has *already painted*, never gate first paint on a
timeline.

### The direction

One sentence: **keep the composition we have, and spend all the new motion on a single
orchestrated hero reveal — nothing else on the page moves.**

- **Type (pass 1).** The signature is a per-character mask reveal on the hero statement, in the
  existing display face. Savor's mechanism, our typography. Characters rise into a clipped line
  on a stagger, once, on load. The words are server-rendered and *already in the DOM* — the mask
  is a transform on painted glyphs, which is what keeps finding 4 from biting.
- **Motion (pass 2).** Lenis for scroll damping, GSAP + ScrollTrigger for the reveal. **No
  parallax, no pinning, no scroll-jacked section snapping.** One orchestrated moment, per the
  §1 "one move, not five" argument that already governs ornament.
- **Depth (pass 3).** Only what the dark ground earns: the existing Ken Burns on frame 1, and a
  slow vignette. **No 3D — R3F is not proposed.** Savor's five canvases are a video-texture
  effect on a food subject; on a tea PDP it would be decoration with a 500 KB entry fee, against
  a page-weight budget that currently passes with room.

### Current APIs, confirmed via Context7 — not from memory

- **`useGSAP()` from `@gsap/react`** is the correct React entry point, not bare `useEffect`. It
  reverts on unmount, takes a `scope` ref so selectors cannot leak, and provides `contextSafe()`
  for animations created inside event handlers. GSAP must not execute during SSR.
- **Lenis already honours `prefers-reduced-motion` by itself.** Its source sets `lerp = 1` for
  user scrolls and `immediate = true` for programmatic ones, so smoothing disappears and the
  scroll becomes 1:1 native tracking. This matters for the §6 argument: **Lenis under reduced
  motion is not scroll-jacking**, it is a pass-through. `respectReducedMotion: false` would
  disable that safeguard and must never be set.
- **Lenis + ScrollTrigger** wire together through `lenis.on('scroll', ScrollTrigger.update)`,
  `gsap.ticker.add(...)` and `gsap.ticker.lagSmoothing(0)`.

### The blocker this section does not resolve

**§6 forbids this outright.** Its table bans *"parallax, scroll-jacking … anything that delays
reading"* and caps motion at **400 ms**. A scroll-damping library and a staggered character
reveal do not fit inside that, and no amount of care makes them fit. §6 is an accepted rule and
**this document does not overrule it** — the conflict is filed as **open-calls #20** and
**R-63**, and no dependency is installed until Sayon rules.

Worth knowing while ruling: §6 is *already* contradicted by shipped code. The session that
designed frame 1 recorded that the hero now runs 500 ms and 600 ms text motion on slide change.
The question is therefore not whether to breach §6 but whether to amend it deliberately.

---

## 8.8 MiCha and Slight Twist — measured — 1 September, 2026

Sayon supplied two references, `micha.asia` and `slight-twist.co.nz`, and ruled that they are a
**direction change** rather than a source of individual devices. That ruling is what
**[ADR-0007](adr/0007-visual-direction-change.md)** exists to carry; this section is only the
evidence under it. Nothing in §2, §3, §5 or §6 has been edited — those sections still describe the
system as built, and they stay that way until ADR-0007 is `Accepted`.

### How these were gathered

Playwright/Chromium at 1440×900, desktop UA, sampled 6 s after `domcontentloaded` — the same probe
as §8.4 and §8.7, extended with `document.getAnimations()` for live animation timings. Both pages
were also screenshotted and looked at. **Slight Twist sits behind an 18+ age gate**, which the probe
dismissed before measuring; an unauthenticated scrape would have measured the gate, not the site.

### The measurements

| | `micha.asia` | `slight-twist.co.nz` |
|---|---|---|
| Platform | WordPress | Webflow (`w-mod-ix`) |
| Ground | `#FFF1F1` body · `#EB373E` header band (6,301,468 px²) | **`#0A6A66`** — 11,040,435 px², dominant |
| Display | **Passion One** 700, 89 px, no tracking | **Nanjaune** 700, 88 px, **letter-spacing −2.26 px** (≈ −0.026 em) |
| Body | **Be Vietnam Pro** 20 px **w900**, lh 1.51 | same family, 18 px **w300**, lh **1.25** |
| Nav | Be Vietnam Pro 15 px w700 | 24 px w500 |
| Motion detected | **GSAP + Lenis**, jQuery | **GSAP**, Swiper, Webflow IX |
| Live animations | **94** | **3** |
| Transition census | 0.5 s ease (×27), 0.4 s opacity (×25), 0.3 s transform (×11) | **one rule total** — `background-color, color` at **0.1 s** |
| Brand token layer | **none** — only WordPress admin vars | **exposed, and product-scoped** |

Colour by rendered area — MiCha runs five saturated hues at large area
(`#FFF1F1` 20.3 M · `#EB373E` 6.3 M · `#FBEF43` 2.4 M · `#7F4E9F` 0.90 M · `#6DB54E` 0.77 M px²).
Slight Twist runs one ground and one type colour, everything else under 3 % of area
(`#0A6A66` 11.0 M · `#FFFCE4` 1.3 M · `#005F5B` 0.54 M · `#00E8FF` 0.12 M · `#FF258E` 0.03 M px²).

### The finding that matters — Slight Twist's tokens are product-scoped

```
--mai-tai--green-200: #0a6a66      --cherry-sling--pink-100: #ffd4f6
--mai-tai--yellow-200: #fff8b5     --citrus-spritz--red-100:  #cb1800
--mai-tai--green-100: #14574b      --citrus-spritz--blue-100: #00e8ff
--mai-tai--pink-200:  #ffa1ce      --ginger-margarita--yellow-100: #fbbd1b
--text--white: #fffce4             --ginger-margarita--green-100:  #308214
```

**One shared ground and one shared type colour, with a named colour family per product.** This is
architecture rather than appearance, and it is the single most portable thing in either reference:
it is the shape `features/catalogue.md` needs for three expressions with Green Tea held separate
(R-05, R-52). It is portable **whatever** ADR-0007 decides about the palette itself — a
`--{expression}--{role}` layer works over `#091b20` exactly as well as over `#0a6a66`.

Note the asymmetry this exposes: **MiCha has no token layer to extract at all.** Its `:root` carries
only WordPress admin defaults. Anything taken from MiCha has to be read off computed styles, which
means it is being copied rather than adopted.

### Discipline, measured — and it runs opposite to the visual impression

Slight Twist *looks* louder than this system and is mechanically quieter than it. Its entire
transition surface is **one rule at 0.1 s**, well inside §6's 400 ms cap, and it runs **three**
animations — all marquees (vertical 40 s ×2, horizontal 80 s, all `linear`, all infinite).

MiCha runs **94**, of which the great majority are infinite `linear` backdrop rotations at
4,000–10,000 ms, plus an arrowed carousel. Against §1's "exactly one decorative move on this
surface" that is not a near miss, and against **R-62** — where LCP already fails at 2.95 s on
`/shop` — it is the §8.7 finding-4 failure mode with more moving parts.

### Typeface licensing — checked, not assumed

Checked against `fonts.googleapis.com` on 1 September 2026, because §3.1 already cost this project
a full session by identifying a display face (Bizantheum) that turned out not to be licensable:

| Face | Result |
|---|---|
| Passion One | **HTTP 200** — served by Google Fonts |
| Be Vietnam Pro | **HTTP 200** — served by Google Fonts |
| Bricolage Grotesque | **HTTP 200** — served by Google Fonts |
| **Nanjaune** | **HTTP 400 — not a Google font** |

**Nanjaune is Slight Twist's real display face**; Bricolage Grotesque is only its fallback in the
`font-family` stack. So the face doing the work in the reference we are following most closely is a
commercial licence we do not hold and have not priced — **R-68**. Google serving a family implies an
open licence, but the specific licence string was not read; treat the three 200s as "obtainable",
not as "OFL confirmed".

### Two things the probe cannot see

- **GSAP tweens do not appear in `document.getAnimations()`.** GSAP writes inline styles from a
  `requestAnimationFrame` loop and never registers with the WAAPI timeline. MiCha's 94 are its
  CSS/WAAPI layer only; whatever GSAP drives on both sites is invisible here, and the counts above
  are therefore **floors, not totals**. This is the same blind spot the DevTools Animations panel has.
- **"Detected" remains weaker than "present"**, per §8.7 — the probe reads globals, script URLs and
  class hooks. It found `class="lenis"` on MiCha's `<html>` and `w-mod-ix` on Slight Twist's, both of
  which are positive identifications; absence still proves nothing.

### What this adds to the motion argument

Both references carry **GSAP**, and MiCha carries **GSAP and Lenis together** — the exact pair
**ADR-0005** proposes. The measured sample supporting that stack goes from 2 of 7 to **4 of 9**.

That is a real strengthening of ADR-0005's empirical case and it changes nothing about **R-63**:
how many sites use GSAP has no bearing on whether its post-Webflow licence permits a commercial
storefront, which is still unread. **open-calls #20 is also untouched** — §6 forbids the direction
regardless of how many references share it.

---


## 9. The design filter

Before approving any visual work (§60):

1. Does it feel premium?
2. Is it specific to this product, or could it be any premium tea?
3. Is the logo given room to be the life of the box? (§27)
4. **Is there exactly one decorative move on this surface?** (§1)
5. Would removing one element improve it? If yes, remove it.
6. Is every factual claim in it verified — including what the photography implies? (§16)
7. Does it strengthen "Earned, Not Indulged"?

Any "no" sends the work back.
