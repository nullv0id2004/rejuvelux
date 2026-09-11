'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Icon, RadioGroup } from '@/components/ds';
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
import { CONTACT, PRICE, PRODUCTS, REVIEWS, SLOT, fmt, type Product } from '@/lib/data';
import { useCart } from '@/lib/cart';

/** Subscription discount is a placeholder alongside the placeholder price. */
const SUBSCRIBE_SAVING = 100;

/**
 * Gallery plan: 6 shots, with image 3 establishing real scale (brief §11.2).
 * Each slot takes the SKU's own photograph where one exists and falls back to
 * the labelled interim stand-in where it does not.
 */
function galleryShots(p: Product): { label: string; ratio: string; tin?: boolean; src?: string; alt?: string }[] {
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

export function ProductView({ p }: { p: Product }) {
  const [img, setImg] = useState(0);
  const [plan, setPlan] = useState('once');
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  // Weight is a placeholder slot on SKUs that have not been specified yet, so
  // the per-gram figure is only derivable where a real weight exists.
  const grams = parseInt(p.weight, 10);
  const unitPrice = Number.isFinite(grams) && grams > 0
    ? Math.round((PRICE / grams) * 10) / 10
    : null;
  const linePrice = plan === 'sub' ? PRICE - SUBSCRIBE_SAVING : PRICE;
  const others = PRODUCTS.filter((q) => q.id !== p.id).slice(0, 3);
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
          <span>{p.category}</span>
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
                  {p.category} · <Ph>{SLOT.grade}</Ph>
                </Eyebrow>
                <Swatch p={p} />
              </div>
              <h1 className="h1" style={{ fontSize: 44 }}>
                {p.name}
              </h1>
              <p className="lead it">{withSlots(`${p.descriptor}. ${p.tagline}`)}</p>
              <div className="row g3 cap">
                <Rating value={4} />
                <span className="num">
                  4.8 · <Ph>[000]</Ph> reviews · example
                </span>
              </div>
            </div>

            <div className="stack g4">
              <div className="between" style={{ alignItems: 'baseline' }}>
                <span className="price" style={{ fontSize: 28 }}>
                  {fmt(linePrice)}
                  <span className="cap">*</span>
                </span>
                <span className="cap num">
                  <Slot v={p.weight} /> ·{' '}
                  {unitPrice === null ? <Ph>₹[0.0]/g</Ph> : <>₹{unitPrice}/g</>} ·{' '}
                  <Slot v={p.cups} /> cups
                </span>
              </div>

              <RadioGroup
                name="plan"
                value={plan}
                onChange={setPlan}
                direction="column"
                options={[
                  { value: 'once', label: `One-time · ${fmt(PRICE)}*` },
                  {
                    value: 'sub',
                    label: `Subscribe · ${fmt(PRICE - SUBSCRIBE_SAVING)}* per tin`,
                    description:
                      'Every 4 or 8 weeks. Same lot for the season. Pause any time. Saving is a placeholder.',
                  },
                ]}
              />

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
                <Button size="lg" style={{ flex: 1 }} onClick={() => add(p, qty)}>
                  {plan === 'sub' ? 'Subscribe' : 'Add to cart'} · {fmt(linePrice * qty)}
                </Button>
              </div>

              <p className="cap">
                Free shipping above ₹<Ph>[0,000]</Ph> · dispatch in <Ph>[00]</Ph> h ·{' '}
                <Ph>[00]</Ph>-day return
              </p>
            </div>

            <ul className="stack g2" style={{ margin: 0, paddingLeft: 18, font: 'var(--type-body)' }}>
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

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
                  ['Net weight', p.weight],
                  ['Cups per tin', p.cups],
                ]}
              />
            </div>

            <div className="stack g3">
              <Eyebrow>Brew · draft values</Eyebrow>
              <Evidence
                rows={[
                  ['Water', p.brew.temp],
                  ['Leaf', p.brew.g],
                  ['Volume', p.brew.ml],
                  ['Time', p.brew.min],
                  ['Steeps', p.brew.steeps],
                ]}
              />
              <div className="grid cols-2" style={{ color: p.ink, paddingTop: 8 }}>
                <Scale label="Body" value={p.body} />
                <Scale label="Briskness" value={p.brisk} />
              </div>
            </div>

            <Accordion
              items={[
                ['Description', p.description + ' ' + p.why],
                [
                  'How to brew',
                  `${p.brew.g} of leaf in ${p.brew.ml} of water at ${p.brew.temp}. ${p.brew.min}. Good for ${p.brew.steeps} steep${p.brew.steeps === '1' ? '' : 's'}. Draft values pending cupping.`,
                ],
                [
                  'Specification',
                  `Net weight ${p.weight}. Grade [GRADE]. Lot [LOT-0000], plucked [MONTH 0000]. Packed at source in a lined steel tin. Ingredients: tea (Camellia sinensis). FSSAI Lic. No. ${CONTACT.fssai}. Packed and marketed by ${CONTACT.entity}, ${CONTACT.address}.`,
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
            <Tile key={q.id} p={q} />
          ))}
        </div>
      </section>

      <section className="wrap sec rule-t">
        <div className="split-wide" style={{ alignItems: 'start' }}>
          <div className="stack g3">
            <Eyebrow>{p.name}</Eyebrow>
            <h2 className="h1">Four questions.</h2>
          </div>
          <Accordion items={p.faqs} />
        </div>
      </section>
    </main>
  );
}
