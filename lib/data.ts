// Product and copy data for the RejuveLuxe site.
//
// Values wrapped in [BRACKETS] are deliberate placeholder slots (design brief §14):
// they render in the accent colour so an unfilled slot is visible rather than
// silently plausible. Replace them with real values before launch — do not
// invent them.

/** Single dummy price applied to every SKU pending real pricing (brief §14). */
export const PRICE = 1250;

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
  hero: '/assets/tea-field.jpeg',
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

export type Product = {
  /** URL slug and cart key. */
  id: string;
  name: string;
  /** One-word register: Focus / Elegance / Legacy … */
  descriptor: string;
  category: string;
  /** Tin body colour — the full-bleed panel behind the product. */
  tin: string;
  /** Tin ink colour — rules, scales, accents scoped to this product. */
  ink: string;
  /**
   * Transparent tin render. `null` where no render has been supplied yet — the
   * tin frame then draws a labelled placeholder in the tin colour rather than a
   * broken image.
   */
  image: string | null;
  /** Real photography, filled in per shot as it arrives. */
  photos?: ProductPhotos;
  weight: string;
  cups: string;
  /** Intensity scale, 1–5. */
  body: number;
  brisk: number;
  description: string;
  why: string;
  tagline: string;
  brew: Brew;
  bullets: string[];
  faqs: [string, string][];
};

