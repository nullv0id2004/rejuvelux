'use client';

import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

/* ---------------------------------------------------------------- Badge -- */

const tones = {
  neutral: { bg: 'var(--bone-300)', fg: 'var(--ink-700)' },
  ink: { bg: 'var(--ink-900)', fg: 'var(--bone-100)' },
  gold: { bg: 'var(--gold-500)', fg: '#fff' },
  success: { bg: 'var(--status-success-soft)', fg: 'var(--status-success)' },
  warning: { bg: 'var(--status-warning-soft)', fg: 'var(--status-warning)' },
  error: { bg: 'var(--status-error-soft)', fg: 'var(--status-error)' },
  info: { bg: 'var(--status-info-soft)', fg: 'var(--status-info)' },
};

export type BadgeTone = keyof typeof tones;

export function Badge({
  children,
  tone = 'neutral',
  style,
}: {
  children?: ReactNode;
  tone?: BadgeTone;
  style?: CSSProperties;
}) {
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 20,
        padding: '0 8px',
        background: t.bg,
        color: t.fg,
        font: 'var(--type-eyebrow)',
        fontSize: 'var(--text-2xs)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-xs)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- Card -- */

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  padding?: number | string;
  inverse?: boolean;
  interactive?: boolean;
  eyebrow?: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
};

export function Card({
  children,
  padding = 24,
  inverse,
  interactive,
  eyebrow,
  title,
  footer,
  style,
  ...rest
}: CardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: inverse ? 'var(--surface-inverse)' : 'var(--surface-card)',
        color: inverse ? 'var(--text-inverse)' : 'var(--text-primary)',
        border: `1px solid ${
          hover && interactive
            ? inverse
              ? 'var(--gold-400)'
              : 'var(--border-strong)'
            : inverse
              ? 'var(--ink-700)'
              : 'var(--border-subtle)'
        }`,
        borderRadius: 0,
        padding,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color var(--dur-fast) var(--ease-out)',
        cursor: interactive ? 'pointer' : undefined,
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {eyebrow && (
        <div
          style={{
            font: 'var(--type-eyebrow)',
            letterSpacing: 'var(--tracking-caps)',
            textTransform: 'uppercase',
            color: inverse ? 'var(--gold-300)' : 'var(--text-accent)',
          }}
        >
          {eyebrow}
        </div>
      )}
      {title && <div style={{ font: 'var(--type-h3)' }}>{title}</div>}
      {children}
      {footer && (
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 12,
            borderTop: `1px solid ${inverse ? 'var(--ink-700)' : 'var(--border-subtle)'}`,
            font: 'var(--type-body-sm)',
            color: inverse ? 'var(--ink-300)' : 'var(--text-secondary)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- ProductCard -- */

export type ProductCardModel = {
  name: string;
  category: string;
  tin: string;
  image: string;
  price: ReactNode;
  weight: string;
  tagline?: string;
  badge?: string;
  badgeTone?: BadgeTone;
};

export function ProductCard({
  product,
  onAdd,
  onOpen,
  style,
}: {
  product: ProductCardModel;
  onAdd?: () => void;
  onOpen?: () => void;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const p = product;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
        transition: 'border-color var(--dur-fast) var(--ease-out)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        onClick={onOpen}
        style={{
          position: 'relative',
          aspectRatio: '1',
          background: p.tin,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onOpen ? 'pointer' : 'default',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          style={{
            width: '78%',
            transform: hover ? 'translateY(-6px)' : 'none',
            transition: 'transform var(--dur-slow) var(--ease-out)',
            filter: 'drop-shadow(0 28px 28px rgba(20,19,17,.35))',
          }}
        />
        {p.badge && (
          <Badge tone={p.badgeTone || 'ink'} style={{ position: 'absolute', top: 14, left: 14 }}>
            {p.badge}
          </Badge>
        )}
      </div>
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            font: 'var(--type-eyebrow)',
            letterSpacing: 'var(--tracking-caps)',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}
        >
          {p.category}
        </div>
        <div
          onClick={onOpen}
          style={{
            font: 'var(--type-h3)',
            fontStyle: 'italic',
            cursor: onOpen ? 'pointer' : 'default',
          }}
        >
          {p.name}
        </div>
        {p.tagline && (
          <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
            {p.tagline}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <div style={{ font: 'var(--type-price)' }}>
            {p.price}{' '}
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>
              / {p.weight}
            </span>
          </div>
          <Button size="sm" variant={hover ? 'primary' : 'outline'} onClick={onAdd}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Tag -- */

export function Tag({
  children,
  selected,
  onClick,
  onRemove,
  tint,
  style,
}: {
  children?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  tint?: string;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const interactive = !!onClick;
  const bg = selected
    ? 'var(--action-primary)'
    : hover && interactive
      ? 'var(--bone-300)'
      : 'transparent';
  const fg = selected ? 'var(--action-primary-text)' : tint || 'var(--text-primary)';
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 14px',
        border: `1px solid ${selected ? 'var(--border-strong)' : tint || 'var(--border-default)'}`,
        borderRadius: 'var(--radius-pill)',
        background: bg,
        color: fg,
        font: 'var(--type-body-sm)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
      {onRemove && (
        <button
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            border: 0,
            background: 'transparent',
            color: 'inherit',
            padding: 0,
            margin: '0 -4px 0 2px',
            display: 'inline-flex',
            cursor: 'pointer',
          }}
        >
          <Icon name="x" size={12} />
        </button>
      )}
    </span>
  );
}
