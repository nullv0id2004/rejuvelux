import type { ContentPage } from './types';

/** Brand and education pages: content handover P21 to P26. */
export const STORY_PAGES: ContentPage[] = [
  {
    slug: 'our-story',
    seoTitle: 'Our Story | Earned, Not Indulged | RejuveLuxe',
    description:
      'Discover why RejuveLuxe began: a search for exceptional Indian tea, a commitment to careful selection and a belief in moments well earned.',
    eyebrow: 'Our Story',
    title: 'A discovery that became a devotion.',
    lead: [
      'It began with a question. Why should some of India’s most exceptional teas travel the world while being difficult to discover at home?',
      'India already had the leaves, the estates and generations of craft. We wanted to bring exceptional teas together with the care and presentation they deserved. So we went closer to the source.',
    ],
    sections: [
      {
        t: 'text',
        title: 'We searched. We tasted. We kept looking.',
        body: [
          'Finding a good tea was not the end of the search. We compared character, paid attention to the choices behind each cup and learned to value what was left out as much as what was chosen.',
          'That search became RejuveLuxe: an Indian tea brand built around origin, craft and the pleasure of discernment.',
        ],
      },
      {
        t: 'text',
        title: 'Assam, expressed in three ways',
        body: [
          'Our hero collection brings together Assam Matcha, Silver Needle Assam and Assam Golden Tips. Different formats, different characters, one shared starting point. Each asks for its own preparation and offers its own experience.',
        ],
      },
      {
        t: 'text',
        title: 'The people behind the selection',
        body: [
          'S. Piyush Bajpai works across tea tasting, buying and procurement. Abhishek Tewari leads sales and marketing. Together, their work connects the selection of tea with the way it is introduced and experienced.',
        ],
      },
      {
        t: 'band',
        title: 'For the moments you have earned',
        body: [
          'We believe a cup can be more than something you fit between tasks. It can be the moment you pause and appreciate the work it took to arrive here. The early hours. The decisions. The standards you chose to keep.',
          'That is what Earned, Not Indulged means to us. Something exceptional, chosen with care and enjoyed without hurry.',
        ],
        cta: [{ label: 'Explore the Assam Collection', href: '/collections/assam-collection' }],
      },
    ],
  },

  {
    slug: 'assam-origin',
    seoTitle: 'Assam Origin | The RejuveLuxe Collection',
    description:
      'Explore the Assam origin behind RejuveLuxe’s hero collection and discover why selection and craft matter as much as the place itself.',
    eyebrow: 'Assam Origin',
    title: 'Assam is where this chapter begins.',
    lead: [
      'Origin gives a tea its context. The choices made around the leaf give it character. RejuveLuxe’s hero collection brings Assam into focus through three different expressions: Matcha, Silver Needle and Golden Tips.',
    ],
    sections: [
      {
        t: 'text',
        title: 'More than a name on the pack',
        body: [
          'We want origin to help you understand the tea you are choosing. A place is the beginning of the story, followed by the selected leaf or bud, its processing and the cup it creates.',
        ],
      },
      {
        t: 'text',
        title: 'One origin, distinct journeys',
        body: [
          'Assam Matcha is a finely milled green tea. Silver Needle Assam is centred on delicate buds. Assam Golden Tips develops the fuller character of black tea. Their differences are part of the value of exploring the collection.',
        ],
      },
      {
        t: 'text',
        title: 'Ask about your tea',
        body: [
          'If you would like more information about a particular product or pack, contact us with its name and batch details. We will help you find the available sourcing information for that tea.',
        ],
        cta: [
          { label: 'Discover the Craft', href: '/craft' },
          { label: 'Ask About a Product', href: '/contact' },
        ],
      },
    ],
  },

  {
    slug: 'craft',
    seoTitle: 'The Craft Behind the Tea | RejuveLuxe',
    description:
      'Discover how selection and different processing approaches shape Assam Matcha, Silver Needle Assam and Assam Golden Tips.',
    eyebrow: 'The Craft',
    title: 'Every decision becomes part of the cup.',
    lead: [
      'The leaf. The timing. The way it is handled. Tea takes its character from a sequence of decisions, and different teas ask for different kinds of care.',
    ],
    sections: [
      {
        t: 'text',
        title: 'Selection comes first',
        body: [
          'A tender bud and a leaf chosen for black tea do not begin the same journey. Selection is the first act of judgment: understanding what a tea is intended to become and choosing accordingly.',
        ],
      },
      {
        t: 'cards',
        cards: [
          {
            eyebrow: 'Silver Needle',
            title: 'Preserve the delicate',
            body: 'With young buds at its centre, Silver Needle asks for gentle handling. Careful withering and drying help preserve the character that makes a lighter cup worth noticing.',
            cta: { label: 'Discover Silver Needle Assam', href: '/shop/silver-needle-assam' },
          },
          {
            eyebrow: 'Golden Tips',
            title: 'Guide the change',
            body: 'Black tea develops through transformation. Withering, rolling, controlled oxidation and drying shape its colour, aroma and body. Each stage contributes to the finished tea.',
            cta: { label: 'Discover Assam Golden Tips', href: '/shop/assam-golden-tips' },
          },
          {
            eyebrow: 'Matcha',
            title: 'Prepare the leaf for a different cup',
            body: 'Matcha becomes a fine powder, changing how the tea is prepared and enjoyed. It is whisked into water, bringing the finely milled tea into the drink itself.',
            cta: { label: 'Discover Assam Matcha', href: '/shop/assam-matcha' },
          },
        ],
      },
      {
        t: 'text',
        title: 'The cup is the final conversation',
        body: [
          'Appearance and process tell part of the story. Aroma, texture and taste complete it. Prepare the tea carefully, take a sip and give yourself time to notice what you enjoy.',
        ],
        cta: [{ label: 'Meet the Three Expressions', href: '/collections/assam-collection' }],
      },
    ],
  },

  {
    slug: 'choose-your-tea',
    seoTitle: 'Choose Your Tea | RejuveLuxe Tea Guide',
    description:
      'Compare Assam Matcha, Silver Needle Assam, Assam Golden Tips and Green Tea by character and preparation. Find a starting point for your ritual.',
    eyebrow: 'Tea Guide',
    title: 'Begin with what you enjoy.',
    lead: [
      'You do not need to know every tea term to choose well. Start with the character you are curious about and the preparation you would enjoy making time for.',
    ],
    sections: [
      {
        t: 'table',
        title: 'Find your starting point',
        head: ['If you are looking for', 'Begin with', 'Your preparation'],
        rows: [
          ['A vibrant green drink and a hands-on ritual', 'Assam Matcha', 'Sift and whisk; enjoy with water or milk'],
          ['A light, delicate cup', 'Silver Needle Assam', 'Gently steep the buds and strain'],
          ['A richer black tea', 'Assam Golden Tips', 'Steep, taste and strain at your preferred strength'],
          ['A simple leaf infusion', 'Green Tea', 'A short steep, followed by straining'],
        ],
      },
      {
        t: 'text',
        title: 'Choosing a gift?',
        body: [
          'If you know the recipient’s favourite tea, begin there. If you do not, a selection offers a way to explore. For someone who enjoys making things with care, a Matcha ritual can make preparation part of the gift.',
        ],
        cta: [{ label: 'Explore Gifting', href: '/gifting' }],
      },
      {
        t: 'text',
        title: 'Still deciding?',
        body: [
          'Tell us what you usually drink and how you like to prepare it. We can help you compare the current options.',
        ],
        cta: [{ label: 'Ask Us About Tea', href: '/contact' }],
      },
    ],
  },

  {
    slug: 'tea-rituals',
    seoTitle: 'Tea Rituals and Brewing Guides | RejuveLuxe',
    description:
      'Learn to prepare RejuveLuxe tea with attention to quantity, water and time. Explore loose-leaf brewing and a step-by-step Matcha ritual.',
    eyebrow: 'Tea Rituals',
    title: 'Pour slowly. Savour deeply.',
    lead: [
      'A good ritual does not need to be complicated. Begin with the right amount of tea, water at the recommended temperature and enough attention to notice when the cup is ready.',
    ],
    cta: [{ label: 'Choose Your Tea', href: '/choose-your-tea' }],
    sections: [
      {
        t: 'text',
        title: 'The three things to notice',
        body: [
          'Quantity gives your preparation a starting point. Water temperature influences how the tea infuses. Time lets you adjust its strength. Follow the guidance on your pack, then make small changes to find your preference.',
        ],
      },
      {
        t: 'table',
        title: 'A starting point for each tea',
        head: ['Tea', 'Quantity and water', 'Preparation'],
        rows: [
          ['Assam Matcha', '2 g; 70 ml at 80°C', 'Sift and whisk; add water or milk to taste'],
          ['Silver Needle Assam', '2 g; 200 ml at 80-85°C', 'Steep 3-4 minutes, then strain'],
          ['Assam Golden Tips', '2 g; 200 ml at 90-95°C', 'Begin at 3 minutes; taste, then strain within 3-5 minutes'],
        ],
      },
      {
        t: 'text',
        title: 'Give loose leaves room',
        body: [
          'Use an infuser with enough space for the tea to move in the water. Strain when the cup reaches your preferred strength, rather than leaving the leaves in as you drink.',
        ],
      },
      {
        t: 'text',
        title: 'A different preparation for Matcha',
        body: [
          'Matcha is whisked, not strained after steeping. Sifting helps break up small clumps before water is added. Visit our guide for a simple bowl and an iced latte variation.',
        ],
        cta: [{ label: 'Make Matcha', href: '/how-to-make-matcha' }],
      },
      {
        t: 'text',
        title: 'Make the next cup yours',
        body: [
          'If the first cup feels too strong, shorten the next infusion or use a little less tea. If it feels too light, adjust gradually. Keep the change small so you can understand what made the difference.',
        ],
      },
    ],
  },

  {
    slug: 'how-to-make-matcha',
    seoTitle: 'How to Make Matcha and an Iced Latte | RejuveLuxe',
    description:
      'Follow RejuveLuxe’s Matcha preparation guide: measure, sift and whisk, then enjoy a simple bowl or combine with milk for an iced latte.',
    eyebrow: 'Tea Rituals',
    title: 'Your Matcha ritual starts here.',
    lead: [
      'A bowl, a little water and a few deliberate movements. Begin simply and give yourself space to learn what you enjoy.',
    ],
    sections: [
      {
        t: 'text',
        title: 'Gather your pieces',
        body: [
          'You will need Matcha, a small scale or measuring spoon, a fine strainer, a bowl, warm water and a bamboo whisk or suitable frother.',
        ],
      },
      {
        t: 'steps',
        title: 'Prepare a simple bowl',
        ordered: true,
        items: [
          'Measure 2 g of Matcha and sift it into the bowl.',
          'Add 70 ml water at around 80°C.',
          'Whisk briskly with a light W or M movement until the powder is evenly dispersed. Start with about 30 seconds and adjust as needed.',
          'Enjoy as prepared, or add a little more water to suit your taste.',
        ],
      },
      {
        t: 'text',
        title: 'Make an iced Matcha latte',
        body: [
          'Prepare the Matcha as above. Fill a glass with ice and add around 3/4 cup of your preferred milk. Pour the prepared Matcha over the milk, then stir before drinking. If you like a sweeter drink, mix a little sweetener into the warm Matcha before assembling.',
        ],
      },
      {
        t: 'text',
        title: 'Keep the ritual comfortable',
        body: [
          'If the mixture is clumpy, try sifting more carefully and mixing with a little water before adding the rest. If it is too strong, adjust the balance of Matcha, water and milk on your next preparation.',
        ],
      },
      {
        t: 'text',
        title: 'Care for your tools',
        body: [
          'Follow the instructions supplied with your whisk, bowl and accessories. Let tools dry fully before putting them away, and ask us if you need the care guidance for your set.',
        ],
        cta: [{ label: 'Explore the Matcha Ritual Set', href: '/shop/matcha-ritual-set' }],
      },
    ],
  },
];
