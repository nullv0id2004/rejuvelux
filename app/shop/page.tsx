import type { Metadata } from 'next';
import { Button } from '@/components/ds';
import { ProductRow } from '@/components/site/ProductRow';
import { SectionHead } from '@/components/site/primitives';
import { listProducts } from '@/lib/catalogue';

/**
 * All Tea: content handover P03. Products, prices and stock come from the
 * database, grouped by range, each on the same outlined card with quantity
 * and Add to cart as the homepage.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Shop Premium Tea | RejuveLuxe' },
  description:
    'Explore RejuveLuxe teas by character and preparation, from Assam Matcha and Silver Needle Assam to Assam Golden Tips and Green Tea.',
};

export default async function ShopPage() {
  const products = await listProducts();
  const teas = products.filter((p) => (p.range ?? 'tea') === 'tea');
  const gifts = products.filter((p) => p.range === 'gift');
  const teaware = products.filter((p) => p.range === 'teaware');

  return (
    <main>
      <section className="wrap sec">
        <SectionHead
          eyebrow="All Tea"
          title="Tea, chosen with intention."
          aside="A distinctive cup begins with a distinctive leaf. Explore our teas through their character, the way they are prepared and the moments you would like to make for them."
        />
        {teas.length > 0 ? (
          <ProductRow products={teas} />
        ) : (
          <p className="body">Nothing is on sale at the moment.</p>
        )}
      </section>

      {gifts.length > 0 && (
        <section className="wrap sec rule-t">
          <SectionHead eyebrow="Gift Sets" title="A considered gift. A lasting ritual." />
          <ProductRow products={gifts} />
        </section>
      )}

      {teaware.length > 0 && (
        <section className="wrap sec rule-t">
          <SectionHead eyebrow="Teaware" title="The details of the ritual." />
          <ProductRow products={teaware} />
        </section>
      )}

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
