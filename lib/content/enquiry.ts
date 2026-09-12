import { CONTACT } from '../data';
import type { ContentPage } from './types';

/**
 * Enquiry-only products: content handover P15 to P18 and P20. None has a
 * database row, price, stock or approved specification, so each renders as an
 * enquiry page at /shop/[slug] with no Add to Bag. A database row with the same
 * slug always takes precedence (see app/shop/[slug]/page.tsx).
 *
 * CTC Tea and Ube are reachable by URL but held out of navigation and the shop
 * grid, as the handover directs.
 */
export const ENQUIRY: ContentPage[] = [
  ...[
    {
      slug: 'complete-tasting-gift-set',
      name: 'Complete Tasting Gift Set',
      key: 'complete-tasting',
      colour: 'Maroon',
      ratio: '4 / 3',
      mrp: '₹3,499',
      description:
        'Four RejuveLuxe teas in one gift box: Assam Golden Tips, Silver Needle Assam, Assam Matcha and Ube, with a tea infuser, a wooden spoon and a premium cup.',
      lead: 'Four teas. One considered box. Move from the depth of Golden Tips to the delicacy of Silver Needle, the whisked ritual of Matcha and the distinctive character of Ube.',
      tubes: 'four tea tubes',
      contents: ['Assam Golden Tips · 10 g', 'Silver Needle Assam · 10 g', 'Assam Matcha · 15 g', 'Ube · 25 g'],
    },
    {
      slug: 'heritage-duo-gift-set',
      name: 'Heritage Duo Gift Set',
      key: 'heritage-duo',
      colour: 'Black',
      ratio: '1 / 1',
      mrp: '₹2,999',
      description:
        'Assam Golden Tips and Silver Needle Assam in one gift box, with a tea infuser, a wooden spoon and a premium cup.',
      lead: 'Two expressions of Assam, side by side. The depth of Golden Tips and the quiet refinement of Silver Needle, presented with the tools for an unhurried cup.',
      tubes: 'two tea tubes',
      contents: ['Assam Golden Tips · 10 g', 'Silver Needle Assam · 10 g'],
    },
    {
      slug: 'vibrant-duo-gift-set',
      name: 'Vibrant Duo Gift Set',
      key: 'vibrant-duo',
      colour: 'Green',
      ratio: '1 / 1',
      mrp: '₹2,199',
      description:
        'Assam Matcha and Ube in one gift box, with a tea infuser, a wooden spoon and a premium cup.',
      lead: 'Two colourful expressions for a hands-on ritual. The fresh green character of Assam Matcha beside the distinctive violet of Ube, with the tools to prepare them.',
      tubes: 'two tea tubes',
      contents: ['Assam Matcha · 15 g', 'Ube · 25 g'],
    },
  ].map(giftSet),

  {
    slug: 'matcha-tea-box',
    seoTitle: 'Matcha Tea Box | RejuveLuxe Gifting',
    description:
      'Discover a RejuveLuxe gift centred on Assam Matcha. Enquire about the current box, contents and presentation options.',
    eyebrow: 'Tea Gift Sets',
    title: 'Matcha Tea Box',
    lead: [
      'A gift centred on the tea. A thoughtful way to introduce someone to the fresh character and deliberate preparation of Assam Matcha.',
    ],
    cta: [{ label: 'Enquire About the Matcha Tea Box', href: '/contact?topic=matcha-box' }],
    sections: [
      {
        t: 'text',
        title: 'One tea, given your attention',
        body: [
          'Some people enjoy discovering a whole collection. Others prefer to spend time with one expression. The Matcha Tea Box is for the latter: a focused gift built around the pleasure of preparing Matcha.',
        ],
      },
      {
        t: 'text',
        title: 'Choose your presentation',
        body: [
          'Enquire about the current box contents, tea quantity and available presentation. We will share the details so you can choose the right gift for the occasion.',
        ],
      },
      {
        t: 'text',
        title: 'Looking for preparation tools too?',
        body: [
          'Explore the Matcha Ritual Set, a separate format bringing the tea together with tools for its preparation.',
        ],
        cta: [{ label: 'Discover the Ritual Set', href: '/shop/matcha-ritual-set' }],
      },
    ],
  },

  {
    slug: 'retro-cup-with-lid',
    seoTitle: 'Retro Cup with Lid 250 ml | RejuveLuxe',
    description:
      'Explore the RejuveLuxe 250 ml Retro Cup with Lid in soft colour options, with a ribbed form and the RejuveLuxe identity.',
    eyebrow: 'Teaware',
    title: 'Retro Cup with Lid',
    lead: [
      'A ribbed form, a soft palette and the RejuveLuxe signature. A considered vessel for your tea setting.',
      'Capacity: 250 ml · Price: [APPROVED_CUP_PRICE]',
    ],
    cta: [{ label: 'Enquire About the Cup', href: '/contact?topic=retro-cup' }],
    sections: [
      {
        t: 'details',
        title: 'Colour options',
        rows: [
          ['Sand Castle', 'Off White'],
          ['Innocent', 'Light Pink'],
          ['Azure', 'Ice Blue'],
          ['Celeste', 'Light Green'],
        ],
      },
      {
        t: 'text',
        title: 'A quieter detail',
        body: [
          'The textured surface and gently ribbed shape give this cup its character. Choose a colour that feels at home in your space or ask about the options available for your gift set.',
        ],
      },
      {
        t: 'text',
        title: 'Before you choose',
        body: ['Ask us for the current material, usage and care details, along with the colours available to order.'],
      },
      {
        t: 'faq',
        title: 'Cup questions',
        items: [
          ['What is its capacity?', 'The supplier specification lists 250 ml.'],
          ['Does it have a lid?', 'Yes, the supplied design includes a lid. It is not described here as leakproof.'],
          ['Can I choose a colour in a gift set?', 'Available colours depend on the selected set. Contact us before ordering.'],
        ],
      },
    ],
  },

  {
    slug: 'ctc-tea',
    seoTitle: 'CTC Tea | RejuveLuxe',
    image: {
      src: '/assets/ctc-tea-900.png',
      alt: 'Brown RejuveLuxe CTC Tea tin with a gold lid.',
      tin: 'var(--tea-ctc-tin)',
    },
    description: 'Discover RejuveLuxe CTC Tea and enquire about its available format, preparation and product details.',
    eyebrow: 'Tea',
    title: 'CTC Tea',
    lead: ['Explore another expression in the RejuveLuxe range, presented in our distinctive tea tin.'],
    sections: [
      {
        t: 'text',
        title: 'Find the details for your cup',
        body: [
          'Ask us about the current pack, ingredients and recommended preparation for RejuveLuxe CTC Tea. We will help you understand the product before you choose.',
        ],
        cta: [
          { label: 'Enquire About CTC Tea', href: '/contact?topic=ctc' },
          { label: 'Explore Assam Golden Tips', href: '/shop/assam-golden-tips' },
        ],
      },
      {
        t: 'faq',
        title: 'Questions about CTC Tea',
        items: [
          ['Where can I find the pack size and price?', 'Contact us for the current product details.'],
          ['Is this the same tea as Assam Golden Tips?', 'CTC Tea and Assam Golden Tips are different product names in the RejuveLuxe range. Please use the instructions and details for the product you select.'],
          ['Where can I get brewing guidance?', 'Follow the guidance on your pack or contact us with a photograph of the label.'],
        ],
      },
    ],
  },

  {
    slug: 'ube',
    seoTitle: 'Ube Tea and Gifting Enquiries | RejuveLuxe',
    image: {
      src: '/assets/ube-900.png',
      alt: 'Lilac RejuveLuxe Ube tin with a purple cafe illustration.',
      tin: 'var(--tea-ube-tin)',
    },
    description:
      'Enquire about RejuveLuxe Ube, its current formulation and gifting availability. Find the right preparation for the product you choose.',
    eyebrow: 'Enquiry',
    title: 'Discover Ube with RejuveLuxe',
    lead: [
      'Interested in the Ube expression featured in our gifting materials? Ask us about the current product, its ingredients and the format available for your occasion.',
    ],
    sections: [
      {
        t: 'text',
        title: 'Begin with the right preparation',
        body: [
          'The way you prepare Ube depends on the product you choose. Contact us for the specific ingredient and preparation information before ordering.',
        ],
        cta: [
          { label: 'Ask About Ube', href: '/contact?topic=ube' },
          { label: 'Explore Tea Gifts', href: '/collections/gift-sets' },
        ],
      },
      {
        t: 'faq',
        title: 'Questions about Ube',
        items: [
          ['Does it contain tea?', 'Please ask for the ingredient list of the current format. Use the details for your selected product.'],
          ['Can I prepare it with milk?', 'Ask for the preparation guide that matches the product you are ordering.'],
          ['Is it available in a gift set?', 'Contact us to discuss the current gifting selection.'],
        ],
      },
    ],
  },
];

