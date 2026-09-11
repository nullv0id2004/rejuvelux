import { COMMERCE_PAGES } from './pages-commerce';
import { STORY_PAGES } from './pages-story';
import { SUPPORT_PAGES } from './pages-support';
import type { ContentPage } from './types';

const ALL: ContentPage[] = [...STORY_PAGES, ...COMMERCE_PAGES, ...SUPPORT_PAGES];

/** A content page by slug. Throws at build time for a slug with no entry, so a typo cannot ship. */
export function page(slug: string): ContentPage {
  const found = ALL.find((p) => p.slug === slug);
  if (!found) throw new Error(`No content page registered for "${slug}"`);
  return found;
}

/** Collection routes served by /collections/[slug]. */
export const COLLECTION_SLUGS = ['assam-collection', 'gift-sets', 'teaware'] as const;
