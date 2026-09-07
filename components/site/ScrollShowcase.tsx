'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Icon } from '@/components/ds';
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
import { Evidence, Scale, withSlots } from './primitives';

const WIPE_COVER_MS = 460;
const WIPE_CYCLE_MS = 960;

/**
 * The collection as a scroll-driven split panel, after the reference video:
 * the stage pins under the nav, each tea holds one viewport of scroll, and a
 * dark panel wipes across as the product changes.
 *
 * Scroll-linked, not scroll-jacked — native scrolling is never intercepted, and
 * `prefers-reduced-motion` swaps products instantly with no wipe.
 */
export function ScrollShowcase() {
  const catalogue = useCatalogue();
  const N = catalogue.length;
  const wrapRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { add } = useCart();

  // `idx` is where the scroll position says we are; `shown` is the product
  // currently painted. They diverge only while a wipe is mid-flight.
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [wipe, setWipe] = useState<'idle' | 'in' | 'out'>('idle');

  const target = useRef(0);
  const shownRef = useRef(0);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Self-rescheduling so a fast scroll during a wipe cannot strand the panel
  // dark: when the cycle finishes it re-checks the target and runs again.
  const run = useCallback(() => {
    if (busy.current || target.current === shownRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shownRef.current = target.current;
      setShown(target.current);
      return;
    }

    busy.current = true;
    setWipe('in');
    timers.current = [
      setTimeout(() => {
        shownRef.current = target.current;
        setShown(target.current);
        setWipe('out');
      }, WIPE_COVER_MS),
      setTimeout(() => {
        setWipe('idle');
        busy.current = false;
        run();
      }, WIPE_CYCLE_MS),
    ];
  }, []);

  useEffect(() => {
    const running = timers;
    return () => running.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    target.current = idx;
    run();
  }, [idx, run]);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const progress = Math.min(1, Math.max(0, -r.top / span));
      setIdx(Math.min(N - 1, Math.floor(progress * N)));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [N]);

  /** Scrolls to the middle of the slice of scroll that product `i` owns. */
  const jump = (i: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    window.scrollTo({ top: window.scrollY + r.top + span * ((i + 0.5) / N), behavior: 'smooth' });
  };

  const p = catalogue[shown];
  // Silver Needle's tin is white, so its pagination dots need the gold instead.
  const dotColor = p.slug === 'silver-needle-assam' ? 'var(--gold-500)' : 'var(--bone-100)';

  return (
    <section
      ref={wrapRef}
      className="sc-wrap"
      style={{ height: `${(N + 1) * 100}vh` }}
      aria-label="The collection"
    >
      <div className="sc-stage">
        <div className="sc-left" style={{ background: p.tin }}>
          <div className="sc-block-ink" style={{ background: p.ink }} />
          <div className="sc-block-dark" />
          {p.image ? (
            <Image
              key={p.slug}
              className="tin-in sc-tin"
              src={p.image}
              alt={`${p.name} tin`}
              width={900}
              height={900}
              sizes="(max-width: 800px) 70vw, 480px"
              priority={shown === 0}
              onClick={() => router.push(`/shop/${p.slug}`)}
            />
          ) : (
            <span
              key={p.slug}
              className="tin-in sc-tin sc-tin-pending tin-pending"
              style={{ color: p.ink }}
              role="img"
              aria-label={`${p.name} tin — render pending`}
              onClick={() => router.push(`/shop/${p.slug}`)}
            >
              Tin render pending
            </span>
          )}
          <div className="sc-dots">
            {catalogue.map((q, i) => (
              <button
                key={q.slug}
                aria-label={q.name}
                aria-current={i === idx}
                onClick={() => jump(i)}
                style={{ borderColor: dotColor, background: i === idx ? dotColor : 'transparent' }}
              />
            ))}
          </div>
        </div>

        <div className="sc-right">
          <div key={p.slug} className="copy-in sc-copy">
            <div className="sc-frame sc-tag">{withSlots(`${p.teaType} · ${p.descriptor}`)}</div>
            <div className="sc-frame sc-title">
              <h2 className="h1 it" style={{ textAlign: 'center', fontSize: 'clamp(34px,4.2cqw,60px)' }}>
                {p.name}
              </h2>
            </div>
            <div className="sc-grid">
              <div className="sc-frame sc-desc">
                <p className="small">{p.description}</p>
              </div>
              <div className="sc-frame sc-notes">
                <div style={{ color: p.ink }}>
                  <Scale label="Body" value={p.body ?? 0} />
                </div>
                {p.brisk !== undefined && (
                  <div style={{ color: p.ink }}>
                    <Scale label="Briskness" value={p.brisk} />
                  </div>
                )}
                {p.brewing && (
                  <div className="stack g2">
                    <span className="eyebrow muted">Brew</span>
                    <span className="cap num" style={{ color: 'var(--text-primary)' }}>
                      {p.brewing.water} · {p.brewing.leaf}
                      <br />
                      {p.brewing.time}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Evidence
              style={{ marginTop: 12 }}
              rows={[
                ['Grade', SLOT.grade],
                ['Lot', SLOT.lot],
                ['Net quantity', p.netQuantity],
              ]}
            />
          </div>

          <div className="sc-foot">
            <div key={'pr' + p.slug} className="copy-in row g2" style={{ alignItems: 'baseline' }}>
              {p.pricePaise === null ? (
                <span className="cap" style={{ color: 'var(--text-accent)' }}>
                  Price to be confirmed
                </span>
              ) : (
                <span className="price" style={{ fontSize: 26 }}>
                  {inr(p.pricePaise)}
                </span>
              )}
              <span className="cap">/ {p.netQuantity}</span>
            </div>
            <div className="row g2">
              <Button
                variant="outline"
                size="sm"
                style={{ width: 44, padding: 0 }}
                onClick={() => jump(Math.max(0, idx - 1))}
                aria-label="Previous tea"
              >
                <Icon name="arrow-left" size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                style={{ width: 44, padding: 0 }}
                onClick={() => jump(Math.min(N - 1, idx + 1))}
                aria-label="Next tea"
              >
                <Icon name="arrow-right" size={14} />
              </Button>
              <Button onClick={() => add(p)}>Add to cart</Button>
            </div>
          </div>

          <div className="sc-count cap num">
            {String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </div>
        </div>

        <div className={'wipe ' + wipe} aria-hidden="true" />
      </div>
    </section>
  );
}
