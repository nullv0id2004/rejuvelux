'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Icon } from '@/components/ds';
import { Accordion, Tile } from '@/components/site/interactive';
import {
  Evidence,
  Eyebrow,
  Greybox,
  Ph,
  Rating,
  SectionHead,
  Scale,
  Slot,
  Swatch,
  TinBox,
  withSlots,
} from '@/components/site/primitives';
import type { CatalogueProduct } from '@/lib/catalogue';
import { useCatalogue } from '@/lib/catalogue-context';
import { CONTACT, REVIEWS, SLOT } from '@/lib/data';
import { useCart } from '@/lib/cart';

/** ₹ with Indian grouping, no decimals. Mirrors formatPrice in lib/catalogue. */
const inr = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);

/**
 * Gallery plan: 6 shots, with image 3 establishing real scale (brief §11.2).
 * Each slot takes the SKU's own photograph where one exists and falls back to
 * the labelled interim stand-in where it does not.
 */
function galleryShots(p: CatalogueProduct): { label: string; ratio: string; tin?: boolean; src?: string; alt?: string }[] {
  return [
    { label: 'Tin · front', ratio: '4 / 5', tin: true },
    {
      label: 'Tin · lot number and pluck date',
      ratio: '4 / 5',
      src: p.photos?.lot,
      alt: `${p.name} tin, showing the printed lot number and pluck date`,
    },
    {
      label: 'Dry leaf at scale · coin in frame',
      ratio: '4 / 5',
      src: p.photos?.dryLeaf,
      alt: `${p.name} dry leaf at real scale`,
    },
    {
      label: 'Brewed liquor · clear glass',
      ratio: '4 / 5',
      src: p.photos?.liquor,
      alt: `${p.name} brewed, showing the colour of the liquor`,
    },
    {
      label: 'Wet leaf after first steep',
      ratio: '4 / 5',
      src: p.photos?.wetLeaf,
      alt: `${p.name} leaf after the first steep`,
    },
    { label: 'Garden · overcast', ratio: '4 / 5' },
  ];
}

