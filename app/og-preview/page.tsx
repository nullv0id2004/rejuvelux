import { Logo } from '@/components/site/primitives';
import { listProducts } from '@/lib/catalogue';
import { rangeWordCap } from '@/lib/data';

/**
 * Source for the static Open Graph card. Rendered once at 1200×630 and
 * screenshotted into `public/assets/og.jpg`; this route exists so the card is
 * built from the site's own tokens and self-hosted faces rather than
 * reconstructed by hand. Not linked from anywhere and excluded from indexing.
 */
export const metadata = { robots: { index: false, follow: false } };

export default async function OgPreview() {
  const products = await listProducts();
  const rangeCap = rangeWordCap(products.length);
  return (
    <div
      id="og-card"
      style={{
        width: 1200,
        height: 630,
        background: 'var(--ink-900)',
        color: 'var(--bone-100)',
        display: 'flex',
        alignItems: 'center',
        gap: 64,
        padding: '0 80px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Logo width={300} priority />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, minWidth: 0 }}>
        <div
          style={{
            font: 'var(--type-eyebrow)',
            fontSize: 18,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-300)',
          }}
        >
          Single-origin Assam
        </div>

        <h1
          style={{
            font: 'var(--type-display)',
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            margin: 0,
            color: 'var(--bone-100)',
          }}
        >
          Earned,{' '}
          <em style={{ color: 'var(--gold-300)' }}>not indulged.</em>
        </h1>

        <div style={{ height: 1, background: 'var(--ink-700)', width: 420 }} />

        <p
          style={{
            font: 'var(--type-body-lg)',
            fontSize: 24,
            lineHeight: 1.4,
            margin: 0,
            color: 'var(--ink-300)',
          }}
        >
          One garden. {rangeCap} expressions.
          <br />
          Grade, lot and pluck month on every tin.
        </p>
      </div>
    </div>
  );
}
