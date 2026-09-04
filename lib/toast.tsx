'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { ToastTone } from '@/components/ds';

export type ToastSpec = {
  tone?: ToastTone;
  title: string;
  description?: string;
  /** Marks the "added to cart" toast so the stack can offer a View cart action. */
  cartAction?: boolean;
};

export type ToastRecord = ToastSpec & { id: number };

const DISMISS_AFTER = 3800;

type ToastContextValue = {
  toasts: ToastRecord[];
  toast: (t: ToastSpec) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: ToastSpec) => {
      const id = nextId.current++;
      setToasts((ts) => [...ts, { ...t, id }]);
      setTimeout(() => dismiss(id), DISMISS_AFTER);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
