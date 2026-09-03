# Design inspiration request

_Started 2026-09-03 10:38 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Untitled"
What `list_files` on the project root returns right now (dotfiles, if any, are not shown here):
📁 _ds
User is viewing file: _ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/tokens/typography.css
Current date is now September 3, 2026
</system-info>

<attached aesthetic_system_instructions>
A design system or theme is attached to this project. That attachment already answers the visual-style question: apply it. Do NOT ask the user which visual style to use — no questions about vibe, colors or palette directions (including color-swatch svg-options questions), typography, mood, or art direction, and skip the "divergent visuals" question from the question-asking tips; offer divergent visual directions only if the user themselves asks for alternatives. This rule bans asking the user to pre-pick a style in the abstract — swatches, mood words, palette pickers. It does not ban asking them to choose among candidates you have already built: putting built candidates on a file-options board for the user to pick from is encouraged. Treat the attachment as the confirmed starting point and product context — the "confirm the starting point" tip is already satisfied, so do not ask the user to confirm or re-pick it. Spend your questions on everything else you need: audience, purpose, content, structure, scope, interactions, tone of copy.
</attached aesthetic_system_instructions>

<pasted_text name="Pasted text (302 lines)">
# REJUVELUXE — WEBSITE DESIGN BRIEF

For handoff to Claude Design. Paste whole, or paste one section at a time when working on that surface.

**Status:** Art direction, colour, type, layout and component specs are decided and buildable now. Copy and photography are not final. Everything marked `PLACEHOLDER` is a known gap, not an oversight. Design should proceed against real structure with honest dummy content, never lorem.

---

## 1. THE BRAND IN 120 WORDS

RejuveLuxe sells single-origin Assam tea in India. The range spans Assam Matcha, Silver Needle, Golden Tips, a premium Green Tea, and CTC.

The founding premise: India grows some of the world's best tea and exports it, while the domestic market settles for the leftovers. RejuveLuxe exists to close that gap.

The brand line is **EARNED, NOT INDULGED**. It is explicitly positioned against display wealth. The customer is someone who has worked for what they have and buys quality quietly, not someone buying a gift box to be seen with.

The word that governs every design decision: **evidence**. This brand proves things. It does not assert them.

---

## 2. THREE DECISIONS ALREADY MADE

Design does not need to wait for these. They are settled here so the work is not blocked. Flag if the client overrules any.

**2.1 Craft leads. Wellness is a subordinate factual layer.**
The content draft carries two brands: a status brand and a functional wellness brand. Craft wins. Wellness compounds appear only as small factual specification text, never as a benefit, never as a badge, never as an icon.
*Design implication:* no leaf icons, no "antioxidant" pills, no wellness iconography anywhere. Zero.

**2.2 The name is treated as locked, and the design is what redefines "Luxe".**
"Luxe" is excess-coded and the positioning rejects excess. The wordmark resolves this by refusing every luxury signal: no gold, no foil, no serif flourish, no monogram, no crest. Set REJUVELUXE in a single weight, all caps, wide even tracking, one colour. The restraint is the argument.

**2.3 The collection is a ladder, not a flat grid.**
Silver Needle and CTC cannot sit as equal tiles. Structure the range as a spectrum from ceremonial to everyday, so CTC reads as the finest version of the daily cup rather than the cheap one in the set.
*Design implication:* the collection layout is a horizontal or stepped sequence with a visible axis, not a 4-up card grid.

---

## 3. THE CENTRAL ART DIRECTION IDEA

&gt; **Two type registers. The serif makes the case. The mono proves it.**

Every claim on this site is paired with a piece of checkable evidence set in monospace: the garden name, the elevation, the grade code, the flush, the pluck month, the lot number, the brew parameters, the net weight. The mono is the truth layer, and it appears on every surface.

This does two things. It makes the design specific to this brand rather than to the category. And it forces the copy to be true, because there is a visual slot that only a fact can fill.

**Second idea, the palette:** the brand's own colours are near-neutral and disciplined. The colour comes from the tea. Each product carries the actual liquor colour of its brewed cup, sampled from a photograph of the real thing. Silver Needle is pale straw, Golden Tips is copper, CTC is deep red-brown, Matcha is opaque green. The range's colour spread is a design asset, and it is honest, because the colour literally is the product.

---

## 4. THE ANTI-BRIEF

Do not build the default luxury tea website. It looks like this, and it must be avoided entirely:

