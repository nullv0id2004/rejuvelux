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

**Numbers & currency.** Indian market: ₹ with Indian grouping (₹1,250). Weights in g.

---

## Visual foundations

**Palette.** Warm bone page (`--bg-page #F3EEE4`), near-black ink (`--ink-900 #141311`), antique gold accent (`--gold-500 #B08A4C`). Each tea owns a tin/ink pair (`--tea-*-tin`, `--tea-*-ink`) used as the full-bleed panel behind that product; never mixed across products. Semantic colours are muted earth tones. No blues/purples except Ube's plum, which is product-scoped.

**Type.** Three faces. `--font-wordmark` (Cinzel, substitute for the Trajan-style small caps on the tins) for the wordmark only. `--font-display` (Playfair Display; *italic* stands in for the tin's script product names) for headings, product names and prices. `--font-body` (Figtree, light/regular) for everything else. Headings are regular weight, never bold; emphasis comes from size and italics. Eyebrows: 11px, 500, 0.22em caps.

**Layout.** Full-viewport sections. Product showcase = **split panel**: left ~45% solid tea-tin colour with the tin floating over it (shadow `--shadow-tin`), a second darker block in the lower-left corner (tin ink colour) for depth; right panel bone with eyebrow → title → description → three-column Taste/Aroma/Mouthfeel grid; price bottom-left, Add to cart bottom-right; vertical dot pagination on the far left. Nav is fixed: three text links left, wordmark centred, cart right. Max content width 1440px, gutters 24/48px.

**Backgrounds.** Flat solid colour panels. No gradients (a subtle top-down darkening on dark panels is the only exception). No photography textures. Line-art "toile" illustrations exist on the tins but are not extracted — do not draw them.

**Imagery.** Product renders on transparent PNG, floating, with a long soft drop shadow. Colour of imagery: warm; the tins carry the colour, the page stays neutral. Loose-leaf photography can bleed from a top corner (as in the reference) — placeholder only until supplied.

**Borders & rules.** Hairlines everywhere: 1px `--border-subtle` rules separate content. Text blocks may sit in hairline-boxed frames (reference video motif) — box outline only, no fill. Card = bone surface + 1px hairline; **no shadow, no rounding**.

**Corner radii.** 0 by default. `--radius-xs 2px` on inputs/buttons; pills only for nav tabs and tags.

**Shadows.** Only on floating objects (tins, dialogs, toasts). Never on cards or buttons.

**Animation.** Slow and cinematic. Panel wipes `--dur-wipe 900ms --ease-wipe` when changing products (dark ink panel sweeps across, new product settles). Content fades + rises 12px, `--dur-slow`. Micro-interactions `--dur-fast`. No bounces, no springs.

**Hover.** Text links → gold. Primary buttons lighten (`--action-primary-hover`). Ghost/outline buttons fill ink. Images: none. Cards: hairline darkens to `--border-strong`.

**Press.** Opacity to `--opacity-hover .72`; no scale.

**Focus.** 3px soft gold ring `--shadow-focus`.

**Transparency & blur.** Only the dialog scrim (`--overlay-scrim`) and the fixed nav when over imagery (`--blur-glass`).

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
