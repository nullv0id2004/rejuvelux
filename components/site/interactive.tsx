'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ds';
import type { CatalogueProduct } from '@/lib/catalogue';
import { useCatalogue } from '@/lib/catalogue-context';
import { SLOT } from '@/lib/data';

/** ₹ with Indian grouping, no decimals. */
const inr = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
import { useCart } from '@/lib/cart';
import { Evidence, Scale, Swatch, TinBox, withSlots } from './primitives';

/* ------------------------------------------------------------ accordion -- */

function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    setH(open && ref.current ? ref.current.scrollHeight : 0);
  }, [open]);

  return (
    <div className="acc">
      <button className="acc-h" aria-expanded={open} onClick={onToggle}>
        <span>{q}</span>
        <span className="sym" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <div className="acc-b" style={{ height: h }}>
        <div ref={ref}>
          <p className="small">{a}</p>
        </div>
      </div>
    </div>
  );
}

/** Full-width rows, hairline bottom, plus/minus, closed by default. */
export function Accordion({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="stack" style={{ borderTop: 'var(--rule)' }}>
      {items.map(([q, a], i) => (
        <AccordionItem
          key={q}
          q={q}
          a={a}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- tile -- */

/** The only card on the site — the one object that genuinely lifts off the page. */
export function Tile({ p }: { p: CatalogueProduct }) {
  const { add } = useCart();
  const href = `/shop/${p.slug}`;

  return (
    <article className="tile" style={{ borderTopColor: p.ink, borderTopWidth: 3 }}>
      <Link href={href} aria-label={p.name} style={{ display: 'block' }}>
        <TinBox p={p} alt={`${p.name} tin`} sizes="(max-width: 800px) 90vw, 340px" />
      </Link>
      <div className="tile-body">
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h3 className="h3">
              <Link href={href} style={{ color: 'inherit' }}>
                {p.name}
              </Link>
            </h3>
            <p className="small it">{withSlots(p.descriptor)}</p>
          </div>
          <Swatch p={p} />
        </div>
        <Evidence
          rows={[
            ['Grade', SLOT.grade],
            ['Net quantity', p.netQuantity],
          ]}
        />
        <div className="between">
          {p.pricePaise === null ? (
            <span className="cap" style={{ color: 'var(--text-accent)' }}>
              Price to be confirmed
            </span>
          ) : (
            <span className="price">{inr(p.pricePaise)}</span>
          )}
          <span className="cap">{p.teaType}</span>
        </div>
        <div className="row g2" style={{ flexWrap: 'wrap' }}>
          <Button size="sm" disabled={p.unavailable} onClick={() => add(p)}>
            {p.priceUnconfirmed
              ? 'Not yet on sale'
              : p.availability <= 0
                ? 'Out of stock'
                : 'Add to cart'}
          </Button>
          <Button size="sm" variant="outline" href={href}>
            Details
          </Button>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------- ladder -- */

/**
 * The collection as a spectrum, ceremonial to everyday, along a visible axis —
 * deliberately not a 4-up grid (brief §2.3). Scrolls inside its own container
 * on narrow viewports so the page body never scrolls sideways.
 */
export function Ladder({
  active,
  onSelect,
  compact,
  linkToProduct = true,
}: {
  active?: string;
  onSelect?: (id: string) => void;
  compact?: boolean;
  linkToProduct?: boolean;
}) {
  const catalogue = useCatalogue();
  const count = catalogue.length;
  return (
    <div className="ladder">
      <div style={{ minWidth: compact ? 0 : count * 224 }} className="ladder-inner">
        <div className="ladder-axis">
          <span>Ceremonial</span>
          <span className="hide-m">One garden · {count} expressions</span>
          <span>Everyday</span>
        </div>
        <div
          className="ladder-track"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(224px, 1fr))`, minWidth: count * 224 }}
        >
          {catalogue.map((p, i) => {
            const inner = (
              <>
                <div className="between">
                  <span className="eyebrow muted">{String(i + 1).padStart(2, '0')}</span>
                  <Swatch p={p} />
                </div>
                <TinBox p={p} sizes="240px" />
                <div>
                  <h3 className="h3">{p.name}</h3>
                  <p className="small it">{p.descriptor}</p>
                </div>
                {p.body !== undefined && p.brisk !== undefined && (
                  <div className="stack g3" style={{ color: p.ink }}>
                    <Scale label="Body" value={p.body} />
                    <Scale label="Briskness" value={p.brisk} />
                  </div>
                )}
                <div className="between">
                  {p.pricePaise === null ? (
                    <span className="cap" style={{ color: 'var(--text-accent)' }}>
                      To be confirmed
                    </span>
                  ) : (
                    <span className="price">{inr(p.pricePaise)}</span>
                  )}
                  <span className="cap">{p.netQuantity}</span>
                </div>
              </>
            );

            const className = 'stop' + (active === p.slug ? ' on' : '');
            const handlers = {
              onMouseEnter: () => onSelect?.(p.slug),
              onFocus: () => onSelect?.(p.slug),
            };

            return linkToProduct ? (
              <Link key={p.slug} href={`/shop/${p.slug}`} className={className} {...handlers}>
                {inner}
              </Link>
            ) : (
              <button
                key={p.slug}
                type="button"
                className={className}
                aria-pressed={active === p.slug}
                {...handlers}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
