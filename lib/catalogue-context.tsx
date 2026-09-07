'use client';

/**
 * The catalogue, made available to client components.
 *
 * Phase 1 moved products from a static array to the database, and almost every
 * component that renders one is a client component — the cart drawer, the nav,
 * the scroll showcase, the product view. A client component cannot query
 * Postgres, so the server resolves the catalogue **once** in the root layout
 * and provides it here.
 *
 * This is deliberately a plain value passed through context, not a fetch. The
 * catalogue is five SKUs and near-static; ADR-0009 puts the database in Sydney
 * and the application in Mumbai, so an extra client round trip is exactly what
 * `architecture.md` §4 says to avoid on the read path.
 *
 * Components read it with `useCatalogue()` / `useProduct(slug)`, which replaced
 * the old `PRODUCTS` and `byId` imports from `lib/data`.
 */

import { createContext, useContext, useMemo } from 'react';
import type { CatalogueProduct } from './catalogue';

const CatalogueContext = createContext<CatalogueProduct[] | null>(null);

export function CatalogueProvider({
  catalogue,
  children,
}: {
  catalogue: CatalogueProduct[];
  children: React.ReactNode;
}) {
  // The array identity is stable per server render; memoising keeps consumers
  // from re-rendering on unrelated parent updates.
  const value = useMemo(() => catalogue, [catalogue]);
  return (
    <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
  );
}

/**
 * Every active product, in the database's sort order.
 *
 * Throws rather than returning `[]` when the provider is missing: an empty
 * catalogue and an unwired provider look identical on screen, and one of them
 * is a bug that would ship silently.
 */
export function useCatalogue(): CatalogueProduct[] {
  const value = useContext(CatalogueContext);
  if (value === null) {
    throw new Error(
      'useCatalogue() called outside CatalogueProvider — the root layout provides it.'
    );
  }
  return value;
}

/** One product by slug, or undefined. Replaces `byId` from the static data. */
export function useProduct(slug: string): CatalogueProduct | undefined {
  return useCatalogue().find((p) => p.slug === slug);
}

/** The three expressions the brief leads with (§13). */
export function useHeroes(): CatalogueProduct[] {
  return useCatalogue().filter((p) => p.isHero);
}
