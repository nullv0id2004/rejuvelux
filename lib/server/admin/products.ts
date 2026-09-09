/**
 * Products and variants, as the admin edits them — features/admin.md §4,
 * stage 3. This is the surface that makes R-04 closable by the client: the
 * price field lives here.
 *
 * The field split is roadmap.md §5.1's: the database owns what the client team
 * edits (name, slug, description, brewing, territory, status, sort order; a
 * variant's SKU, price, net quantity, status), the repository owns
 * presentation. `origin` is pinned to 'Assam, India' until R-03 validates
 * deeper (open call #11), `is_hero` and `components` are catalogue-architecture
 * decisions made by migration, so none of those are editable here.
 *
 * Every write goes through `auditedMutation` and locks the row it changes, so
 * §5's Stale state is a real check rather than a hope: the form carries the
 * `updated_at` it was rendered from and a mismatch refuses the edit.
 */

import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import {
  inventoryItem,
  inventoryLevel,
  product,
  productVariant,
  variantInventoryItem,
} from '../db/schema';
import type { AdminSession } from '../auth/session';
import { getVariantAvailability } from '../inventory/availability';
import { auditedMutation } from './audit';
import { RefusedError, assertNotStale } from './refusal';

export const PRODUCT_STATUSES = ['draft', 'active', 'retired'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const TERRITORIES = ['FOCUS', 'ELEGANCE', 'LEGACY'] as const;
export type Territory = (typeof TERRITORIES)[number];

/** The one origin the catalogue may state until R-03 validates a sub-region. */
export const FIXED_ORIGIN = 'Assam, India';

export interface AdminVariantRow {
  id: string;
  sku: string;
  name: string | null;
  pricePaise: number | null;
  netQuantity: string;
  status: ProductStatus;
  availability: number;
  updatedAt: Date;
}

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  territory: Territory | null;
  status: ProductStatus;
  sortOrder: number;
  isHero: boolean;
  updatedAt: Date;
  variants: AdminVariantRow[];
}

export type AdminProductDetail = AdminProductRow & {
  teaType: string;
  origin: string;
  shortDescription: string;
  ingredients: string;
  brewingLeaf: string | null;
  brewingWater: string | null;
  brewingTime: string | null;
  components: string[] | null;
};

/** Every product in every status, in the shop's own order. */
export async function listAdminProducts(): Promise<AdminProductRow[]> {
  const products = await db
    .select()
    .from(product)
    .orderBy(asc(product.sortOrder), asc(product.name));
  const variants = await db.select().from(productVariant).orderBy(asc(productVariant.sku));
  const availability = await getVariantAvailability(variants.map((v) => v.id));

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    territory: p.territory as Territory | null,
    status: p.status as ProductStatus,
    sortOrder: p.sortOrder,
    isHero: p.isHero,
    updatedAt: p.updatedAt,
    variants: variants
      .filter((v) => v.productId === p.id)
      .map((v) => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        pricePaise: v.pricePaise,
        netQuantity: v.netQuantity,
        status: v.status as ProductStatus,
        availability: availability.get(v.id) ?? 0,
        updatedAt: v.updatedAt,
      })),
  }));
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail | null> {
  const [p] = await db.select().from(product).where(eq(product.id, id)).limit(1);
  if (!p) return null;
  const variants = await db
    .select()
    .from(productVariant)
    .where(eq(productVariant.productId, id))
    .orderBy(asc(productVariant.sku));
  const availability = await getVariantAvailability(variants.map((v) => v.id));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    territory: p.territory as Territory | null,
    status: p.status as ProductStatus,
    sortOrder: p.sortOrder,
    isHero: p.isHero,
    updatedAt: p.updatedAt,
    teaType: p.teaType,
    origin: p.origin,
    shortDescription: p.shortDescription,
    ingredients: p.ingredients,
    brewingLeaf: p.brewingLeaf,
    brewingWater: p.brewingWater,
    brewingTime: p.brewingTime,
    components: p.components,
    variants: variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      pricePaise: v.pricePaise,
      netQuantity: v.netQuantity,
      status: v.status as ProductStatus,
      availability: availability.get(v.id) ?? 0,
      updatedAt: v.updatedAt,
    })),
  };
}

