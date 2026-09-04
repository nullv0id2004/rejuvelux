# RejuveLuxe

Single-origin Assam tea, built as a Next.js site from the Claude Design handoff in
[`project/`](project/) — the original prototype, design-system bundle, chat
transcripts and its own [handoff notes](project/HANDOFF.md) are kept there as the
reference for what this implements.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static prerender of every route
npm run typecheck
```

## Routes

| Route | What it is |
|---|---|
| `/` | Homepage — full-bleed hero, three cards, dark story band, scroll-driven collection showcase, "why" row, newsletter band |
| `/shop/[slug]` | Product page, one per SKU. Gallery, evidence panel, brew parameters, accordions, reviews, cross-sells, FAQs |
| `/craft` | Three chapters, one per tea, as a vertical process timeline |
| `/garden` | Long-form editorial, single 720px column with full-bleed photography breaking it |
| `/alt-home` | The homepage in the brief's fixed section order (deliverable 1). `noindex` |
| `/specs` | Component sheet and colour/type specimen, both themes (deliverables 4, 5, 8, 9, 10). `noindex` |
| `/wholesale`, `/contact` | Nav destinations the brief specifies; content pending, slots visibly empty |
| `/og-preview` | Source for the link-preview card. `noindex`, unlinked — see below |

## Layout

```
app/            routes; globals.css carries the ported stylesheet
components/ds/  the design system's components as typed React modules
components/site/ chrome and shared primitives (evidence rows, ladder, greybox, showcase)
lib/            product data, cart / toast / theme state
styles/tokens/  design tokens, copied unchanged from the handoff bundle
```

### The design system

`components/ds/` is a faithful transliteration of
`project/_ds/rejuveluxe-design-system-…/_ds_bundle.js` — same styles, props and
behaviour, typed and importable rather than attached to `window`. Two deliberate
changes:

- **`Icon`** resolves glyphs from `lucide-react` instead of fetching the Lucide
  UMD build from a CDN at runtime, so icons render on the server.
- **`Button`** takes an optional `href` and renders a real anchor. The bundle's
  general-purpose `as` prop is narrowed to the one case the site needs.

Tokens in `styles/tokens/` are byte-identical to the bundle's, except
`fonts.css`: the three families are loaded and self-hosted by `next/font` in
`app/layout.tsx` rather than imported from Google Fonts at runtime.

### Themes

The full light palette lives on `:root`; `[data-theme="dark"]` redefines only
the semantic aliases. A small inline script in `<head>` applies the stored theme
before first paint, so there is no flash. The toggle sits in the nav.

### Responsiveness

Breakpoint rules are container queries on the app shell (`.rjx-app`) rather than
viewport media queries — carried over from the prototype, where the same
stylesheet had to drive a 390px device frame. Wide content (the collection
ladder, the brew table) scrolls inside its own container; the page body never
scrolls sideways.

## Link previews

`public/assets/og.jpg` is a static 1200×630 card, rendered once by screenshotting
`/og-preview` so it is built from the site's own tokens and self-hosted faces.
To regenerate it after a brand change, screenshot the `#og-card` element on that
route at scale 1 and re-encode to JPEG.

`metadataBase` resolves from `NEXT_PUBLIC_SITE_URL`, falling back to Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`, then localhost. Social scrapers will not follow
a relative image path, so set `NEXT_PUBLIC_SITE_URL` once a custom domain exists.

The favicon stays a plain gold `R` rather than the crest: at 32px every crop of
the crest is illegible, and a favicon has to read as a silhouette.

## Placeholders

Everything the brief marks as a known gap is a visible slot, not an invented
value. Bracketed text (`[ESTATE]`, `[LOT-0000]`, `[000 m]`) renders in the accent
colour so an unfilled slot reads as empty rather than as fact.

- **Prices** — one dummy value (₹1,250) on every SKU, marked with `*`.
- **Photography** — none exists. Every image slot shows the interim tea-field
  photograph at the correct aspect ratio, captioned with the shot it stands in
  for. It is a golden-hour image, which the brief's photography direction rules
  out; replace it when the flat-daylight garden shots arrive.
- **Reviews, awards, stockists** — modules are built, content is marked "example".
- **Ube** — the sixth expression. Its tin colourway is confirmed
  (`--tea-ube-tin` / `--tea-ube-ink`) but no copy and no tin render were
  supplied, so its `image` is `null` and the tin frame draws a labelled
  placeholder. Drop the render at `public/assets/ube-900.png` and set `image` in
  `lib/data.ts` to wire it in.

Adding or removing a SKU in `lib/data.ts` is enough: routes, the ladder, the
showcase, the footer and the range-size copy all derive from that list.

## What is not built

Checkout, wholesale and contact content, the full brew-guide page, and set and
gift configuration. The cart is client-side only — quantities persist in
`localStorage`; the Checkout button is a stub.