export function ProductView({ p }: { p: CatalogueProduct }) {
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const catalogue = useCatalogue();

  // Per-gram is only derivable where the net quantity is a weight — the Ritual
  // Set is "Six pieces" — and where a price is confirmed at all (R-04).
  const grams = parseInt(p.netQuantity, 10);
  const unitPrice =
    p.pricePaise !== null && Number.isFinite(grams) && grams > 0
      ? Math.round((p.pricePaise / 100 / grams) * 10) / 10
      : null;
  const others = catalogue.filter((q) => q.slug !== p.slug).slice(0, 3);
  const shots = galleryShots(p);
  const shot = shots[img];

  return (
    <main>
      <div className="wrap" style={{ paddingTop: 24 }}>
        <nav className="row g2 cap" aria-label="Breadcrumb">
          <Link href="/#collection" style={{ color: 'var(--text-tertiary)' }}>
            Shop
          </Link>
          <span>/</span>
          <span>{p.teaType}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{p.name}</span>
        </nav>
      </div>

      <section className="wrap" style={{ padding: '24px 0 96px' }}>
        <div className="pdp">
          <div className="gallery">
            <div className="thumbs">
              {shots.map((s, i) => (
                <button
                  key={s.label}
                  className={i === img ? 'on' : ''}
                  onClick={() => setImg(i)}
                  aria-label={s.label}
                  aria-pressed={i === img}
                >
                  {s.tin ? (
                    <TinBox p={p} sizes="72px" imgStyle={{ width: '70%' }} />
                  ) : s.src ? (
                    <Image src={s.src} alt="" width={72} height={90} sizes="72px" className="thumb-img" />
                  ) : (
                    <span className="cap num">{i + 1}</span>
                  )}
                </button>
              ))}
            </div>
            <div>
              {shot.tin ? (
                <TinBox
                  p={p}
                  style={{ aspectRatio: '4 / 5' }}
                  alt={`${p.name} tin, front`}
                  sizes="(max-width: 800px) 100vw, 520px"
                  priority
                />
              ) : (
                <Greybox
                  label={shot.label}
                  ratio={shot.ratio}
                  src={shot.src}
                  alt={shot.alt}
                  sizes="(max-width: 800px) 100vw, 520px"
                />
              )}
            </div>
          </div>

          <div className="stack g8 sticky">
            <div className="stack g3">
              <div className="between">
                <Eyebrow>
                  {p.teaType} · <Ph>{SLOT.grade}</Ph>
                </Eyebrow>
                <Swatch p={p} />
              </div>
              <h1 className="h1" style={{ fontSize: 44 }}>
                {p.name}
              </h1>
              <p className="lead it">
                {withSlots(
                  [p.descriptor, p.tagline].filter(Boolean).join('. '),
                )}
              </p>
              <div className="row g3 cap">
                <Rating value={4} />
                <span className="num">
                  4.8 · <Ph>[000]</Ph> reviews · example
                </span>
              </div>
            </div>

            <div className="stack g4">
              <div className="between" style={{ alignItems: 'baseline' }}>
                {p.pricePaise === null ? (
                  /* R-04: the price is unconfirmed, so there is no price to
                     show. An unpriced product renders as unpriced — never a
                     zero, never an estimate (product.md §4.2). */
                  <span className="cap" style={{ color: 'var(--text-accent)' }}>
                    Price to be confirmed
                  </span>
                ) : (
                  <span className="price" style={{ fontSize: 28 }}>
                    {inr(p.pricePaise)}
                  </span>
                )}
                <span className="cap num">
                  <Slot v={p.netQuantity} />
                  {unitPrice !== null && <> · ₹{unitPrice}/g</>}
                  {p.cups && <> · {p.cups} cups</>}
                </span>
              </div>

              <div className="row g3" style={{ flexWrap: 'wrap' }}>
                <div className="qty lg">
                  <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="body num">{qty}</span>
                  <button aria-label="Increase quantity" onClick={() => setQty(qty + 1)}>
                    <Icon name="plus" size={14} />
                  </button>
                </div>
                <Button
                  size="lg"
                  style={{ flex: 1 }}
                  disabled={p.unavailable}
                  onClick={() => add(p, qty)}
                >
                  {p.priceUnconfirmed
                    ? 'Not yet on sale'
                    : p.availability <= 0
                      ? 'Out of stock'
                      : `Add to cart · ${inr(p.pricePaise! * qty)}`}
                </Button>
              </div>

              {/* Says why, rather than leaving a dead button unexplained. */}
              {p.priceUnconfirmed && (
                <p className="cap" style={{ color: 'var(--text-accent)' }}>
                  This tin has no confirmed price yet, so it cannot be bought.
                </p>
              )}
              {!p.priceUnconfirmed && p.availability > 0 && p.availability <= 5 && (
                <p className="cap">Only {p.availability} left.</p>
              )}

              <p className="cap">
                Free shipping above ₹<Ph>[0,000]</Ph> · dispatch in <Ph>[00]</Ph> h ·{' '}
                <Ph>[00]</Ph>-day return
              </p>
            </div>

            {p.bullets && p.bullets.length > 0 && (
              <ul className="stack g2" style={{ margin: 0, paddingLeft: 18, font: 'var(--type-body)' }}>
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}

            {/* The kit's contents, as display copy from the database. Its
                availability is computed from the six components' stock, not
                from this list (data-model.md §4.3). */}
            {p.components && p.components.length > 0 && (
              <div className="stack g3">
                <Eyebrow>What is in the set</Eyebrow>
                <ul className="stack g2" style={{ margin: 0, paddingLeft: 18, font: 'var(--type-body)' }}>
                  {p.components.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* The evidence panel — what makes this page unlike a competitor's.
                It sits above the accordions, never inside them (brief §11.2). */}
            <div className="stack g3">
              <Eyebrow>Evidence</Eyebrow>
              <Evidence
                rows={[
                  ['Garden', SLOT.estate],
                  ['District', SLOT.district],
                  ['Elevation', SLOT.elevation],
                  ['Grade', SLOT.grade],
                  ['Flush', SLOT.flush],
                  ['Pluck month', SLOT.pluck],
                  ['Lot', SLOT.lot],
                  ['Net quantity', p.netQuantity],
                  ...(p.cups ? ([['Cups per tin', p.cups]] as [string, string][]) : []),
                  ['Tea type', p.teaType],
                  ['Origin', p.origin],
                  ['Ingredients', p.ingredients],
                ]}
              />
            </div>

            {/* Brewing is the database's, and the database holds three
                parameters. Vessel volume and steep count have no column, so
                they are absent rather than invented (product.md §4.2). */}
            {p.brewing && (
              <div className="stack g3">
                <Eyebrow>Brew · draft values</Eyebrow>
                <Evidence
                  rows={[
                    ['Water', p.brewing.water],
                    ['Leaf', p.brewing.leaf],
                    ['Time', p.brewing.time],
                  ]}
                />
                {p.body !== undefined && p.brisk !== undefined && (
                  <div className="grid cols-2" style={{ color: p.ink, paddingTop: 8 }}>
                    <Scale label="Body" value={p.body} />
                    <Scale label="Briskness" value={p.brisk} />
                  </div>
                )}
              </div>
            )}

            <Accordion
              items={[
                ['Description', [p.description, p.why].filter(Boolean).join(' ')],
                ...(p.brewing
                  ? ([
                      [
                        'How to brew',
                        `${p.brewing.leaf} of leaf at ${p.brewing.water}. ${p.brewing.time}. Draft values pending cupping.`,
                      ],
                    ] as [string, string][])
                  : []),
                [
                  'Specification',
                  `Net quantity ${p.netQuantity}. SKU ${p.sku}. Grade [GRADE]. Lot [LOT-0000], plucked [MONTH 0000]. Packed at source in a lined steel tin. Ingredients: ${p.ingredients}. FSSAI Lic. No. ${CONTACT.fssai}. Packed and marketed by ${CONTACT.entity}, ${CONTACT.address}.`,
                ],
                [
                  'Shipping and returns',
                  'India-wide shipping. Free above ₹[0,000]; ₹[000] below. Dispatch within [00] hours. Unopened tins returnable within [00] days. All values are placeholders.',
                ],
              ]}
            />
          </div>
        </div>
      </section>

      <section className="wrap sec rule-t">
        <SectionHead
          eyebrow="Reviews · example content"
          title={`What people said about ${p.name}.`}
        >
          <span className="price num">4.8 / 5</span>
        </SectionHead>
        <div className="grid cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="stack g3 rule-t" style={{ paddingTop: 20 }}>
              <Rating value={r.rating} />
              <p className="body it">{r.text}</p>
              <span className="cap">
                {r.name}, {r.city}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec rule-t">
        <SectionHead eyebrow="Elsewhere on the ladder" title="Three to try next." />
        <div className="grid cols-3">
          {others.map((q) => (
            <Tile key={q.slug} p={q} />
          ))}
        </div>
      </section>

      <section className="wrap sec rule-t">
        <div className="split-wide" style={{ alignItems: 'start' }}>
          <div className="stack g3">
            <Eyebrow>{p.name}</Eyebrow>
            <h2 className="h1">Questions.</h2>
          </div>
          <Accordion items={p.faqs ?? []} />
        </div>
      </section>
    </main>
  );
}
