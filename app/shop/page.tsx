import type { Metadata } from 'next';
import { Button } from '@/components/ds';
import { ShopGrid } from '@/components/pages/ShopGrid';
import { SectionHead } from '@/components/site/primitives';
import { listProducts } from '@/lib/catalogue';

/** All Tea: content handover P03. Products and prices come from the database. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Shop Premium Tea | RejuveLuxe' },
  description:
    'Explore RejuveLuxe teas by character and preparation, from Assam Matcha and Silver Needle Assam to Assam Golden Tips and Green Tea.',
};

export default async function ShopPage() {
  const products = await listProducts();

  return (
    <main>
      <section className="wrap sec">
        <SectionHead
          eyebrow="All Tea"
          title="Tea, chosen with intention."
          aside="A distinctive cup begins with a distinctive leaf. Explore our teas through their character, the way they are prepared and the moments you would like to make for them."
        />
        <ShopGrid products={products} />
      </section>

      <section className="wrap sec rule-t">
        <div className="editorial" style={{ alignItems: 'flex-start' }}>
          <h2 className="h2">Find a character you enjoy</h2>
          <p>
            Choose Matcha for the whisked whole-leaf experience. Turn to Silver Needle for delicacy, or Golden
            Tips for a fuller black tea. If you prefer an everyday leaf-brewing ritual, explore Green Tea.
          </p>
          <Button href="/choose-your-tea">Compare the Teas</Button>
        </div>
      </section>
    </main>
  );
}
