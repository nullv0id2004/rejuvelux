'use client';

import { useState } from 'react';
import { Button, Icon } from '@/components/ds';
import { Accordion, Ladder } from '@/components/site/interactive';
import { NewsletterBand } from '@/components/site/NewsletterBand';
import {
  Evidence,
  Eyebrow,
  Greybox,
  Ph,
  Rating,
  SectionHead,
  Swatch,
  withSlots,
} from '@/components/site/primitives';
import {
  FAQS,
  PRICE,
  PRODUCTS,
  RANGE_WORD,
  RANGE_WORD_CAP,
  REVIEWS,
  SLOT,
  STORY,
  byId,
  fmt,
} from '@/lib/data';
import { useCart } from '@/lib/cart';
import { useToast } from '@/lib/toast';

const OBJECTIONS: [string, string][] = [
  [
    'Origin',
    'One estate in Assam, not a blend of many. Garden, district and elevation appear on every tin.',
  ],
  [
    'Flush',
    'Picked in a named month and sold within the season. The pluck date is printed, not implied.',
  ],
  [
    'Proof',
    'Grade, lot and brew parameters on every product. Nothing is claimed without a number beside it.',
  ],
  ['Dispatch', 'Packed in the tin at source. Ships within [00] hours; free above ₹[0,000].'],
];

const SETS: [string, string, string, string][] = [
  [
    'Tasting box',
    `All ${RANGE_WORD}, 25 g each`,
    'Save ₹[000]',
    'Start here if you have not tasted the range.',
  ],
  [
    'Sampler flight',
    'Three teas of your choice, 25 g each',
    'Save ₹[000]',
    'Pick a register — pale, copper, or strong.',
  ],
  [
    'Subscription',
    'One tin, every 4 or 8 weeks',
    'Save ₹[000] per tin',
    'Same lot for the season. Pause or change any time.',
  ],
];

const GUARANTEES: [string, string, string][] = [
  ['Shipping', 'Free above ₹[0,000]', 'Dispatch within [00] hours, India-wide.'],
  ['Returns', '[00] days', 'Unopened tins, no questions. Opened tins, one question.'],
  ['Guarantee', '[TBC]', 'Terms pending. The slot is sized for one sentence.'],
];

/**
 * The homepage in the brief's fixed section order (S04–S14), each section
 * closing one objection. Kept alongside the shipped homepage as deliverable 1.
 */