/**
 * The three boxed gift sets. Contents, MRP, shelf life and storage are as
 * printed on the back of each box (supplied pack photography, 12 Sep 2026).
 * The printed "bio-degradable" cup claim is left off until it is substantiated.
 * No database row yet, so each is an enquiry page with its price shown.
 */
function giftSet(g: {
  slug: string;
  name: string;
  key: string;
  colour: string;
  ratio: string;
  mrp: string;
  description: string;
  lead: string;
  tubes: string;
  contents: string[];
}): ContentPage {
  const dir = `/assets/gift-sets/${g.key}`;
  return {
    slug: g.slug,
    seoTitle: `${g.name} | RejuveLuxe`,
    description: g.description,
    eyebrow: 'Tea Gift Sets',
    title: g.name,
    image: { src: `${dir}-front.jpg`, alt: `${g.colour} RejuveLuxe ${g.name} box, closed.`, photo: true, ratio: g.ratio },
    lead: [g.lead, `MRP ${g.mrp} · inclusive of all taxes`],
    cta: [
      { label: 'Enquire About This Gift', href: `/contact?topic=${g.key}` },
      { label: 'Discuss a Gifting Order', href: '/corporate-gifting' },
    ],
    sections: [
      {
        t: 'gallery',
        images: [
          {
            src: `${dir}-open.jpg`,
            alt: `${g.name} open, showing ${g.tubes}, a cup, a tea infuser and a wooden spoon.`,
            caption: 'Inside the box',
            ratio: g.ratio,
          },
          {
            src: `${dir}-back.jpg`,
            alt: `Back of the ${g.name} box, printed with its contents, nutrition and packing details.`,
            caption: 'Contents and details, as printed on the box',
            ratio: g.ratio,
          },
        ],
      },
      {
        t: 'steps',
        title: 'Inside the set',
        items: [...g.contents, 'Tea infuser', 'Wooden spoon', 'Premium cup'],
      },
      {
        t: 'details',
        title: 'Set details',
        rows: [
          ['Net quantity', '1 gift set'],
          ['MRP', `${g.mrp} (inclusive of all taxes)`],
          ['Best before', '12 months from date of packaging'],
          ['Storage', 'Store in a cool, dry place, away from direct sunlight'],
          ['Country of origin', 'India'],
          ['Packed and marketed by', `${CONTACT.entity}, ${CONTACT.address}`],
          ['FSSAI Lic. No.', CONTACT.fssai],
          ['Note', 'Combination package, not to be sold loose'],
        ],
      },
      {
        t: 'text',
        title: 'Give the ritual room',
        body: [
          'Each tea has its own preparation. Use the individual brewing guidance to explore the selection, rather than treating every tea in the box the same way.',
        ],
        cta: [{ label: 'Explore Tea Rituals', href: '/tea-rituals' }],
      },
      {
        t: 'faq',
        title: 'Gift set questions',
        items: [
          ['Can I change the teas?', 'Contact us to discuss the available selection; customization is subject to confirmation.'],
          ['Can I order several sets?', 'Tell us the quantity, delivery locations and date you have in mind through our gifting enquiry form.'],
          ['How long does the tea keep?', 'Best before 12 months from the date of packaging. Store the set in a cool, dry place, away from direct sunlight.'],
        ],
        cta: [{ label: 'Discuss a Gifting Order', href: '/corporate-gifting' }],
      },
    ],
  };
}
