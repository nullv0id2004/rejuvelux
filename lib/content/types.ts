/**
 * Shapes for the editorial pages transcribed from the RejuveLuxe website content
 * handover. Every block maps to something `ContentView` already renders, so a
 * page is data, not a component.
 *
 * Copy may carry `[SLOT]` fields for business facts not yet approved. They
 * render as visible placeholders through `withSlots`, the site-wide convention.
 */

export type Cta = { label: string; href: string };

export type Photo = {
  src: string;
  alt: string;
  caption?: string;
  /** CSS aspect ratio of the frame, e.g. '4 / 3'. Defaults to square. */
  ratio?: string;
};

export type Card = {
  eyebrow?: string;
  title: string;
  body: string;
  cta?: Cta;
  image?: Photo;
};

export type Section =
  | { t: 'text'; eyebrow?: string; title?: string; body: string[]; cta?: Cta[] }
  | { t: 'cards'; eyebrow?: string; title?: string; intro?: string; cards: Card[]; cta?: Cta[] }
  | { t: 'table'; title?: string; intro?: string; head: string[]; rows: string[][]; cta?: Cta[] }
  | { t: 'steps'; title?: string; intro?: string; items: string[]; ordered?: boolean; cta?: Cta[] }
  | { t: 'faq'; title: string; items: [string, string][]; cta?: Cta[] }
  | { t: 'details'; title?: string; rows: [string, string][] }
  | { t: 'band'; eyebrow?: string; title: string; body: string[]; cta?: Cta[] }
  | { t: 'form'; form: 'contact' | 'gifting'; title: string; intro?: string }
  | { t: 'contact'; title: string }
  | { t: 'gallery'; title?: string; images: Photo[] }
  | { t: 'products'; title?: string; intro?: string; slugs: string[]; cta?: Cta[] };

export type ContentPage = {
  /** Route segment. Unique within its registry. */
  slug: string;
  /** Full document title, used as-is rather than through the layout template. */
  seoTitle: string;
  description: string;
  eyebrow?: string;
  title: string;
  lead?: string[];
  cta?: Cta[];
  sections: Section[];
  noindex?: boolean;
  /**
   * Image beside the heading. A tin render sits on its tin colour; a photograph
   * (`photo`) fills its frame.
   */
  image?: { src: string; alt: string; tin?: string; photo?: boolean; ratio?: string };
};
