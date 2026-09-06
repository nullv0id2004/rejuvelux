/**
 * The commerce schema. `docs/data-model.md` governs this file — any disagreement
 * between the two is a finding, not a preference (data-model.md, header).
 *
 * Shape derived in part from Medusa v2.19.0 (MIT):
 *   - inventory_item / inventory_level / reservation and the variant↔inventory link
 *     carrying required_quantity follow packages/modules/inventory and
 *     packages/modules/link-modules (product_variant_inventory_item).
 *   The MIT License (MIT) — Copyright (c) MedusaJS, Inc. See ADR-0006 for the
 *   attribution rule and the Enterprise Materials boundary (none used here).
 *
 * Two things live only in the migration SQL, not in this file, and that is
 * deliberate (data-model.md §5.1, §9.1):
 *   - the FK from customer.auth_user_id to auth.users(id) — a cross-schema
 *     reference drizzle-kit should not own;
 *   - RLS ENABLE on every table (deny-all; the domain layer connects as postgres
 *     and bypasses it, the anon PostgREST surface sees nothing).
 */

import {
  bigint,
  boolean,
  check,
  integer,
  jsonb,
  pgSequence,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/* Shared column shorthands ------------------------------------------------ */

const id = () => uuid('id').primaryKey().defaultRandom();
const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp('updated_at', { withTimezone: true }).notNull().defaultNow();
/** Money is integer paise, never floats (data-model.md §1.1, open call #9). */
const paise = (name: string) => bigint(name, { mode: 'number' });

/* 3. Catalogue ------------------------------------------------------------ */

export const product = pgTable(
  'product',
  {
    id: id(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    /** FOCUS / ELEGANCE / LEGACY — only the three heroes carry one (§13). */
    territory: text('territory'),
    teaType: text('tea_type').notNull(),
    /** 'Assam, India' only, until R-03 validates deeper (open call #11). */
    origin: text('origin').notNull(),
    shortDescription: text('short_description').notNull(),
    ingredients: text('ingredients').notNull(),
    brewingLeaf: text('brewing_leaf'),
    brewingWater: text('brewing_water'),
    brewingTime: text('brewing_time'),
    isHero: boolean('is_hero').notNull().default(false),
    /**
     * Kit contents as DISPLAY COPY (§32's list, e.g. 'Assam Matcha', 'Bamboo
     * whisk'). Distinct from the inventory linkage in variant_inventory_item,
     * whose item names describe physical stock units. NULL for non-kits.
     */
    components: text('components').array(),
    status: text('status').notNull().default('active'),
    /** Interim stock art (R-57). Replaced wholesale when photography lands. */
    standinSrc: text('standin_src'),
    standinAlt: text('standin_alt'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),

    /*
     * Deliberately absent, same list as catalogue.ts, same reasons:
     *   taste_notes (R-29) · processing_story (R-01) · statutory_fssai (R-28).
     * Added by one migration on the day the data exists — never placeholdered.
     */
  },
  (t) => [
    uniqueIndex('product_slug_unique').on(t.slug),
    check(
      'product_territory_check',
      sql`${t.territory} IS NULL OR ${t.territory} IN ('FOCUS','ELEGANCE','LEGACY')`
    ),
    check(
      'product_status_check',
      sql`${t.status} IN ('draft','active','retired')`
    ),
  ]
);

export const productVariant = pgTable(
  'product_variant',
  {
    id: id(),
    productId: uuid('product_id')
      .notNull()
      .references(() => product.id, { onDelete: 'restrict' }),
    sku: text('sku').notNull(),
    name: text('name'),
    /** NULL = price unconfirmed (R-04) → not purchasable. Never estimated (open call #4). */
    pricePaise: paise('price_paise'),
    netQuantity: text('net_quantity').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('product_variant_sku_unique').on(t.sku),
    check(
      'product_variant_price_check',
      sql`${t.pricePaise} IS NULL OR ${t.pricePaise} >= 0`
    ),
    check(
      'product_variant_status_check',
      sql`${t.status} IN ('draft','active','retired')`
    ),
  ]
);

/* 4. Inventory — the tables that close race 1 ----------------------------- */

export const inventoryItem = pgTable(
  'inventory_item',
  {
    id: id(),
    sku: text('sku').notNull(),
    name: text('name').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('inventory_item_sku_unique').on(t.sku)]
);

export const inventoryLevel = pgTable(
  'inventory_level',
  {
    id: id(),
    /** UNIQUE = single location, structurally. Multi-location seam: data-model.md §4.2. */
    inventoryItemId: uuid('inventory_item_id')
      .notNull()
      .references(() => inventoryItem.id, { onDelete: 'restrict' }),
    stockedQuantity: integer('stocked_quantity').notNull().default(0),
    reservedQuantity: integer('reserved_quantity').notNull().default(0),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('inventory_level_item_unique').on(t.inventoryItemId),
    check('inventory_level_stocked_check', sql`${t.stockedQuantity} >= 0`),
    check('inventory_level_reserved_check', sql`${t.reservedQuantity} >= 0`),
    /** No backorder, ever — §50 has drops and early access, never oversell. */
    check(
      'inventory_level_no_oversell_check',
      sql`${t.reservedQuantity} <= ${t.stockedQuantity}`
    ),
  ]
);

/**
 * The kit link — the most important table in the schema (data-model.md §4.3).
 * Ritual Set = one variant, six rows here. Nothing else distinguishes a kit.
 */
export const variantInventoryItem = pgTable(
  'variant_inventory_item',
  {
    variantId: uuid('variant_id')
      .notNull()
      .references(() => productVariant.id, { onDelete: 'cascade' }),
    inventoryItemId: uuid('inventory_item_id')
      .notNull()
      .references(() => inventoryItem.id, { onDelete: 'restrict' }),
    requiredQuantity: integer('required_quantity').notNull().default(1),
  },
  (t) => [
    primaryKey({ columns: [t.variantId, t.inventoryItemId] }),
    check(
      'variant_inventory_item_qty_check',
      sql`${t.requiredQuantity} > 0`
    ),
  ]
);

export const reservation = pgTable(
  'reservation',
  {
    id: id(),
    inventoryItemId: uuid('inventory_item_id')
      .notNull()
      .references(() => inventoryItem.id, { onDelete: 'restrict' }),
    orderId: uuid('order_id')
      .notNull()
      .references(() => order.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    /** held → consumed | released. Forward-only (features/inventory.md §4.3). */
    state: text('state').notNull().default('held'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check('reservation_qty_check', sql`${t.quantity} > 0`),
    check(
      'reservation_state_check',
      sql`${t.state} IN ('held','consumed','released')`
    ),
  ]
);

/* 5. Customer and address -------------------------------------------------- */

export const customer = pgTable(
  'customer',
  {
    id: id(),
    /**
     * NULL = guest. FK to auth.users(id) ON DELETE SET NULL lives in the
     * migration SQL, not here (cross-schema — see file header).
     */
    authUserId: uuid('auth_user_id'),
    /** Deliberately NOT unique — a guest's email is unverified (data-model.md §5.1). */
    email: text('email').notNull(),
    name: text('name'),
    phone: text('phone'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('customer_auth_user_unique').on(t.authUserId)]
);

export const address = pgTable(
  'address',
  {
    id: id(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customer.id, { onDelete: 'cascade' }),
    recipientName: text('recipient_name').notNull(),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    /** India state list validated in app, not enum — the list changes. */
    state: text('state').notNull(),
    pincode: text('pincode').notNull(),
    phone: text('phone').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    /* No country column at all — India only (R-23). */
  },
  (t) => [check('address_pincode_check', sql`${t.pincode} ~ '^[0-9]{6}$'`)]
);

/* 6. Cart ------------------------------------------------------------------ */

export const cart = pgTable(
  'cart',
  {
    id: id(),
    customerId: uuid('customer_id').references(() => customer.id, {
      onDelete: 'set null',
    }),
    status: text('status').notNull().default('open'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check(
      'cart_status_check',
      sql`${t.status} IN ('open','completed','abandoned')`
    ),
  ]
);

export const cartLine = pgTable(
  'cart_line',
  {
    id: id(),
    cartId: uuid('cart_id')
      .notNull()
      .references(() => cart.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id')
      .notNull()
      .references(() => productVariant.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    /** Display snapshot at add time; re-quoted at checkout on mismatch (data-model.md §6.2). */
    unitPricePaise: paise('unit_price_paise').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('cart_line_cart_variant_unique').on(t.cartId, t.variantId),
    /** Cap 10: D2C only, no B2B path at launch (R-19). */
    check('cart_line_qty_check', sql`${t.quantity} > 0 AND ${t.quantity} <= 10`),
    check('cart_line_price_check', sql`${t.unitPricePaise} >= 0`),
  ]
);

/* 7. Order — append-only, the spine's terminus ----------------------------- */

/** Human-facing order number: RJ- + padded sequence. NOT a GST invoice number (R-45, deferred). */
export const orderNumberSeq = pgSequence('order_number_seq', {
  startWith: 1,
  increment: 1,
});

export const order = pgTable(
  'order',
  {
    id: id(),
    orderNumber: text('order_number').notNull(),
    /** UNIQUE(cart_id) IS the checkout idempotency (race 2) — one cart, one order. */
    cartId: uuid('cart_id')
      .notNull()
      .references(() => cart.id, { onDelete: 'restrict' }),
    customerId: uuid('customer_id').references(() => customer.id, {
      onDelete: 'set null',
    }),
    /* Contact + shipping are snapshots — the order works if the customer row is erased. */
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    shipName: text('ship_name').notNull(),
    shipLine1: text('ship_line1').notNull(),
    shipLine2: text('ship_line2'),
    shipCity: text('ship_city').notNull(),
    shipState: text('ship_state').notNull(),
    shipPincode: text('ship_pincode').notNull(),
    isGift: boolean('is_gift').notNull().default(false),
    giftMessage: text('gift_message'),
    subtotalPaise: paise('subtotal_paise').notNull(),
    shippingPaise: paise('shipping_paise').notNull(),
    totalPaise: paise('total_paise').notNull(),
    currency: text('currency').notNull().default('INR'),
    createdAt: createdAt(),
    /* No updated_at, no status column — state lives in order_event (race 3). */
  },
  (t) => [
    uniqueIndex('order_number_unique').on(t.orderNumber),
    uniqueIndex('order_cart_unique').on(t.cartId),
    check('order_currency_check', sql`${t.currency} = 'INR'`),
    check('order_subtotal_check', sql`${t.subtotalPaise} >= 0`),
    check('order_shipping_check', sql`${t.shippingPaise} >= 0`),
    /**
     * total = subtotal + shipping. No other arithmetic exists: no discount
     * column, deliberately — adding one would build the mechanic §49 bans.
     */
    check(
      'order_total_check',
      sql`${t.totalPaise} = ${t.subtotalPaise} + ${t.shippingPaise}`
    ),
  ]
);

export const orderLine = pgTable(
  'order_line',
  {
    id: id(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => order.id, { onDelete: 'restrict' }),
    /** RESTRICT is why product/variant have 'retired' instead of DELETE. */
    variantId: uuid('variant_id')
      .notNull()
      .references(() => productVariant.id, { onDelete: 'restrict' }),
    productName: text('product_name').notNull(),
    variantName: text('variant_name'),
    quantity: integer('quantity').notNull(),
    unitPricePaise: paise('unit_price_paise').notNull(),
    lineTotalPaise: paise('line_total_paise').notNull(),
  },
  (t) => [
    check('order_line_qty_check', sql`${t.quantity} > 0`),
    check('order_line_price_check', sql`${t.unitPricePaise} >= 0`),
    check(
      'order_line_total_check',
      sql`${t.lineTotalPaise} = ${t.quantity} * ${t.unitPricePaise}`
    ),
  ]
);

/**
 * Where order state actually lives. No status column exists to overwrite —
 * state is a fold over these rows, forward-only (data-model.md §7.3).
 */
export const orderEvent = pgTable(
  'order_event',
  {
    /** Identity PK: insertion order is the order. */
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => order.id, { onDelete: 'restrict' }),
    type: text('type').notNull(),
    payload: jsonb('payload').notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [
    check(
      'order_event_type_check',
      sql`${t.type} IN ('placed','payment_captured','payment_failed','cancelled','shipped','delivered','refunded')`
    ),
  ]
);

/* 8. Payment — Razorpay, append-only --------------------------------------- */

export const payment = pgTable(
  'payment',
  {
    id: id(),
    /** One payment intent per order; a retry is a new attempt on the same intent. */
    orderId: uuid('order_id')
      .notNull()
      .references(() => order.id, { onDelete: 'restrict' }),
    provider: text('provider').notNull().default('razorpay'),
    /** Razorpay's order_id, minted at placement. */
    providerOrderId: text('provider_order_id').notNull(),
    /** Razorpay speaks paise natively — no conversion anywhere. */
    amountPaise: paise('amount_paise').notNull(),
    createdAt: createdAt(),
    /* No status column — state folds from payment_event. */
  },
  (t) => [
    uniqueIndex('payment_order_unique').on(t.orderId),
    uniqueIndex('payment_provider_order_unique').on(t.providerOrderId),
    check('payment_provider_check', sql`${t.provider} = 'razorpay'`),
    check('payment_amount_check', sql`${t.amountPaise} >= 0`),
  ]
);

export const paymentEvent = pgTable(
  'payment_event',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    paymentId: uuid('payment_id')
      .notNull()
      .references(() => payment.id, { onDelete: 'restrict' }),
    /**
     * THE webhook idempotency constraint (race 2). A redelivered Razorpay
     * webhook violates this unique index and is discarded — the database is
     * the arbiter, not an application-level "seen it?" check.
     */
    providerEventId: text('provider_event_id').notNull(),
    type: text('type').notNull(),
    providerPaymentId: text('provider_payment_id'),
    /** Verbatim verified webhook body — the reconciliation record. */
    payload: jsonb('payload').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('payment_event_provider_unique').on(t.providerEventId),
  ]
);

/* Admin — features/admin.md §7, ADR-0008 ----------------------------------- */

/**
 * The admin's commerce-side identity. Credentials live in Supabase Auth, never
 * here — the same split Medusa uses (modules/user/src/models/user.ts holds a
 * profile with no password column) and the same one `customer` already uses.
 *
 * ON DELETE CASCADE, unlike customer's SET NULL: a customer's orders must
 * outlive their account, but an admin identity with no auth user behind it is
 * just a dead row. The audit trail is what outlives the person, and it holds
 * its own FK with RESTRICT.
 */
export const adminUser = pgTable(
  'admin_user',
  {
    id: id(),
    /** FK to auth.users(id) lives in the migration SQL — cross-schema. */
    authUserId: uuid('auth_user_id').notNull(),
    email: text('email').notNull(),
    name: text('name'),
    /** Two fixed roles. Medusa's RBAC is Enterprise and out of bounds (ADR-0008). */
    role: text('role').notNull().default('staff'),
    status: text('status').notNull().default('active'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('admin_user_auth_user_unique').on(t.authUserId),
    uniqueIndex('admin_user_email_unique').on(t.email),
    check('admin_user_role_check', sql`${t.role} IN ('owner','staff')`),
    check('admin_user_status_check', sql`${t.status} IN ('active','disabled')`),
  ]
);

/**
 * Append-only audit of every admin mutation, written in the same transaction
 * as the change it records (features/admin.md §6.2 — if the audit write fails,
 * the change fails). No update or delete path exists in code.
 *
 * RESTRICT on the actor: an audit row outlives the person who caused it.
 */
export const adminAction = pgTable('admin_action', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  adminUserId: uuid('admin_user_id')
    .notNull()
    .references(() => adminUser.id, { onDelete: 'restrict' }),
  /** e.g. 'stock.adjust', 'variant.price.set', 'order.fulfil' */
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  /** Nullable: a create has no before, a delete has no after. */
  before: jsonb('before'),
  after: jsonb('after'),
  createdAt: createdAt(),
});

/**
 * Invitations to the admin. The token is stored HASHED — the plaintext exists
 * only in the emailed link, so a database read cannot mint a session.
 */
export const adminInvite = pgTable(
  'admin_invite',
  {
    id: id(),
    email: text('email').notNull(),
    role: text('role').notNull().default('staff'),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    invitedBy: uuid('invited_by')
      .notNull()
      .references(() => adminUser.id, { onDelete: 'restrict' }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('admin_invite_token_unique').on(t.tokenHash),
    check('admin_invite_role_check', sql`${t.role} IN ('owner','staff')`),
  ]
);
