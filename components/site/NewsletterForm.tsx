'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { Button, Input } from '@/components/ds';
import { useToast } from '@/lib/toast';
import { EMAIL_RE } from './fields';

/**
 * The Journal sign-up, shared by the footer and the homepage band (content
 * handover, newsletter module). The marketing choice is separate and unticked.
 * There is no subscription backend yet; this confirms on the page only.
 */
export function NewsletterForm({ compact }: { compact?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const { toast } = useToast();

  return (
    <form
      className="stack g3"
      style={{ width: '100%' }}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!EMAIL_RE.test(email.trim())) {
          toast({ tone: 'error', title: 'Please enter a valid email address.' });
          return;
        }
        toast({
          tone: 'success',
          title: 'You’re on the list.',
          description: 'We look forward to sharing the next chapter.',
        });
        setEmail('');
        setOptIn(false);
      }}
    >
      <div className="nl-form">
        <div data-theme="dark">
          <Input
            size={compact ? 'sm' : undefined}
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button size={compact ? 'sm' : undefined} variant="inverse" type="submit">
          Join the Journal
        </Button>
      </div>
      <label className="nl-opt" htmlFor={id}>
        <input id={id} type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
        <span>
          I would like to receive RejuveLuxe stories, product news and gifting updates by email. I can
          unsubscribe at any time.
        </span>
      </label>
      <p className="cap nl-privacy">
        <Link href="/policies/privacy-policy">Read our Privacy Policy</Link>
      </p>
    </form>
  );
}
