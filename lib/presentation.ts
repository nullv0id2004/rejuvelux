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
  /** Tin body colour: the full-bleed panel behind the product. */
  tin: string;
  /** Tin ink colour: rules, scales and accents scoped to this product. */
  ink: string;
  /**
   * Transparent tin render. `null` where none has been supplied; the tin
   * frame then draws a labelled placeholder rather than a broken image.
   */
  image: string | null;
  /** Real photography, filled in per shot as it arrives. */
  photos?: ProductPhotos;
  /** Intensity scales, 1 to 5. PROVISIONAL, see the header, R-29. */
  body?: number;
  brisk?: number;
  why?: string;
  /** Short card line. Used in listings, metadata and the showcase. */
  tagline?: string;
  bullets?: string[];
  faqs?: [string, string][];
  /** Eyebrow above the product name, e.g. "FOCUS · THE ASSAM COLLECTION". */
  eyebrow?: string;
  /** Standfirst under the product name. */
  intro?: string;
  /** Editorial sections as [heading, body], rendered as the product page accordions. */
  sections?: [string, string][];
  /** Preparation guidance as customer copy. May carry [SLOT] fields. */
  preparation?: string;
  /** Product details rows. Net quantity is appended from the database. */
  details?: [string, string][];
  storage?: string;
  /** The onward action the content handover gives this product. */
  related?: { label: string; href: string };
};

