'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button, Input, Select } from '@/components/ds';
import { CONTACT } from '@/lib/data';
import { useToast } from '@/lib/toast';
import { EMAIL_RE, Textarea, openMail } from './fields';

/** Topic options from the content handover (P30). */
const TOPICS = [
  'Choosing a tea',
  'Product and brewing question',
  'Existing order',
  'Return or cancellation',
  'Gifting',
  'Other',
];

/** `?topic=` values used by enquiry buttons across the site: [topic, item asked about]. */
const TOPIC_PARAMS: Record<string, [string, string]> = {
  ctc: ['Product and brewing question', 'CTC Tea'],
  ube: ['Product and brewing question', 'Ube'],
  'tea-gift-set': ['Gifting', 'Complete Tasting Gift Set'],
  'complete-tasting': ['Gifting', 'Complete Tasting Gift Set'],
  'heritage-duo': ['Gifting', 'Heritage Duo Gift Set'],
  'vibrant-duo': ['Gifting', 'Vibrant Duo Gift Set'],
  'matcha-box': ['Gifting', 'Matcha Tea Box'],
  'matcha-ritual-set': ['Gifting', 'Matcha Ritual Set'],
  'retro-cup': ['Product and brewing question', 'Retro Cup with Lid'],
  retail: ['Other', 'Retail and event availability'],
};

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export function ContactForm() {
  const params = useSearchParams();
  const preset = TOPIC_PARAMS[params.get('topic') ?? ''];
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(preset?.[0] ?? TOPICS[0]);
  const [order, setOrder] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email address.';
    if (!message.trim()) e.message = 'Please tell us how we can help.';
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
        if (Object.keys(e).length) return;

        const subject = [topic, preset?.[1], order.trim() && `Order ${order.trim()}`]
          .filter(Boolean)
          .join(' · ');
        const body = [
          message.trim(),
          '',
          `${name.trim()} (${email.trim()})`,
          order.trim() ? `Order number: ${order.trim()}` : '',
        ]
          .filter((line, i) => line || i === 1)
          .join('\n');
        openMail(CONTACT.email, subject, body);
        toast({
          tone: 'success',
          title: 'Your email app is opening',
          description: `Send the drafted message to reach ${CONTACT.email}.`,
        });
      }}
    >
      {preset && (
        <p className="cap" style={{ color: 'var(--text-accent)' }}>
          Enquiring about: {preset[1]}
        </p>
      )}

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        <Input
          label="Name"
          required
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <Input
          label="Email"
          required
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        <Select label="Topic" options={TOPICS} value={topic} onChange={(ev) => setTopic(ev.target.value)} />
        <Input label="Order number (optional)" value={order} onChange={(ev) => setOrder(ev.target.value)} />
      </div>

      <Textarea
        label="Message"
        required
        value={message}
        error={errors.message}
        onChange={(ev) => setMessage(ev.target.value)}
      />

      <p className="small" style={{ color: 'var(--text-tertiary)' }}>
        Your details will be used to respond to your message.{' '}
        <Link href="/policies/privacy-policy">Read our Privacy Policy</Link>. Sending opens your own
        email app; nothing is stored on this site.
      </p>

      <div>
        <Button type="submit">Send Message</Button>
      </div>
    </form>
  );
}
