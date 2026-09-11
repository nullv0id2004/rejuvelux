import type { Metadata } from 'next';
import { Button } from '@/components/ds';
import { ContactForm } from '@/components/site/ContactForm';
import { Evidence, Eyebrow } from '@/components/site/primitives';
import { CONTACT } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to reach RejuveLuxe.',
};

export default function ContactPage() {
  return (
    <main>
      <section className="wrap sec">
        <div className="editorial" style={{ alignItems: 'flex-start', gap: 32 }}>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
            Reach the people who packed it.
          </h1>
          <p className="lead">
            Order queries, returns, and anything about the leaf in the tin. One inbox, one number,
            answered during business hours, India time.
          </p>

          <div className="row g6" style={{ flexWrap: 'wrap' }}>
            <Button href={`mailto:${CONTACT.email}`}>Email us</Button>
            <Button variant="outline" href={`tel:${CONTACT.phoneHref}`}>
              {CONTACT.phone}
            </Button>
          </div>

          <ContactForm />

          <Evidence
            rows={[
              ['Consumer support', CONTACT.email],
              ['Phone', CONTACT.phone],
              ['FSSAI Lic. No.', CONTACT.fssai],
              ['Packed & marketed by', CONTACT.entity],
              ['Address', CONTACT.address],
            ]}
            style={{ width: '100%' }}
          />

          <Button variant="outline" href="/">
            Back to the collection
          </Button>
        </div>
      </section>
    </main>
  );
}
