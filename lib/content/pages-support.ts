import { CONTACT } from '../data';
import type { ContentPage } from './types';

/** Service pages: content handover P30 to P32 and P49. */
export const SUPPORT_PAGES: ContentPage[] = [
  {
    slug: 'contact',
    seoTitle: 'Contact RejuveLuxe | Tea, Orders and Gifting',
    description:
      'Contact RejuveLuxe about tea selection, an order, preparation or gifting. Share your question and the details needed to help.',
    eyebrow: 'Contact',
    title: 'Let’s talk about tea.',
    lead: [
      'Whether you are choosing a tea, planning a gift or asking about an order, we would be glad to hear from you.',
    ],
    sections: [
      {
        t: 'form',
        form: 'contact',
        title: 'How can we help?',
        intro:
          'For an existing order, include your order number and the email used at checkout. For a product question, tell us which tea or set you have in mind.',
      },
      { t: 'contact', title: 'Contact details' },
      {
        t: 'text',
        title: 'Gifting for a team or occasion?',
        body: ['Use our dedicated gifting form to share quantities, dates and delivery locations.'],
        cta: [{ label: 'Send a Gifting Enquiry', href: '/corporate-gifting' }],
      },
    ],
  },

  {
    slug: 'faq',
    seoTitle: 'Frequently Asked Questions | RejuveLuxe',
    description:
      'Find answers about RejuveLuxe teas, preparation, gifting, orders and product concerns, with links to detailed guides and support.',
    eyebrow: 'FAQs',
    title: 'A little guidance for your next cup.',
    sections: [
      {
        t: 'faq',
        title: 'Choosing tea',
        items: [
          ['What is the Assam Collection?', 'It is our hero collection of Assam Matcha, Silver Needle Assam and Assam Golden Tips, expressed through Focus, Elegance and Legacy.'],
          ['Which tea should I try first?', 'Choose Matcha for a whisked green-tea ritual, Silver Needle for a delicate cup or Golden Tips for richer black-tea character. Our tea guide helps you compare them.'],
          ['Is Silver Needle Assam a white tea?', 'Yes. Silver Needle Assam is the product expression; white tea is the category.'],
          ['Are all products caffeine-free?', 'No. The hero teas contain naturally occurring caffeine. Check the specific product details if caffeine content is important to your choice.'],
        ],
        cta: [{ label: 'Choose Your Tea', href: '/choose-your-tea' }],
      },
      {
        t: 'faq',
        title: 'Preparation and storage',
        items: [
          ['Where can I find brewing instructions?', 'Follow the instructions on your pack and the relevant product page. Our Tea Rituals section offers additional preparation guidance.'],
          ['Can I make an iced Matcha latte?', 'Yes. Whisk Matcha with water first, then combine with cold milk and ice. See our Matcha guide for a starting recipe.'],
          ['How should I store tea?', 'Keep it tightly closed in a cool, dry place away from moisture and direct sunlight. Follow any additional storage guidance on the pack.'],
          ['What if my tea looks unusual?', 'Contact us with the product name, batch information and a photograph if available. If you suspect contamination or moisture damage, set the product aside while the concern is reviewed.'],
        ],
        cta: [{ label: 'Explore Tea Rituals', href: '/tea-rituals' }],
      },
      {
        t: 'faq',
        title: 'Gifts',
        items: [
          ['What gift formats are available?', 'Explore the current Gift Sets collection. Final contents and availability are shown for the selected format or confirmed through enquiry.'],
          ['Can I arrange corporate gifts?', 'Yes, you can send a corporate gifting enquiry with your quantity, budget, locations and date. The available options will be confirmed before ordering.'],
          ['Can I request a particular cup colour?', 'Ask us which colours are available for your selected product or gift format.'],
        ],
        cta: [{ label: 'Explore Gift Sets', href: '/collections/gift-sets' }],
      },
      {
        t: 'faq',
        title: 'Orders and support',
        items: [
          ['Where do you deliver and what does shipping cost?', 'Available destinations and charges are shown during checkout and explained in the Shipping Policy.'],
          ['How do I check my order?', 'Use Track an Order or contact us with your order number and checkout email.'],
          ['Can I cancel an order?', 'See Returns and Cancellations for the applicable stage and conditions, then contact us with your order number.'],
          ['What if my order arrives spilled or damaged?', 'Contact us with your order details and a description of the issue. Our Returns and Cancellations page explains the process. Your statutory rights remain unaffected.'],
        ],
        cta: [{ label: 'Still Need Help?', href: '/contact' }],
      },
    ],
  },

  {
    slug: 'where-to-find-us',
    seoTitle: 'Where to Find RejuveLuxe | Shopping and Enquiries',
    description:
      'Explore RejuveLuxe online or contact the team for current information about retail availability, events and product enquiries.',
    eyebrow: 'Where to Find Us',
    title: 'Find your next RejuveLuxe cup.',
    lead: [
      'Explore our tea collection online. If you are looking for a physical retail location or an upcoming opportunity to discover the range, contact us for current information.',
    ],
    cta: [
      { label: 'Explore the Collection', href: '/shop' },
      { label: 'Ask About Retail Availability', href: '/contact?topic=retail' },
    ],
    sections: [
      {
        t: 'text',
        title: 'For retail and event enquiries',
        body: [
          'If you would like to discuss introducing RejuveLuxe in your space or at an event, tell us about your business and what you have in mind.',
        ],
        cta: [{ label: 'Start a Conversation', href: '/contact' }],
      },
    ],
  },

  {
    slug: 'track-order',
    seoTitle: 'Track Your Order | RejuveLuxe',
    description: 'Get help checking the status of a RejuveLuxe order.',
    noindex: true,
    eyebrow: 'Track an Order',
    title: 'Follow your order.',
    // The handover's support fallback: there is no tracking integration yet,
    // so this page routes to customer care rather than showing an inert form.
    lead: [
      `Send your order number and checkout email to ${CONTACT.email}, and we will help you check its status.`,
    ],
    cta: [
      { label: 'Email Customer Care', href: `mailto:${CONTACT.email}` },
      { label: 'Contact Us', href: '/contact' },
    ],
    sections: [
      {
        t: 'text',
        title: 'Tracking details',
        body: [
          'Tracking will appear once the order has been dispatched and a tracking reference is available.',
        ],
      },
    ],
  },
];
