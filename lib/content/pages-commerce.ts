import type { ContentPage } from './types';


/**
 * Collections and gifting: content handover P02, P04, P09, P10 and P27 to P29.
 * All Tea (P03) is /shop. The optional single-type collections (P05 to P08)
 * are not built: the handover keeps them out of navigation while each holds
 * one product.
 */
export const COMMERCE_PAGES: ContentPage[] = [
  {
    slug: 'collections',
    seoTitle: 'Explore Tea Collections and Gifts | RejuveLuxe',
    description:
      'Find your way through RejuveLuxe: the Assam Collection, individual teas, gift sets and teaware for thoughtful preparation.',
    eyebrow: 'Collections',
    title: 'Find your expression.',
    lead: ['Begin with the tea, the ritual or the person you are choosing for.'],
    sections: [
      {
        t: 'cards',
        cards: [
          {
            title: 'The Assam Collection',
            body: 'Three teas with a shared origin and distinctly different characters.',
            cta: { label: 'Explore Assam', href: '/collections/assam-collection' },
          },
          {
            title: 'All Tea',
            body: 'Compare the range and find the cup that feels right for you.',
            cta: { label: 'Shop Tea', href: '/shop' },
          },
          {
            title: 'Tea Gift Sets',
            body: 'Considered selections for personal moments and meaningful occasions.',
            cta: { label: 'Explore Gift Sets', href: '/collections/gift-sets' },
          },
          {
            title: 'Teaware',
            body: 'The tools and vessels that give preparation its place.',
            cta: { label: 'Explore Teaware', href: '/collections/teaware' },
          },
        ],
      },
      {
        t: 'text',
        title: 'Need a starting point?',
        body: ['Meet the three hero teas in our guide to choosing your first RejuveLuxe cup.'],
        cta: [{ label: 'Choose Your Tea', href: '/choose-your-tea' }],
      },
    ],
  },

  {
    slug: 'assam-collection',
    seoTitle: 'The Assam Collection | Matcha, Silver Needle and Golden Tips',
    description:
      'Discover Focus, Elegance and Legacy: Assam Matcha, Silver Needle Assam and Assam Golden Tips, three expressions of one origin.',
    eyebrow: 'The Assam Collection',
    title: 'Three expressions. One origin.',
    lead: [
      'Assam is the starting point. Selection and craft give each tea its individual character. Our hero collection brings together a finely milled green tea, a delicate bud tea and a distinguished black tea.',
    ],
    sections: [
      {
        t: 'cards',
        cards: [
          {
            eyebrow: 'Focus',
            title: 'Assam Matcha',
            body: 'A powder that becomes part of the cup. Bright green character and a preparation ritual shaped by sifting and whisking.',
            cta: { label: 'Explore Focus', href: '/shop/assam-matcha' },
          },
          {
            eyebrow: 'Elegance',
            title: 'Silver Needle Assam',
            body: 'Tender buds, carefully handled to preserve their subtle character. A lighter cup that invites you to notice the details.',
            cta: { label: 'Explore Elegance', href: '/shop/silver-needle-assam' },
          },
          {
            eyebrow: 'Legacy',
            title: 'Assam Golden Tips',
            body: 'Selected golden tips, shaped through black-tea craft into a richer expression. A cup with presence, to be savoured without hurry.',
            cta: { label: 'Explore Legacy', href: '/shop/assam-golden-tips' },
          },
        ],
      },
      {
        t: 'text',
        title: 'The origin is only the beginning',
        body: [
          'The leaf selected, the decisions made after harvest and the way you prepare it all influence what arrives in the cup.',
        ],
        cta: [{ label: 'Discover the Craft', href: '/craft' }],
      },
    ],
  },

  {
    slug: 'gift-sets',
    seoTitle: 'Luxury Tea Gift Sets | RejuveLuxe',
    description:
      'Discover thoughtful RejuveLuxe tea gifts, from a selection of different teas to Matcha-focused boxes and preparation rituals.',
    eyebrow: 'Tea Gift Sets',
    title: 'A considered gift. A lasting ritual.',
    lead: [
      'Some gifts are enjoyed in a moment. Others create moments to return to. Explore tea gifts chosen for the pleasure of discovering, preparing and sharing something exceptional.',
    ],
    sections: [
      { t: 'products', slugs: [...['complete-tasting-gift-set', 'heritage-duo-gift-set', 'vibrant-duo-gift-set'], 'matcha-ritual-set', 'matcha-tea-box'] },
      {
        t: 'text',
        title: 'Choosing for a team or an occasion?',
        body: [
          'Tell us about the recipients, quantity and date you have in mind. We can discuss a suitable selection and the available presentation options.',
        ],
        cta: [{ label: 'Enquire About Corporate Gifting', href: '/corporate-gifting' }],
      },
    ],
  },

  {
    slug: 'teaware',
    seoTitle: 'Teaware and Matcha Ritual Accessories | RejuveLuxe',
    description:
      'Explore RejuveLuxe teaware and Matcha rituals, with considered vessels and preparation tools that give tea its time.',
    eyebrow: 'Teaware',
    title: 'The details of the ritual.',
    lead: [
      'The bowl you reach for. The whisk in your hand. A cup that makes you want to sit a little longer. Discover the pieces that support your tea ritual.',
    ],
    sections: [
      { t: 'products', slugs: ['retro-cup-with-lid', 'matcha-ritual-set'] },
      {
        t: 'text',
        title: 'Choose for the way you prepare',
        body: [
          'Whisked tea calls for space to work. Loose-leaf tea needs room to infuse. Begin with the tea you enjoy, then choose the tools that help you prepare it comfortably.',
        ],
        cta: [{ label: 'Explore Preparation Guides', href: '/tea-rituals' }],
      },
    ],
  },

  {
    slug: 'gifting',
    seoTitle: 'Thoughtful Tea Gifting | RejuveLuxe',
    description:
      'Choose RejuveLuxe for personal, festive and corporate tea gifting. Explore tea selections and Matcha rituals for meaningful occasions.',
    eyebrow: 'Gifting',
    title: 'Give a moment worth making time for.',
    lead: [
      'A thoughtful gift begins with the person receiving it. Their taste. Their curiosity. The small rituals they enjoy. RejuveLuxe brings tea and considered presentation together for a gesture that feels personal.',
    ],
    sections: [
      {
        t: 'cards',
        cards: [
          {
            title: 'For a milestone',
            body: 'Mark the work behind an achievement with something chosen to be enjoyed slowly. A distinctive tea can give the occasion a quieter, more personal expression.',
          },
          {
            title: 'For a thank-you',
            body: 'Choose a selection that invites discovery, or a familiar tea presented with care. The thought behind the choice is part of the gift.',
          },
          {
            title: 'For the ritual',
            body: 'The Matcha Ritual Set makes preparation part of the experience, bringing the tea together with the tools to begin.',
            cta: { label: 'Discover the Ritual Set', href: '/shop/matcha-ritual-set' },
          },
        ],
        cta: [{ label: 'Explore Gift Sets', href: '/collections/gift-sets' }],
      },
      { t: 'products', title: 'Our gift sets', slugs: ['complete-tasting-gift-set', 'heritage-duo-gift-set', 'vibrant-duo-gift-set'] },
      {
        t: 'text',
        title: 'For teams and business relationships',
        body: [
          'Tell us about the recipients, quantity and occasion. We can discuss the current gift formats and what is possible for your order.',
        ],
        cta: [{ label: 'Corporate Gifting Enquiry', href: '/corporate-gifting' }],
      },
    ],
  },

  {
    slug: 'corporate-gifting',
    seoTitle: 'Corporate Tea Gifts and Business Enquiries | RejuveLuxe',
    description:
      'Discuss RejuveLuxe tea gifts for teams, clients and business occasions. Share your quantity, timing and preferences for a considered proposal.',
    eyebrow: 'Corporate Gifting',
    title: 'A thoughtful expression of appreciation.',
    lead: [
      'For the people who contribute, collaborate and build alongside you. RejuveLuxe tea gifts offer a considered way to mark the relationship.',
    ],
    sections: [
      {
        t: 'text',
        title: 'Begin with the occasion',
        body: [
          'Whether you are recognising a team, thanking a client or planning a festive gesture, share what you have in mind. We will discuss the tea selection, presentation and current options for your order.',
        ],
      },
      {
        t: 'text',
        title: 'Tell us what matters',
        body: [
          'The number of recipients, delivery locations, budget and date help us understand the brief. If you have a message or presentation idea, include it in your enquiry so we can confirm what is possible.',
        ],
      },
      { t: 'form', form: 'gifting', title: 'Let’s discuss your gifts.' },
      {
        t: 'faq',
        title: 'Corporate gifting questions',
        items: [
          ['Can gifts include our branding?', 'Include your idea in the enquiry. We will confirm the available options before you order.'],
          ['Can you help us choose a selection?', 'Tell us about the recipients and occasion so we can discuss suitable current formats.'],
          ['Can an order go to different addresses?', 'Share the destinations and quantity. Delivery arrangements must be confirmed for the order.'],
          ['Is there a minimum quantity?', 'Ask us for the current requirements for your selected gift format.'],
        ],
      },
    ],
  },

  {
    slug: 'festive-gifting',
    seoTitle: 'Festive Tea Gifts | RejuveLuxe',
    description:
      'Discover a considered approach to festive gifting with RejuveLuxe tea selections and rituals for the people you wish to celebrate.',
    eyebrow: 'Festive Gifting',
    title: 'A season for thoughtful gestures.',
    lead: [
      'Celebrate with something chosen for the person receiving it. A tea to discover, a ritual to begin, a moment to share.',
    ],
    sections: [
      {
        t: 'text',
        title: 'Precious blends. Perfectly presented.',
        body: [
          'Explore the current gift selection and find a format that suits your occasion. Keep the gesture personal, with attention to the tea and the experience it invites.',
        ],
        cta: [{ label: 'Explore Festive Gifts', href: '/collections/gift-sets' }],
      },
      { t: 'products', title: 'Gift sets for the season', slugs: ['complete-tasting-gift-set', 'heritage-duo-gift-set', 'vibrant-duo-gift-set'] },
      {
        t: 'text',
        title: 'Planning gifts for a group?',
        body: [
          'Share the number of recipients, the occasion and your preferred date. We will discuss the available formats and confirm the practical details before you order.',
        ],
        cta: [{ label: 'Discuss a Festive Order', href: '/corporate-gifting' }],
      },
    ],
  },
];