- Gold foil, gold rules, gold type, embossed monograms, crests, filigree
- Deep brown or black grounds with warm spotlighting
- High-contrast fashion serifs (Playfair, Cormorant, Didot and their relatives)
- Steaming cups on dark wood, hands cradling mugs, golden-hour styling
- Flat-lays with dried flowers, brass strainers, silk, cinnamon sticks
- Script or calligraphic accents
- Full-bleed video hero with centred serif type and a thin outlined button
- The words heritage, timeless, indulgence, or exquisite anywhere in the design as decoration

Also avoid the generic AI-design default: warm cream ground, a display serif, and a terracotta accent. That is the exact combination this subject pulls toward. Resist it.

**The reference feeling is a watchmaker's spec sheet, not a jewellery advert.** Precise, plain, materially honest, confident enough not to decorate.

---

## 5. COLOUR SYSTEM

### 5.1 Brand neutrals

Cool-leaning stone. Not cream. Cream reads as the category default.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ground` | `#EDEEEA` | `#121310` | Page background |
| `--surface` | `#F8F8F6` | `#1A1C18` | Cards, panels |
| `--surface-2` | `#E1E3DD` | `#232620` | Inset panels, table headers |
| `--ink` | `#12140F` | `#EDEEE9` | Primary text, primary buttons |
| `--ink-2` | `#3D4237` | `#C0C4B8` | Secondary text |
| `--muted` | `#6B7064` | `#8E9485` | Labels, captions, mono meta |
| `--line` | `#D3D6CE` | `#2A2E27` | Hairlines |
| `--line-strong` | `#AFB4A8` | `#434840` | Structural rules, input borders |

### 5.2 Liquor colours, one per SKU

**These are placeholders.** Re-sample every one from a photograph of the actual brewed liquor in clear glass under neutral daylight before build. The whole idea fails if the colours are invented.

| SKU | Liquor | Notes |
|---|---|---|
| Assam Matcha | `#6F8F3A` | Opaque, not translucent. Assam matcha will be more olive than Japanese ceremonial. Do not over-saturate it. |
| Silver Needle | `#E6DBB0` | Very pale straw. Light-only. |
| Golden Tips | `#C4711F` | Copper amber. |
| Premium Green | `#A9B85E` | Pale yellow-green. |
| CTC | `#93401A` | Deep red-brown. |

**Rules for liquor colour**
- Fills, rules, large shapes, background washes, hover states, and the product's own page chrome. Never body text.
- Silver Needle, Premium Green and Matcha fail contrast as text on a light ground. Golden Tips and CTC pass at large sizes only. Test every instance.
- One liquor colour per screen region. Never two adjacent.
- On dark mode, lighten each by roughly 12 to 18% rather than swapping the hue.

### 5.3 Action colour

**Primary buttons are `--ink`.** Solid, near-black, high contrast, square or 2px radius. No liquor colour, no gold, so no single tea is favoured and the commerce surface stays neutral.

Semantic colours are separate and used only for system states: success `#4A7A55`, warning `#8A5D00`, error `#9B3226`. Never decorative.

---

## 6. TYPOGRAPHY

Three roles. Two registers, plus the truth layer.

| Role | Typeface | Fallback stack | Where |
|---|---|---|---|
| Display and UI | **Archivo** (variable, width + weight axes) | `"Helvetica Neue", Arial, sans-serif` | Headlines, nav, buttons, product names |
| Editorial | **Newsreader** (variable, optical size) | `Georgia, "Times New Roman", serif` | Story, craft, origin, long-form. Any passage over 40 words. |
| Evidence | **DM Mono** | `ui-monospace, Menlo, monospace` | Grades, elevations, dates, weights, lot numbers, brew specs, prices in tables, all eyebrow labels |

Alternate for Display if Archivo is rejected: **Instrument Sans**. Do not substitute Inter or Space Grotesk.

### 6.1 Scale

Base 17px. Ratio approximately 1.25, snapped to whole pixels.

| Step | Size / line-height | Face and setting |
|---|---|---|
| Display XL | `clamp(2.6rem, 7vw, 4.4rem)` / 0.98 | Archivo, wdth 88, wght 800, tracking -0.028em |
| Display L | `2.2rem` / 1.08 | Archivo, wdth 92, wght 760, tracking -0.02em |
| Heading | `1.5rem` / 1.2 | Archivo, wght 700 |
| Editorial lead | `1.24rem` / 1.5 | Newsreader, opsz 20, wght 380 |
| Body | `1.0625rem` / 1.62 | Newsreader for prose, Archivo for UI |
| Small | `0.9rem` / 1.45 | Archivo |
| Mono label | `0.65rem` / 1.4 | DM Mono, tracking 0.13em, uppercase |
| Mono data | `0.8rem` / 1.6 | DM Mono, `font-variant-numeric: tabular-nums` |

