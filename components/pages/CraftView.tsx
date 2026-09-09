'use client';

import { Fragment, useState } from 'react';
import { Button, Tabs } from '@/components/ds';
import { Evidence, Eyebrow, Greybox, Ph, Swatch, TinBox } from '@/components/site/primitives';
import { useProduct } from '@/lib/catalogue-context';
import { CRAFT, CRAFT_ORDER, SLOT } from '@/lib/data';
import { useCart } from '@/lib/cart';

/**
 * One page, three chapters, one per tea. Each chapter is the numbered process
 * as a vertical timeline: step number, step name, description, with a macro
 * photograph every three steps.
 */
export function CraftView() {
  const [tea, setTea] = useState<string>('assam-golden-tips');
  const { add } = useCart();

  const c = CRAFT[tea];
  const p = useProduct(tea);
  const chapter = CRAFT_ORDER.indexOf(tea as (typeof CRAFT_ORDER)[number]) + 1;
  // The chapter's tea may be absent from the catalogue — a product can be
  // retired in the admin without this page being edited. Render nothing rather
  // than crash on a missing row.
  if (!p) return null;
  // The chapter's macro slots take this tea's own photography in order, and
  // fall back to the labelled stand-in once it runs out.
  const macros = [p.photos?.dryLeaf, p.photos?.wetLeaf, p.photos?.liquor].filter(Boolean) as string[];

  return (
    <main>
      <section className="wrap sec">
        <div className="split-wide" style={{ alignItems: 'end' }}>
          <div className="stack g4">
            <Eyebrow>The Craft</Eyebrow>
            <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
              Three teas. Three distinct journeys.
            </h1>
          </div>
          <p className="lead">
            Nothing rushed, nothing skipped. Each chapter is the process as it is run at{' '}
            <Ph>{SLOT.estate}</Ph>, in order, with the stages that take longest given the most room.
          </p>
        </div>
      </section>

      <div className="wrap rule-y" style={{ padding: '12px 0' }}>
        <div className="between wrapm">
          <Tabs
            variant="underline"
            items={[
              { value: 'matcha', label: 'I · Matcha' },
              { value: 'silver', label: 'II · Silver Needle' },
              { value: 'golden', label: 'III · Golden Tips' },
            ]}
            value={tea}
            onChange={setTea}
          />
          <span className="cap">
            Chapter {chapter} of 3 · {c.steps.length} steps
          </span>
        </div>
      </div>

      <section className="wrap sec" key={tea}>
        <div className="split-wide">
          <div className="stack g8 sticky">
            <div className="stack g3">
              <div className="row g3">
                <Swatch p={p} />
                <Eyebrow muted>Chapter {chapter}</Eyebrow>
              </div>
              <h2 className="h1">{c.title}</h2>
              <p className="lead it">{p.tagline}</p>
            </div>
            <TinBox
              p={p}
              style={{ aspectRatio: '4 / 5', maxWidth: 360 }}
              alt={`${p.name} tin`}
              sizes="(max-width: 800px) 100vw, 360px"
            />
            <Evidence
              style={{ maxWidth: 360 }}
              rows={[
                ['Garden', SLOT.estate],
                ['Grade', SLOT.grade],
                ['Flush', SLOT.flush],
                ['Steps', String(c.steps.length)],
              ]}
            />
            <div className="row g3">
              <Button href={`/shop/${tea}`}>See {p.name}</Button>
              <Button variant="outline" onClick={() => add(p)}>
                Add to cart
              </Button>
            </div>
          </div>

          <div className="timeline">
            {c.steps.map(([n, d], i) => (
              <Fragment key={n}>
                <div className="step">
                  <span className="n num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="stack g2">
                    <h3
                      className="h3"
                      style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 18 }}
                    >
                      {n}
                    </h3>
                    <p className="body" style={{ color: 'var(--text-secondary)' }}>
                      {d}
                    </p>
                  </div>
                </div>
                {(i + 1) % 3 === 0 && i + 1 < c.steps.length && (
                  <div className="step" style={{ borderBottom: 'var(--rule)' }}>
                    <span />
                    <Greybox
                      label={`Macro · after step ${String(i + 1).padStart(2, '0')} · ${n.toLowerCase()}`}
                      ratio="3 / 2"
                      sizes="(max-width: 800px) 100vw, 600px"
                      src={macros[Math.floor((i + 1) / 3) - 1]}
                      alt={`${p.name}, ${n.toLowerCase()}`}
                    />
                  </div>
                )}
              </Fragment>
            ))}
            <p className="lead it" style={{ padding: '32px 0 0 80px' }}>
              {c.close}
            </p>
          </div>
        </div>
      </section>

      <section className="wrap sec-sm rule-t">
        <p className="h2 it" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          Different leaves. Different craftsmanship. One origin: Assam.
        </p>
      </section>
    </main>
  );
}
