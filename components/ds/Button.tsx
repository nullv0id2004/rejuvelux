'use client';

import Link from 'next/link';
import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

const base: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  letterSpacing: 'var(--tracking-caps)',
  textTransform: 'uppercase',
  border: '1px solid transparent',
  borderRadius: 'var(--radius-xs)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  transition:
    'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), opacity var(--dur-fast)',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  boxSizing: 'border-box',
};

const sizes = {
  sm: { height: 'var(--control-h-sm)', padding: '0 18px', fontSize: 'var(--text-2xs)' },
  md: { height: 'var(--control-h-md)', padding: '0 26px', fontSize: 'var(--text-xs)' },
  lg: { height: 'var(--control-h-lg)', padding: '0 34px', fontSize: 'var(--text-sm)' },
} satisfies Record<string, CSSProperties>;

const variants = {
  primary: {
    bg: 'var(--action-primary)',
    fg: 'var(--action-primary-text)',
    bc: 'var(--action-primary)',
    hbg: 'var(--action-primary-hover)',
    hfg: 'var(--action-primary-text)',
    hbc: 'var(--action-primary-hover)',
  },
  outline: {
    bg: 'transparent',
    fg: 'var(--text-primary)',
    bc: 'var(--border-strong)',
    hbg: 'var(--action-primary)',
    hfg: 'var(--action-primary-text)',
    hbc: 'var(--action-primary)',
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--text-primary)',
    bc: 'transparent',
    hbg: 'transparent',
    hfg: 'var(--text-accent)',
    hbc: 'transparent',
  },
  gold: {
    bg: 'var(--accent)',
    fg: '#fff',
    bc: 'var(--accent)',
    hbg: 'var(--accent-hover)',
    hfg: '#fff',
    hbc: 'var(--accent-hover)',
  },
  inverse: {
    bg: 'var(--bone-100)',
    fg: 'var(--ink-900)',
    bc: 'var(--bone-100)',
    hbg: 'var(--gold-200)',
    hfg: 'var(--ink-900)',
    hbc: 'var(--gold-200)',
  },
};

export type ButtonSize = keyof typeof sizes;
export type ButtonVariant = keyof typeof variants;

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /**
   * Renders the button as a link. The bundle's `as` prop generalised this;
   * here it is narrowed to the only case the site needs, so navigation stays
   * a real anchor (middle-click, open in new tab, crawlable).
   */
  href?: string;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  fullWidth,
  iconLeft,
  iconRight,
  href,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const v = variants[variant] || variants.primary;

  const s: CSSProperties = {
    ...base,
    ...sizes[size],
    background: hover && !disabled ? v.hbg : v.bg,
    color: hover && !disabled ? v.hfg : v.fg,
    borderColor: hover && !disabled ? v.hbc : v.bc,
    opacity: disabled ? 'var(--opacity-disabled)' : down ? 'var(--opacity-hover)' : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : undefined,
    ...(variant === 'ghost' ? { padding: '0 4px' } : null),
    ...style,
  };

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      setHover(true);
      onMouseEnter?.(e as React.MouseEvent<HTMLButtonElement>);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      setHover(false);
      setDown(false);
      onMouseLeave?.(e as React.MouseEvent<HTMLButtonElement>);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
  };

  const body = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if (href) {
    const { type: _type, ...anchorRest } = rest;
    return (
      <Link
        href={href}
        style={s}
        aria-disabled={disabled}
        {...hoverHandlers}
        {...(anchorRest as Record<string, unknown>)}
      >
        {body}
      </Link>
    );
  }

  return (
    <button style={s} disabled={disabled} aria-disabled={disabled} {...hoverHandlers} {...rest}>
      {body}
    </button>
  );
}