### 6.2 Rules

- Running text stays near 65 characters wide.
- `text-wrap: balance` on every heading.
- Never set editorial serif below 1rem.
- Every numeric column gets tabular numerals.
- Uppercase is reserved for mono labels and the wordmark. Never for headlines.

---

## 7. LAYOUT AND SPACING

- **Grid:** 12 columns, 24px gutters. Max content width 1240px. Editorial column max 720px.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Nothing off-scale.
- **Section rhythm:** 96px vertical padding on desktop, 56px on mobile.
- **Breakpoints:** 480, 768, 1024, 1280.
- **Structure:** lay out sibling groups with flex or grid and `gap`. No per-element margins.
- **Radius:** 0 or 2px. Nothing rounder. Roundness reads as consumer app, not as this brand.
- **Shadow:** none, except a 1px hairline lift on the cart drawer and modals. Separation comes from rules and space.
- **Rules over cards.** Default to hairline-separated rows and open space. A card is spent only where an object genuinely needs lifting off the page, which on this site is the product tile and nothing else.

---

## 8. COMPONENTS

| Component | Spec |
|---|---|
| **Wordmark** | REJUVELUXE, Archivo wght 600, wdth 100, tracking 0.22em, uppercase, single colour, no lockup marks. One horizontal version, one stacked. |
| **Primary button** | `--ink` fill, `--ground` text, Archivo 600, 14px, tracking 0.02em, padding 14/28, radius 2. Hover: 88% opacity. No transform. |
| **Secondary button** | 1px `--ink` border, transparent fill, same metrics. |
| **Mono label** | DM Mono, 0.65rem, uppercase, tracking 0.13em, `--muted`. Sits above the element it labels, 8px gap. |
| **Evidence row** | Label (mono) left, value (mono, tabular) right, 1px `--line` between rows. The core repeating object of this site. |
| **Product tile** | Product photo on `--surface`, name in Archivo 700, descriptor in Newsreader italic, evidence rows for grade and weight, price in mono, then both CTAs. Liquor colour appears as a 3px rule at the top edge only. |
| **Liquor swatch** | 24px circle of the SKU's liquor colour with a 1px `--line-strong` ring. Used in the ladder and the tile. |
| **Intensity scale** | 5 segments, filled in the SKU's liquor colour. Labelled in mono: BODY, BRISKNESS. |
| **Accordion** | Full-width row, 1px `--line` bottom, plus/minus in mono, closed by default, 200ms height ease. |
| **Cart drawer** | 420px, right slide-in, 240ms ease-out. Free shipping progress bar in `--ink` on `--surface-2`, 4px tall. |
| **Input** | 1px `--line-strong`, radius 2, 12/14 padding, focus ring 2px `--ink` at 2px offset. |
| **Announcement bar** | 36px tall, `--ink` ground, `--ground` text, mono 0.7rem, centre aligned, dot separators. |

---

## 9. PHOTOGRAPHY AND ART DIRECTION

Six asset types. All shot in **flat neutral daylight**. No golden hour, no warm gels, no atmospheric haze, no steam.

| Asset | Direction |
|---|---|
| **Product** | Seamless `--surface` background, one lighting setup, one angle for the whole range. Shot as a set in one session, non-negotiable. |
| **Liquor** | The hero asset. Brewed tea in clear straight-sided glass, white ground, top-lit, shot straight on so the true colour reads. This is where the palette comes from. |
| **Dry leaf macro** | At real scale with a scale reference in frame. Silver Needle's silvery hairs and the golden tips must be visible. This is the proof shot. |
| **Garden** | Overcast, flat light, working conditions. Rows, sheds, sorting tables. Not sunset over the plantation. |
| **People** | The actual pluckers and the actual manager, at work, named in the caption. No models. No hands-only crops. Faces. |
| **Packaging** | The tin as a material object. Show the printed lot number and pluck date. |

**Banned:** dried flowers, brass strainers, linen runners, cinnamon, star anise, silk, wooden trays, cupped hands, anyone gazing into a mug.

