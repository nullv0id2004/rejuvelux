'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button, Toast, ToastStack } from '@/components/ds';
import type { CatalogueProduct } from '@/lib/catalogue';
import { CatalogueProvider } from '@/lib/catalogue-context';
import { CartProvider, useCart } from '@/lib/cart';
import { ThemeProvider } from '@/lib/theme';
import { ToastProvider, useToast } from '@/lib/toast';
import { Announcement } from './Announcement';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { Nav } from './Nav';
import { Popup } from './Popup';

function Toasts() {
  const { toasts, dismiss } = useToast();
  const { open, setOpen } = useCart();
  return (
    // Shift clear of the cart drawer while it is open, so a toast never covers
    // the Checkout button.
    <ToastStack
      style={{
        right: open ? 'min(444px, calc(100vw - 24px))' : 24,
        transition: 'right var(--dur-base) var(--ease-out)',
      }}
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          tone={t.tone}
          title={t.title}
          description={t.description}
          onDismiss={() => dismiss(t.id)}
          action={
            t.cartAction ? (
              <Button variant="inverse" size="sm" onClick={() => setOpen(true)}>
                View cart
              </Button>
            ) : null
          }
        />
      ))}
    </ToastStack>
  );
}

/**
 * Announcement bar, nav, page, footer, plus the cart drawer, popup and toasts.
 *
 * `catalogue` is resolved once by the root layout — a server component — and
 * provided from here, because every consumer below (nav, footer, cart drawer,
 * showcase) is a client component and cannot query the database itself.
 */
export function Chrome({
  catalogue,
  children,
}: {
  catalogue: CatalogueProduct[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  // The admin is its own surface (features/admin.md §6.6, "route-group
  // isolation"): it must not render inside the shop's nav, footer, cart drawer
  // and popup, and it needs none of the providers — its layout carries its own
  // chrome. The theme still applies, because the pre-paint script in the root
  // layout sets `data-theme` on <html> before anything here runs.
  if (pathname.startsWith('/admin')) return <>{children}</>;

  return (
    <CatalogueProvider catalogue={catalogue}>
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <div className="rjx-app">
              <Announcement />
              <Nav />
              <div id="main">{children}</div>
              <Footer />
              <CartDrawer />
              <Popup />
              <Toasts />
            </div>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </CatalogueProvider>
  );
}
