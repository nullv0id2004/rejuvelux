import type { Cta } from './types';

/**
 * The RejuveLuxe Journal: content handover P33 to P39. The first two articles
 * adapt the supplied brand blogs; the other four were written for the brand.
 *
 * No publication dates, author credentials or view counts: the handover says
 * to publish real dates on release and invent none. Reading time is derived
 * from the text itself.
 */

export type Block =
  | { t: 'p'; v: string }
  | { t: 'h'; v: string }
  | { t: 'quote'; v: string; who?: string }
  | { t: 'list'; v: string[] }
  | { t: 'evidence'; rows: [string, string][] }
  | { t: 'image'; label: string; caption?: string };

export type Category = 'Origin' | 'Craft' | 'Ritual' | 'Taste' | 'Knowledge' | 'Achievement';

export type Post = {
  /** URL slug. */
  id: string;
  title: string;
  seoTitle: string;
  description: string;
  /** Standfirst on the index card. */
  dek: string;
  category: Category;
  author: string;
  /** Label for the hero stand-in until the real photograph lands. */
  hero: string;
  /** Catalogue slugs this article discusses, for the tea links at its foot. */
  products: string[];
  cta: Cta[];
  body: Block[];
};

const p = (v: string): Block => ({ t: 'p', v });
const h = (v: string): Block => ({ t: 'h', v });

