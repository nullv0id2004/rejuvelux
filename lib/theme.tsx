'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'rjx-theme';

/**
 * Runs before paint so the stored theme is applied without a flash of the
 * wrong palette. Kept as a string so it can be inlined in <head>.
 */
export const THEME_INIT_SCRIPT = `
(function(){try{
  var t = localStorage.getItem('${THEME_STORAGE_KEY}');
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = t;
}catch(e){document.documentElement.dataset.theme='light';}})();
`.trim();

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Starts as 'light' to match the server render; the pre-paint script has
  // already set the real value on <html>, and the effect below syncs state to it.
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'dark' || current === 'light') setThemeState(current);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      /* storage unavailable — the theme still applies for this page view */
    }
  }, []);

  const toggle = useCallback(
    () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'),
    [setTheme],
  );

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