/**
 * The rendered range. Keys are database slugs. Editorial copy is transcribed
 * from the RejuveLuxe website content handover (P11 to P14, P19); it carries
 * no processing, grade or wellness claim the handover does not approve.
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
    eyebrow: 'ELEGANCE · THE ASSAM COLLECTION',
    tagline: 'Tender buds and a delicate cup.',
    intro: 'Tender buds. Delicate character. A white tea for the moments when you have time to notice the cup.',
    sections: [
      [
        'Quiet distinction',
        'Silver Needle Assam is our expression of Elegance. Its appeal lies in careful selection and gentle handling, preserving the subtle qualities of the buds. Pour it without hurry and let its lighter character unfold.',
      ],
      [
        'Character in the cup',
        'A light infusion, delicate aroma and refined presence. Enjoy it on its own to explore the tea’s subtleties.',
      ],
      [
        'Care that preserves character',
        'Silver Needle begins with young buds. The aim of its craft is to handle them carefully through withering and drying, allowing delicacy to remain at the centre of the experience.',
      ],
    ],
    preparation:
      'Place 2 g of tea in a roomy infuser. Add 200 ml water at 80-85°C. Steep for 3-4 minutes, then strain. Taste before adjusting your next infusion; small changes in time can help you find the balance you enjoy.',
    details: [
      ['Tea type', 'White tea'],
      ['Ingredient', 'White tea'],
      ['Origin', 'Assam, India'],
      ['Caffeine', 'Naturally contains caffeine'],
    ],
    storage: 'Keep tightly closed in a cool, dry place away from direct sunlight and moisture.',
    faqs: [
      ['Is this a white tea?', 'Yes. Silver Needle Assam is the specific product name; white tea is its tea category.'],
      ['Is it best with milk?', 'Begin by tasting it on its own so its delicate character can be appreciated.'],
      [
        'Can I steep the buds again?',
        'You can try another infusion and adjust the time to taste. The result depends on your preparation and the tea in your pack.',
      ],
      ['Is white tea caffeine-free?', 'No. It naturally contains caffeine.'],
    ],
    related: { label: 'Compare with Assam Golden Tips', href: '/shop/assam-golden-tips' },
  },

  'assam-matcha': {
    descriptor: 'Focus',
    tin: 'var(--tea-matcha-tin)',
    ink: 'var(--tea-matcha-ink)',
    image: '/assets/matcha-900.png',
    eyebrow: 'FOCUS · THE ASSAM COLLECTION',
    tagline: 'Vibrant green character. A deliberate whole-leaf ritual.',
    intro:
      'A finely milled whole-leaf green tea with a vibrant green character. Made for the pleasure of slowing down to sift, whisk and enjoy.',
    sections: [
      [
        'A ritual of intention',
        'Assam Matcha brings preparation into the experience. The powder is whisked into the cup, creating a different texture from an infused leaf tea. Enjoy it with water to explore its character, or with milk as a latte.',
      ],
      [
        'Character in the cup',
        'Fresh. Green. Vibrant. Begin with a simple preparation and adjust the balance of tea, water and milk to your preference.',
      ],
      [
        'The leaf, in another form',
        'Matcha is finely milled green tea. Because the powder remains in the drink, sifting and whisking help create a smooth, even mixture. A little care at the beginning makes the preparation more enjoyable.',
      ],
    ],
    preparation:
      'Sift 2 g into a bowl. Add 70 ml water at around 80°C. Whisk briskly until evenly mixed, then enjoy or add more water or milk to taste. For an iced latte, pour the prepared Matcha over cold milk and ice, then stir before drinking.',
    details: [
      ['Tea type', 'Green tea powder'],
      ['Ingredient', 'Green tea powder (Matcha)'],
      ['Origin', 'Assam, India'],
      ['Caffeine', 'Naturally contains caffeine'],
    ],
    storage:
      'Keep tightly closed in a cool, dry place away from direct sunlight and moisture. Follow any additional instructions on your pack.',
    faqs: [
      [
        'Is Assam Matcha a loose-leaf tea?',
        'It is a fine powder whisked into water, rather than leaves that are steeped and removed.',
      ],
      ['Can I make a latte?', 'Yes. Prepare the Matcha with water first, then combine with your choice of milk.'],
      [
        'Do I need a bamboo whisk?',
        'A bamboo whisk is part of the traditional preparation experience. A suitable handheld frother can also help mix a latte.',
      ],
      ['Is it caffeine-free?', 'No. Matcha contains naturally occurring caffeine.'],
    ],
    related: { label: 'Complete the Ritual', href: '/shop/matcha-ritual-set' },
  },

  'assam-golden-tips': {
    descriptor: 'Legacy',
    tin: 'var(--tea-golden-tin)',
    ink: 'var(--tea-golden-ink)',
    image: '/assets/golden-tips-900.png',
    eyebrow: 'LEGACY · THE ASSAM COLLECTION',
    tagline: 'Selected golden tips. Rich black-tea character.',
    intro: 'Selected golden tips. Rich black-tea character. A distinguished expression of Assam, made to be savoured.',
    sections: [
      [
        'A cup with presence',
        'Assam Golden Tips brings depth to the collection. Its character develops through the decisions of black-tea craft: withering, rolling, controlled oxidation and drying. The result is a tea that invites you to slow down and notice its richness.',
      ],
      [
        'Character in the cup',
        'Rich, smooth and aromatic, with the fuller presence of black tea. Begin without additions, then explore the way you prefer to drink it.',
      ],
      [
        'Transformation, carefully guided',
        'Each stage changes the leaf. Withering prepares it, rolling shapes its path and oxidation develops character before drying. The craft is in guiding that change with care.',
      ],
    ],
    preparation:
      'Use 2 g of tea for 200 ml water at 90-95°C. Steep for 3 minutes and taste; allow up to 5 minutes if you prefer a stronger cup. Strain fully when the tea reaches your preferred strength.',
    details: [
      ['Tea type', 'Black tea'],
      ['Ingredient', 'Black tea leaves'],
      ['Origin', 'Assam, India'],
      ['Caffeine', 'Naturally contains caffeine'],
    ],
    storage: 'Keep tightly closed in a cool, dry place away from direct sunlight and moisture.',
    faqs: [
      [
        'What are golden tips?',
        'The name refers to the selected golden tips that distinguish this black tea expression.',
      ],
      ['Can I add milk?', 'You can. Taste it on its own first, then add a little milk if that is how you enjoy black tea.'],
      [
        'How can I make it stronger?',
        'Adjust the leaf quantity or steeping time gradually. Strain the leaves once the tea is ready.',
      ],
      [
        'How does it differ from Silver Needle?',
        'Golden Tips is a black tea with a richer character. Silver Needle Assam is a white tea centred on delicacy.',
      ],
    ],
    related: { label: 'Discover the Assam Collection', href: '/collections/assam-collection' },
  },

  'green-tea': {
    descriptor: 'Clarity',
    tin: 'var(--tea-green-tin)',
    ink: 'var(--tea-green-ink)',
    image: '/assets/green-tea-900.png',
    tagline: 'A simple leaf infusion, made your way.',
    intro: 'A simple leaf-brewing ritual, with room to make the cup your own.',
    sections: [
      [
        'Return to the leaf',
        'Measure the tea. Pour the water. Give the leaves a little time to infuse, then strain. RejuveLuxe Green Tea is for those who enjoy the straightforward pleasure of preparing a fresh cup.',
      ],
      [
        'Find your balance',
        'Start with a shorter infusion and taste. Adjust the next cup gradually until you find the strength you enjoy. A timer helps you repeat a preparation that works for you.',
      ],
    ],
    preparation:
      'Use 1 teaspoon of tea with [APPROVED_GREEN_TEA_WATER_VOLUME] water at around 80°C. Steep for 1.5-2 minutes, then remove the leaves. Adjust within the guidance on your pack to suit your taste.',
    details: [
      ['Tea type', 'Green tea'],
      ['Ingredients', '[APPROVED_GREEN_TEA_INGREDIENTS]'],
      ['Origin', '[APPROVED_GREEN_TEA_ORIGIN]'],
    ],
    storage: 'Keep tightly closed in a cool, dry place away from direct sunlight and moisture.',
    faqs: [
      ['How is it different from Matcha?', 'These leaves are infused and removed. Matcha is a powder that remains in the drink.'],
      ['Can I use a tea infuser?', 'Yes. Choose an infuser that gives the leaves room to move in the water.'],
      ['Can I sweeten it?', 'Prepare and taste the tea first, then add a little sweetener if you prefer.'],
    ],
    related: { label: 'Explore Assam Matcha', href: '/shop/assam-matcha' },
  },

  /**
   * The six-component kit (§32). It has **no tin render** in this repository,
   * so `image` is null and the tin frame draws its labelled placeholder. Its
   * contents come from the database's `components` column.
   */
  'matcha-ritual-set': {
    descriptor: 'Ritual',
    tin: 'var(--tea-matcha-tin)',
    ink: 'var(--tea-matcha-ink)',
    image: null,
    tagline: 'Preparation is part of the product.',
    intro:
      'Preparation is part of the product. Bring the tea and its tools together, and give the ritual your full attention.',
    sections: [
      [
        'From powder to pause',
        'Measure the tea. Sift it into the bowl. Add water and whisk. The sequence is simple, but the attention it asks for is part of its pleasure. This set brings the elements of that preparation together.',
      ],
      [
        'Learn as you prepare',
        'Our Matcha guide takes you through measuring, sifting and whisking, with a latte variation for a different way to enjoy the tea.',
      ],
      [
        'A gift for someone who enjoys the details',
        'For the curious first bowl or a familiar personal ritual, choose a set that makes preparation part of the experience.',
      ],
    ],
    details: [
      ['Set type', 'Matcha tea and preparation tools'],
      ['Matcha quantity', '[APPROVED_MATCHA_QUANTITY]'],
      ['Care', 'Follow the care instructions supplied with the set'],
    ],
    faqs: [
      ['Does the set include tea?', 'Ask us to confirm the current Matcha quantity and full set contents before ordering.'],
      [
        'Is it suitable for a beginner?',
        'The preparation guide offers a clear place to start. No prior tea knowledge is needed to follow the steps.',
      ],
      [
        'How should I care for the tools?',
        'Follow the care instructions supplied with the set. Contact us if you need guidance for a particular piece.',
      ],
    ],
    related: { label: 'Enquire About the Set', href: '/contact?topic=matcha-ritual-set' },
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
