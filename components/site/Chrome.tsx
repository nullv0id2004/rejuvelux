'use client';

import type { ReactNode } from 'react';
import { Button, Toast, ToastStack } from '@/components/ds';
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

/** Announcement bar, nav, page, footer, plus the cart drawer, popup and toasts. */
export function Chrome({ children }: { children: ReactNode }) {
  return (
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
  );
}
