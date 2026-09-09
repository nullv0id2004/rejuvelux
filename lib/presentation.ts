/**
 * The repo half of a product — Phase 1's field split (`docs/roadmap.md` §5.1).
 *
 * **The rule: commerce data lives in the database and is client-editable;
 * presentation and editorial live here.** The database owns name, description,
 * brewing, territory, status, sort order, slug, SKU, price and net quantity —
 * everything `features/admin.md` §4 gives the client team a field for. This
 * file owns colourways, art direction and editorial copy, which have no admin
 * screen and are not planned one (**R-34** keeps editorial in the repo).
 *
 * Keyed by **database slug**, which is the join. A slug with no entry here
 * still renders — it simply has no tin colour, no tagline and no FAQs, which
 * is the honest outcome for a product nobody has written copy for yet.
 *
 * `body` and `brisk` are here **provisionally**. They are sensory scales, and
 * **R-29** records that no sensory vocabulary exists for any product and
 * forbids inventing one. They move to the database if and when a written
 * lexicon arrives per SKU (`roadmap.md` §11.2).
 *
 * `cups` is deliberately absent: it is derived in `catalogue.ts` from the
 * database's own net quantity and brewing leaf, so it cannot drift from them.
 */

import type { ProductPhotos } from './data';

export type Presentation = {
  /** One-word register: Focus / Elegance / Legacy / Clarity … */
  descriptor: string;
  /** Tin body colour — the full-bleed panel behind the product. */
  tin: string;
  /** Tin ink colour — rules, scales and accents scoped to this product. */
  ink: string;
  /**
   * Transparent tin render. `null` where none has been supplied — the tin
   * frame then draws a labelled placeholder rather than a broken image.
   */
  image: string | null;
  /** Real photography, filled in per shot as it arrives. */
  photos?: ProductPhotos;
  /** Intensity scales, 1–5. PROVISIONAL — see the header, R-29. */
  body?: number;
  brisk?: number;
  why?: string;
  tagline?: string;
  bullets?: string[];
  faqs?: [string, string][];
};

/**
 * The rendered range. Keys are database slugs, not the old frontend ids —
 * `silver` became `silver-needle-assam`, `matcha` became `assam-matcha`,
 * `golden` became `assam-golden-tips`, `green` became `green-tea`.
 */
