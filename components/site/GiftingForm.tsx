'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Input } from '@/components/ds';
import { CONTACT } from '@/lib/data';
import { useToast } from '@/lib/toast';
import { EMAIL_RE, Textarea, openMail } from './fields';

type Key =
  | 'name'
  | 'email'
  | 'company'
  | 'phone'
  | 'occasion'
  | 'quantity'
  | 'budget'
  | 'date'
  | 'cities'
  | 'message';

/** Field labels from the content handover (P28), in order. Optional fields say so in the label. */
const LABELS: Record<Key, string> = {
  name: 'Full name',
  email: 'Work email',
  company: 'Company',
  phone: 'Phone number (optional)',
  occasion: 'Occasion',
  quantity: 'Approximate quantity',
  budget: 'Budget per gift (optional)',
  date: 'Required date',
  cities: 'Delivery city or cities',
  message: 'Your message',
};

const OPTIONAL = new Set<Key>(['phone', 'budget']);

const EMPTY = Object.fromEntries(Object.keys(LABELS).map((k) => [k, ''])) as Record<Key, string>;

export function GiftingForm() {
  const { toast } = useToast();
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});

  const set = (k: Key) => (ev: { target: { value: string } }) => setV((prev) => ({ ...prev, [k]: ev.target.value }));

  function validate() {
    const e: Partial<Record<Key, string>> = {};
    for (const k of Object.keys(LABELS) as Key[]) {
      if (!OPTIONAL.has(k) && !v[k].trim()) e[k] = `Please enter ${LABELS[k].toLowerCase()}.`;
    }
    if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
    return e;
  }

  const field = (k: Key, extra: Record<string, unknown> = {}) => (
    <Input
      label={LABELS[k]}
      required={!OPTIONAL.has(k)}
      value={v[k]}
      error={errors[k]}
      onChange={set(k)}
      {...extra}
    />
  );

  return (
    <form
      className="stack g5"
      style={{ width: '100%', gap: 20 }}
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        const body = (Object.keys(LABELS) as Key[])
          .filter((k) => k !== 'message' && v[k].trim())
          .map((k) => `${LABELS[k].replace(' (optional)', '')}: ${v[k].trim()}`)
          .concat(['', v.message.trim()])
          .join('\n');
        openMail(CONTACT.email, `Corporate gifting enquiry · ${v.company.trim()}`, body);
        toast({
          tone: 'success',
          title: 'Your email app is opening',
          description: `Send the drafted enquiry to reach ${CONTACT.email}.`,
        });
      }}
    >
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        {field('name', { autoComplete: 'name' })}
        {field('email', { type: 'email', autoComplete: 'email' })}
        {field('company', { autoComplete: 'organization' })}
        {field('phone', { type: 'tel', autoComplete: 'tel' })}
        {field('occasion')}
        {field('quantity', { inputMode: 'numeric' })}
        {field('budget')}
        {field('date', { type: 'date' })}
      </div>
      {field('cities')}
      <Textarea
        label={LABELS.message}
        required
        value={v.message}
        error={errors.message}
        onChange={set('message')}
      />

      <p className="small" style={{ color: 'var(--text-tertiary)' }}>
        We will use these details to respond to your enquiry.{' '}
        <Link href="/policies/privacy-policy">Read our Privacy Policy</Link>. Sending opens your own
        email app; nothing is stored on this site.
      </p>

      <div>
        <Button type="submit">Send Gifting Enquiry</Button>
      </div>
    </form>
  );
}
