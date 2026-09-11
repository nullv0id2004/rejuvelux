import Link from 'next/link';
import { CONTACT } from '@/lib/data';
import { NewsletterForm } from './NewsletterForm';
import { Logo } from './primitives';

/** Footer columns from the content handover, in its order. */
const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Shop',
    links: [
      { href: '/shop', label: 'All Tea' },
      { href: '/collections/assam-collection', label: 'The Assam Collection' },
      { href: '/collections/gift-sets', label: 'Gift Sets' },
      { href: '/collections/teaware', label: 'Teaware' },
    ],
  },
  {
    heading: 'Discover',
    links: [
      { href: '/our-story', label: 'Our Story' },
      { href: '/assam-origin', label: 'Assam Origin' },
      { href: '/craft', label: 'The Craft' },
      { href: '/tea-rituals', label: 'Tea Rituals' },
      { href: '/journal', label: 'Journal' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQs' },
      { href: '/track-order', label: 'Track an Order' },
      { href: '/where-to-find-us', label: 'Where to Find Us' },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { href: '/policies/shipping-policy', label: 'Shipping' },
      { href: '/policies/refund-policy', label: 'Returns and Cancellations' },
      { href: '/policies/privacy-policy', label: 'Privacy' },
      { href: '/policies/terms-of-service', label: 'Terms of Service' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap stack g8">
        <div className="fgrid">
          <div className="stack g5" style={{ gap: 20 }}>
            <Logo width={148} />
            <p className="small" style={{ color: 'var(--ink-400)', maxWidth: 280 }}>
              RejuveLuxe. Exceptional Assam tea, thoughtfully selected for the moments you have earned.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} className="stack g2" aria-label={col.heading}>
              <div className="eyebrow">{col.heading}</div>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="stack g4">
            <div className="eyebrow">The Journal</div>
            <p className="h3" style={{ color: 'var(--bone-100)' }}>
              A little more time for tea.
            </p>
            <p className="small" style={{ color: 'var(--ink-400)' }}>
              Join the RejuveLuxe journal for tea stories, preparation guides and considered gifting ideas.
            </p>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="stack g2">
          <p className="cap flegal">© {new Date().getFullYear()} RejuveLuxe. All rights reserved.</p>
          <p className="cap flegal">
            Packed and marketed by {CONTACT.entity}, {CONTACT.address} · FSSAI Lic. No. {CONTACT.fssai} ·
            Consumer support: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{' '}
            <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
