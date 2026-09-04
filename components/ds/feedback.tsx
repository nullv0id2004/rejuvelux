'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { IconButton } from './IconButton';

/* --------------------------------------------------------------- Dialog -- */

export function Dialog({
  open,
  onClose,
  eyebrow,
  title,
  children,
  footer,
  width = 520,
  side,
  style,
}: {
  open?: boolean;
  onClose?: () => void;
  eyebrow?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  side?: 'left' | 'right';
  style?: CSSProperties;
}) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  if (!open) return null;

  const panel: CSSProperties = {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-float)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    animation: `rjx-${side ? 'slide' : 'rise'} var(--dur-slow) var(--ease-out)`,
    ...style,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay-scrim)',
        zIndex: 100,
        display: 'flex',
        alignItems: side ? 'stretch' : 'center',
        justifyContent: side === 'right' ? 'flex-end' : side === 'left' ? 'flex-start' : 'center',
        padding: side ? 0 : 24,
      }}
    >
      <style>{`@keyframes rjx-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes rjx-slide{from{transform:translateX(${side === 'left' ? '-' : ''}24px);opacity:0}to{transform:none;opacity:1}}`}</style>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...panel,
          width: side ? width : '100%',
          maxWidth: side ? undefined : width,
          height: side ? '100%' : undefined,
          maxHeight: side ? undefined : '90vh',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '28px 32px 0',
            gap: 16,
          }}
        >
          <div>
            {eyebrow && (
              <div
                style={{
                  font: 'var(--type-eyebrow)',
                  letterSpacing: 'var(--tracking-caps)',
                  textTransform: 'uppercase',
                  color: 'var(--text-accent)',
                  marginBottom: 8,
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && <div style={{ font: 'var(--type-h2)' }}>{title}</div>}
          </div>
          <IconButton label="Close" size="sm" onClick={onClose}>
            <Icon name="x" size={18} />
          </IconButton>
        </div>
        <div
          style={{
            padding: '20px 32px',
            flex: 1,
            overflow: 'auto',
            font: 'var(--type-body)',
            color: 'var(--text-secondary)',
          }}
        >
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: '20px 32px 28px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Toast -- */

const toastIcons: Record<ToastTone, IconName> = {
  neutral: 'leaf',
  success: 'check',
  error: 'x',
  warning: 'minus',
};

export type ToastTone = 'neutral' | 'success' | 'error' | 'warning';

export function Toast({
  title,
  description,
  tone = 'neutral',
  action,
  onDismiss,
  style,
}: {
  title?: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  action?: ReactNode;
  onDismiss?: () => void;
  style?: CSSProperties;
}) {
  const accent = {
    neutral: 'var(--gold-300)',
    success: 'var(--status-success)',
    error: 'var(--status-error)',
    warning: 'var(--status-warning)',
  }[tone];

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        minWidth: 300,
        maxWidth: 420,
        padding: '16px 18px',
        background: 'var(--surface-inverse)',
        color: 'var(--text-inverse)',
        boxShadow: 'var(--shadow-float)',
        ...style,
      }}
    >
      <span style={{ color: accent, display: 'inline-flex', marginTop: 2 }}>
        <Icon name={toastIcons[tone] || 'leaf'} size={16} />
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ font: 'var(--type-label)' }}>{title}</div>
        {description && (
          <div style={{ font: 'var(--type-body-sm)', color: 'var(--ink-300)' }}>{description}</div>
        )}
        {action && <div style={{ marginTop: 6 }}>{action}</div>}
      </div>
      {onDismiss && (
        <button
          aria-label="Dismiss"
          onClick={onDismiss}
          style={{
            border: 0,
            background: 'transparent',
            color: 'var(--ink-400)',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
          }}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

export function ToastStack({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 200,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- Tooltip -- */

export function Tooltip({
  content,
  children,
  side = 'top',
  style,
}: {
  content?: ReactNode;
  children?: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  style?: CSSProperties;
}) {
  const [show, setShow] = useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translate(-50%,-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translate(-50%,8px)' },
    left: { right: '100%', top: '50%', transform: 'translate(-8px,-50%)' },
    right: { left: '100%', top: '50%', transform: 'translate(8px,-50%)' },
  }[side];

  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: 'absolute',
          ...pos,
          background: 'var(--ink-900)',
          color: 'var(--bone-100)',
          font: 'var(--type-caption)',
          padding: '6px 10px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: show ? 1 : 0,
          transition: 'opacity var(--dur-fast) var(--ease-out)',
          zIndex: 50,
        }}
      >
        {content}
      </span>
    </span>
  );
}
