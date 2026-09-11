'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Button, Dialog, Icon } from '@/components/ds';
import { useCatalogue } from '@/lib/catalogue-context';
import { FREE_SHIPPING_AT, rangeWordCap, SLOT } from '@/lib/data';

/** ₹ with Indian grouping, no decimals. */
const inr = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
import { useCart } from '@/lib/cart';
import { useToast } from '@/lib/toast';
import { Ph, TinBox } from './primitives';

export function CartDrawer() {
  const { items, count, totalPaise, open, setOpen, add, setQty } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const catalogue = useCatalogue();
  const restoreFocus = useRef<HTMLElement | null>(null);

  const total = totalPaise / 100;
  const left = Math.max(0, FREE_SHIPPING_AT - total);
  const rangeCap = rangeWordCap(catalogue.length);
  // Suggest something buyable that is not already in the cart. A product with
  // no confirmed price (R-04) is never suggested — the cart would refuse it.
  const addon =
    catalogue.find(
      (p) => !p.unavailable && !items.some((it) => it.slug === p.slug),
    ) ?? null;

  // Focus moves into the drawer on open, is trapped while it is open, and
  // returns to the trigger on close.
  useEffect(() => {
    if (!open) {
      restoreFocus.current?.focus();
      restoreFocus.current = null;
      return;
    }
    restoreFocus.current = document.activeElement as HTMLElement | null;

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) return;

    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));

    focusable()[0]?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', trap);
    return () => window.removeEventListener('keydown', trap);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      side="right"
      width="min(420px, 100vw)"
      eyebrow="Cart"
      title={count ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Your cart is empty'}
      footer={
        items.length ? (
          <div className="stack g4" style={{ width: '100%' }}>
            <div className="between small">
              <span>Shipping</span>
              <span className="num">{left === 0 ? 'Free' : '₹[000]'}</span>
            </div>
            <div className="between">
              <span className="eyebrow muted">Total</span>
              <span className="price" style={{ fontSize: 26 }}>
                {inr(totalPaise)}
              </span>
            </div>
            <Button
              size="lg"
              fullWidth
              onClick={() => {
                setOpen(false);
                toast({
                  title: 'Checkout',
                  description: 'Checkout is not wired up yet.',
                });
              }}
            >
              Checkout
            </Button>
            <p className="cap">
              Dispatch in <Ph>[00]</Ph> h · <Ph>[00]</Ph>-day return
            </p>
          </div>
        ) : null
      }
    >
      <div className="stack g3" style={{ paddingBottom: 20 }}>
        <div className="between">
          <span className="eyebrow muted">
            {left === 0 ? 'Free shipping unlocked' : 'Free shipping'}
          </span>
          <span className="cap num">{left === 0 ? '✓' : `${inr(left * 100)} to go`}</span>
        </div>
        <div className="progress">
          <i style={{ width: `${Math.min(100, (total / FREE_SHIPPING_AT) * 100)}%` }} />
        </div>
      </div>

      {items.length === 0 && (
        <div className="stack g4" style={{ padding: '24px 0 32px' }}>
          <p className="h3 it" style={{ color: 'var(--text-primary)' }}>
            Nothing in it yet.
          </p>
          <p className="small">
            {rangeCap} teas, one garden. Start with the one you already drink and work outward from
            there.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              router.push('/shop');
            }}
          >
            Browse the collection
          </Button>
        </div>
      )}

      <div className="stack">
        {items.map(({ slug, qty }) => {
          const p = catalogue.find((c) => c.slug === slug);
          if (!p) return null;
          return (
            <div
              key={slug}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                gap: 16,
                padding: '16px 0',
                borderBottom: 'var(--rule)',
                alignItems: 'center',
              }}
            >
              <TinBox
                p={p}
                style={{ width: 72, height: 84 }}
                sizes="72px"
                imgStyle={{ width: '70%', filter: 'drop-shadow(0 8px 8px rgba(20,19,17,.3))' }}
              />

              <div className="stack g2">
                <div>
                  <div className="h3 it" style={{ color: 'var(--text-primary)', fontSize: 18 }}>
                    {p.name}
                  </div>
                  <div className="cap num">
                    {p.netQuantity} · Lot <Ph>{SLOT.lot}</Ph>
                  </div>
                </div>
                <div className="qty">
                  <button aria-label={`Decrease ${p.name}`} onClick={() => setQty(slug, qty - 1)}>
                    <Icon name="minus" size={12} />
                  </button>
                  <span className="small num">{qty}</span>
                  <button aria-label={`Increase ${p.name}`} onClick={() => setQty(slug, qty + 1)}>
                    <Icon name="plus" size={12} />
                  </button>
                </div>
              </div>

              <div className="stack g2" style={{ alignItems: 'flex-end' }}>
                <span className="price" style={{ color: 'var(--text-primary)' }}>
                  {inr((p.pricePaise ?? 0) * qty)}
                </span>
                <button
                  aria-label={`Remove ${p.name}`}
                  onClick={() => setQty(slug, 0)}
                  style={{
                    border: 0,
                    background: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'inline-flex',
                  }}
                >
                  <Icon name="x" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 0 && addon && (
        <div className="stack g3" style={{ paddingTop: 24 }}>
          <div className="eyebrow muted">Add to the order</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr auto',
              gap: 12,
              alignItems: 'center',
              border: 'var(--rule)',
              padding: 12,
            }}
          >
            <TinBox
              p={addon}
              style={{ width: 56, height: 64 }}
              sizes="56px"
              imgStyle={{ width: '70%', filter: 'none' }}
            />
            <div>
              <div className="small" style={{ color: 'var(--text-primary)' }}>
                {addon.name}
              </div>
              <div className="cap num">
                {addon.netQuantity}
                {addon.pricePaise !== null && <> · {inr(addon.pricePaise)}</>}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => add(addon)}>
              Add
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
