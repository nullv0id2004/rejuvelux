'use client';

import { useEffect, useState } from 'react';
import { Button, Icon, IconButton, Input } from '@/components/ds';
import { useToast } from '@/lib/toast';
import { Eyebrow } from './primitives';

const SHOWN_KEY = 'rjx-popup-shown';
const DELAY_MS = 45_000;
const SCROLL_FRACTION = 0.6;

/**
 * The Flush Letter capture. Exit intent on pointer devices; 45 seconds or 60%
 * scroll otherwise. Shows at most once per browser.
 */
export function Popup() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  useEffect(() => {
    let shown = false;
    try {
      shown = localStorage.getItem(SHOWN_KEY) === '1';
    } catch {
      /* storage unavailable — treat as not yet shown */
    }
    if (shown) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      setOpen(true);
      try {
        localStorage.setItem(SHOWN_KEY, '1');
      } catch {
        /* storage unavailable — it may show again next visit */
      }
    };

    const timer = setTimeout(fire, DELAY_MS);
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable > SCROLL_FRACTION) fire();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  if (!open) return null;

  return (
    <div className="pop" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="The Flush Letter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="between">
          <Eyebrow>The Flush Letter</Eyebrow>
          <IconButton label="Close" size="sm" onClick={() => setOpen(false)}>
            <Icon name="x" size={18} />
          </IconButton>
        </div>
        <h2 className="h2">Hear when the next flush is picked.</h2>
        <p className="small">
          Flush notices. Brew notes. Garden reports. Lot releases. Four or five letters a year;
          nothing else.
        </p>
        <form
          className="stack g3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes('@')) {
              toast({ tone: 'error', title: 'Enter a valid email' });
              return;
            }
            toast({ tone: 'success', title: 'Subscribed', description: email });
            setOpen(false);
          }}
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
          <Button size="lg" fullWidth type="submit">
            Tell me when it&rsquo;s picked
          </Button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 0,
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              font: 'var(--type-caption)',
              padding: 8,
              minHeight: 44,
            }}
          >
            I&rsquo;ll find out on my own
          </button>
        </form>
      </div>
    </div>
  );
}
