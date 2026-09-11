'use client';

import { useState, type CSSProperties } from 'react';
import { Button, Field, Input, Select } from '@/components/ds';
import { CONTACT } from '@/lib/data';
import { useToast } from '@/lib/toast';

/**
 * Consumer support reasons, ordered by how often a tea shop actually gets them.
 * Trade enquiries are deliberately absent — this form is for customers.
 */
const REASONS = [
  'Where is my order?',
  'Damaged or wrong item',
  'Return or refund',
  'Change or cancel an order',
  'Product or brewing question',
  'Something else',
];

/** Reasons that need an order number to be answerable. */
const ORDER_REASONS = new Set([
  'Where is my order?',
  'Damaged or wrong item',
  'Return or refund',
  'Change or cancel an order',
]);

/**
 * The design system has no textarea, so this is one styled to match `Input`:
 * same border, radius, focus shadow and typography, sized for prose.
 */
function Textarea({
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
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
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

type Errors = Partial<Record<'name' | 'email' | 'order' | 'message', string>>;

export function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const [order, setOrder] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const needsOrder = ORDER_REASONS.has(reason);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Tell us who you are.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Enter a valid email address.';
    }
    if (needsOrder && !order.trim()) {
      e.order = 'We need the order number to look this up.';
    }
    if (message.trim().length < 10) {
      e.message = 'A little more detail, please — ten characters or more.';
    }
    return e;
  }

  return (
    <form
      className="stack g5"
      style={{ width: '100%', gap: 20 }}
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) {
          toast({ tone: 'error', title: 'Check the highlighted fields' });
          return;
        }

        const lines = [
          message.trim(),
          '',
          `— ${name.trim()} (${email.trim()})`,
          needsOrder ? `Order: ${order.trim()}` : '',
        ].filter(Boolean);

        const subject = needsOrder ? `${reason} — order ${order.trim()}` : reason;
        window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(lines.join('\n'))}`;

        toast({
          tone: 'success',
          title: 'Opening your mail app',
          description: `Send the drafted message to ${CONTACT.email}.`,
        });
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
        }}
      >
        <Input
          label="Name"
          required
          autoComplete="name"
          placeholder="Your name"
          value={name}
          error={errors.name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <Input
          label="Email"
          required
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          hint="The address you ordered with, if you have one."
          value={email}
          error={errors.email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
        }}
      >
        <Select
          label="How can we help?"
          options={REASONS}
          value={reason}
          onChange={(ev) => {
            setReason(ev.target.value);
            setErrors((prev) => ({ ...prev, order: undefined }));
          }}
        />
        {needsOrder && (
          <Input
            label="Order number"
            required
            inputMode="numeric"
            placeholder="RJL-00000"
            hint="On your confirmation email."
            value={order}
            error={errors.order}
            onChange={(ev) => setOrder(ev.target.value)}
          />
        )}
      </div>

      <Textarea
        label="Message"
        required
        placeholder={
          needsOrder
            ? 'What went wrong, and what would put it right.'
            : 'Tell us what you need — tin, lot, or brew.'
        }
        hint="Sends through your own mail app — nothing is stored on this site."
        value={message}
        error={errors.message}
        onChange={(ev) => setMessage(ev.target.value)}
      />

      <div>
        <Button type="submit">Send message</Button>
      </div>
    </form>
  );
}