export const PRODUCTS: Product[] = [
  {
    id: 'silver',
    name: 'Silver Needle',
    descriptor: 'Elegance',
    category: 'White tea',
    tin: 'var(--tea-silver-tin)',
    ink: 'var(--tea-silver-ink)',
    image: '/assets/silver-needle-900.png',
    weight: '50 g',
    cups: '≈ 16',
    body: 1,
    brisk: 1,
    description:
      'Made almost entirely from young, tender buds, minimally processed to preserve every delicate note. Pale in the cup, soft on the palate — a slow tea, for slow mornings.',
    why: 'Crafted from tender young buds and gently processed, Silver Needle is naturally rich in tea polyphenols and catechins, offering a refined cup with a naturally elegant character.',
    tagline: 'Youngest buds. Minimal intervention. Extraordinary elegance.',
    brew: { temp: '80 °C', g: '3 g', ml: '200 ml', min: '4–5 min', steeps: '3' },
    bullets: [
      'Hand-harvested buds only, no leaf',
      'Withered, not rolled — the leaf keeps its silvery down',
      'Pale straw liquor, honeysuckle and melon',
    ],
    faqs: [
      [
        'Why is Silver Needle pale?',
        'It is made from buds that are withered and dried with almost no oxidation. Colour in the cup comes from oxidation, so there is very little of it here.',
      ],
      [
        'Can I re-steep it?',
        'Yes. Three steeps at 80 °C is the usual range; the second is often the best.',
      ],
      [
        'Is it low in caffeine?',
        'It is naturally lower than black tea from the same garden, but not caffeine-free. Draft — final figure pending lab sheet.',
      ],
      [
        'How should I store it?',
        'Sealed, away from light, heat and anything aromatic. The tin is designed for this.',
      ],
    ],
  },
  {
    id: 'matcha',
    name: 'Assam Matcha',
    descriptor: 'Focus',
    category: 'Matcha',
    tin: 'var(--tea-matcha-tin)',
    ink: 'var(--tea-matcha-ink)',
    image: '/assets/matcha-900.png',
    weight: '50 g',
    cups: '≈ 25',
    body: 4,
    brisk: 2,
    description:
      "Vividly green, fresh, and grassy — with a whole-leaf intensity that infused tea can't match, because with Matcha, you consume the leaf itself, not just its infusion.",
    why: 'Naturally rich in catechins and EGCG, with naturally occurring caffeine and L-theanine — a concentrated whole-leaf experience crafted for energy, alertness, and mindful focus. Grown under heavy canopy shade, it develops a distinctive chlorophyll richness alongside its natural sweetness.',
    tagline: 'Naturally vibrant. Rich in catechins. Crafted for focus.',
    brew: { temp: '75 °C', g: '2 g', ml: '70 ml', min: 'Whisk 20 s', steeps: '1' },
    bullets: [
      'Shade-grown, steamed, stone-milled',
      'Whole leaf, consumed — not infused',
      'Opaque green, sweet, umami',
    ],
    faqs: [
      [
        'How is Assam Matcha different from Japanese matcha?',
        'Same process — shading, steaming, deveining, stone-milling — applied to an Assam cultivar. Expect a slightly deeper, more olive green and a rounder, less marine flavour.',
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
  {
    id: 'golden',
    name: 'Golden Tips',
    descriptor: 'Legacy',
    category: 'Black tea',
    tin: 'var(--tea-golden-tin)',
    ink: 'var(--tea-golden-ink)',
    image: '/assets/golden-tips-900.png',
    weight: '100 g',
    cups: '≈ 40',
    body: 4,
    brisk: 3,
    description:
      'A refined expression of Assam black tea, built from carefully selected golden tips. Controlled oxidation gives it a rich, complex cup with real depth and body.',
    why: "Naturally rich in tea polyphenols and theaflavins, with naturally occurring caffeine, Golden Tips carries Assam's heritage into a sophisticated daily ritual.",
    tagline: 'Rare golden tips. Deep character. Assam heritage.',
    brew: { temp: '95 °C', g: '2.5 g', ml: '200 ml', min: '3–4 min', steeps: '2' },
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
      ['How many cups per tin?', 'Around 40 at 2.5 g. Second steeps are not counted.'],
    ],
  },
  {
    id: 'green',
    name: 'Premium Green Tea',
    descriptor: 'Clarity',
    category: 'Green tea',
    tin: 'var(--tea-green-tin)',
    ink: 'var(--tea-green-ink)',
    image: '/assets/green-tea-900.png',
    weight: '100 g',
    cups: '≈ 40',
    body: 2,
    brisk: 3,
    description:
      'Clean, grassy, and unadorned — the leaf, done properly, with nothing extra required.',
    why: 'Naturally rich in catechins with naturally occurring caffeine, our Green Tea is the everyday expression of the Assam leaf, done properly.',
    tagline: 'Clean. Grassy. Unadorned.',
    brew: { temp: '80 °C', g: '2.5 g', ml: '200 ml', min: '2–3 min', steeps: '2' },
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
  {
    id: 'ctc',
    name: 'CTC Tea',
    descriptor: 'Strength',
    category: 'Black tea',
    tin: 'var(--tea-ctc-tin)',
    ink: 'var(--tea-ctc-ink)',
    image: '/assets/ctc-tea-900.png',
    weight: '250 g',
    cups: '≈ 80',
    body: 5,
    brisk: 5,
    description:
      'Crush, Tear, Curl — built for strength without apology. Bold, malty, and deep amber in the cup; the foundation of a proper cup of chai, for those who take their standards strong.',
    why: 'Naturally rich in theaflavins and thearubigins with naturally occurring caffeine, CTC gives chai its strength and colour.',
    tagline: 'Bold. Malty. Without apology.',
    brew: { temp: '100 °C', g: '3 g', ml: '200 ml', min: 'Boil 3 min', steeps: '1' },
    bullets: [
      'Single-estate CTC, not a blend',
      'Graded [GRADE] — even granule, fast colour',
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
  {
    // The sixth expression. DRAFT COPY — the design system supplied none for
    // Ube, so the sensory writing below was authored to the house voice and
    // needs sign-off before launch. Specifically unconfirmed: the blend
    // composition (real ube vs. flavouring), tin weight, cups per tin, the
    // intensity scores, and the brew parameters. Everything the rest of the
    // range keeps as a slot — estate, grade, flush, lot — stays a slot here too.
    id: 'ube',
    name: 'Ube',
    descriptor: 'Comfort',
    category: 'Flavoured tea',
    tin: 'var(--tea-ube-tin)',
    ink: 'var(--tea-ube-ink)',
    image: '/assets/ube-900.png',
    weight: '50 g',
    cups: '≈ 20',
    body: 3,
    brisk: 2,
    description:
      'Estate Assam blended with ube — the purple yam, earthy and gently sweet. Soft in the cup, with a violet cast that deepens as it steeps and holds its colour against milk.',
    why: 'Built on the same estate leaf as the rest of the range and blended rather than flavoured, Ube is naturally rich in the polyphenols of its base tea, with naturally occurring caffeine. A different register, held to the same standard.',
    tagline: 'Estate leaf. Real ube. Quietly different.',
    brew: { temp: '90 °C', g: '3 g', ml: '200 ml', min: '3–4 min', steeps: '2' },
    bullets: [
      'Single-estate Assam base — blended, not flavoured',
      'Violet liquor that deepens with the steep',
      'Takes milk without thinning out',
    ],
    faqs: [
      [
        'What does ube taste like?',
        'Earthy and mildly sweet — closer to chestnut or taro than to fruit. It rounds the Assam base rather than masking it.',
      ],
      [
        'Is it sweetened?',
        'No sugar is added. The sweetness is the ube’s own. Sweeten it yourself if you want it dessert-like. Draft — final formulation pending.',
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
];

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id);

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/** Spelled-out size of the range, so headline copy tracks the SKU list. */
export const RANGE_COUNT = PRODUCTS.length;
export const RANGE_WORD = NUMBER_WORDS[RANGE_COUNT] ?? String(RANGE_COUNT);
/** Capitalised for sentence-initial use. */
export const RANGE_WORD_CAP = RANGE_WORD.charAt(0).toUpperCase() + RANGE_WORD.slice(1);

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
  matcha: {
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
  silver: {
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
  golden: {
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
export const CRAFT_ORDER = ['matcha', 'silver', 'golden'] as const;

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
