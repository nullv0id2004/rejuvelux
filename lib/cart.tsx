'use client';

/**
 * The cart, client-side.
 *
 * **This is Phase 1 state, and Phase 2 replaces it.** `docs/roadmap.md` §5.2
 * swaps this for the server cart already built at `lib/server/cart/cart.ts` and
 * exposed through `/api/cart` — a real `cart` row keyed by an httpOnly cookie,
 * with atomic merge, a quantity cap and price snapshots. Until then the cart
 * lives in `localStorage` and knows only slugs and quantities.
 *
 * What changed in Phase 1: lines are keyed by **database slug**, and money
 * comes from the catalogue's real `pricePaise` rather than a single dummy
 * value. A product with no confirmed price (**R-04**) or no stock cannot be
 * added at all — the guard lives here so every caller inherits it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CatalogueProduct } from './catalogue';
import { useCatalogue } from './catalogue-context';
import { useToast } from './toast';

/** A line: the product's database slug, and how many. */
export type CartItem = { slug: string; qty: number };

const STORAGE_KEY = 'rjx-cart-v2';

type CartContextValue = {
  items: CartItem[];
  /** Total units across all lines — what the nav badge shows. */
  count: number;
  /** Line-item total in **paise**, from the catalogue's real prices. */
  totalPaise: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Refused, with an explanation, when the product is not purchasable. */
  add: (product: CatalogueProduct, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  replace: (items: CartItem[]) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { toast } = useToast();
  const catalogue = useCatalogue();

  // Read persisted cart after mount so the server and first client render agree.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        setItems(
          parsed.filter(
            (i): i is CartItem =>
              !!i &&
              typeof i === 'object' &&
              typeof (i as CartItem).slug === 'string' &&
              typeof (i as CartItem).qty === 'number',
          ),
        );
      }
    } catch {
      /* corrupt or unavailable storage — start with an empty cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — the cart still works for this session */
    }
  }, [items, hydrated]);

  const add = useCallback(
    (product: CatalogueProduct, qty = 1) => {
      // Refuse rather than silently accept. features/admin.md §6.5's rule —
      // a refusal names the reason in a sentence — applies to the storefront
      // just as much as to the admin.
      if (product.priceUnconfirmed) {
        toast({
          tone: 'neutral',
          title: 'Not yet on sale',
          description: `${product.name} has no confirmed price yet, so it cannot be bought.`,
        });
        return;
      }
      if (product.availability <= 0) {
        toast({
          tone: 'neutral',
          title: 'Out of stock',
          description: `${product.name} is not available at the moment.`,
        });
        return;
      }

      setItems((its) => {
        const existing = its.find((i) => i.slug === product.slug);
        return existing
          ? its.map((i) =>
              i.slug === product.slug ? { ...i, qty: i.qty + qty } : i,
            )
          : [...its, { slug: product.slug, qty }];
      });
      toast({
        tone: 'success',
        title: 'Added to cart',
        description: `${product.name} · ${product.netQuantity}${qty > 1 ? ' × ' + qty : ''}`,
        cartAction: true,
      });
    },
    [toast],
  );

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((its) =>
      its.map((i) => (i.slug === slug ? { ...i, qty } : i)).filter((i) => i.qty > 0),
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const totalPaise = items.reduce((s, i) => {
      const p = catalogue.find((c) => c.slug === i.slug);
      return s + (p?.pricePaise ?? 0) * i.qty;
    }, 0);
    return {
      items,
      count,
      totalPaise,
      open,
      setOpen,
      add,
      setQty,
      replace: setItems,
      clear: () => setItems([]),
    };
  }, [items, open, add, setQty, catalogue]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
