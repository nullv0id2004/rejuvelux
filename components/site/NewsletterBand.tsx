'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ds';
import { useToast } from '@/lib/toast';
import { Eyebrow } from './primitives';

/** Dark full-bleed capture band that closes the homepage. */
export function NewsletterBand() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  return (
    <section data-theme="dark" style={{ background: 'var(--ink-900)', color: 'var(--bone-100)' }}>
      <div className="wrap" style={{ padding: '96px var(--gutter-lg)' }}>
        <div
          className="stack g6"
          style={{ alignItems: 'center', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}
        >
          <Eyebrow style={{ color: 'var(--gold-300)' }}>The Flush Letter</Eyebrow>
          <h2 className="h1 it" style={{ color: 'var(--bone-100)' }}>
            Hear when the next flush is picked.
          </h2>
          <p className="lead" style={{ color: 'var(--ink-300)' }}>
            Flush notices. Brew notes. Garden reports. Lot releases. Four or five letters a year;
            nothing else.
          </p>
          <form
            className="nl-form"
            style={{ width: '100%', maxWidth: 480 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes('@')) {
                toast({ tone: 'error', title: 'Enter a valid email' });
                return;
              }
              toast({ tone: 'success', title: 'Subscribed', description: email });
              setEmail('');
            }}
          >
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
              />
            </div>
            <Button variant="inverse" type="submit">
              Join
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
