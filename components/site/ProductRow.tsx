'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Icon } from '@/components/ds';
import type { CatalogueProduct } from '@/lib/catalogue';
import { useCart } from '@/lib/cart';
import { TinBox, withSlots } from './primitives';

/**
 * A tea in the range with no database row yet: shown so the row lists every
 * tea, but offered by enquiry because it has no price or stock to sell.
 */
export type PendingTea = {
  slug: string;
  name: string;
  teaType: string;
  netQuantity: string;
  tagline?: string;
  tin: string;
  ink: string;
  image: string | null;
  enquireHref: string;
};

/** ₹ with Indian grouping, no decimals. Mirrors formatPrice in lib/catalogue, which is server-only. */
const inr = (paise: number) => '₹' + Math.round(paise / 100).toLocaleString('en-IN');

function RowCard({ p }: { p: CatalogueProduct }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const href = `/shop/${p.slug}`;
  // Never offer more than can be bought; the cart refuses an unpriced or
  // out-of-stock product with its own message.
  const max = Math.max(1, p.availability);

  return (
    <article className="prow-card">
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <TinBox p={p} sizes="(max-width: 800px) 70vw, 280px" />
      </Link>
      <div className="prow-body">
        <span className="cap" style={{ color: 'var(--text-tertiary)' }}>
          {p.teaType}
        </span>
        <h3 className="h3">
          <Link href={href} style={{ color: 'inherit' }}>
            {p.name}
          </Link>
        </h3>
        {p.tagline && <p className="small">{withSlots(p.tagline)}</p>}

        <div className="between" style={{ alignItems: 'baseline', marginTop: 'auto', paddingTop: 8 }}>
          {p.pricePaise === null ? (
            <span className="cap" style={{ color: 'var(--text-accent)' }}>
              Price to be confirmed
            </span>
          ) : (
            <span className="price">{inr(p.pricePaise)}</span>
          )}
          <span className="cap">{p.netQuantity}</span>
        </div>

        <div className="row g2">
          <div className="qty">
            <button
              type="button"
              aria-label={`Decrease quantity of ${p.name}`}
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Icon name="minus" size={14} />
            </button>
            <span className="num" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${p.name}`}
              disabled={p.unavailable || qty >= max}
              onClick={() => setQty((q) => Math.min(max, q + 1))}
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
          <Button
            size="sm"
            style={{ flex: 1 }}
            disabled={p.unavailable}
            onClick={() => {
              add(p, qty);
              setQty(1);
            }}
          >
            {p.priceUnconfirmed ? 'Not yet on sale' : p.availability <= 0 ? 'Out of stock' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </article>
  );
}

function PendingCard({ t }: { t: PendingTea }) {
  const href = `/shop/${t.slug}`;
  return (
    <article className="prow-card">
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <TinBox p={t} sizes="(max-width: 800px) 70vw, 280px" />
      </Link>
      <div className="prow-body">
        <span className="cap" style={{ color: 'var(--text-tertiary)' }}>
          {t.teaType}
        </span>
        <h3 className="h3">
          <Link href={href} style={{ color: 'inherit' }}>
            {t.name}
          </Link>
        </h3>
        {t.tagline && <p className="small">{withSlots(t.tagline)}</p>}

        <div className="between" style={{ alignItems: 'baseline', marginTop: 'auto', paddingTop: 8 }}>
          <span className="cap" style={{ color: 'var(--text-accent)' }}>
            Price on enquiry
          </span>
          <span className="cap">{t.netQuantity}</span>
        </div>

        <Button size="sm" variant="outline" href={t.enquireHref}>
          Enquire
        </Button>
      </div>
    </article>
  );
}

/** The teas in a grid, four to a row, each with its own quantity and Add to cart. */
export function ProductRow({
  products,
  pending = [],
}: {
  products: CatalogueProduct[];
  pending?: PendingTea[];
}) {
  return (
    <div className="prow" role="list">
      {products.map((p) => (
        <div key={p.slug} className="prow-item" role="listitem">
          <RowCard p={p} />
        </div>
      ))}
      {pending.map((t) => (
        <div key={t.slug} className="prow-item" role="listitem">
          <PendingCard t={t} />
        </div>
      ))}
    </div>
  );
}
