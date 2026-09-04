'use client';

import {
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { Icon } from './Icon';

type ControlSize = 'sm' | 'md' | 'lg';

const controlHeight = (size: ControlSize) =>
  size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';

/* ---------------------------------------------------------------- Field -- */

export function Field({
  label,
  hint,
  error,
  required,
  children,
  style,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, font: 'var(--type-body)', ...style }}>
      {label && (
        <span
          style={{
            font: 'var(--type-eyebrow)',
            letterSpacing: 'var(--tracking-caps)',
            textTransform: 'uppercase',
            color: error ? 'var(--status-error)' : 'var(--text-secondary)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--accent)' }}> *</span>}
        </span>
      )}
      {children}
      {(error || hint) && (
        <span
          style={{
            font: 'var(--type-caption)',
            color: error ? 'var(--status-error)' : 'var(--text-tertiary)',
          }}
        >
          {error || hint}
        </span>
      )}
    </label>
  );
}

/* ---------------------------------------------------------------- Input -- */

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  size?: ControlSize;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export function Input({
  label,
  hint,
  error,
  required,
  size = 'md',
  prefix,
  suffix,
  style,
  disabled,
  ...rest
}: InputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <Field label={label} hint={hint} error={error} required={required} style={style}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          height: controlHeight(size),
          border: `1px solid ${
            error ? 'var(--status-error)' : focus ? 'var(--border-strong)' : 'var(--border-default)'
          }`,
          borderRadius: 'var(--radius-xs)',
          background: disabled ? 'var(--bone-300)' : 'var(--surface-raised)',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'all var(--dur-fast) var(--ease-out)',
          padding: '0 14px',
          gap: 10,
          opacity: disabled ? 'var(--opacity-disabled)' : 1,
          boxSizing: 'border-box',
        }}
      >
        {prefix && (
          <span style={{ color: 'var(--text-tertiary)', font: 'var(--type-body-sm)' }}>{prefix}</span>
        )}
        <input
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 0,
            background: 'transparent',
            font: 'var(--type-body)',
            color: 'var(--text-primary)',
            padding: 0,
          }}
          {...rest}
        />
        {suffix && <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex' }}>{suffix}</span>}
      </span>
    </Field>
  );
}

/* --------------------------------------------------------------- Select -- */

export type SelectOption = string | { value: string; label: string };

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  options?: SelectOption[];
  size?: ControlSize;
};

export function Select({
  label,
  hint,
  error,
  required,
  options = [],
  size = 'md',
  style,
  disabled,
  ...rest
}: SelectProps) {
  const [focus, setFocus] = useState(false);
  return (
    <Field label={label} hint={hint} error={error} required={required} style={style}>
      <span
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: controlHeight(size),
          border: `1px solid ${
            error ? 'var(--status-error)' : focus ? 'var(--border-strong)' : 'var(--border-default)'
          }`,
          borderRadius: 'var(--radius-xs)',
          background: 'var(--surface-raised)',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'all var(--dur-fast) var(--ease-out)',
          opacity: disabled ? 'var(--opacity-disabled)' : 1,
          boxSizing: 'border-box',
        }}
      >
        <select
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            width: '100%',
            height: '100%',
            border: 0,
            outline: 0,
            background: 'transparent',
            font: 'var(--type-body)',
            color: 'var(--text-primary)',
            padding: '0 40px 0 14px',
            cursor: 'pointer',
          }}
          {...rest}
        >
          {options.map((o) =>
            typeof o === 'string' ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ),
          )}
        </select>
        <span
          style={{
            position: 'absolute',
            right: 12,
            pointerEvents: 'none',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
          }}
        >
          <Icon name="chevron-down" size={16} />
        </span>
      </span>
    </Field>
  );
}

/* ---------------------------------------------------------------- Radio -- */

export function Radio({
  name,
  value,
  label,
  description,
  checked,
  onChange,
  disabled,
  style,
}: {
  name?: string;
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        gap: 12,
        alignItems: 'flex-start',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        font: 'var(--type-body)',
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(value)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span
        style={{
          width: 18,
          height: 18,
          flex: 'none',
          marginTop: 2,
          borderRadius: '50%',
          border: `1px solid ${checked ? 'var(--border-strong)' : 'var(--border-default)'}`,
          background: 'var(--surface-raised)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--dur-fast) var(--ease-out)',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--action-primary)',
            transform: checked ? 'scale(1)' : 'scale(0)',
            transition: 'transform var(--dur-fast) var(--ease-out)',
          }}
        />
      </span>
      <span>
        <span>{label}</span>
        {description && (
          <span
            style={{
              display: 'block',
              font: 'var(--type-caption)',
              color: 'var(--text-tertiary)',
              marginTop: 2,
            }}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  direction = 'column',
  style,
}: {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: { value: string; label?: ReactNode; description?: ReactNode; disabled?: boolean }[];
  direction?: 'row' | 'column';
  style?: CSSProperties;
}) {
  return (
    <div
      role="radiogroup"
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: direction === 'row' ? 24 : 12,
        ...style,
      }}
    >
      {options.map((o) => (
        <Radio
          key={o.value}
          name={name}
          value={o.value}
          label={o.label}
          description={o.description}
          checked={value === o.value}
          onChange={onChange}
          disabled={o.disabled}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- Checkbox -- */

export function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  description,
  style,
}: {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  description?: ReactNode;
  style?: CSSProperties;
}) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange?.(!on);
  };
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      style={{
        display: 'inline-flex',
        gap: 12,
        alignItems: 'flex-start',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        font: 'var(--type-body)',
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      <span
        role="checkbox"
        aria-checked={on}
        style={{
          width: 18,
          height: 18,
          flex: 'none',
          marginTop: 2,
          border: `1px solid ${on ? 'var(--border-strong)' : 'var(--border-default)'}`,
          background: on ? 'var(--action-primary)' : 'var(--surface-raised)',
          color: 'var(--bone-100)',
          borderRadius: 'var(--radius-xs)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--dur-fast) var(--ease-out)',
          boxSizing: 'border-box',
        }}
      >
        {on && <Icon name="check" size={12} strokeWidth={2} />}
      </span>
      <span>
        <span>{label}</span>
        {description && (
          <span
            style={{
              display: 'block',
              font: 'var(--type-caption)',
              color: 'var(--text-tertiary)',
              marginTop: 2,
            }}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

/* --------------------------------------------------------------- Switch -- */

export function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  style,
}: {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange?.(!on);
  };
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      style={{
        display: 'inline-flex',
        gap: 12,
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        font: 'var(--type-body)',
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      <span
        role="switch"
        aria-checked={on}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          border: `1px solid ${on ? 'var(--border-strong)' : 'var(--border-default)'}`,
          background: on ? 'var(--action-primary)' : 'var(--bone-300)',
          position: 'relative',
          transition: 'all var(--dur-fast) var(--ease-out)',
          flex: 'none',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: on ? 'var(--gold-300)' : 'var(--surface-raised)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'left var(--dur-fast) var(--ease-out), background var(--dur-fast)',
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