Aspect ratios: 4:5 for product, 3:2 for editorial, 16:9 for the garden. Every image needs alt text.

---

## 10. MOTION

Minimal and functional. Excess motion is the fastest way to make this brand look like everyone else.

- Transitions: 160 to 240ms, `cubic-bezier(0.2, 0, 0, 1)`.
- Product tile hover: liquor rule expands from 3px to 6px. Nothing else moves.
- Collection ladder: horizontal scroll or step, with the liquor swatch scaling 1.0 to 1.08.
- One permitted signature moment: on the hero, a slow crossfade from dry leaf to brewed liquor. 4 seconds, once on load, then still.
- No parallax. No scroll-jacking. No counting numbers. No text sliding in on scroll.
- Every section must be readable at rest, on load, without scrolling to trigger it.
- Full `prefers-reduced-motion` support, which disables all of the above.

---

## 11. PAGE SPECIFICATIONS

### 11.1 Homepage

Section order is fixed. Each closes one objection.

| # | Section | Design notes |
|---|---|---|
| S01 | Announcement bar | Shipping threshold, current flush, dispatch time. Three rotating messages. |
| S02 | Nav | Wordmark left. Shop, The Garden, The Craft, Wholesale, Contact. Cart with live count. Sticky, 64px, hairline bottom border. |
| S03 | Cart drawer | Written empty state. Free shipping progress bar. One add-on SKU. |
| S04 | Hero | Left: headline, one plain subhead, one CTA. Right: liquor crossfade. Not full viewport height. Height sized to content, roughly 620px desktop. |
| S05 | Objection bar | Four tiles, hairline-separated, no cards. Mono label, then two short sentences. Directly under hero, before any price. |
| S06 | Comparison | Three rows against the supermarket default. Mono throughout. Concede one row. |
| S07 | The collection ladder | The signature section. Ceremonial to everyday along a visible axis, each stop carrying its liquor swatch, name, descriptor, intensity scale and price. |
| S08 | Brew guide | Per-SKU parameters as evidence rows: temperature, grams, millilitres, minutes, steeps. Pure mono. Links to the full guide page. |
| S09 | Bundle and subscribe | Tasting box, sampler flight, subscription. Saving stated in rupees. |
| S10 | The garden | Full-bleed garden photograph, editorial serif copy, named human, evidence rows for estate, district, elevation, flush. |
| S11 | Reviews | Creator wall plus three written reviews attributed with first name and city. Aggregate rating in mono. |
| S12 | Gifting | Packaging-led. Show the box, not the leaf. |
| S13 | Shipping and guarantee | Three-column strip. Mono. `--surface-2` ground. |
| S14 | FAQ | Six to eight accordions. |
| S15 | Footer | Links, named email list with four noun phrases, socials, FSSAI number, legal. |
| S16 | Popup | Exit intent desktop, 45s or 60% scroll mobile. First-person button. |

### 11.2 Product page

Gallery (5 to 7 images, image 3 establishes scale) · Title and descriptor · Rating · Price, size, unit price · One-time vs subscribe · Add to cart with shipping and guarantee lines directly beneath · Three bullets · **Evidence panel** (garden, district, elevation, grade, flush, pluck month, lot, net weight, cups) · Brew parameters · Accordions: description, how to brew, specification, shipping and returns · Reviews · Three cross-sells · Four SKU-specific FAQs.

The evidence panel is what makes this page unlike a competitor's. It goes above the accordions, not inside them.

### 11.3 The Craft page

One page, three chapters, one per tea. Each chapter is a numbered process sequence taken from the existing content doc, set as a vertical timeline: step number in mono, step name in Archivo, description in Newsreader, one macro photograph per two to three steps.

### 11.4 The Garden page

Long-form editorial. Single 720px column, full-bleed photography breaking the column at intervals. Evidence rows at the head of the page. Named people with captions.

---

## 12. ACCESSIBILITY AND TECHNICAL

- WCAG 2.1 AA. 4.5:1 for body text, 3:1 for large text and UI boundaries.
- Never rely on liquor colour alone to distinguish SKUs. Always pair with the name.
- Visible focus state on every interactive element, 2px `--ink` at 2px offset.
- Touch targets 44px minimum.
- Full keyboard operation including the cart drawer and accordions, with focus trapping in the drawer.
- Both light and dark themes. Define the full light palette on `:root`, redefine tokens only inside the dark blocks, and give `body` an explicit background token.
- Target under 3MB per page, LCP under 2.5s on 4G.
- Wide content (tables, the collection ladder) scrolls inside its own container. The page body never scrolls sideways.

