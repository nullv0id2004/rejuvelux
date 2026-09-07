import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductView } from '@/components/product/ProductView';
import { getProduct, listProducts } from '@/lib/catalogue';

type Params = { params: Promise<{ slug: string }> };

/**
 * Slugs come from the database, which Phase 1 made the source of truth
 * (`docs/roadmap.md` §5.1). Products not in the database — `ctc` (R-52) and
 * `ube` (undocumented) — have no row, so no page is generated and
 * `dynamicParams: false` turns a request for one into a 404.
 */
export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

/**
 * ADR-0009 puts the database in Sydney and the application in Mumbai, so every
 * query crosses the Indian Ocean. `architecture.md` §4's answer for the read
 * path is to cache rendered output rather than query per request: these pages
 * are prerendered and revalidated, so a client price edit appears within the
 * hour without a deploy, and no visitor pays the round trip.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const summary = [p.descriptor, p.tagline].filter(Boolean).join('. ');
  return {
    title: p.name,
    description: `${p.name}${summary ? ` — ${summary}` : ''} Single-origin Assam, ${p.netQuantity}.`,
    openGraph: {
      title: `${p.name} · RejuveLuxe`,
      description: p.tagline ?? p.description,
      ...(p.image ? { images: [{ url: p.image }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  return <ProductView p={p} />;
}
