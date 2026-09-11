'use client';

import { useState, type CSSProperties, type TextareaHTMLAttributes } from 'react';
import { Field } from '@/components/ds';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hands a composed message to the visitor's own mail client. The site has no
 * mail backend, so a form never claims to have sent anything itself.
 */
export function openMail(to: string, subject: string, body: string) {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The design system has no textarea, so this is one styled to match `Input`:
 * same border, radius, focus shadow and typography, sized for prose.
 */
export function Textarea({
  label,
  hint,
  error,
  required,
  rows = 6,
  style,
  ...rest
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  style?: CSSProperties;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focus, setFocus] = useState(false);
  return (
    <Field label={label} hint={hint} error={error} required={required} style={style}>
      <textarea
        rows={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${
            error ? 'var(--status-error)' : focus ? 'var(--border-strong)' : 'var(--border-default)'
          }`,
          borderRadius: 'var(--radius-xs)',
          background: 'var(--surface-raised)',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'all var(--dur-fast) var(--ease-out)',
          padding: '12px 14px',
          font: 'var(--type-body)',
          color: 'var(--text-primary)',
          outline: 0,
          resize: 'vertical',
          boxSizing: 'border-box',
          width: '100%',
        }}
        {...rest}
      />
    </Field>
  );
}