---

## 13. DELIVERABLES

Artboards, in priority order:

1. Homepage, desktop, full scroll
2. Homepage, mobile, full scroll
3. Product page, desktop and mobile
4. The collection ladder, three states, since it is the riskiest component
5. Cart drawer, empty and filled
6. The Craft page, one chapter
7. The Garden page
8. Component sheet: buttons, inputs, tiles, evidence rows, accordions, labels, swatches, intensity scales
9. Colour and type specimen, both themes
10. Wordmark, horizontal and stacked, on light and dark

---

## 14. WHAT IS PLACEHOLDER

Design around these honestly. Do not invent values and present them as real.

| Gap | Instruction |
|---|---|
| All prices | Use a consistent dummy value and mark it. |
| Garden name, district, elevation | Use `[ESTATE]`, `[DISTRICT]`, `[000m]` in the evidence rows so the slots are visibly sized and visibly empty. |
| Grade codes, flush, pluck dates | Same treatment. |
| Liquor colours | Placeholders in section 5.2. Re-sample before build. |
| Photography | No estate, process or liquor photography exists yet. Use clearly marked greyboxes at the correct aspect ratios. Do not use stock tea imagery, which will pull the design straight back into the anti-brief. |
| Reviews and proof | No reviews, awards or stockists confirmed. Build the modules, fill with clearly marked example content. |
| Headline and body copy | Not final. Use the existing content doc's real sentences where they exist, marked as draft. Never lorem. |
| Shipping, returns, guarantee | Undecided. Build the strip, mark the values. |

---

**Brief version 1.0.** Sections 2, 3 and 4 are the ones that make this design specific to RejuveLuxe. If time is short, hold those three and let the rest flex.
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Rejuveluxe Design System (design system)">
[Design System] This project uses the **Rejuveluxe Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

This project has the **RejuveluxeDesignSystem_0fe2c7** design system bound at `_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/`. If anything under that path is missing or fails to load, the folder name may differ — `list_files` `_ds/` and use the folder whose name ends with 0fe2c70a-415e-4b72-a746-4b9531e9bd8f instead, including in the <link>/<script> paths below.

**Loading the bundle is how you use this design system.** Every page you build must load `_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/_ds_bundle.js` and compose with the components it exports on `window.RejuveluxeDesignSystem_0fe2c7` — do not recreate those components from scratch or restyle raw HTML to look like them. The bundle calls `React.createElement`, so `window.React` and `window.ReactDOM` must be loaded first. Then add these once:

```html
<link rel="stylesheet" href="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/tokens/fonts.css">
<link rel="stylesheet" href="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/tokens/colors.css">
<link rel="stylesheet" href="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/tokens/typography.css">
<link rel="stylesheet" href="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/tokens/spacing.css">
<link rel="stylesheet" href="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/tokens/effects.css">
<link rel="stylesheet" href="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/tokens/base.css">
<link rel="stylesheet" href="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/styles.css">
<script src="_ds/rejuveluxe-design-system-0fe2c70a-415e-4b72-a746-4b9531e9bd8f/_ds_bundle.js"></script>
```

The bundle is plain compiled JS — load it with a regular `<script>` (no `type="text/babel"` or `type="module"`). Every component is then available on `window.RejuveluxeDesignSystem_0fe2c7` — e.g. `const { Button, Card } = window.RejuveluxeDesignSystem_0fe2c7;`. The linked stylesheet(s) carry the design tokens (colors, type, spacing) — style against those via `var(--*)` and the design system's classes rather than guessing values.

