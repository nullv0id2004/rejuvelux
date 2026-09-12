import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentView, contentMetadata } from '@/components/site/ContentView';
import { COLLECTION_SLUGS, page } from '@/lib/content/pages';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COLLECTION_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

const known = (slug: string) => (COLLECTION_SLUGS as readonly string[]).includes(slug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return known(slug) ? contentMetadata(page(slug)) : {};
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  if (!known(slug)) notFound();
  return <ContentView page={page(slug)} />;
}

/** Lists live products, so prices and stock refresh on the same hour as the shop. */
export const revalidate = 3600;
