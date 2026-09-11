/**
 * The commerce boundary. **Server-only.**
 *
 * Everything the storefront knows about products passes through this module.
 * It resolves from Supabase PostgreSQL via Drizzle (ADR-0006) and merges the
 * repo-side presentation map — the field split in `docs/roadmap.md` §5.1.
 * Pages and components never see database rows.
 *
 * Derived in part from `rejuvelux_old/apps/web/lib/catalogue.ts`, the module
 * this replaces; the resolver shape and the paise/format helpers are carried
 * over unchanged.
 *
 * Nothing here is invented. Fields the brief does not supply are absent, not
 * empty (`product.md` §4.2 — a blocked field is omitted, never placeholdered).
 * Three are absent from the schema itself for the same reason and grow with it
 * on the day the data exists: taste notes (**R-29**), processing story
 * (**R-01**) and the FSSAI statutory declarations (**R-28**).
 *
 * **Caching.** ADR-0009 puts the database in Sydney and the application in
 * Mumbai, so every query crosses the Indian Ocean. `architecture.md` §4's
 * caching guidance stops being a nicety on the read path: the catalogue is
 * five SKUs and near-static, so these resolvers are wrapped in React `cache()`
 * for per-request deduplication and the routes that use them are statically
 * rendered with revalidation, rather than querying per request.
 */

import 'server-only';
import { cache } from 'react';
import { asc, eq } from 'drizzle-orm';
import { db } from './server/db/client';
import { product, productVariant } from './server/db/schema';
import { getVariantAvailability, stockState } from './server/inventory/availability';
import { PRESENTATION, type Presentation } from './presentation';

export type Territory = 'FOCUS' | 'ELEGANCE' | 'LEGACY';

/** Brewing parameters, as the database holds them. */
export type Brewing = { leaf: string; water: string; time: string };

/**
 * A product as the storefront sees it: the database's commerce fields merged
 * with this repository's presentation. The split is documented in
 * `presentation.ts` and decided in `roadmap.md` §5.1.
 */
export type CatalogueProduct = Presentation & {
  /* ---- from the database ---- */
  /** URL slug and cart key. The public URL — see `features/admin.md` §4. */
  slug: string;
  name: string;
  /** FOCUS / ELEGANCE / LEGACY. Only the three heroes carry one (§13). */
  territory?: Territory;
  teaType: string;
  /** Stops at state level until R-03 validates the sub-region. */
  origin: string;
  description: string;
  ingredients: string;
  brewing?: Brewing;
  /** Kit contents as display copy. Present only for the Ritual Set (§32). */
  components?: string[];
  isHero: boolean;
  sku: string;
  netQuantity: string;
  /** Paise, never floats. `null` = price unconfirmed → not purchasable (R-04). */
  pricePaise: number | null;
  variantId: string;

  /* ---- derived ---- */
  /**
   * Cups per tin, derived from net quantity ÷ brewing leaf so it cannot drift
   * from either. Absent when the database supplies no brewing leaf, or when
   * the net quantity is not a weight — the Ritual Set is "Six pieces".
   */
  cups?: string;
  /** Units buyable now. For a kit this is the minimum across its components. */
  availability: number;
  stock: ReturnType<typeof stockState>;
  /** `true` when the product cannot be bought — no price, or none in stock. */
  unavailable: boolean;
  /** Distinguishes "we have not priced it" from "it sold out". */
  priceUnconfirmed: boolean;
};

type ProductRow = typeof product.$inferSelect;
type VariantRow = typeof productVariant.$inferSelect;

/** Fallback for a slug with no presentation entry — renders, plainly. */
const BARE: Presentation = {
  descriptor: '',
  tin: 'var(--bone-300)',
  ink: 'var(--ink-900)',
  image: null,
};

/**
 * Cups = net quantity ÷ leaf per cup, both parsed from the database. Returns
 * undefined rather than a guess when either is missing or non-numeric, which
 * is what happens for the Ritual Set ("Six pieces", no brewing leaf).
 */
function deriveCups(netQuantity: string, brewingLeaf: string | null): string | undefined {
  if (!brewingLeaf) return undefined;
  const net = Number.parseFloat(netQuantity);
  const leaf = Number.parseFloat(brewingLeaf);
  if (!Number.isFinite(net) || !Number.isFinite(leaf) || leaf <= 0) return undefined;
  if (!/g\b/i.test(netQuantity) || !/g\b/i.test(brewingLeaf)) return undefined;
  return `≈ ${Math.floor(net / leaf)}`;
}

function toProduct(
  p: ProductRow,
  v: VariantRow,
  availability: number
): CatalogueProduct {
  const presentation = PRESENTATION[p.slug] ?? BARE;
  const priceUnconfirmed = v.pricePaise === null;
  const cups = deriveCups(v.netQuantity, p.brewingLeaf);
  return {
    ...presentation,
    slug: p.slug,
    name: p.name,
    ...(p.territory ? { territory: p.territory as Territory } : {}),
    teaType: p.teaType,
    origin: p.origin,
    description: p.shortDescription,
    ingredients: p.ingredients,
    ...(p.brewingLeaf && p.brewingWater && p.brewingTime
      ? { brewing: { leaf: p.brewingLeaf, water: p.brewingWater, time: p.brewingTime } }
      : {}),
    ...(p.components && p.components.length > 0 ? { components: p.components } : {}),
    isHero: p.isHero,
    sku: v.sku,
    netQuantity: v.netQuantity,
    pricePaise: v.pricePaise,
    variantId: v.id,
    ...(cups ? { cups } : {}),
    availability,
    stock: stockState(availability),
    unavailable: priceUnconfirmed || availability <= 0,
    priceUnconfirmed,
  };
}

const activeRows = () =>
  db
    .select()
    .from(product)
    .innerJoin(productVariant, eq(productVariant.productId, product.id))
    .where(eq(product.status, 'active'))
    .orderBy(asc(product.sortOrder));

/**
 * The active catalogue, in the database's own sort order. Deduplicated per
 * request by React `cache()` — the layout, the page and its metadata all ask
 * for this, and one cross-region round trip is enough.
 */
export const listProducts = cache(async (): Promise<CatalogueProduct[]> => {
  const rows = await activeRows();
  // One availability query for the whole catalogue, not one per variant —
  // getVariantAvailability is a batch call, and ADR-0009 makes every extra
  // round trip a cross-region one.
  const availability = await getVariantAvailability(
    rows.map((r) => r.product_variant.id)
  );
  return rows.map((r) =>
    toProduct(
      r.product,
      r.product_variant,
      availability.get(r.product_variant.id) ?? 0
    )
  );
});

/** The three expressions the brief leads with (§13). */
export const listHeroes = cache(async (): Promise<CatalogueProduct[]> => {
  const all = await listProducts();
  return all.filter((p) => p.isHero);
});

/** One product by slug, or null. A non-active product is treated as absent. */
export const getProduct = cache(
  async (slug: string): Promise<CatalogueProduct | null> => {
    const all = await listProducts();
    return all.find((p) => p.slug === slug) ?? null;
  }
);

/** ₹ with Indian digit grouping, no decimals — prices are whole rupees. */
export function formatPrice(pricePaise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(pricePaise / 100);
}