/* ------------------------------------------------------------ validation -- */

export interface ProductFields {
  name: string;
  slug: string;
  teaType: string;
  ingredients: string;
  shortDescription: string;
  brewingLeaf: string | null;
  brewingWater: string | null;
  brewingTime: string | null;
  territory: Territory | null;
  sortOrder: number;
}

export interface VariantFields {
  sku: string;
  name: string | null;
  pricePaise: number | null;
  netQuantity: string;
  status: ProductStatus;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKU = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

/** Pure. The sentence to show, or null when the fields are acceptable. */
export function validateProductFields(f: ProductFields): string | null {
  if (!f.name || f.name.length > 120) return 'Give the product a name of up to 120 characters.';
  if (!SLUG.test(f.slug) || f.slug.length > 80) {
    return 'The slug is the address in the URL: lowercase letters, digits and single hyphens only, for example silver-needle-assam.';
  }
  if (!f.teaType) return 'Say what kind of tea this is, for example "White tea, young buds".';
  if (!f.ingredients) return 'Ingredients are required on every product.';
  if (!f.shortDescription) return 'Write a short description. It appears on the shop.';
  if (f.shortDescription.length > 600) return 'Keep the short description under 600 characters.';
  const brewing = [f.brewingLeaf, f.brewingWater, f.brewingTime].filter((v) => v !== null);
  if (brewing.length !== 0 && brewing.length !== 3) {
    return 'Enter all three brewing values (leaf, water, time), or leave all three empty. A half-filled brew guide is not shown.';
  }
  if (f.territory !== null && !TERRITORIES.includes(f.territory)) {
    return 'Territory must be FOCUS, ELEGANCE, LEGACY or none.';
  }
  if (!Number.isInteger(f.sortOrder) || f.sortOrder < 0 || f.sortOrder > 9999) {
    return 'Sort order is a whole number from 0 to 9999. Lower comes first.';
  }
  return null;
}

/** Pure. The sentence to show, or null when the fields are acceptable. */
export function validateVariantFields(f: VariantFields): string | null {
  if (!SKU.test(f.sku) || f.sku.length > 40) {
    return 'A SKU is capital letters, digits and single hyphens, for example RJ-SILVER-50.';
  }
  if (!f.netQuantity || f.netQuantity.length > 40) {
    return 'Net quantity is required, for example "50 g" or "Six pieces".';
  }
  if (f.pricePaise !== null) {
    if (!Number.isInteger(f.pricePaise) || f.pricePaise < 0) {
      return 'The price is a whole number of rupees, zero or more. Leave it empty if the price is not confirmed.';
    }
    if (f.pricePaise % 100 !== 0) return 'Prices are whole rupees.';
  }
  if (!PRODUCT_STATUSES.includes(f.status)) return 'Status must be draft, active or retired.';
  return null;
}

/**
 * Pure. Which status changes a product may make. A live product never goes
 * back to draft: its slug is a URL customers hold, and draft would 404 it.
 * Retiring is the way off the shop; a retired product may come back.
 */
export function productStatusChangeAllowed(from: ProductStatus, to: ProductStatus): boolean {
  if (from === to) return true;
  if (from === 'draft') return to === 'active' || to === 'retired';
  if (from === 'active') return to === 'retired';
  return to === 'active'; // retired
}

/* ---------------------------------------------------------------- writes -- */

/**
 * Create a product with its first variant, and the stock item behind it.
 *
 * A variant with no inventory link is unsellable by design (availability
 * fails closed to 0), so a product created here always gets one item, one
 * level at zero stock, and one link. It starts as `draft`, unpriced unless a
 * price was given, and with nothing in stock: three separate, visible steps
 * stand between creating a product and selling it.
 */
export async function createProduct(
  session: AdminSession,
  fields: ProductFields,
  variant: Omit<VariantFields, 'status'>
): Promise<{ productId: string; variantId: string }> {
  const invalid = validateProductFields(fields) ?? validateVariantFields({ ...variant, status: 'active' });
  if (invalid) throw new RefusedError(invalid);

  return auditedMutation(
    session,
    async (tx) => {
      const [p] = await tx
        .insert(product)
        .values({
          slug: fields.slug,
          name: fields.name,
          territory: fields.territory,
          teaType: fields.teaType,
          origin: FIXED_ORIGIN,
          shortDescription: fields.shortDescription,
          ingredients: fields.ingredients,
          brewingLeaf: fields.brewingLeaf,
          brewingWater: fields.brewingWater,
          brewingTime: fields.brewingTime,
          status: 'draft',
          sortOrder: fields.sortOrder,
        })
        .returning({ id: product.id });
      const variantId = await insertVariantWithStock(tx, p.id, fields.name, variant);
      return { productId: p.id, variantId };
    },
    (r) => ({
      action: 'product.create',
      entityType: 'product',
      entityId: r.productId,
      after: { name: fields.name, slug: fields.slug, sku: variant.sku, status: 'draft' },
    })
  );
}

type TxLike = Parameters<Parameters<typeof auditedMutation>[1]>[0];

/** Variant + inventory item + level + link, in the caller's transaction. */
async function insertVariantWithStock(
  tx: TxLike,
  productId: string,
  productName: string,
  variant: Omit<VariantFields, 'status'>
): Promise<string> {
  const [v] = await tx
    .insert(productVariant)
    .values({
      productId,
      sku: variant.sku,
      name: variant.name,
      pricePaise: variant.pricePaise,
      netQuantity: variant.netQuantity,
      status: 'active',
    })
    .returning({ id: productVariant.id });
  const [item] = await tx
    .insert(inventoryItem)
    .values({ sku: `INV-${variant.sku}`, name: `${productName}, ${variant.netQuantity}` })
    .returning({ id: inventoryItem.id });
  await tx.insert(inventoryLevel).values({ inventoryItemId: item.id, stockedQuantity: 0 });
  await tx
    .insert(variantInventoryItem)
    .values({ variantId: v.id, inventoryItemId: item.id, requiredQuantity: 1 });
  return v.id;
}

export interface ProductUpdate extends ProductFields {
  status: ProductStatus;
}

/**
 * Save a product's editable fields. Refuses a stale form, a slug change on
 * anything but a draft, and a status change the rule above forbids.
 */
export async function updateProduct(
  session: AdminSession,
  productId: string,
  fields: ProductUpdate,
  expectedUpdatedAt: string
): Promise<{ changed: Record<string, unknown>; statusChanged: boolean }> {
  const invalid = validateProductFields(fields);
  if (invalid) throw new RefusedError(invalid);

  return auditedMutation(
    session,
    async (tx) => {
      const [current] = await tx
        .select()
        .from(product)
        .where(eq(product.id, productId))
        .for('update');
      if (!current) throw new RefusedError('That product no longer exists.');
      assertNotStale(current.updatedAt, expectedUpdatedAt);

      if (fields.slug !== current.slug && current.status !== 'draft') {
        throw new RefusedError(
          'The slug cannot change once a product has been live: it is the address customers hold. Create a new product if the address must change.'
        );
      }
      const from = current.status as ProductStatus;
      if (!productStatusChangeAllowed(from, fields.status)) {
        throw new RefusedError(
          from === 'active' && fields.status === 'draft'
            ? 'A live product cannot go back to draft, because its page would disappear for anyone holding the link. Retire it instead.'
            : `A ${from} product cannot become ${fields.status}.`
        );
      }
      if (fields.status === 'active' && from !== 'active') {
        const [{ n }] = await tx
          .select({ n: sql<number>`count(*)::int` })
          .from(productVariant)
          .where(
            and(eq(productVariant.productId, productId), eq(productVariant.status, 'active'))
          );
        if (n === 0) {
          throw new RefusedError(
            'A product needs at least one active variant before it can go on the shop.'
          );
        }
      }

      const before: Record<string, unknown> = {};
      const after: Record<string, unknown> = {};
      const compare = <K extends keyof typeof current>(key: K, next: (typeof current)[K]) => {
        if (current[key] !== next) {
          before[key] = current[key];
          after[key] = next;
        }
      };
      compare('name', fields.name);
      compare('slug', fields.slug);
      compare('teaType', fields.teaType);
      compare('ingredients', fields.ingredients);
      compare('shortDescription', fields.shortDescription);
      compare('brewingLeaf', fields.brewingLeaf);
      compare('brewingWater', fields.brewingWater);
      compare('brewingTime', fields.brewingTime);
      compare('territory', fields.territory);
      compare('sortOrder', fields.sortOrder);
      compare('status', fields.status);

      if (Object.keys(after).length === 0) {
        throw new RefusedError('Nothing changed, so nothing was saved.');
      }

      await tx
        .update(product)
        .set({
          name: fields.name,
          slug: fields.slug,
          teaType: fields.teaType,
          ingredients: fields.ingredients,
          shortDescription: fields.shortDescription,
          brewingLeaf: fields.brewingLeaf,
          brewingWater: fields.brewingWater,
          brewingTime: fields.brewingTime,
          territory: fields.territory,
          sortOrder: fields.sortOrder,
          status: fields.status,
          updatedAt: sql`now()`,
        })
        .where(eq(product.id, productId));

      return { before, after, statusChanged: 'status' in after };
    },
    (r) => ({
      action: r.statusChanged ? 'product.status.set' : 'product.update',
      entityType: 'product',
      entityId: productId,
      before: r.before,
      after: r.after,
    })
  ).then((r) => ({ changed: r.after, statusChanged: r.statusChanged }));
}

/**
 * Save a variant. A price change is audited as `variant.price.set` so the
 * single most consequential edit in the admin (§4) is findable on its own.
 */
export async function updateVariant(
  session: AdminSession,
  variantId: string,
  fields: VariantFields,
  expectedUpdatedAt: string
): Promise<{ changed: Record<string, unknown>; priceChanged: boolean }> {
  const invalid = validateVariantFields(fields);
  if (invalid) throw new RefusedError(invalid);

  return auditedMutation(
    session,
    async (tx) => {
      const [current] = await tx
        .select()
        .from(productVariant)
        .where(eq(productVariant.id, variantId))
        .for('update');
      if (!current) throw new RefusedError('That variant no longer exists.');
      assertNotStale(current.updatedAt, expectedUpdatedAt);

      const before: Record<string, unknown> = {};
      const after: Record<string, unknown> = {};
      const compare = <K extends keyof typeof current>(key: K, next: (typeof current)[K]) => {
        if (current[key] !== next) {
          before[key] = current[key];
          after[key] = next;
        }
      };
      compare('sku', fields.sku);
      compare('name', fields.name);
      compare('pricePaise', fields.pricePaise);
      compare('netQuantity', fields.netQuantity);
      compare('status', fields.status);
      if (Object.keys(after).length === 0) {
        throw new RefusedError('Nothing changed, so nothing was saved.');
      }

      await tx
        .update(productVariant)
        .set({
          sku: fields.sku,
          name: fields.name,
          pricePaise: fields.pricePaise,
          netQuantity: fields.netQuantity,
          status: fields.status,
          updatedAt: sql`now()`,
        })
        .where(eq(productVariant.id, variantId));

      return { before, after, priceChanged: 'pricePaise' in after };
    },
    (r) => ({
      action: r.priceChanged ? 'variant.price.set' : 'variant.update',
      entityType: 'product_variant',
      entityId: variantId,
      before: r.before,
      after: r.after,
    })
  ).then((r) => ({ changed: r.after, priceChanged: r.priceChanged }));
}

/** A second variant of an existing product, with its own stock item. */
export async function createVariant(
  session: AdminSession,
  productId: string,
  variant: Omit<VariantFields, 'status'>
): Promise<{ variantId: string }> {
  const invalid = validateVariantFields({ ...variant, status: 'active' });
  if (invalid) throw new RefusedError(invalid);

  return auditedMutation(
    session,
    async (tx) => {
      const [p] = await tx
        .select({ name: product.name })
        .from(product)
        .where(eq(product.id, productId))
        .limit(1);
      if (!p) throw new RefusedError('That product no longer exists.');
      const variantId = await insertVariantWithStock(tx, productId, p.name, variant);
      return { variantId };
    },
    (r) => ({
      action: 'variant.create',
      entityType: 'product_variant',
      entityId: r.variantId,
      after: { productId, sku: variant.sku, netQuantity: variant.netQuantity, pricePaise: variant.pricePaise },
    })
  );
}