The full design-system source tree lives at `/projects/0fe2c70a-415e-4b72-a746-4b9531e9bd8f/` — use `list_files` / `read_file` from there for anything not under `_ds/` (layout varies by brand; don't assume folder names). Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Rejuveluxe Design System

**Rejuveluxe — Earned, Not Indulged.** A luxury Indian tea house building a collection of Assam's finest expressions for people who "understand quality — and expect nothing less". The brand argues that India exports its best tea and settles for less at home; Rejuveluxe exists to give India access to its own best leaf.

## Products
One product: a direct-to-consumer **e-commerce website** for luxury tea. Six SKUs, each sold in an illustrated tin:

| Expression | Descriptor | Tin | Ink | Asset |
|---|---|---|---|---|
| Assam Matcha | Focus | sage `#C9CB92` | forest `#2F4A1E` | `assets/products/matcha.png` |
| Silver Needle (White Tea) | Elegance | white | gold `#B8975A` | `assets/products/silver-needle-white-tea.png` |
| Golden Tips | Legacy | black `#151515` | gold `#C5A76A` | `assets/products/golden-tips.png` |
| Premium Green Tea | — | celadon `#B4BE8E` | green `#1F4A2A` | `assets/products/green-tea.png` |
| CTC Tea | — | cocoa `#4A2A1A` | gold `#D9B57A` | `assets/products/ctc-tea.png` |
| Ube | — (no copy provided) | lilac `#D9B8D6` | plum `#7B4A7E` | `assets/products/ube.png` |

## Sources given
- `uploads/REJUVELUXE Website Content.docx` — Our Story, The Collection, The Craft copy. Extracted to `research/website-content.md`.
- Six product tin renders (3000×3000 PNG, transparent) → copied to `assets/products/`.
- `uploads/original-74f2a8c4b64d95858d967195e4d4ddf6.mp4` — 18.6s reference video of a split-panel product showcase (another tea brand's concept). Frames in `research/video-frames.png`. The user wants the **Our Products** page to behave like this.
- Reference site: https://haflongtea.com/ (Assam estate tea; page could not be fetched fully in this session — treated as tonal inspiration only: estate origin, heritage, single-origin storytelling).
- No Figma, no codebase, no logo file, no font files.

## Logo
**No logo file was provided.** The tins show a crest (crown, steaming cup, leaves, in a scalloped Mughal-arch frame) and a small-caps wordmark with the strapline "◆ EARNED NOT INDULGED ◆". The crest is **not** reconstructed here. Wherever a mark is needed, render the wordmark in plain type: `REJUVELUXE` in `--font-wordmark`, tracking `--tracking-wordmark`, with the strapline beneath in `--type-eyebrow`. Ask the client for the crest as SVG.

---

## Content fundamentals

**Voice.** Assured, spare, editorial. Declarative sentences, often fragments. Never gushing, never salesy; luxury by restraint.
- "Not for the excess. For the earned."
- "India doesn't need better tea. India needs better access to its best tea."
- "Nothing rushed, nothing skipped."

**Person.** Brand speaks as **we** ("We searched. We tasted. We rejected."). The customer is rarely addressed directly; when they are, it is as "people who have earned the finer things" — third person, aspirational. Avoid "you'll love" style CTAs.

**Structure.** Three-beat rhythm. Each tea gets: one-word descriptor (Focus / Elegance / Legacy), a two-sentence sensory description, a "Why X" paragraph, then a **three-fragment tagline** with full stops: "Youngest buds. Minimal intervention. Extraordinary elegance."

**Casing.** Sentence case for body and headings. **ALL CAPS with wide tracking** only for the wordmark, strapline and eyebrows ("REJUVELUXE. EARNED, NOT INDULGED."). Product names in Title Case. Process steps use "Step Name — description" with an em dash.

**Punctuation.** Em dashes are a house signature (" — "). Colons introduce "Why Matcha:". Oxford-free lists.

**Vocabulary.** craft, expression, origin, character, refined, deliberate, minimal intervention, heritage, ritual, standard. Avoid: yummy, treat yourself, indulgent (the brand explicitly rejects indulgence), wellness cures.

**Wellness claims.** Only "naturally rich in…" phrasing. No treatment/prevention claims (FSSAI note in the source). Always couple science words with "naturally occurring".

**No emoji. Ever.** Decorative glyphs are limited to the ◆ diamond separator from the strapline and the em dash.

**Numbers &amp; currency.** Indian market: ₹ with Indian grouping (₹1,250). Weights in g.

---

## Visual foundations

**Palette.** Warm bone page (`--bg-page #F3EEE4`), near-black ink (`--ink-900 #141311`), antique gold accent (`--gold-500 #B08A4C`). Each tea owns a tin/ink pair (`--tea-*-tin`, `--tea-*-ink`) used as the full-bleed panel behind that product; never mixed across products. Semantic colours are muted earth tones. No blues/purples except Ube's plum, which is product-scoped.

**Type.** Three faces. `--font-wordmark` (Cinzel, substitute for the Trajan-style small caps on the tins) for the wordmark only. `--font-display` (Playfair Display; *italic* stands in for the tin's script product names) for headings, product names and prices. `--font-body` (Figtree, light/regular) for everything else. Headings are regular weight, never bold; emphasis comes from size and italics. Eyebrows: 11px, 500, 0.22em caps.

**Layout.** Full-viewport sections. Product showcase = **split panel**: left ~45% solid tea-tin colour with the tin floating over it (shadow `--shadow-tin`), a second darker block in the lower-left corner (tin ink colour) for depth; right panel bone with eyebrow → title → description → three-column Taste/Aroma/Mouthfeel grid; price bottom-left, Add to cart bottom-right; vertical dot pagination on the far left. Nav is fixed: three text links left, wordmark centred, cart right. Max content width 1440px, gutters 24/48px.

**Backgrounds.** Flat solid colour panels. No gradients (a subtle top-down darkening on dark panels is the only exception). No photography textures. Line-art "toile" illustrations exist on the tins but are not extracted — do not draw them.

**Imagery.** Product renders on transparent PNG, floating, with a long soft drop shadow. Colour of imagery: warm; the tins carry the colour, the page stays neutral. Loose-leaf photography can bleed from a top corner (as in the reference) — placeholder only until supplied.

**Borders &amp; rules.** Hairlines everywhere: 1px `--border-subtle` rules separate content. Text blocks may sit in hairline-boxed frames (reference video motif) — box outline only, no fill. Card = bone surface + 1px hairline; **no shadow, no rounding**.

**Corner radii.** 0 by default. `--radius-xs 2px` on inputs/buttons; pills only for nav tabs and tags.

**Shadows.** Only on floating objects (tins, dialogs, toasts). Never on cards or buttons.

**Animation.** Slow and cinematic. Panel wipes `--dur-wipe 900ms --ease-wipe` when changing products (dark ink panel sweeps across, new product settles). Content fades + rises 12px, `--dur-slow`. Micro-interactions `--dur-fast`. No bounces, no springs.

**Hover.** Text links → gold. Primary buttons lighten (`--action-primary-hover`). Ghost/outline buttons fill ink. Images: none. Cards: hairline darkens to `--border-strong`.

**Press.** Opacity to `--opacity-hover .72`; no scale.

**Focus.** 3px soft gold ring `--shadow-focus`.

**Transparency &amp; blur.** Only the dialog scrim (`--overlay-scrim`) and the fixed nav when over imagery (`--blur-glass`).

**Iconography.** See below. Hairline stroke, matching the type's lightness.

---

## Iconography
No icon assets were supplied and the packaging carries no UI icons. **Substitution:** [Lucide](https://lucide.dev) via CDN (`https://unpkg.com/lucide@latest`), stroke width **1.5**, size 18–20px, colour inherits text. Wrapped by the `Icon` component (`components/icon/`). Common glyphs: `shopping-bag`, `menu`, `x`, `chevron-down`, `arrow-right`, `arrow-left`, `plus`, `minus`, `check`, `search`, `leaf`.
Unicode used as ornaments only: ◆ (strapline separators), — (em dash), · (meta separators). No emoji, no icon fonts, no PNG icons.

---

## Intentional additions
- `Icon` — thin wrapper over Lucide so consumers never hand-roll SVG.
- `ProductCard` / `ProductShowcase` — the two e-commerce-specific compositions (grid tile; full-viewport split panel from the reference video).

## Index
- `styles.css` — entry; imports `tokens/{fonts,colors,typography,spacing,effects,base}.css`
- `guidelines/` — specimen cards (Colors, Type, Spacing, Brand)
- `assets/products/` — six tin renders
- `components/actions/` — Button, IconButton
- `components/forms/` — Input, Select, Checkbox, Radio, Switch
- `components/display/` — Badge, Tag, Card, ProductCard
- `components/navigation/` — Tabs
- `components/feedback/` — Dialog, Toast, Tooltip
- `components/icon/` — Icon
- `ui_kits/website/` — Home, Products (split showcase), Product detail, Cart, Our Story
- `research/` — extracted copy and video frames
- `SKILL.md`, `thumbnail.html`

</design-system-guide>
</attached-skill>

## Assistant



## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: ask_user]_

Waiting on your answers — chiefly which system governs and which deliverable to start with.

## User

Answered — system: The attached system (bone, Playfair, gold) — apply the brief's structure and content only; deliverable: Homepage desktop, full scroll, Homepage mobile, full scroll, Product page, Collection ladder, three states, Cart drawer, empty and filled, Craft page, one chapter, Garden page, Component sheet, Colou…; format: One clickable prototype; theme: Both, toggle

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: copy_files]_

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

Now the product page and the Craft/Garden pages.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: ready_for_verification]_

Prototype is up for review: one clickable site with all ten deliverables, in the attached system's visuals (bone, Playfair, Figtree, gold, tin colours) and the brief's structure.

Toolbar at top switches page (Home, Product, Craft, Garden, Components), light/dark, desktop/mobile, and triggers the popup and cart.

Calls I made where you left it open:
- Tin renders used as-is; Ube omitted (not in the brief's five-tea range, no copy).
- Single dummy price ₹1,250 on every SKU, marked with an asterisk. Estate, grade, flush, lot and shipping values show as bracketed slots.
- No mono face exists in the system, so the "evidence" layer uses the eyebrow style for labels and tabular Figtree for values.
- Dark theme is new: it redefines only the semantic tokens on top of the system's palette.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: run_script]_

_[tool: delete_file]_

_[tool: ready_for_verification]_

Fixed the sideways-scroll defects (all grid tracks now `minmax(0, 1fr)`, wordmark and newsletter form allowed to shrink, footer newsletter column spans full width on mobile) and swapped the 3000px tin renders for 900px copies (~0.5 MB each). Back out for review.

## User

Take design inspiration from here for the home page,

## User

Take design inspiration from here for the home page,

## Assistant

_[tool: ask_user]_

Waiting on which elements to borrow and whether the section order changes.

## User

Answered — borrow: Full-bleed photo hero, headline overlaid, "Why us" row with round icon badges, Centred wordmark in the nav; structure: Reorder to follow the reference's flow (hero → cards → story band → products → why → newsletter); imagery: Greyboxes stay; pages: Home only

## Assistant

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

New home page ("Home B", default) follows the reference flow: full-bleed hero with headline overlaid → three image-topped cards → dark garden story band → collection ladder → "why" row with four round icon badges → dark newsletter band → footer. Nav now centres the stacked wordmark with links split either side. The brief-order version stays as "Home A" in the toolbar.

Dropped from Home B to match the reference flow: comparison table, brew guide, sets, reviews, gifting, shipping strip, FAQ. Say which you want back and I'll slot them in. Photos remain greyboxes; the hero and story band use dark ones so the overlaid type reads.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Fixed: section gutters restored (the `.sec` shorthand was wiping them), footer stays ink in both themes so the wordmark and gold labels read, and the centred nav now puts the menu button on the left with `minmax(0,1fr)` columns so the wordmark centres on mobile. Back out for review.

## User

I want the collection to be a scroll animation of product, i attatched reference animation

## Assistant

_[tool: view_image]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

The collection on Home B is now a scroll-driven split-panel showcase after the reference: the stage pins under the nav, each tea holds one viewport of scroll, and a dark wipe sweeps across as the product changes (tin colour panel with the ink block lower-left, tin floating in, hairline-framed copy on the right, price bottom-left, Add to cart bottom-right, dot pagination on the left, 01/05 counter). Dots and arrows scroll you to that tea; reduced-motion swaps instantly.

Note this is scroll-linked rather than scroll-jacked, so native scrolling is untouched. The ladder remains on Home A.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Fixed: the wipe now runs from a self-contained ref-driven cycle that re-checks the scroll target when it finishes, so fast scrolling can no longer strand it dark; toolbar groups no longer shrink (it scrolls sideways if narrow); the showcase reserves room for the price/Add row and drops the evidence rows, then the notes grid, on short viewports. Back out for review.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Toolbar tightened to fit one row at ~900px: shorter labels (Specs, 1280 / 390), smaller type and padding, brand label hidden on narrow widths. Height stays 44px so the sticky stage offsets are unchanged. Back out for review.

## User

add this image to placeholders for now

## Assistant

_[tool: list_files]_

_[tool: copy_files]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Done. The tea-field photo now fills every image placeholder (cards, story band, garden, gallery, craft macros, reviews) with a small "Interim" caption in the corner so it still reads as a stand-in. On Home B the hero and garden band use it full-bleed with a dark overlay so the type stays legible.

One note: it's a golden-hour shot, which the brief's photography section rules out for the final site. Fine as interim; swap it when the flat-daylight garden shots arrive.

