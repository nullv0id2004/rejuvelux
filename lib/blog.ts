import { SLOT } from './data';

/**
 * A block of post body. Kept deliberately small — the posts are editorial, not
 * a CMS, and every block maps to something the stylesheet already renders.
 */
export type Block =
  | { t: 'p'; v: string }
  | { t: 'h'; v: string }
  | { t: 'quote'; v: string; who?: string }
  | { t: 'list'; v: string[] }
  | { t: 'evidence'; rows: [string, string][] }
  | { t: 'image'; label: string; caption?: string };

export type Post = {
  /** URL slug. */
  id: string;
  title: string;
  /** Standfirst under the headline. */
  dek: string;
  /** Section label — the eyebrow above the headline and the card's tag. */
  category: 'Brewing' | 'The Garden' | 'Craft' | 'Provenance';
  /** ISO date. Sorting key and `<time datetime>`. */
  date: string;
  /** Rounded reading time, minutes. */
  minutes: number;
  author: string;
  /** Label for the hero stand-in until the real photograph lands. */
  hero: string;
  /** Product ids this post is about, for the cross-link row at the foot. */
  products: string[];
  body: Block[];
};

export const POSTS: Post[] = [
  {
    id: 'what-single-origin-means',
    title: 'What single-origin actually means on a tin',
    dek: 'The phrase is on half the tea in the country and it is doing almost no work. Here is the version we hold ourselves to, and the three numbers that prove it.',
    category: 'Provenance',
    date: '2026-08-14',
    minutes: 6,
    author: 'RejuveLuxe',
    hero: 'Sorting table · sacks marked by lot',
    products: ['golden', 'silver'],
    body: [
      {
        t: 'p',
        v: 'Single-origin is not a regulated term. A packer can blend forty gardens across two states, print "single-origin Assam" on the front, and break no rule. The word origin is doing the lying: Assam is a region the size of Ireland, and a region is not an origin.',
      },
      {
        t: 'p',
        v: 'We mean something narrower and duller. One garden. One flush. One lot. If any of those three change, it is a different tin with a different number on it, and we do not merge the two to keep a line in stock.',
      },
      { t: 'h', v: 'The three numbers' },
      {
        t: 'p',
        v: 'Every tin carries an estate name, a pluck month and a lot number. Together they answer the only question that matters — which specific leaf is this, and when did it come off the bush.',
      },
      {
        t: 'evidence',
        rows: [
          ['Estate', SLOT.estate],
          ['District', SLOT.district],
          ['Elevation', SLOT.elevation],
          ['Lot', SLOT.lot],
          ['Plucked', SLOT.pluck],
        ],
      },
      {
        t: 'p',
        v: 'Estate is the garden. District and elevation say where in Assam it sits, because a low riverine garden and a hill garden thirty kilometres apart make measurably different tea. The lot number ties the tin to a pluck month and a processing run.',
      },
      { t: 'h', v: 'What it costs to work this way' },
      {
        t: 'p',
        v: 'Blending exists because it solves real problems. It smooths a bad season, holds a house flavour steady year to year, and lets a brand promise the same cup in March and October. Refusing it means our tea changes. A second flush is not a first flush, and the tin will tell you which one you have.',
      },
      {
        t: 'p',
        v: 'It also means we run out. When a lot is finished it is finished, and the next one tastes like itself rather than like the last one. We would rather publish that than quietly blend across it.',
      },
      {
        t: 'quote',
        v: 'If the tin cannot tell you which garden and which month, the word origin on the front is decoration.',
      },
      { t: 'h', v: 'How to check anyone else' },
      {
        t: 'list',
        v: [
          'Look for a garden name, not a region. "Assam" is a region. "Darjeeling" is a region.',
          'Look for a pluck month or a harvest year. Tea without a date is tea of unknown age.',
          'Look for a lot number that changes between tins. One number on every tin, forever, is a brand code, not a lot.',
          'Ask what happens when they run out. The answer tells you whether they blend.',
        ],
      },
      {
        t: 'p',
        v: 'None of this makes tea taste better on its own. It makes it knowable, which is the part you cannot get back once it is lost in a blending silo.',
      },
    ],
  },

  {
    id: 'brewing-silver-needle',
    title: 'Silver Needle asks for cooler water than you think',
    dek: 'Buds are not leaves. Boiling water strips a white tea in seconds and leaves you with hot water that smells faintly of hay. The fix is a thermometer and some patience.',
    category: 'Brewing',
    date: '2026-07-29',
    minutes: 5,
    author: 'RejuveLuxe',
    hero: 'Silver Needle · dry buds in a warmed vessel',
    products: ['silver'],
    body: [
      {
        t: 'p',
        v: 'Silver Needle is made of unopened buds, withered and dried, with almost no oxidation. There is very little structure in it to survive rough treatment. Pour boiling water over it and the delicate volatile aromatics — the melon, the cut grass, the faint honey — are gone before the cup reaches the table.',
      },
      { t: 'h', v: 'The parameters we publish' },
      {
        t: 'p',
        v: 'These are the starting values on every tin. They are a floor, not a rule: adjust upward once you know what the tea does.',
      },
      {
        t: 'evidence',
        rows: [
          ['Leaf', '4 g'],
          ['Water', '200 ml'],
          ['Temperature', '80 °C'],
          ['First steep', '3 minutes'],
          ['Steeps', 'Three, extending each time'],
        ],
      },
      { t: 'h', v: 'Getting to 80 °C without a thermometer' },
      {
        t: 'p',
        v: 'Boil the kettle, then leave it uncovered for four to five minutes in a room-temperature kitchen. That lands most kettles between 78 and 83 °C. Alternatively pour boiling water into a second room-temperature vessel and then into the pot — each transfer costs roughly five degrees.',
      },
      {
        t: 'p',
        v: 'Warm the brewing vessel first regardless. A cold pot pulls eight to ten degrees out of the water immediately, which is the difference between an underextracted cup and a correct one.',
      },
      { t: 'h', v: 'Steeping long, not hot' },
      {
        t: 'p',
        v: 'The instinct when a cup tastes thin is to raise the temperature. With white tea, extend the time instead. Three minutes at 80 °C gives a fuller and sweeter cup than ninety seconds at 95 °C, and it does not scorch the top notes to get there.',
      },
      {
        t: 'quote',
        v: 'Heat extracts fast and indiscriminately. Time extracts slowly and in order. With buds, you want the second one.',
      },
      {
        t: 'p',
        v: 'Take it to three steeps. Add a minute each time. The second is usually the best of the three — the buds have opened, and the cup is at its sweetest before the tannin arrives.',
      },
      { t: 'h', v: 'What goes wrong' },
      {
        t: 'list',
        v: [
          'Water too hot: flat, hay-like, faintly bitter. Drop ten degrees.',
          'Steep too short: watery, no body. Add a minute before touching the temperature.',
          'Too little leaf: thin regardless of time. Four grams to 200 ml is not generous, it is correct.',
          'Cold pot: everything above, at once. Warm the vessel.',
        ],
      },
    ],
  },

  {
    id: 'matcha-is-not-green-tea',
    title: 'Matcha is not green tea with the volume turned up',
    dek: 'They start as the same plant and diverge almost immediately. One is an infusion. The other is the leaf itself, and that single fact explains the shade cloth, the price and the caffeine.',
    category: 'Craft',
    date: '2026-07-11',
    minutes: 7,
    author: 'RejuveLuxe',
    hero: 'Shade canopy over the matcha rows',
    products: ['matcha', 'green'],
    body: [
      {
        t: 'p',
        v: 'Both come from Camellia sinensis. Both are steamed early to stop oxidation, which is why both stay green. After that they are different products with different agriculture, different machinery and different chemistry in the cup.',
      },
      { t: 'h', v: 'Shade is the first divergence' },
      {
        t: 'p',
        v: 'Matcha rows spend their final weeks before plucking under heavy canopy. Starved of direct light, the plant overproduces chlorophyll — hence the colour — and holds on to L-theanine instead of converting it to catechins. The leaf gets sweeter, greener and more savoury. It also yields less, which is most of the price difference.',
      },
      { t: 'image', label: 'Shade canopy · underside', caption: 'The last weeks before pluck, under cloth.' },
      { t: 'h', v: 'Then the leaf is taken apart' },
      {
        t: 'p',
        v: 'Green tea is steamed, rolled and dried, and you infuse it. Matcha is steamed, dried flat, deveined and destemmed, and only the leaf flesh is kept. That is tencha. Stone mills then reduce tencha to a powder fine enough to stay suspended in water — slowly, because heat from fast milling would cook the flavour out.',
      },
      {
        t: 'quote',
        v: 'With green tea you drink what the water pulled out of the leaf. With matcha you drink the leaf.',
      },
      { t: 'h', v: 'Why that changes the caffeine' },
      {
        t: 'p',
        v: 'Consuming the whole leaf means consuming everything in it, not the fraction that dissolves in three minutes. More caffeine, but also far more L-theanine, which moderates how the caffeine arrives. Most people describe the effect as steadier and longer than coffee, without the same edge.',
      },
      {
        t: 'evidence',
        rows: [
          ['Green tea', 'Infused. Leaf discarded.'],
          ['Matcha', 'Suspended. Leaf consumed.'],
          ['Shade before pluck', 'Matcha only'],
          ['Preparation', 'Steep vs whisk'],
        ],
      },
      { t: 'h', v: 'Practical consequences' },
      {
        t: 'list',
        v: [
          'Matcha does not steep. Whisk it, in a zigzag, until the surface holds a fine foam.',
          'Water at 80 °C or below. Boiling water makes matcha bitter and clumps it.',
          'Sift before whisking. The powder cakes in the tin and lumps will not break up in the bowl.',
          'Refrigerate matcha once opened, sealed. Do not refrigerate leaf tea — it takes on moisture and smells.',
          'Drink it the day you whisk it. Suspension is not solution; it settles and oxidises.',
        ],
      },
      {
        t: 'p',
        v: 'If you have only ever had matcha in a sweetened latte, the whisked bowl is a different drink. Vividly grassy, thick, faintly sweet, with a savoury finish that the sugar in a latte is usually there to hide.',
      },
    ],
  },

  {
    id: 'reading-a-flush',
    title: 'First flush, second flush, and why the same garden tastes different in June',
    dek: 'Assam gets two harvests that matter and a long tail that mostly does not. The differences between them are larger than the differences between many gardens.',
    category: 'The Garden',
    date: '2026-06-20',
    minutes: 6,
    author: 'RejuveLuxe',
    hero: 'Second flush · new growth on the bush',
    products: ['golden', 'ctc'],
    body: [
      {
        t: 'p',
        v: 'A flush is a growth period — the bush pushing out new shoots after a dormancy or a rain. Assam runs on a monsoon calendar, and what the bush does in March is not what it does in June.',
      },
      { t: 'h', v: 'First flush' },
      {
        t: 'p',
        v: 'The first growth after winter dormancy, roughly late February into April. Bright, brisk, comparatively light in the cup, with more aroma than body. It is the flush that most rewards careful brewing and punishes boiling water and long steeps.',
      },
      { t: 'h', v: 'Second flush' },
      {
        t: 'p',
        v: 'May into June, and the reason Assam is famous. The plant has had warmth and water, and the leaf develops the malty, deep, faintly sweet character that people mean when they say Assam. More golden tips, more body, and far more forgiving in a mug with milk.',
      },
      {
        t: 'quote',
        v: 'The same bushes, the same soil, the same hands. Eight weeks apart, and a cup you would not identify as related.',
      },
      { t: 'h', v: 'The rains, and after' },
      {
        t: 'p',
        v: 'Monsoon flush arrives in volume and thins in character. It is the backbone of commodity CTC and it does a job — strong, fast, holds up to milk and sugar — but it is not what you buy for a lot number. The autumn flush that follows is lighter again and can be lovely, though the volumes are small.',
      },
      {
        t: 'evidence',
        rows: [
          ['First flush', 'Late Feb – April · bright, aromatic'],
          ['Second flush', 'May – June · malty, full, tippy'],
          ['Monsoon', 'July – Sept · volume, strength, less character'],
          ['Autumn', 'Oct – Nov · light, small volumes'],
          ['Current lot', SLOT.flush],
        ],
      },
      { t: 'h', v: 'What to do with this' },
      {
        t: 'p',
        v: 'Check the flush before you argue with the tea. A first flush brewed like a second flush tastes thin and sharp and it is not the garden\'s fault. Drop the temperature, shorten the steep, and drink it without milk.',
      },
      {
        t: 'p',
        v: 'And when a tin you liked runs out and the next one tastes different, look at the pluck month before you assume the quality slipped. Usually the season moved.',
      },
    ],
  },

  {
    id: 'storing-tea-properly',
    title: 'Five things that ruin tea in your kitchen',
    dek: 'Tea does not spoil so much as fade, and it fades fastest in exactly the places people keep it. Light, heat, air, damp and smell — in roughly that order.',
    category: 'Brewing',
    date: '2026-05-30',
    minutes: 4,
    author: 'RejuveLuxe',
    hero: 'Lined steel tin · lid off, on a work surface',
    products: ['green', 'ube'],
    body: [
      {
        t: 'p',
        v: 'A sealed tin in a dark cupboard will hold a tea in good condition for a year and acceptable condition for longer. The same tea in a glass jar on a sunny shelf above the hob is noticeably duller in six weeks. Nothing has gone off. The aromatics have simply left.',
      },
      { t: 'h', v: 'Light' },
      {
        t: 'p',
        v: 'Direct sun degrades the compounds that make green and white teas taste green and white. Clear glass storage looks excellent and works badly. If you want the jar on the counter, decant a week at a time and keep the rest in the tin.',
      },
      { t: 'h', v: 'Heat' },
      {
        t: 'p',
        v: 'The cupboard above the kettle or the hob is the worst place in most kitchens — warm, and periodically humid. Every degree accelerates the reactions that flatten a tea. Pick a cupboard away from the cooking.',
      },
      { t: 'h', v: 'Air' },
      {
        t: 'p',
        v: 'Oxidation continues slowly in the tin. A half-empty container is mostly air, so as a tea gets low it fades faster. Press the lid properly, and finish an opened tin within a few months rather than keeping six open at once.',
      },
      { t: 'h', v: 'Damp' },
      {
        t: 'p',
        v: 'Dry leaf is hygroscopic and will pull moisture out of a humid room. Never use a wet spoon in a tin. Never store tea in the fridge unless it is matcha — condensation forms every time it comes out.',
      },
      { t: 'h', v: 'Smell' },
      {
        t: 'p',
        v: 'This one surprises people. Tea takes on the smell of whatever is next to it, and it does so through packaging that seems sealed. Coffee, spices, and anything with a strong aroma will transfer within weeks. Give the tea its own shelf.',
      },
      {
        t: 'evidence',
        rows: [
          ['Keep in', 'A sealed, lined, opaque tin'],
          ['Keep away from', 'Sun, hob, kettle, spice rack'],
          ['Refrigerate', 'Matcha only, sealed'],
          ['Do not refrigerate', 'All leaf tea'],
          ['Best within', 'A year of the pluck month on the tin'],
        ],
      },
      {
        t: 'quote',
        v: 'Old tea is rarely undrinkable. It is just quieter than it was, and it got that way in a cupboard you chose.',
      },
    ],
  },
];

/** Newest first — the order the index and the related row both use. */
export const POSTS_BY_DATE = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

export const postById = (id: string) => POSTS.find((p) => p.id === id);

/** Up to `n` other posts, preferring the same category, newest first. */
export function relatedPosts(id: string, n = 2) {
  const post = postById(id);
  if (!post) return [];
  const others = POSTS_BY_DATE.filter((p) => p.id !== id);
  const sameCategory = others.filter((p) => p.category === post.category);
  return [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(0, n);
}

/** "14 August 2026" — one formatter, so index and post page never disagree. */
export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
