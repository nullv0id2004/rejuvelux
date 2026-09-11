import type { Metadata } from 'next';
import { SectionHead } from '@/components/site/primitives';
import { ShopGrid } from '@/components/pages/ShopGrid';
import { listProducts } from '@/lib/catalogue';
import { rangeWordCap } from '@/lib/data';

/**
 * The shop index. New in Phase 1 (`docs/roadmap.md` §5.1 step 7) — the site had
 * `/shop/[slug]` pages with nothing above them, so the nav's "Shop" pointed at
 * an anchor on the homepage.
 */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const products = await listProducts();
  return {
    title: 'Shop',
    description: `${rangeWordCap(products.length)} expressions of one Assam garden. Grade, lot and pluck month on every tin.`,
  };
}

export default async function ShopPage() {
  const products = await listProducts();
  const cap = rangeWordCap(products.length);

  return (
    <main>
      <section className="wrap sec">
        <SectionHead
          eyebrow="The collection"
          title={`${cap} expressions. One garden.`}
          aside="Arranged from ceremonial to everyday. Each carries its grade, lot and pluck month."
        />
        <ShopGrid products={products} />
      </section>
    </main>
  );
}
