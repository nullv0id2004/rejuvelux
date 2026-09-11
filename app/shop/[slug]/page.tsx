import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductView } from '@/components/product/ProductView';
import { ContentView, contentMetadata } from '@/components/site/ContentView';
import { getProduct, listProducts } from '@/lib/catalogue';
import { ENQUIRY } from '@/lib/content/enquiry';

type Params = { params: Promise<{ slug: string }> };

/**
 * Slugs come from the database, which Phase 1 made the source of truth
 * (`docs/roadmap.md` §5.1), plus the enquiry-only items from the content
 * handover that have no database row. A database row always wins, so an item
 * that later gains a row, a price and stock becomes a real product page.
 */
export async function generateStaticParams() {
  const products = await listProducts();
  const inDb = new Set(products.map((p) => p.slug));
  return [
    ...products.map((p) => ({ slug: p.slug })),
    ...ENQUIRY.filter((e) => !inDb.has(e.slug)).map((e) => ({ slug: e.slug })),
  ];
}

export const dynamicParams = false;

/**
 * ADR-0009 puts the database in Sydney and the application in Mumbai, so every
 * query crosses the Indian Ocean. These pages are prerendered and revalidated,
 * so a client price edit appears within the hour without a deploy.
 */
export const revalidate = 3600;

const enquiry = (slug: string) => ENQUIRY.find((e) => e.slug === slug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) {
    const e = enquiry(slug);
    return e ? contentMetadata(e) : {};
  }
  const summary = p.tagline ?? p.description;
  return {
    title: p.name,
    description: `${p.name}. ${summary} ${p.netQuantity}.`,
    openGraph: {
      title: `${p.name} · RejuveLuxe`,
      description: summary,
      ...(p.image ? { images: [{ url: p.image }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (p) return <ProductView p={p} />;
  const e = enquiry(slug);
  if (e) return <ContentView page={e} />;
  notFound();
}
