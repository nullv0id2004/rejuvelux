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

import { CONTACT, type ProductPhotos } from './data';

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
  /** `image` is a photograph that fills its frame, not a transparent tin render. */
  photo?: boolean;
  /** Further photographs for the product page gallery, after `image`. */
  gallery?: { src: string; alt: string; label: string }[];
  /** Which part of the range a product belongs to. Defaults to tea. */
  range?: 'tea' | 'gift' | 'teaware';
};

/** Pack details printed on every boxed gift set (supplied pack photography, 12 Sep 2026). */
const giftSetDetails = (mrp: string): [string, string][] => [
  ['MRP', `${mrp} (inclusive of all taxes)`],
  ['Best before', '12 months from date of packaging'],
  ['Country of origin', 'India'],
  ['Packed and marketed by', `${CONTACT.entity}, ${CONTACT.address}`],
  ['FSSAI Lic. No.', CONTACT.fssai],
  ['Note', 'Combination package, not to be sold loose'],
];

function giftSet(key: string, colour: string, mrp: string, tagline: string, intro: string, contents: string[]): Presentation {
  const dir = `/assets/gift-sets/${key}`;
  return {
    descriptor: 'Gifting',
    tin: 'var(--bone-300)',
    ink: 'var(--ink-900)',
    image: `${dir}-open.jpg`,
    photo: true,
    range: 'gift',
    gallery: [
      { src: `${dir}-front.jpg`, alt: `${colour} RejuveLuxe gift box, closed.`, label: 'Box · front' },
      { src: `${dir}-back.jpg`, alt: 'Back of the gift box, printed with its contents, nutrition and packing details.', label: 'Box · back' },
    ],
    eyebrow: 'TEA GIFT SETS',
    tagline,
    intro,
    // The printed "bio-degradable" cup claim is left off until it is substantiated.
    bullets: [...contents, 'Tea infuser', 'Wooden spoon', 'Premium cup'],
    sections: [
      [
        'Give the ritual room',
        'Each tea has its own preparation. Use the individual brewing guidance to explore the selection, rather than treating every tea in the box the same way.',
      ],
      [
        'For the occasion you have in mind',
        'A thank-you, a milestone or a festive visit. Choose a tea gift when you want the gesture to continue beyond the moment it is opened.',
      ],
    ],
    details: giftSetDetails(mrp),
    storage: 'Store in a cool, dry place, away from direct sunlight.',
    faqs: [
      ['Can I change the teas?', 'Contact us to discuss the available selection; customization is subject to confirmation.'],
      ['Can I order several sets?', 'Tell us the quantity, delivery locations and date you have in mind through our gifting enquiry form.'],
      ['How long does the tea keep?', 'Best before 12 months from the date of packaging. Store the set in a cool, dry place, away from direct sunlight.'],
    ],
    related: { label: 'Discuss a Gifting Order', href: '/corporate-gifting' },
  };
}

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
    range: 'gift',
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

  /**
   * CTC Tea and Ube, added on the client's instruction of 12 Sep 2026 that all
   * six teas are sold (resolving the R-52 and ube catalogue calls). Copy is the
   * content handover's enquiry copy: no origin, formulation, sensory or brewing
   * claim is approved for either, so those fields stay as visible slots.
   */
  'ctc-tea': {
    descriptor: 'Strength',
    tin: 'var(--tea-ctc-tin)',
    ink: 'var(--tea-ctc-ink)',
    image: '/assets/ctc-tea-900.png',
    tagline: 'Another expression in the RejuveLuxe range.',
    intro: 'Explore another expression in the RejuveLuxe range, presented in our distinctive tea tin.',
    sections: [
      [
        'Find the details for your cup',
        'Ask us about the current pack, ingredients and recommended preparation for RejuveLuxe CTC Tea. We will help you understand the product before you choose.',
      ],
    ],
    preparation:
      'Follow the guidance on your pack. For help with brewing, contact us with a photograph of the label.',
    details: [
      ['Tea type', 'CTC tea'],
      ['Ingredients', '[APPROVED_CTC_INGREDIENTS]'],
      ['Origin', '[APPROVED_CTC_ORIGIN]'],
    ],
    storage: 'Keep tightly closed in a cool, dry place away from direct sunlight and moisture.',
    faqs: [
      [
        'Is this the same tea as Assam Golden Tips?',
        'CTC Tea and Assam Golden Tips are different product names in the RejuveLuxe range. Please use the instructions and details for the product you select.',
      ],
      ['Where can I get brewing guidance?', 'Follow the guidance on your pack or contact us with a photograph of the label.'],
    ],
    related: { label: 'Explore Assam Golden Tips', href: '/shop/assam-golden-tips' },
  },

  ube: {
    descriptor: 'Comfort',
    tin: 'var(--tea-ube-tin)',
    ink: 'var(--tea-ube-ink)',
    image: '/assets/ube-900.png',
    tagline: 'The Ube expression from our gifting collection.',
    intro:
      'The Ube expression featured in our gifting materials. Ask us about its ingredients and the preparation that suits the format you choose.',
    sections: [
      [
        'Begin with the right preparation',
        'The way you prepare Ube depends on the product you choose. Contact us for the specific ingredient and preparation information before ordering.',
      ],
    ],
    preparation: 'Ask us for the preparation guide that matches the product you are ordering.',
    details: [
      ['Ingredients', '100% Ube'],
      ['Caffeine', '[APPROVED_UBE_CAFFEINE_STATEMENT]'],
    ],
    storage: 'Keep tightly closed in a cool, dry place away from direct sunlight and moisture.',
    faqs: [
      ['Does it contain tea?', 'Please ask for the ingredient list of the current format. Use the details for your selected product.'],
      ['Can I prepare it with milk?', 'Ask for the preparation guide that matches the product you are ordering.'],
      ['Is it available in a gift set?', 'Contact us to discuss the current gifting selection.'],
    ],
    related: { label: 'Ask About Ube', href: '/contact?topic=ube' },
  },

  'complete-tasting-gift-set': giftSet(
    'complete-tasting',
    'Maroon',
    '₹3,499',
    'Four teas with the tools to prepare them.',
    'Four teas. One considered box. Move from the depth of Golden Tips to the delicacy of Silver Needle, the whisked ritual of Matcha and the distinctive character of Ube.',
    ['Assam Golden Tips · 10 g', 'Silver Needle Assam · 10 g', 'Assam Matcha · 15 g', 'Ube · 25 g'],
  ),

  'heritage-duo-gift-set': giftSet(
    'heritage-duo',
    'Black',
    '₹2,999',
    'Golden Tips and Silver Needle, side by side.',
    'Two expressions of Assam, side by side. The depth of Golden Tips and the quiet refinement of Silver Needle, presented with the tools for an unhurried cup.',
    ['Assam Golden Tips · 10 g', 'Silver Needle Assam · 10 g'],
  ),

  'vibrant-duo-gift-set': giftSet(
    'vibrant-duo',
    'Green',
    '₹2,199',
    'Matcha and Ube for a hands-on ritual.',
    'Two colourful expressions for a hands-on ritual. The fresh green character of Assam Matcha beside the distinctive violet of Ube, with the tools to prepare them.',
    ['Assam Matcha · 15 g', 'Ube · 25 g'],
  ),

  'matcha-tea-box': {
    descriptor: 'Gifting',
    tin: 'var(--tea-matcha-tin)',
    ink: 'var(--tea-matcha-ink)',
    image: null,
    range: 'gift',
    eyebrow: 'TEA GIFT SETS',
    tagline: 'A gift centred on Assam Matcha.',
    intro:
      'A gift centred on the tea. A thoughtful way to introduce someone to the fresh character and deliberate preparation of Assam Matcha.',
    sections: [
      [
        'One tea, given your attention',
        'Some people enjoy discovering a whole collection. Others prefer to spend time with one expression. The Matcha Tea Box is for the latter: a focused gift built around the pleasure of preparing Matcha.',
      ],
    ],
    details: [['Contents', '[APPROVED_MATCHA_TEA_BOX_CONTENTS]']],
    faqs: [['Does the box include a whisk or bowl?', 'Ask us to confirm the current contents before ordering. The Matcha Ritual Set brings the tea together with preparation tools.']],
    related: { label: 'Discover the Ritual Set', href: '/shop/matcha-ritual-set' },
  },

  'retro-cup-with-lid': {
    descriptor: 'Teaware',
    tin: 'var(--bone-300)',
    ink: 'var(--ink-900)',
    image: null,
    range: 'teaware',
    eyebrow: 'TEAWARE',
    tagline: 'A ribbed 250 ml cup in soft colours.',
    intro: 'A ribbed form, a soft palette and the RejuveLuxe signature. A considered vessel for your tea setting.',
    sections: [
      [
        'A quieter detail',
        'The textured surface and gently ribbed shape give this cup its character. Choose a colour that feels at home in your space or ask about the options available for your gift set.',
      ],
    ],
    details: [
      ['Capacity', '250 ml'],
      ['Colours', 'Sand Castle, Innocent, Azure, Celeste'],
      ['Material', '[APPROVED_CUP_MATERIAL]'],
      ['Care', '[APPROVED_CUP_CARE]'],
    ],
    faqs: [
      ['Does it have a lid?', 'Yes, the supplied design includes a lid. It is not described here as leakproof.'],
      ['Can I choose a colour?', 'Tell us the colour you would like in your order notes or contact us before ordering.'],
    ],
    related: { label: 'Explore Gift Sets', href: '/collections/gift-sets' },
  },

};
