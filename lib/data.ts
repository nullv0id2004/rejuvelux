// Product and copy data for the RejuveLuxe site.
//
// Values wrapped in [BRACKETS] are deliberate placeholder slots (design brief §14):
// they render in the accent colour so an unfilled slot is visible rather than
// silently plausible. Replace them with real values before launch — do not
// invent them.

/*
 * PRICE — the single dummy ₹1,250 applied to every SKU — is gone.
 *
 * Phase 1 (`docs/roadmap.md` §5.1) made the database the source of truth for
 * price. Real values now render from `product_variant.price_paise`, and a NULL
 * there means the price is unconfirmed (R-04) and the product is not
 * purchasable — never a placeholder, never an estimate. Format with
 * `formatPrice` from `lib/catalogue`.
 */

/** Free-shipping threshold used by the cart progress bar. Placeholder. */
export const FREE_SHIPPING_AT = 2500;

export const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

/** Named placeholder slots, so the same gap reads identically everywhere. */
export const SLOT = {
  estate: '[ESTATE]',
  district: '[DISTRICT]',
  elevation: '[000 m]',
  flush: '[FLUSH]',
  pluck: '[MONTH 0000]',
  lot: '[LOT-0000]',
  grade: '[GRADE]',
} as const;

/**
 * Real photography for a SKU, keyed by the shot it fills. Every key is
 * optional — an absent one falls back to the labelled interim stand-in, so
 * photography can land one shot at a time.
 *
 * Shot direction is set by brief §9: flat neutral daylight throughout, no
 * golden hour, no steam, no styling props.
 */
export type ProductPhotos = {
  /** Dry leaf at real scale, with a scale reference in frame. The proof shot. */
  dryLeaf?: string;
  /** Brewed liquor in clear straight-sided glass on white, shot straight on. */
  liquor?: string;
  /** Wet leaf after the first steep. */
  wetLeaf?: string;
  /** The tin as an object, showing its printed lot number and pluck date. */
  lot?: string;
};

/**
 * Shared editorial photography, as distinct from the per-SKU shots below.
 *
 * `interim` is the stand-in used wherever no real photograph exists yet. Any
 * slot still pointing at it renders with an "Interim" caption, so a stand-in is
 * never mistaken for the real shot; give a slot its own file and the caption
 * disappears on its own.
 */
export const SITE_PHOTOS = {
  /** Homepage hero, full-bleed behind the headline. 21:9. */
  hero: '/assets/hero.jpg',
  /** Dark story band, mid-homepage. 21:9. */
  storyBand: '/assets/tea-field.jpeg',
  /** The stand-in itself. */
  interim: '/assets/tea-field.jpeg',
} as const;

export const isInterim = (src: string) => src === SITE_PHOTOS.interim;

export type Brew = {
  temp: string;
  g: string;
  ml: string;
  min: string;
  steeps: string;
};

/*
 * The product shape lives in `lib/catalogue.ts` as `CatalogueProduct`, which
 * merges the database's commerce fields with `lib/presentation.ts`. Nothing in
 * this file describes a product any more — only the editorial around one.
 */

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/**
 * Spelled-out size of the range, so headline copy tracks the SKU list.
 *
 * Phase 1 made the catalogue a database read, so this can no longer be a
 * constant computed from a static array — the count is whatever the database
 * holds. Callers pass `useCatalogue().length` (client) or the length of
 * `listProducts()` (server).
 */
export const rangeWord = (count: number) =>
  NUMBER_WORDS[count] ?? String(count);

/** Capitalised for sentence-initial use. */
export const rangeWordCap = (count: number) => {
  const w = rangeWord(count);
  return w.charAt(0).toUpperCase() + w.slice(1);
};

export const ANNOUNCEMENTS = [
  'Free shipping above ₹[0,000] · India-wide',
  'Current flush · [FLUSH] [0000]',
  'Dispatch within [00] hours · Lot number on every tin',
];

export const FAQS: [string, string][] = [
  [
    'Where does the tea come from?',
    'A single estate in Assam. The garden name, district and elevation appear on every product page and are printed on every tin. Estate details are pending confirmation — the slots read [ESTATE] until then.',
  ],
  [
    'What does single-origin mean here?',
    'One garden, one flush, one lot. Not blended across gardens or seasons. The lot number on the tin traces to a pluck month.',
  ],
  [
    'How fresh is it?',
    'Each tin carries its pluck month and lot number. Current flush is shown in the announcement bar. Dispatch timings are being finalised.',
  ],
  [
    'How should I store tea?',
    'Sealed in the tin, away from light, heat and anything with a smell. Do not refrigerate leaf tea; do refrigerate Matcha.',
  ],
  [
    'What is the difference between Matcha and Green Tea?',
    'Both start as green leaf. Green Tea is steamed, rolled and infused. Matcha is shaded, steamed, deveined and stone-milled, and you consume the leaf itself.',
  ],
  [
    'How much caffeine is in each tea?',
    'All five contain naturally occurring caffeine. Lab figures per cup will be published on each product page once available. Draft.',
  ],
  [
    'Do you ship outside India?',
    'Not yet. India-wide shipping only. Thresholds and dispatch times are placeholders until logistics are confirmed.',
  ],
];

