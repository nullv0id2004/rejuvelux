'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Input } from '@/components/ds';
import { useCatalogue } from '@/lib/catalogue-context';
import { CONTACT } from '@/lib/data';
import { useToast } from '@/lib/toast';
import { Logo } from './primitives';

export function Footer() {
  const catalogue = useCatalogue();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  return (
    <footer className="footer">
      <div className="wrap stack g8">
        <div className="fgrid">
          <div className="stack g5" style={{ gap: 20 }}>
            <Logo width={148} />
            <p className="small" style={{ color: 'var(--ink-400)', maxWidth: 280 }}>
              Single-origin Assam. One garden, one flush, one lot: printed on every tin.
            </p>
          </div>

          <div className="stack g2">
            <div className="eyebrow">Shop</div>
            {catalogue.map((p) => (
              <Link key={p.slug} href={`/shop/${p.slug}`}>
                {p.name}
              </Link>
            ))}
          </div>

          <div className="stack g2">
            <div className="eyebrow">House</div>
            <Link href="/garden">The Garden</Link>
            <Link href="/craft">The Craft</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="stack g2">
            <div className="eyebrow">Contact</div>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
          </div>

          <div className="stack g2">
            <div className="eyebrow">Design</div>
            <Link href="/specs">Component sheet</Link>
            <Link href="/alt-home">Homepage, brief order</Link>
          </div>

          <div className="stack g4">
            <div className="eyebrow">The Flush Letter</div>
            <p className="small" style={{ color: 'var(--ink-400)' }}>
              Flush notices. Brew notes. Garden reports. Lot releases.
            </p>
            <form
              className="nl-form"
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
              <div data-theme="dark">
                <Input
                  size="sm"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email"
                />
              </div>
              <Button size="sm" variant="inverse" type="submit">
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="between wrapm" style={{ gap: 12 }}>
          <p className="cap" style={{ color: 'var(--ink-500)' }}>
            © 2026 RejuveLuxe · Packed &amp; marketed by {CONTACT.entity}, {CONTACT.address} · FSSAI
            Lic. No. {CONTACT.fssai}
          </p>
          <div className="row g6">
            <Link href="/contact">Instagram</Link>
            <Link href="/contact">YouTube</Link>
            <Link href="/contact">Privacy</Link>
            <Link href="/contact">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
