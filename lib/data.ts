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
  /** Homepage hero banner, art-directed: landscape above the nav breakpoint, portrait below. */
  heroDesktop: '/assets/hero-banner-desktop.jpg',
  heroMobile: '/assets/hero-banner-mobile.jpg',
  heroAlt: 'Six RejuveLuxe tea tins arranged on pale stone with tea leaves and flowers.',
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

/** Verified business and support details. Single source for footer, contact and pack copy. */
export const CONTACT = {
  email: 'support@rejuveluxe.in',
  /** E.164, for `tel:` hrefs. */
  phoneHref: '+918853920222',
  phone: '+91 88539 20222',
  fssai: '12726066000468',
  entity: 'Green Life Global Pvt. Ltd.',
  address: 'E4/1609, SEC-O, LDA Colony, Lucknow, Uttar Pradesh',
} as const;

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

/** Announcement bar. The brand promise only: no shipping, dispatch or offer claim until approved. */
export const ANNOUNCEMENTS: { text: string; href: string }[] = [
  { text: 'Exceptional Tea. Uncompromising Quality.', href: '/collections/assam-collection' },
];

/** Short FAQ set for the design deliverables (alt-home, specs). The full set lives on /faq. */
export const FAQS: [string, string][] = [
  [
    'What is the Assam Collection?',
    'It is our hero collection of Assam Matcha, Silver Needle Assam and Assam Golden Tips, expressed through Focus, Elegance and Legacy.',
  ],
  [
    'Which tea should I try first?',
    'Choose Matcha for a whisked green-tea ritual, Silver Needle for a delicate cup or Golden Tips for richer black-tea character. Our tea guide helps you compare them.',
  ],
  [
    'Is Silver Needle Assam a white tea?',
    'Yes. Silver Needle Assam is the product expression; white tea is the category.',
  ],
  [
    'Are all products caffeine-free?',
    'No. The hero teas contain naturally occurring caffeine. Check the specific product details if caffeine content is important to your choice.',
  ],
  [
    'How should I store tea?',
    'Keep it tightly closed in a cool, dry place away from moisture and direct sunlight. Follow any additional storage guidance on the pack.',
  ],
  [
    'Can I make an iced Matcha latte?',
    'Yes. Whisk Matcha with water first, then combine with cold milk and ice. See our Matcha guide for a starting recipe.',
  ],
];

export const STORY = [
  'It started with a question: why does the world come to India for some of its finest teas, while India so often settles for less at home?',
  'We have extraordinary estates. Exceptional leaves. Generations of craftsmanship. What was missing was a brand that brought the best of it together, worthy of the people who have earned the finer things in life.',
  "So we went to the source. We searched. We tasted. We rejected. And we searched again, until we found teas that made one thing clear: India doesn't need better tea. India needs better access to its best tea.",
  'That belief became RejuveLuxe. From rare Silver Needle and Matcha to Golden Tips, premium Green Tea and exceptional CTC, we are building a collection for people who understand quality, and expect nothing less. Not for the excess. For the earned.',
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