export const PRESENTATION: Record<string, Presentation> = {
  'silver-needle-assam': {
    descriptor: 'Elegance',
    tin: 'var(--tea-silver-tin)',
    ink: 'var(--tea-silver-ink)',
    image: '/assets/silver-needle-900.png',
    photos: {
      dryLeaf: '/assets/silver-needle-dry-leaf.webp',
      liquor: '/assets/silver-needle-liquor.jpg',
    },
    body: 1,
    brisk: 1,
    why: 'Crafted from tender young buds and gently processed, Silver Needle is naturally rich in tea polyphenols and catechins, offering a refined cup with a naturally elegant character.',
    tagline: 'Youngest buds. Minimal intervention. Extraordinary elegance.',
    bullets: [
      'Hand-harvested buds only, no leaf',
      'Withered, not rolled. The leaf keeps its silvery down',
      'Pale straw liquor, honeysuckle and melon',
    ],
    faqs: [
      [
        'Why is Silver Needle pale?',
        'It is made from buds that are withered and dried with almost no oxidation. Colour in the cup comes from oxidation, so there is very little of it here.',
      ],
      [
        'Can I re-steep it?',
        'Yes. Three steeps is the usual range; the second is often the best.',
      ],
      [
        'Is it low in caffeine?',
        'It is naturally lower than black tea from the same garden, but not caffeine-free. Draft: final figure pending lab sheet.',
      ],
      [
        'How should I store it?',
        'Sealed, away from light, heat and anything aromatic. The tin is designed for this.',
      ],
    ],
  },

  'assam-matcha': {
    descriptor: 'Focus',
    tin: 'var(--tea-matcha-tin)',
    ink: 'var(--tea-matcha-ink)',
    image: '/assets/matcha-900.png',
    body: 4,
    brisk: 2,
    why: 'Naturally rich in catechins and EGCG, with naturally occurring caffeine and L-theanine. A concentrated whole-leaf experience crafted for energy, alertness, and mindful focus. Grown under heavy canopy shade, it develops a distinctive chlorophyll richness alongside its natural sweetness.',
    tagline: 'Naturally vibrant. Rich in catechins. Crafted for focus.',
    bullets: [
      'Shade-grown, steamed, stone-milled',
      'Whole leaf, consumed rather than infused',
      'Opaque green, sweet, umami',
    ],
    faqs: [
      [
        'How is Assam Matcha different from Japanese matcha?',
        'Shading, steaming, deveining and stone-milling: the same process, applied to an Assam cultivar. Expect a slightly deeper, more olive green and a rounder, less marine flavour.',
      ],
      [
        'Do I need a whisk?',
        'A bamboo whisk gives the best texture. A small electric frother works. A spoon does not.',
      ],
      [
        'Does it contain caffeine?',
        'Yes, naturally occurring caffeine alongside L-theanine. Because you consume the leaf, the effect is steadier than infused tea.',
      ],
      [
        'How long does it keep?',
        'Sealed and cold, several months. Once opened, use within eight weeks for colour and freshness. Draft.',
      ],
    ],
  },

  'assam-golden-tips': {
    descriptor: 'Legacy',
    tin: 'var(--tea-golden-tin)',
    ink: 'var(--tea-golden-ink)',
    image: '/assets/golden-tips-900.png',
    body: 4,
    brisk: 3,
    why: "Naturally rich in tea polyphenols and theaflavins, with naturally occurring caffeine, Golden Tips carries Assam's heritage into a sophisticated daily ritual.",
    tagline: 'Rare golden tips. Deep character. Assam heritage.',
    bullets: [
      'Hand-picked tips, orthodox rolled',
      'Controlled oxidation for depth without harshness',
      'Copper liquor, malt, honey, dried fruit',
    ],
    faqs: [
      ['Milk or no milk?', 'It stands on its own. If you take milk, steep a minute longer.'],
      [
        'What does "tips" mean?',
        'The unopened bud at the end of each shoot. Golden after oxidation because of its fine down. More tips, finer grade.',
      ],
      [
        'How does this differ from CTC?',
        'Golden Tips is whole leaf and orthodox-rolled; CTC is cut and curled for strength. Different jobs.',
      ],
    ],
  },

  'green-tea': {
    descriptor: 'Clarity',
    tin: 'var(--tea-green-tin)',
    ink: 'var(--tea-green-ink)',
    image: '/assets/green-tea-900.png',
    body: 2,
    brisk: 3,
    why: 'Naturally rich in catechins with naturally occurring caffeine, our Green Tea is the everyday expression of the Assam leaf, done properly.',
    tagline: 'Clean. Grassy. Unadorned.',
    bullets: [
      'Whole leaf, steamed to hold the green',
      'Made for a daily cup, priced for one',
      'Pale yellow-green liquor, clean finish',
    ],
    faqs: [
      [
        'Why does my green tea taste bitter?',
        'Water too hot or steeped too long. 80 °C and under three minutes.',
      ],
      [
        'Is this the same leaf as the Matcha?',
        'Same garden, different plucking and processing. This is infused; Matcha is milled and consumed.',
      ],
      ['Can I cold-brew it?', 'Yes. 5 g per 500 ml, six hours in the fridge.'],
      ['Loose leaf only?', 'Yes. No bags, no sachets.'],
    ],
  },

  /**
   * The six-component kit (§32). It has **no tin render** in this repository,
   * so `image` is null and the tin frame draws its labelled placeholder — the
   * honest state, not a broken image. Its contents come from the database's
   * `components` column, which is display copy, distinct from the inventory
   * linkage in `variant_inventory_item` that computes its availability.
   *
   * No `body`/`brisk`: intensity scales describe a tea, and this is a set.
   */
  'matcha-ritual-set': {
    descriptor: 'Ritual',
    tin: 'var(--tea-matcha-tin)',
    ink: 'var(--tea-matcha-ink)',
    image: null,
    tagline: 'Everything the ritual asks for, and the tea it was made for.',
    bullets: [
      'Six pieces, each stock-tracked on its own',
      'Unavailable the moment any one component is',
      'Built around the Assam Matcha, not around a box',
    ],
    faqs: [
      [
        'What is in the set?',
        'Six pieces: the Assam Matcha itself, a bamboo whisk, a bamboo spoon, a strainer, a ceramic bowl and a whisk stand.',
      ],
      [
        'Why does it show as unavailable when the matcha is in stock?',
        'The set is only as available as its scarcest component. If the whisk stands run out, the set does too. We would rather say so than ship you five pieces of six.',
      ],
    ],
  },
};

