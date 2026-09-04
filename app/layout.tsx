import type { Metadata, Viewport } from 'next';
import { Cinzel, Figtree, Playfair_Display } from 'next/font/google';
import { Chrome } from '@/components/site/Chrome';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://rejuveluxe.example'),
  title: {
    default: 'RejuveLuxe — Earned, not indulged',
    template: '%s · RejuveLuxe',
  },
  description:
    "Single-origin Assam tea. One garden, one flush, one lot — printed on every tin. India doesn't need better tea; India needs better access to its best tea.",
  openGraph: {
    type: 'website',
    siteName: 'RejuveLuxe',
    title: 'RejuveLuxe — Earned, not indulged',
    description: 'Single-origin Assam tea. One garden, one flush, one lot.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EEE4' },
    { media: '(prefers-color-scheme: dark)', color: '#141311' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