export type CraftChapter = {
  title: string;
  close: string;
  steps: [string, string][];
};

export const CRAFT: Record<string, CraftChapter> = {
  'assam-matcha': {
    title: 'Crafting Our Matcha',
    close:
      'Carefully selected leaves, gently transformed into fine Matcha powder — so the whole leaf becomes part of every cup.',
    steps: [
      ['Leaf Selection', 'Tender, high-quality leaves are chosen for Matcha production.'],
      [
        'Shading',
        'Before harvest, the plants are shaded, changing their chemistry — building L-theanine and chlorophyll.',
      ],
      ['Harvesting', 'Young leaves are picked at precisely the right stage for colour and flavour.'],
      ['Steaming', 'Leaves are rapidly steamed to halt oxidation and lock in their vivid green.'],
      ['Cooling & Drying', 'Carried out under controlled conditions.'],
      ['Deveining', 'Stems and coarse veins are removed, leaving tencha — the pure leaf.'],
      [
        'Fine Grinding',
        'Tencha is slowly stone-milled into an exceptionally fine powder — deliberately slow, to prevent heat from compromising the leaf.',
      ],
      [
        'Quality Screening & Packaging',
        'Assessed for colour, aroma, and fineness, then sealed against oxygen, light, and moisture.',
      ],
    ],
  },
  'silver-needle-assam': {
    title: 'Crafting Our Silver Needle',
    close:
      'Selected from tender young buds, gently withered and carefully dried — preserving natural elegance and refined character with minimal intervention.',
    steps: [
      [
        'Bud Selection',
        'Only young, tender buds are hand-harvested, their fine silvery hairs giving Silver Needle its signature look.',
      ],
      ['Gentle Handling', 'Buds are handled carefully to avoid bruising or unwanted oxidation.'],
      [
        'Withering',
        'Spread in a controlled environment to lose moisture naturally — the most critical stage of white tea.',
      ],
      ['Minimal Oxidation', 'Unlike black tea, the process stays deliberately gentle.'],
      ['Drying', 'Carefully stabilised once the desired character is achieved.'],
      [
        'Sorting & Grading, then Packaging',
        'Graded for bud quality and appearance, then sealed against moisture and light.',
      ],
    ],
  },
  'assam-golden-tips': {
    title: 'Crafting Our Golden Tips',
    close:
      'Carefully selected golden tips, transformed through precise withering, rolling, oxidation, and drying — developing their distinctive depth and character.',
    steps: [
      ['Selective Harvesting', 'Young leaves and golden tips are hand-picked for premium quality.'],
      ['Withering', 'Reduces moisture, making the leaf flexible for processing.'],
      ['Rolling', 'Disrupts the leaf structure, enabling natural enzymatic reactions.'],
      [
        'Oxidation',
        "Controlled oxidation develops theaflavins and thearubigins — the compounds behind Golden Tips' colour, aroma, and body.",
      ],
      ['Drying / Firing', 'Stops oxidation at precisely the right point and stabilises the leaf.'],
      [
        'Sorting, Grading & Sensory Evaluation',
        'Assessed for appearance, liquor, flavour, and finish before packaging.',
      ],
    ],
  },
};

/** Order the Craft page presents its chapters in. */
/** Chapter order, by database slug (Phase 1 — roadmap.md §5.1 step 2). */
export const CRAFT_ORDER = [
  'assam-matcha',
  'silver-needle-assam',
  'assam-golden-tips',
] as const;

export const STORY = [
  'It started with a question: why does the world come to India for some of its finest teas, while India so often settles for less at home?',
  'We have extraordinary estates. Exceptional leaves. Generations of craftsmanship. What was missing was a brand that brought the best of it together — worthy of the people who have earned the finer things in life.',
  "So we went to the source. We searched. We tasted. We rejected. And we searched again — until we found teas that made one thing clear: India doesn't need better tea. India needs better access to its best tea.",
  'That belief became RejuveLuxe. From rare Silver Needle and Matcha to Golden Tips, premium Green Tea and exceptional CTC, we are building a collection for people who understand quality — and expect nothing less. Not for the excess. For the earned.',
];

export type Review = { name: string; city: string; text: string; rating: number };

/** Example content — no real reviews are confirmed (brief §14). */
export const REVIEWS: Review[] = [
  {
    name: 'Anjali',
    city: 'Bengaluru',
    text: 'The Golden Tips is the first Assam I have bought in India that tastes like the one my cousin sends from London. Example review.',
    rating: 5,
  },
  {
    name: 'Rohan',
    city: 'Pune',
    text: 'Ordered the CTC expecting chai tea. Got chai tea, but with a lot number on the tin. That is the point, I think. Example review.',
    rating: 5,
  },
  {
    name: 'Meera',
    city: 'Delhi',
    text: 'Silver Needle is expensive and very quiet. Took me three cups to understand it. Example review.',
    rating: 4,
  },
];