export const POSTS: Post[] = [
  {
    id: 'the-journey-in-every-leaf',
    title: 'The Journey in Every Leaf',
    seoTitle: 'The Journey in Every Leaf | RejuveLuxe Journal',
    description:
      'Follow RejuveLuxe’s journey from the search for exceptional Indian tea to the choices that make each cup worth taking time for.',
    dek: 'How a search for exceptional tea became a story of selection, care and personal ritual.',
    category: 'Origin',
    author: 'RejuveLuxe',
    hero: 'Loose leaf and buds on a quiet table',
    products: ['silver-needle-assam', 'assam-golden-tips', 'assam-matcha'],
    cta: [{ label: 'Explore the Assam Collection', href: '/collections/assam-collection' }],
    body: [
      p('What began as a discovery became a devotion. RejuveLuxe started with a question: how could some of India’s most exceptional teas be admired across the world, yet feel so difficult to discover at home?'),
      p('The quality was already there. So were the knowledge, the gardens and the people who understood the leaf. Our search was for a way to bring those qualities together with the care and presentation they deserved.'),
      h('Closer to the source'),
      p('We searched, tasted and compared. We rejected teas and continued looking. The purpose was not simply to fill a collection. It was to find character: something distinctive in the tea before the first sip, and something worth returning to after it.'),
      p('A chosen bud. A leaf at the right stage. A process carried out with enough restraint to preserve delicacy, or enough precision to develop depth. These choices take place long before a tin is opened, but their effect belongs to the cup.'),
      h('Different teas take different paths'),
      p('Silver Needle Assam centres on young buds and gentle handling. Its appeal is delicate, asking for attention rather than demanding it. Assam Golden Tips takes another path. The work of black-tea processing develops a richer character through controlled change.'),
      p('Assam Matcha offers a different preparation again. Finely milled green tea is whisked into water, making the powder part of the drink. The preparation becomes visible: measuring, sifting, adding water and moving the whisk.'),
      p('Three teas. Three distinct journeys. What connects them is the belief that exceptional tea deserves considered care.'),
      h('The person holding the cup'),
      p('The journey does not end with the leaf. It continues with the person who chooses to make time for it. Perhaps the day began early. Perhaps it has been shaped by decisions, deadlines or work that no one else will notice.'),
      p('A tea ritual does not erase that effort. It gives it a pause. A quiet table, water at the right temperature and a few minutes to notice an aroma can make an ordinary part of the day feel more deliberate.'),
      h('Earned, Not Indulged'),
      p('For RejuveLuxe, luxury is found in discernment: what was selected, what was protected and what was worth waiting for. It need not announce itself loudly. It can be as simple as something made well, chosen carefully and enjoyed without hurry.'),
      p('That is the journey we hope you find in every leaf, and the moment we hope you make in every cup.'),
    ],
  },

  {
    id: 'what-makes-a-tea-exceptional',
    title: 'What Makes a Tea Exceptional?',
    seoTitle: 'What Makes a Tea Exceptional | RejuveLuxe Journal',
    description:
      'Explore how leaf selection, timing, processing and tasting shape an exceptional tea, through three distinct RejuveLuxe expressions.',
    dek: 'The small decisions that shape the finished cup.',
    category: 'Craft',
    author: 'RejuveLuxe',
    hero: 'Three teas side by side: powder, buds and black leaf',
    products: ['silver-needle-assam', 'assam-golden-tips', 'assam-matcha'],
    cta: [{ label: 'Choose Your Tea', href: '/choose-your-tea' }],
    body: [
      p('Some cups pass almost unnoticed. Others invite you to pay attention: to the aroma before the sip, the colour in the cup or the way the flavour changes as you return to it. That difference rarely comes from one thing.'),
      p('Exceptional tea is shaped by a series of decisions, beginning well before the water is poured.'),
      h('The first choice is the leaf'),
      p('Different teas ask for different beginnings. Silver Needle centres on tender buds. Golden Tips is distinguished by selected tips and the character developed through black-tea craft. Matcha takes green tea into a finely milled form.'),
      p('Selection is not the act of treating every leaf alike. It is the judgment to understand what belongs in a particular tea, and what should be left for another purpose.'),
      h('Craft must respect the tea'),
      p('Processing is not a competition to do more. It is a question of what the tea needs. A delicate bud tea calls for careful handling. Black tea depends on transformation through withering, rolling, oxidation and drying. Matcha becomes a powder prepared through sifting and whisking at home.'),
      p('These are different paths to different experiences. Their value is not that one is universally better, but that each can express its character clearly.'),
      h('Selection continues after processing'),
      p('A finished tea still asks to be evaluated. Appearance, aroma, flavour and the colour of the liquor offer ways to understand it. Consistency matters too: the experience should make sense in the context of the tea you have chosen.'),
      p('For RejuveLuxe, the willingness to compare and keep searching belongs to that standard. A collection gains meaning through the choices behind it, not simply through the number of products it contains.'),
      h('Give the cup a fair beginning'),
      p('Even a carefully chosen tea needs suitable preparation. Use the guidance for the product, measure thoughtfully and strain an infusion when it is ready. If the first cup is not quite your preference, change one part of the preparation at a time.'),
      p('This gives you a way to learn the tea, rather than judging it by a hurried first attempt.'),
      h('The final test is personal'),
      p('The story behind the leaf matters, but the cup must also offer something you enjoy. Notice the aroma, take a sip and let the tea have a little time. You may prefer delicacy, depth or a more involved preparation.'),
      p('An exceptional tea gives you a reason to notice. The ritual gives you the opportunity.'),
    ],
  },

  {
    id: 'matcha-and-green-tea',
    title: 'Matcha and Green Tea: Two Ways to Make the Cup',
    seoTitle: 'Matcha and Green Tea | Two Preparation Styles | RejuveLuxe',
    description:
      'Compare the experience of whisked Matcha and brewed green tea, from preparation tools to the way each tea becomes part of the cup.',
    dek: 'Understand the difference between a whisked powder and an infused leaf.',
    category: 'Knowledge',
    author: 'RejuveLuxe',
    hero: 'A whisked bowl of Matcha beside a brewed cup of green tea',
    products: ['assam-matcha', 'green-tea'],
    cta: [
      { label: 'Explore Assam Matcha', href: '/shop/assam-matcha' },
      { label: 'Explore Green Tea', href: '/shop/green-tea' },
    ],
    body: [
      p('Choosing between Matcha and loose-leaf green tea begins with the experience you want to make. Both belong to the green-tea conversation, but the way they reach the cup is different.'),
      h('An infusion and a whisked drink'),
      p('With loose-leaf green tea, the leaves spend time in water and are removed when the infusion is ready. With Matcha, finely milled tea is whisked into water and remains in the drink. That difference shapes the preparation and the texture you notice.'),
      p('It also changes the tools. An infuser and timer are useful for leaf tea. For Matcha, a strainer, bowl and whisk make the process easier to follow.'),
      h('The preparation you enjoy matters'),
      p('If you like the simplicity of measuring leaves, steeping and straining, brewed Green Tea offers a familiar rhythm. If you enjoy a more hands-on process, Matcha gives you the sequence of sifting, adding water and whisking.'),
      p('Neither ritual needs to be elaborate. Start with the product’s instructions and let repetition make the preparation more comfortable.'),
      h('Water or milk'),
      p('Matcha can be enjoyed with water or prepared as a latte. For the latter, mix it with water first before adding milk. An iced version adds another variation: prepared Matcha, cold milk and ice, stirred together before drinking.'),
      p('Loose-leaf green tea offers its own scope for preference. Try the infusion as it is before deciding whether to add anything. Learning the tea’s character first makes your choices more deliberate.'),
      h('Choose through curiosity'),
      p('There is no need to turn the comparison into a claim that one tea is the healthiest or the best. Think about flavour, texture, tools and the time you want to give the cup. Those are useful reasons to choose, and useful reasons to explore both.'),
    ],
  },

  {
    id: 'a-tea-gift-chosen-well',
    title: 'A Tea Gift Chosen Well',
    seoTitle: 'How to Choose a Thoughtful Tea Gift | RejuveLuxe',
    description:
      'Choose a tea gift around the recipient’s taste, preparation habits and occasion, with thoughtful guidance from RejuveLuxe.',
    dek: 'A practical way to choose for someone else’s taste and occasion.',
    category: 'Achievement',
    author: 'RejuveLuxe',
    hero: 'A wrapped tea gift on a table',
    products: ['assam-golden-tips', 'silver-needle-assam', 'matcha-ritual-set'],
    cta: [
      { label: 'Explore Tea Gifts', href: '/collections/gift-sets' },
      { label: 'Discuss Corporate Gifting', href: '/corporate-gifting' },
    ],
    body: [
      p('A good gift begins with attention. Before choosing the box, think about the person who will open it. What do they enjoy? Do they return to a familiar favourite or like discovering something new? Would they enjoy making the drink as much as drinking it?'),
      p('These questions often lead to a better choice than starting with the largest selection or the most elaborate presentation.'),
      h('Begin with their taste'),
      p('For someone who enjoys a fuller black tea, Assam Golden Tips is a fitting expression to explore. For a person drawn to lighter, subtler cups, consider Silver Needle Assam. A Matcha enthusiast may appreciate tea that supports an existing ritual, while a curious beginner may enjoy learning a new preparation.'),
      p('If you are unsure, a selection can offer a gentle introduction to different characters. Check the actual contents and preparation requirements so the gift is easy to enjoy.'),
      h('Consider the tools'),
      p('Loose-leaf tea is more welcoming when the recipient has a way to brew it. A Matcha gift benefits from an understanding of sifting and whisking. If tools are included in a set, check which pieces are supplied rather than assuming the photograph tells the whole story.'),
      p('The practical details are part of thoughtfulness. They help the recipient begin without having to solve the gift first.'),
      h('Let the occasion guide the message'),
      p('A thank-you can be simple. A milestone may call for a more personal note. A corporate gift should feel appropriate to the relationship, with enough consideration that it is more than an item carrying a logo.'),
      p('The same tea can take on a different meaning through the care with which it is chosen and given.'),
      h('Plan before the date'),
      p('For multiple recipients, confirm quantities, addresses, presentation options and delivery arrangements before ordering. Keep the message clear and the gift coherent. A smaller, well-considered selection often communicates more than a box crowded with unrelated items.'),
      p('A tea gift becomes meaningful when the person receiving it can imagine a moment of their own. That is a good place to begin.'),
    ],
  },

  {
    id: 'making-time-for-tea',
    title: 'Making Time for Tea',
    seoTitle: 'Making Time for Tea | Earned, Not Indulged | RejuveLuxe',
    description:
      'A RejuveLuxe reflection on giving a familiar cup more attention, through a simple ritual of preparation, tasting and an unhurried pause.',
    dek: 'Give a familiar part of your day a little more attention.',
    category: 'Ritual',
    author: 'RejuveLuxe',
    hero: 'A single cup on a quiet table',
    products: [],
    cta: [{ label: 'Find Your Tea Ritual', href: '/tea-rituals' }],
    body: [
      p('There are days when a cup is made almost without noticing. Water is poured while another task is started, and the drink is finished between messages. There is nothing unusual about that. But sometimes a familiar cup can be given a different place in the day.'),
      p('It does not require an elaborate setting. It begins with a small decision to pay attention.'),
      h('Start with one cup'),
      p('Choose the tea you want to drink rather than reaching automatically. Read its preparation guidance. Measure it, notice the temperature and give the water time to work. A few deliberate actions can change the way the moment feels.'),
      p('With Matcha, the movement of the whisk becomes part of the rhythm. With a leaf tea, the wait gives you time to notice colour and aroma developing.'),
      h('Let preference develop'),
      p('You do not have to describe every tasting note. Start with simpler questions. Does the cup feel light or full? Do you like the aroma? Would you prepare it more gently next time? Paying attention is enough to begin learning your preferences.'),
      p('Over time, a tea may become associated with a particular part of the day or a familiar place to sit. That is how a preparation becomes a personal ritual.'),
      h('A pause that belongs to you'),
      p('Earned, Not Indulged is RejuveLuxe’s way of recognising the effort behind the day. The cup need not be a reward for a grand occasion. It can be a small acknowledgement of work done carefully and standards kept.'),
      p('Choose something worth enjoying. Give it a little time. Let the moment be complete before moving to the next one.'),
    ],
  },

  {
    id: 'keeping-your-tea-well',
    title: 'Keeping Your Tea Well',
    seoTitle: 'Tea Storage and Handling | RejuveLuxe Journal',
    description:
      'Simple habits for storing and handling RejuveLuxe tea, with attention to moisture, sunlight, pack guidance and the consistency of your cup.',
    dek: 'Simple habits for storage, handling and a more consistent cup.',
    category: 'Knowledge',
    author: 'RejuveLuxe',
    hero: 'A closed tin away from the window',
    products: [],
    cta: [
      { label: 'Explore Tea Rituals', href: '/tea-rituals' },
      { label: 'Ask a Product Question', href: '/contact' },
    ],
    body: [
      p('The care behind a tea continues after the pack is opened. A few simple habits can help you keep preparation organized and avoid introducing moisture into the tea.'),
      h('Begin with the pack'),
      p('Read the storage instructions and the best-before information on your specific product. Different products and formats may have different requirements. Keep the pack available if you later need its batch or ingredient details.'),
      h('Close it after measuring'),
      p('Store the tea tightly closed in a cool, dry place away from direct sunlight. Use a clean, dry spoon and keep the container away from steam while preparing your cup. Measure what you need and close the pack before working with water.'),
      h('Keep the guidance product-specific'),
      p('Do not assume every tea or gift component has the same shelf life. Check the label for each product, especially where a gift contains several different items. The printed guidance belongs to that pack and its contents.'),
      h('If something seems wrong'),
      p('If the packaging arrives damaged, tea has spilled or you notice an unusual change, contact the seller with the order and product details. Photographs can help explain the concern. If you suspect moisture damage or contamination, set the product aside rather than continuing to use it while you seek guidance.'),
      p('Ordinary small powder clumps and a damaged product are not automatically the same thing. Describe what you see so the concern can be considered in context.'),
      h('Make a preparation worth repeating'),
      p('Keep your tools clean and dry, follow their care instructions and note a brewing method you enjoy. Good organization leaves more attention for the cup itself.'),
    ],
  },
];

export const postById = (id: string) => POSTS.find((post) => post.id === id);

/** Minutes to read, from the article's own words at 200 per minute. */
export function readingMinutes(post: Post): number {
  const words = post.body
    .map((b) => ('v' in b ? (Array.isArray(b.v) ? b.v.join(' ') : b.v) : ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Up to `n` other articles, preferring the same category, in journal order. */
export function relatedPosts(id: string, n = 2): Post[] {
  const post = postById(id);
  if (!post) return [];
  const others = POSTS.filter((q) => q.id !== id);
  const same = others.filter((q) => q.category === post.category);
  return [...same, ...others.filter((q) => q.category !== post.category)].slice(0, n);
}
