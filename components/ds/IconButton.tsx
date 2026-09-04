'use client';

import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode;
  label: string;
  variant?: 'ghost' | 'outline' | 'filled' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  badge?: ReactNode;
};

export function IconButton({
  children,
  label,
  variant = 'ghost',
  size = 'md',
  badge,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const d = size === 'sm' ? 32 : size === 'lg' ? 52 : 44;

  const vs = {
    ghost: {
      bg: 'transparent',
      fg: hover ? 'var(--text-accent)' : 'var(--text-primary)',
      bc: 'transparent',
    },
    outline: {
      bg: hover ? 'var(--action-primary)' : 'transparent',
      fg: hover ? 'var(--action-primary-text)' : 'var(--text-primary)',
      bc: 'var(--border-strong)',
    },
    filled: {
      bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)',
      fg: 'var(--action-primary-text)',
      bc: 'transparent',
    },
    inverse: {
      bg: 'transparent',
      fg: hover ? 'var(--gold-300)' : 'var(--bone-100)',
      bc: 'transparent',
    },
  }[variant];

  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        width: d,
        height: d,
        borderRadius: '50%',
        border: `1px solid ${vs.bc}`,
        background: vs.bg,
        color: vs.fg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        transition: 'all var(--dur-fast) var(--ease-out)',
        padding: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
      {badge != null && (
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 2,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 999,
            background: 'var(--accent)',
            color: '#fff',
            font: 'var(--type-caption)',
            fontSize: 10,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
