import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductView } from '@/components/product/ProductView';
import { PRODUCTS, byId } from '@/lib/data';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = byId(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} — ${p.descriptor}. ${p.tagline} Single-origin Assam, ${p.weight}.`,
    openGraph: {
      title: `${p.name} · RejuveLuxe`,
      description: p.tagline,
      ...(p.image ? { images: [{ url: p.image }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = byId(slug);
  if (!p) notFound();
  return <ProductView p={p} />;
}
