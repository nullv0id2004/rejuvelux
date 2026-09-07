'use client';

/**
 * The shop index grid. A client component because `Tile` adds to the cart, and
 * the cart is client state until Phase 2 moves it to the server.
 *
 * Products are passed in rather than read from `useCatalogue()` so the page
 * controls the ordering it renders — the index shows the database's own
 * `sort_order`, but a future filtered view would pass a subset.
 */

import { Tile } from '@/components/site/interactive';
import type { CatalogueProduct } from '@/lib/catalogue';

export function ShopGrid({ products }: { products: CatalogueProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="body" style={{ paddingTop: 24 }}>
        Nothing is on sale at the moment.
      </p>
    );
  }
  return (
    <div className="grid cols-3">
      {products.map((p) => (
        <Tile key={p.slug} p={p} />
      ))}
    </div>
  );
}
