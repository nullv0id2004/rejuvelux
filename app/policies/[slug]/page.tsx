import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentView, contentMetadata } from '@/components/site/ContentView';
import { POLICIES } from '@/lib/content/policies';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES.find((p) => p.slug === slug);
  return policy ? contentMetadata(policy) : {};
}

export default async function PolicyPage({ params }: Params) {
  const { slug } = await params;
  const policy = POLICIES.find((p) => p.slug === slug);
  if (!policy) notFound();
  return <ContentView page={policy} />;
}
