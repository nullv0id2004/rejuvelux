import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { SITE_PHOTOS, type Product } from '@/lib/data';

/* --------------------------------------------------------------- labels -- */

export function Eyebrow({
  children,
  muted,
  style,
}: {
  children?: ReactNode;
  muted?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={'eyebrow' + (muted ? ' muted' : '')} style={style}>
      {children}
    </div>
  );
}

/** An unfilled content slot, rendered in the accent colour so gaps stay visible. */
export function Ph({ children }: { children?: ReactNode }) {
  return <span className="ph">{children}</span>;
}

/** Renders a value, wrapping it as a placeholder if it reads as `[SLOT]`. */
export function Slot({ v }: { v: string }) {
  return /^\[.*\]$/.test(String(v)) ? <Ph>{v}</Ph> : <>{v}</>;
}

/** Splits a sentence so any embedded [SLOT] renders as a placeholder. */
export function withSlots(text: string) {
  return text
    .split(/(₹?\[[^\]]+\])/)
    .map((part, i) => (/\[/.test(part) ? <Ph key={i}>{part}</Ph> : <span key={i}>{part}</span>));
}

/* ------------------------------------------------------------- wordmark -- */

export function Wordmark({
  stacked,
  size = 22,
  href,
  inverse,
}: {
  stacked?: boolean;
  size?: number;
  href?: string;
  inverse?: boolean;
}) {
  const color = inverse ? 'var(--bone-100)' : 'var(--text-primary)';
  const strap = inverse ? 'var(--gold-300)' : 'var(--text-accent)';

  const content = stacked ? (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        color,
      }}
    >
      <span className="wordmark" style={{ fontSize: size }}>
        Rejuveluxe
      </span>
      <span className="strap" style={{ color: strap, fontSize: Math.max(8, size * 0.36) }}>
        ◆ Earned not indulged ◆
      </span>
    </span>
  ) : (
    <span className="wm" style={{ color }}>
      <span className="wordmark" style={{ fontSize: size }}>
        Rejuveluxe
      </span>
      <span className="strap hide-m" style={{ color: strap, fontSize: 8 }}>
        ◆ Earned not indulged ◆
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="RejuveLuxe — home" style={{ display: 'inline-flex', color }}>
      {content}
    </Link>
  );
}

/**
 * The brand crest — the full lockup from the tins: Mughal arch, crown, cup,
 * leaves, wordmark and strapline.
 *
 * It carries its own detail and its own colour (gold gradients on a cream
 * ground), so it does not take the page's ink colour and it needs room. Below
 * roughly 120px tall the wordmark inside it turns to mush; use `Wordmark` in
 * type for anything smaller, which is what the nav does.
 */
export function Logo({
  width = 150,
  priority,
  style,
}: {
  width?: number;
  priority?: boolean;
  style?: CSSProperties;
}) {
  const RATIO = 1345.1 / 1253.7; // the SVG's own viewBox
  return (
    <Image
      src="/assets/logo.svg"
      alt="RejuveLuxe"
      width={width}
      height={Math.round(width * RATIO)}
      priority={priority}
      style={{ height: 'auto', ...style }}
    />
  );
}

/* ------------------------------------------------------------- greybox --- */

/**
 * A photography slot at a stated aspect ratio.
 *
 * Given a `src`, it shows that photograph. Without one it falls back to the
 * interim field photo, captioned with the shot it is standing in for — most
 * estate, process and liquor photography does not exist yet (brief §14), and a
 * labelled stand-in is more honest than a picture pretending to be the thing.
 */