/**
 * Withheld from the rendered catalogue, and kept rather than deleted.
 *
 * Neither product exists in the database, so neither has a price, a SKU or
 * stock. Both are held pending a **client decision**, not a technical one, and
 * their copy and assets stay here so that decision costs an afternoon rather
 * than a rewrite (`roadmap.md` §5.1 step 5, §8).
 *
 * - **`ctc`** — **R-52**, an open launch blocker. CTC is the commodity
 *   crush-tear-curl process; the risk row states it "must not share a shelf, a
 *   page module or a gift box with the heroes" until the client decides
 *   whether it is excluded, held in a separate line, or sold elsewhere.
 * - **`ube`** — appears in **no document in the suite**. The tin and colourway
 *   are confirmed; the copy below was authored to the house voice and has
 *   never been signed off. Blend composition, weight, cups, intensity scores
 *   and brew figures are all unconfirmed.
 *
 * To restore either: add the row to the database, then move its entry into
 * `PRESENTATION` above under the slug the database gives it.
 */
export const WITHHELD: Record<string, Presentation> = {
  ctc: {
    descriptor: 'Strength',
    tin: 'var(--tea-ctc-tin)',
    ink: 'var(--tea-ctc-ink)',
    image: '/assets/ctc-tea-900.png',
    body: 5,
    brisk: 5,
    why: 'Naturally rich in theaflavins and thearubigins with naturally occurring caffeine, CTC gives chai its strength and colour.',
    tagline: 'Bold. Malty. Without apology.',
    bullets: [
      'Single-estate CTC, not a blend',
      'Graded [GRADE] · even granule, fast colour',
      'Deep red-brown liquor, malt, brisk',
    ],
    faqs: [
      [
        "Isn't CTC the cheap tea?",
        'CTC is a process, not a grade. This is the finest version of the daily cup: one garden, one flush, graded and dated like the rest of the range.',
      ],
      [
        'How do I make chai with it?',
        'Boil 3 g in 100 ml water for two minutes, add 100 ml milk, boil one more. Strain.',
      ],
      ['Why 250 g?', 'Because it is a daily tea. The tin is sized for a month.'],
      ['Does it work without milk?', 'Yes, at 2 g and a shorter boil. It will be strong.'],
    ],
  },

  ube: {
    descriptor: 'Comfort',
    tin: 'var(--tea-ube-tin)',
    ink: 'var(--tea-ube-ink)',
    image: '/assets/ube-900.png',
    body: 3,
    brisk: 2,
    why: 'Built on the same estate leaf as the rest of the range and blended rather than flavoured, Ube is naturally rich in the polyphenols of its base tea, with naturally occurring caffeine. A different register, held to the same standard.',
    tagline: 'Estate leaf. Real ube. Quietly different.',
    bullets: [
      'Single-estate Assam base, blended rather than flavoured',
      'Violet liquor that deepens with the steep',
      'Takes milk without thinning out',
    ],
    faqs: [
      [
        'What does ube taste like?',
        'Earthy and mildly sweet: closer to chestnut or taro than to fruit. It rounds the Assam base rather than masking it.',
      ],
      [
        'Is it sweetened?',
        'No sugar is added. The sweetness is the ube’s own. Sweeten it yourself if you want it dessert-like. Draft: final formulation pending.',
      ],
      [
        'Does it work with milk?',
        'Yes, and it is the one in the range built for it. Steep 3 g in 150 ml of water, then add 50 ml of milk. The colour holds.',
      ],
      [
        'Is the colour natural?',
        'It comes from the ube itself; nothing is added to deepen it. Pending confirmation on the final blend sheet.',
      ],
    ],
  },
};
