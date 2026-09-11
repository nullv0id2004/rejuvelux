import type { Metadata, Viewport } from 'next';
import { Cinzel, Figtree, Playfair_Display } from 'next/font/google';
import { Chrome } from '@/components/site/Chrome';
import { listProducts } from '@/lib/catalogue';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import './globals.css';

// Substitutes for the packaging faces — see styles/tokens/fonts.css.
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});
const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-figtree',
  display: 'swap',
});

/**
 * Absolute base for Open Graph URLs. Social scrapers will not resolve a
 * relative image path, so this has to be the real deployed origin: set
 * NEXT_PUBLIC_SITE_URL once a custom domain exists, otherwise Vercel's own
 * production URL is used, and local development falls back to localhost.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

const OG_IMAGE = {
  url: '/assets/og.jpg',
  width: 1200,
  height: 630,
  alt: 'RejuveLuxe · Earned, not indulged. Single-origin Assam tea.',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RejuveLuxe · Earned, not indulged',
    template: '%s · RejuveLuxe',
  },
  description:
    "Single-origin Assam tea. One garden, one flush, one lot: printed on every tin. India doesn't need better tea; India needs better access to its best tea.",
  openGraph: {
    type: 'website',
    siteName: 'RejuveLuxe',
    title: 'RejuveLuxe · Earned, not indulged',
    description: 'Single-origin Assam tea. One garden, one flush, one lot.',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RejuveLuxe · Earned, not indulged',
    description: 'Single-origin Assam tea. One garden, one flush, one lot.',
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EEE4' },
    { media: '(prefers-color-scheme: dark)', color: '#141311' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The single catalogue read for the whole tree. Every consumer below is a
  // client component, so the server resolves it here and Chrome provides it;
  // React cache() dedupes this against the page's own call in one render.
  const catalogue = await listProducts();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cinzel.variable} ${playfair.variable} ${figtree.variable}`}
    >
      <head>
        {/* Applies the stored theme before first paint so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Chrome catalogue={catalogue}>{children}</Chrome>
      </body>
    </html>
  );
}