export function AltHome() {
  const [active, setActive] = useState('golden');
  const { add } = useCart();
  const { toast } = useToast();
  const a = byId(active)!;

  return (
    <main>
      {/* S04 Hero — dry leaf crossfading once to brewed liquor */}
      <section className="wrap">
        <div className="hero">
          <div className="stack g6">
            <Eyebrow>
              Single-origin Assam · <Ph>{SLOT.estate}</Ph>
            </Eyebrow>
            <h1 className="display">
              Earned,
              <br />
              <em>not</em> indulged.
            </h1>
            <p className="lead">
              India doesn&rsquo;t need better tea. India needs better access to its best tea.
            </p>
            <div className="row g3">
              <Button size="lg" href="#collection" iconRight={<Icon name="arrow-right" size={16} />}>
                Shop the collection
              </Button>
            </div>
            <Evidence
              style={{ maxWidth: 360 }}
              rows={[
                ['Garden', SLOT.estate],
                ['Elevation', SLOT.elevation],
                ['Current flush', SLOT.flush],
              ]}
            />
          </div>
          <div className="xfade" aria-label="Dry leaf crossfading to brewed liquor">
            <Greybox label="Dry leaf macro · scale reference in frame" ratio="4 / 5" priority />
            <div className="b">
              <Greybox
                label="Brewed liquor · clear glass · white ground"
                ratio="4 / 5"
                style={{ background: 'var(--bone-400)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* S05 Objection bar — hairline-separated tiles, no cards, before any price */}
      <section className="wrap sec-sm rule-y">
        <div className="obj">
          {OBJECTIONS.map(([k, t]) => (
            <div key={k}>
              <Eyebrow muted>{k}</Eyebrow>
              <p className="small" style={{ color: 'var(--text-primary)' }}>
                {withSlots(t)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* S06 Comparison — three rows against the supermarket default, one conceded */}
      <section className="wrap sec">
        <SectionHead
          eyebrow="Against the default"
          title="What the supermarket tin leaves out."
          aside="Three rows. One of them is theirs."
        />
        <div className="cmp">
          <div className="hd">Measure</div>
          <div className="hd">RejuveLuxe</div>
          <div className="hd">Supermarket blend</div>

          <div className="lb">Origin</div>
          <div className="us">
            <Ph>{SLOT.estate}</Ph>, single garden
          </div>
          <div>Blended · several regions</div>

          <div className="lb">Leaf grade</div>
          <div className="us">
            <Ph>{SLOT.grade}</Ph> · whole leaf and tips
          </div>
          <div>Dust and fannings</div>

          <div className="lb">Pluck date on pack</div>
          <div className="us">
            <Ph>{SLOT.pluck}</Ph> · lot <Ph>{SLOT.lot}</Ph>
          </div>
          <div>Best-before only</div>

          <div className="lb">Price per cup</div>
          <div>
            ₹<Ph>[00]</Ph>
          </div>
          <div className="us">
            ₹<Ph>[0]</Ph> — they win here
          </div>
        </div>
      </section>

      {/* S07 The collection ladder — the signature section */}
      <section className="wrap sec rule-t" id="collection">
        <SectionHead
          eyebrow="The collection"
          title={`${RANGE_WORD_CAP} expressions. One garden.`}
          aside="Ceremonial to everyday. CTC is the finest version of the daily cup, not the cheap one in the set."
        />
        <Ladder active={active} onSelect={setActive} />
        <div className="between wrapm rule-t" style={{ paddingTop: 24, marginTop: 8 }}>
          <p className="lead" style={{ maxWidth: 560, fontStyle: 'italic' }}>
            {a.tagline}
          </p>
          <div className="row g3">
            <Button onClick={() => add(a)}>Add {a.name}</Button>
            <Button variant="outline" href={`/shop/${a.id}`}>
              Details
            </Button>
          </div>
        </div>
        <p className="cap" style={{ marginTop: 16 }}>
          *All prices are a single placeholder value pending pricing.
        </p>
      </section>

      {/* S08 Brew guide — pure evidence rows */}
      <section className="wrap sec rule-t">
        <SectionHead
          eyebrow="Brew guide · draft values"
          title="Water, weight, time."
          aside="Parameters for a 200 ml cup unless stated. Full guide covers vessels and re-steeping."
        />
        <div className="brew-wrap">
          <div className="brew">
            <div className="hd">Tea</div>
            <div className="hd">Temp</div>
            <div className="hd">Leaf</div>
            <div className="hd">Water</div>
            <div className="hd">Time</div>
            <div className="hd">Steeps</div>
            {PRODUCTS.map((p) => (
              <div key={p.id} style={{ display: 'contents' }}>
                <div className="row g3">
                  <Swatch p={p} size={12} />
                  {p.name}
                </div>
                <div>{p.brew.temp}</div>
                <div>{p.brew.g}</div>
                <div>{p.brew.ml}</div>
                <div>{p.brew.min}</div>
                <div>{p.brew.steeps}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 24 }}>
          <Button
            variant="ghost"
            onClick={() =>
              toast({ title: 'Brew guide', description: 'The full guide page is not built yet.' })
            }
            iconRight={<Icon name="arrow-right" size={14} />}
          >
            The full brew guide
          </Button>
        </div>
      </section>

      {/* S09 Bundle and subscribe */}
      <section className="wrap sec rule-t" id="sets">
        <SectionHead eyebrow="Sets and subscription" title="Taste the ladder, or settle on a rung." />
        <div className="bundle">
          {SETS.map(([t, d, s, c]) => (
            <div key={t}>
              <Eyebrow muted>{t}</Eyebrow>
              <h3 className="h3">{d}</h3>
              <p className="small">{c}</p>
              <div className="between" style={{ marginTop: 'auto' }}>
                <span className="price">{fmt(PRICE)}*</span>
                <span className="cap">
                  <Ph>{s}</Ph>
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  toast({ title: t, description: 'Set configuration is not built yet.' })
                }
              >
                Choose
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* S10 The garden */}
      <section className="rule-t">
        <Greybox
          label="The garden · overcast · rows, sheds, sorting tables"
          ratio="16 / 9"
          className="bleed"
          style={{ maxHeight: 640 }}
          sizes="100vw"
        />
        <div className="wrap sec">
          <div className="split-wide">
            <div className="stack g6">
              <Eyebrow>The garden</Eyebrow>
              <h2 className="h1">We went to the source.</h2>
              <Evidence
                rows={[
                  ['Estate', SLOT.estate],
                  ['District', SLOT.district],
                  ['Elevation', SLOT.elevation],
                  ['Flush', SLOT.flush],
                ]}
              />
            </div>
            <div className="stack g6">
              <p className="lead">{STORY[2]}</p>
              <div className="row g4" style={{ alignItems: 'flex-start' }}>
                <Greybox
                  label="Portrait · at work"
                  ratio="4 / 5"
                  style={{ width: 96, flex: 'none' }}
                  sizes="96px"
                />
                <div className="stack g1" style={{ paddingTop: 4 }}>
                  <span className="small" style={{ color: 'var(--text-primary)' }}>
                    <Ph>[MANAGER NAME]</Ph>
                  </span>
                  <span className="cap">
                    Estate manager, <Ph>{SLOT.estate}</Ph>. Photographed at the sorting table.
                  </span>
                </div>
              </div>
              <div>
                <Button variant="outline" href="/garden">
                  Read about the garden
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S11 Reviews */}
      <section className="wrap sec rule-t">
        <SectionHead eyebrow="Reviews · example content" title="From people who paid for it.">
          <div className="stack g1" style={{ alignItems: 'flex-end' }}>
            <span className="price num">4.8 / 5</span>
            <span className="cap num">
              <Ph>[000]</Ph> reviews
            </span>
          </div>
        </SectionHead>
        <div className="grid cols-4" style={{ marginBottom: 40 }}>
          {['@handle_one', '@handle_two', '@handle_three', '@handle_four'].map((h) => (
            <div key={h} className="stack g2">
              <Greybox label="Creator still" ratio="4 / 5" sizes="(max-width: 800px) 100vw, 280px" />
              <span className="cap">{h} · example</span>
            </div>
          ))}
        </div>
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

      {/* S12 Gifting — packaging-led, show the box not the leaf */}
      <section className="wrap sec rule-t" id="gifting">
        <div className="split">
          <Greybox label="Gift box · closed · printed lot and pluck date visible" ratio="3 / 2" />
          <div className="stack g6">
            <Eyebrow>Gifting</Eyebrow>
            <h2 className="h1">A box that says what is in it.</h2>
            <p className="lead">
              Two tins, a brew card, and the lot sheet. The label carries the garden, the flush and
              the pluck month. No ribbon.
            </p>
            <Evidence
              style={{ maxWidth: 360 }}
              rows={[
                ['Contents', '2 × 50 g'],
                ['Card', 'Brew parameters, both teas'],
                ['Price', fmt(PRICE) + '*'],
              ]}
            />
            <div className="row g3">
              <Button
                onClick={() =>
                  toast({ title: 'Gift box', description: 'Gift configuration is not built yet.' })
                }
              >
                Build a box
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* S13 Shipping and guarantee */}
      <section className="strip">
        <div className="wrap">
          <div className="grid cols-3">
            {GUARANTEES.map(([k, v, d]) => (
              <div key={k}>
                <Eyebrow muted>{k}</Eyebrow>
                <span className="h3">{withSlots(v)}</span>
                <p className="cap">{withSlots(d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S14 FAQ */}
      <section className="wrap sec">
        <div className="split-wide" style={{ alignItems: 'start' }}>
          <div className="stack g3">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="h1">Asked before buying.</h2>
          </div>
          <Accordion items={FAQS} />
        </div>
      </section>

      <NewsletterBand />
    </main>
  );
}