export function Greybox({
  label,
  ratio = '3 / 2',
  style,
  className = '',
  sizes = '(max-width: 800px) 100vw, 50vw',
  priority,
  src,
  alt,
}: {
  label: string;
  ratio?: string;
  style?: CSSProperties;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Real photograph for this slot. Omit to get the labelled interim stand-in. */
  src?: string;
  /** Description of the real photograph, for assistive technology. */
  alt?: string;
}) {
  const real = Boolean(src);
  return (
    <div
      className={'greybox photo ' + className}
      style={{ aspectRatio: ratio, ...style }}
      role="img"
      aria-label={real ? (alt ?? label) : label + ' — interim photograph'}
    >
      <Image
        src={src ?? SITE_PHOTOS.interim}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        style={real ? { objectFit: 'cover' } : undefined}
      />
      {!real && (
        <div className="gl">
          {label} · {ratio.replace(/\s/g, '')} · Interim
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------- evidence rows --- */

/** Label left, tabular value right, hairline between. The core repeating object. */
export function Evidence({
  rows,
  inverse,
  style,
}: {
  rows: [string, string][];
  inverse?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={'ev' + (inverse ? ' inv' : '')} style={style}>
      {rows.map(([k, v]) => (
        <div className="ev-row" key={k}>
          <span className="k">{k}</span>
          <span className="v">
            <Slot v={v} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------- swatch and scales --- */

export function Swatch({ p, size = 24, style }: { p: Product; size?: number; style?: CSSProperties }) {
  return (
    <span
      className="swatch"
      title={p.name}
      style={{
        width: size,
        height: size,
        background: p.tin,
        boxShadow: `inset 0 0 0 1px ${p.ink}`,
        ...style,
      }}
    />
  );
}

/**
 * Five segments filled in the SKU's ink colour (inherited via currentColor).
 * A value of 0 means the tea has not been cupped yet, and reads as an empty
 * slot rather than as a genuine score of zero.
 */
export function Scale({ label, value }: { label: string; value: number }) {
  const rated = value > 0;
  return (
    <div className="stack g2" style={{ minWidth: 0 }}>
      <div className="between">
        <span className="eyebrow muted">{label}</span>
        <span className="cap num">{rated ? `${value}/5` : <Ph>[0]/5</Ph>}</span>
      </div>
      <div
        className="scale"
        aria-label={rated ? `${label} ${value} of 5` : `${label} — not yet rated`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <i key={i} className={i <= value ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- tin figure --- */

/**
 * A product tin floating on its own tin colour. Where no render has been
 * supplied, the frame states which one is missing instead of breaking.
 */
export function TinBox({
  p,
  className = '',
  style,
  imgStyle,
  sizes = '(max-width: 800px) 90vw, 400px',
  priority,
  alt,
}: {
  p: Product;
  className?: string;
  style?: CSSProperties;
  imgStyle?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <div
      className={'tinbox ' + className}
      style={{ background: p.tin, ...style }}
      role={p.image ? undefined : 'img'}
      aria-label={p.image ? undefined : `${p.name} tin — render pending`}
    >
      {p.image ? (
        <Image
          src={p.image}
          alt={alt ?? ''}
          width={900}
          height={900}
          sizes={sizes}
          priority={priority}
          // Sizing lives in CSS (`.tinbox img`, and the per-context overrides
          // that follow it) so context rules are not beaten by inline styles.
          style={imgStyle}
        />
      ) : (
        <span className="tin-pending" style={{ color: p.ink }}>
          Tin render
          <br />
          pending
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------- section header -- */

export function SectionHead({
  eyebrow,
  title,
  aside,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className="between wrapm"
      style={{
        alignItems: 'flex-end',
        paddingBottom: 24,
        borderBottom: 'var(--rule)',
        marginBottom: 40,
      }}
    >
      <div className="stack g3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="h1">{title}</h2>
      </div>
      {aside && (
        <p className="small" style={{ maxWidth: 360 }}>
          {aside}
        </p>
      )}
      {children}
    </div>
  );
}

/** Star-equivalent rating row. The brand's only permitted ornament is ◆. */
export function Rating({ value, style }: { value: number; style?: CSSProperties }) {
  return (
    <span className="cap num" aria-label={`${value} of 5`} style={style}>
      {'◆'.repeat(value)}
      <span style={{ opacity: 0.3 }}>{'◆'.repeat(5 - value)}</span>
    </span>
  );
}
