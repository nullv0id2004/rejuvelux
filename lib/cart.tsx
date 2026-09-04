'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PRICE, type Product } from './data';
import { useToast } from './toast';

export type CartItem = { id: string; qty: number };

const STORAGE_KEY = 'rjx-cart';

type CartContextValue = {
  items: CartItem[];
  /** Total units across all lines — what the nav badge shows. */
  count: number;
  /** Line-item total in rupees. Placeholder pricing (one value per SKU). */
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  replace: (items: CartItem[]) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { toast } = useToast();

  // Read persisted cart after mount so the server and first client render agree.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        setItems(
          parsed.filter(
            (i): i is CartItem =>
              !!i && typeof i === 'object' && typeof i.id === 'string' && typeof i.qty === 'number',
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
    (product: Product, qty = 1) => {
      setItems((its) => {
        const existing = its.find((i) => i.id === product.id);
        return existing
          ? its.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
          : [...its, { id: product.id, qty }];
      });
      toast({
        tone: 'success',
        title: 'Added to cart',
        description: `${product.name} · ${product.weight}${qty > 1 ? ' × ' + qty : ''}`,
        cartAction: true,
      });
    },
    [toast],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((its) => its.map((i) => (i.id === id ? { ...i, qty } : i)).filter((i) => i.qty > 0));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      count,
      total: items.reduce((s, i) => s + PRICE * i.qty, 0),
      open,
      setOpen,
      add,
      setQty,
      replace: setItems,
      clear: () => setItems([]),
    };
  }, [items, open, add, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
