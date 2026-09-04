'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

export type TabItem = { value: string; label: ReactNode };

export function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'pill',
  inverse,
  style,
}: {
  items?: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'pill' | 'underline';
  inverse?: boolean;
  style?: CSSProperties;
}) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const cur = value ?? inner;
  const set = (v: string) => {
    setInner(v);
    onChange?.(v);
  };

  const fg = inverse ? 'var(--bone-100)' : 'var(--text-primary)';
  const bc = inverse ? 'var(--ink-600)' : 'var(--border-default)';

  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: 32,
          borderBottom: `1px solid ${inverse ? 'var(--ink-700)' : 'var(--border-subtle)'}`,
          ...style,
        }}
      >
        {items.map((it) => {
          const on = it.value === cur;
          return (
            <button
              key={it.value}
              role="tab"
              aria-selected={on}
              onClick={() => set(it.value)}
              style={{
                background: 'transparent',
                border: 0,
                borderBottom: `1px solid ${
                  on ? (inverse ? 'var(--gold-300)' : 'var(--border-strong)') : 'transparent'
                }`,
                marginBottom: -1,
                padding: '12px 0',
                font: 'var(--type-eyebrow)',
                letterSpacing: 'var(--tracking-caps)',
                textTransform: 'uppercase',
                color: on ? fg : inverse ? 'var(--ink-400)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all var(--dur-fast) var(--ease-out)',
              }}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        border: `1px solid ${bc}`,
        borderRadius: 'var(--radius-pill)',
        padding: 3,
        gap: 2,
        ...style,
      }}
    >
      {items.map((it) => {
        const on = it.value === cur;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={on}
            onClick={() => set(it.value)}
            style={{
              height: 30,
              padding: '0 16px',
              borderRadius: 'var(--radius-pill)',
              border: 0,
              background: on
                ? inverse
                  ? 'var(--bone-100)'
                  : 'var(--action-primary)'
                : 'transparent',
              color: on ? (inverse ? 'var(--ink-900)' : 'var(--action-primary-text)') : fg,
              font: 'var(--type-eyebrow)',
              letterSpacing: 'var(--tracking-caps)',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all var(--dur-fast) var(--ease-out)',
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
