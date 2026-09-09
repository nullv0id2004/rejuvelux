/**
 * Exit test for `features/admin.md` §8 stages 3 to 6 — products and the price
 * field, orders and fulfilment, users and invitations, customers and the
 * audit viewer — plus the shell fixes made alongside them.
 *
 * Every check is written so it would FAIL if the property were absent. The
 * domain modules are exercised directly; the screens are exercised over HTTP
 * against a dev server when one is up (BASE_URL, default :3000), and SKIPPED
 * with a line saying so when it is not.
 *
 * Self-cleaning: throwaway admins, a throwaway product with its variants and
 * stock, one throwaway order, one throwaway customer, and the invitations and
 * audit rows they produce are all removed at the end, including on failure.
 *
 * Run:  npm run test:admin-stages
 */

import { and, eq, inArray, like, sql } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import {
  address,
  adminAction,
  adminInvite,
  adminUser,
  appUser,
  cart,
  customer,
  inventoryItem,
  inventoryLevel,
  order,
  orderEvent,
  orderLine,
  product,
  productVariant,
  refreshToken,
  reservation,
  variantInventoryItem,
} from '../lib/server/db/schema';
import { COOKIE } from '../lib/server/auth/config';
import { hashPassword } from '../lib/server/auth/password';
import { NotAuthorisedError, type AdminSession } from '../lib/server/auth/session';
import { issueSession } from '../lib/server/auth/sessions';
import { verifyToken } from '../lib/server/auth/tokens';
import { listActionFacets, listActions } from '../lib/server/admin/audit-log';
import { getCustomer, listCustomers } from '../lib/server/admin/customers';
import {
  fulfilOrder,
  getAdminOrder,
  listAdminOrders,
  listGuestBuyers,
} from '../lib/server/admin/orders';
import {
  createProduct,
  createVariant,
  getAdminProduct,
  listAdminProducts,
  productStatusChangeAllowed,
  updateProduct,
  updateVariant,
  validateProductFields,
} from '../lib/server/admin/products';
import {
  RefusedError,
  StaleError,
  assertNotStale,
  explainRefusal,
} from '../lib/server/admin/refusal';
import {
  acceptInvite,
  assertAnOwnerRemains,
  createInvite,
  listOpenInvites,
  readInvite,
  revokeInvite,
  setAdminRole,
  setAdminStatus,
  signOutAdminEverywhere,
} from '../lib/server/admin/users';
import { adjustStock, releaseReservations, reserveForOrder } from '../lib/server/inventory/reserve';
import { appendOrderEvent } from '../lib/server/orders/events';
import { deriveOrderState } from '../lib/server/orders/state';

let pass = 0;
let fail = 0;
let skipped = 0;
const check = (ok: boolean, label: string, detail?: unknown) => {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}`, detail === undefined ? '' : detail);
  }
};
const skip = (label: string, why: string) => {
  skipped++;
  console.log(`  SKIP  ${label} — ${why}`);
};

/** Await a call that should refuse; returns the refusal sentence or null. */
async function refusal(run: () => Promise<unknown>): Promise<string | null> {
  try {
    await run();
    return null;
  } catch (e) {
    const sentence = explainRefusal(e);
    if (sentence === null) throw e;
    return sentence;
  }
}

const MARK = 'stagetest+';
const SLUG = 'stagetest-tea';
const SKU = 'STAGETEST-50';
const SKU2 = 'STAGETEST-100';
const PASSWORD = 'correct-horse-9-battery';
// `next dev`'s own default port. Port 3315 was the old task runner's and has
// held a dead listener that accepts connections and never answers.
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

const PRODUCT_FIELDS = {
  name: 'Stage Test Tea',
  slug: SLUG,
  teaType: 'Test tea',
  ingredients: 'Whole-leaf test tea',
  shortDescription: 'A product that exists only while the admin exit test runs.',
  brewingLeaf: '3 g',
  brewingWater: '80 °C',
  brewingTime: '3 min',
  territory: null,
  sortOrder: 900,
};

async function cleanup() {
  // Orders first: they RESTRICT everything they touch.
  const testOrders = await db
    .select({ id: order.id, cartId: order.cartId })
    .from(order)
    .where(like(order.email, `${MARK}%`));
  const orderIds = testOrders.map((o) => o.id);
  for (const id of orderIds) await releaseReservations(id).catch(() => {});
  if (orderIds.length) {
    await db.delete(reservation).where(inArray(reservation.orderId, orderIds));
    await db.delete(orderEvent).where(inArray(orderEvent.orderId, orderIds));
    await db.delete(orderLine).where(inArray(orderLine.orderId, orderIds));
    await db.delete(order).where(inArray(order.id, orderIds));
    await db.delete(cart).where(inArray(cart.id, testOrders.map((o) => o.cartId)));
  }

  // The throwaway product and everything hanging off it.
  const products = await db.select({ id: product.id }).from(product).where(like(product.slug, 'stagetest-%'));
  for (const p of products) {
    const variants = await db.select({ id: productVariant.id }).from(productVariant).where(eq(productVariant.productId, p.id));
    const vids = variants.map((v) => v.id);
    if (vids.length) {
      const links = await db.select({ itemId: variantInventoryItem.inventoryItemId }).from(variantInventoryItem).where(inArray(variantInventoryItem.variantId, vids));
      await db.delete(variantInventoryItem).where(inArray(variantInventoryItem.variantId, vids));
      const itemIds = links.map((l) => l.itemId);
      if (itemIds.length) {
        await db.delete(inventoryLevel).where(inArray(inventoryLevel.inventoryItemId, itemIds));
        await db.delete(inventoryItem).where(inArray(inventoryItem.id, itemIds));
      }
      await db.delete(productVariant).where(inArray(productVariant.id, vids));
    }
    await db.delete(product).where(eq(product.id, p.id));
  }
  await db.delete(inventoryItem).where(like(inventoryItem.sku, 'INV-STAGETEST-%'));

  // Throwaway customer.
  const custs = await db.select({ id: customer.id }).from(customer).where(like(customer.email, `${MARK}%`));
  if (custs.length) {
    await db.delete(address).where(inArray(address.customerId, custs.map((c) => c.id)));
    await db.delete(customer).where(inArray(customer.id, custs.map((c) => c.id)));
  }

  // Admins: audit rows and invites RESTRICT the admin_user, so they go first.
  const admins = await db.select({ id: adminUser.id }).from(adminUser).where(like(adminUser.email, `${MARK}%`));
  const adminIds = admins.map((a) => a.id);
  if (adminIds.length) {
    await db.delete(adminAction).where(inArray(adminAction.adminUserId, adminIds));
    await db.delete(adminInvite).where(inArray(adminInvite.invitedBy, adminIds));
  }
  await db.delete(adminInvite).where(like(adminInvite.email, `${MARK}%`));
  // app_user cascades to admin_user and refresh_token.
  await db.delete(appUser).where(like(appUser.email, `${MARK}%`));
}

async function makeAdmin(tag: string, role: 'owner' | 'staff') {
  const email = `${MARK}${tag}@example.test`;
  const [u] = await db
    .insert(appUser)
    .values({ email, passwordHash: await hashPassword(PASSWORD), emailVerifiedAt: new Date() })
    .returning();
  const [a] = await db
    .insert(adminUser)
    .values({ authUserId: u.id, email, name: `Stage ${tag}`, role, status: 'active' })
    .returning();
  const session: AdminSession = {
    userId: u.id,
    adminUserId: a.id,
    authUserId: u.id,
    email,
    name: a.name,
    role,
  };
  return { user: u, admin: a, session };
}

async function auditCount(adminUserId: string, action?: string): Promise<number> {
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(adminAction)
    .where(
      action
        ? and(eq(adminAction.adminUserId, adminUserId), eq(adminAction.action, action))
        : eq(adminAction.adminUserId, adminUserId)
    );
  return n;
}

async function main() {
  await cleanup(); // a previous run may have died mid-way

  const owner = await makeAdmin('owner', 'owner');
  const staff = await makeAdmin('staff', 'staff');

  try {
    /* 1. Refusals explain (features/admin.md §5, §6.5) ---------------------- */

    check(explainRefusal(new RefusedError('plain')) === 'plain', 'a RefusedError explains itself');
    const wrapped = Object.assign(new Error('insert into product ...'), {
      cause: Object.assign(new Error('driver'), { cause: { code: '23505', constraint_name: 'product_slug_unique' } }),
    });
    const sentence = explainRefusal(wrapped);
    check(!!sentence && /slug/i.test(sentence), 'a constraint two levels down the cause chain becomes a sentence', sentence);
    check(explainRefusal(new Error('boom')) === null, 'a bug is not explained away: null');
    const now = new Date();
    check(
      (() => {
        try {
          assertNotStale(now, now.toISOString());
          return true;
        } catch {
          return false;
        }
      })(),
      'a matching updated_at is not stale'
    );
    check(
      (() => {
        try {
          assertNotStale(now, new Date(now.getTime() - 1000).toISOString());
          return false;
        } catch (e) {
          return e instanceof StaleError;
        }
      })(),
      'a different updated_at is refused as stale'
    );

    /* 2. Products and the price field (stage 3) ----------------------------- */

    check(
      validateProductFields({ ...PRODUCT_FIELDS, slug: 'Bad Slug!' }) !== null,
      'a malformed slug is refused before the database'
    );
    check(
      /all three/.test(validateProductFields({ ...PRODUCT_FIELDS, brewingTime: null }) ?? ''),
      'a half-filled brew guide is refused'
    );
    check(!productStatusChangeAllowed('active', 'draft'), 'a live product cannot go back to draft');
    check(productStatusChangeAllowed('retired', 'active'), 'a retired product can come back');

    const created = await createProduct(owner.session, PRODUCT_FIELDS, {
      sku: SKU,
      name: null,
      netQuantity: '50 g',
      pricePaise: null,
    });
    const detail = await getAdminProduct(created.productId);
    check(detail?.status === 'draft', 'a created product starts as a draft');
    check(detail?.variants.length === 1 && detail.variants[0].pricePaise === null, 'its variant starts unpriced');
    const [item] = await db.select().from(inventoryItem).where(eq(inventoryItem.sku, `INV-${SKU}`));
    const [level] = item ? await db.select().from(inventoryLevel).where(eq(inventoryLevel.inventoryItemId, item.id)) : [];
    check(!!item && level?.stockedQuantity === 0, 'a stock item and a zero level were created behind it');
    check(detail?.variants[0].availability === 0, 'so nothing is available yet');
    check((await auditCount(owner.admin.id, 'product.create')) === 1, 'product.create was audited');

    const dup = await refusal(() =>
      createProduct(owner.session, PRODUCT_FIELDS, { sku: 'STAGETEST-DUP', name: null, netQuantity: '50 g', pricePaise: null })
    );
    check(!!dup && /slug/i.test(dup), 'a duplicate slug is refused with a sentence', dup);
    const [{ n: productCount }] = await db.select({ n: sql<number>`count(*)::int` }).from(product).where(like(product.slug, 'stagetest-%'));
    check(productCount === 1, 'and nothing was created');

    const before = await auditCount(owner.admin.id);
    const stale = await refusal(() =>
      updateProduct(owner.session, created.productId, { ...PRODUCT_FIELDS, status: 'draft', name: 'Renamed' }, new Date(0).toISOString())
    );
    check(!!stale && /changed while/i.test(stale), 'an edit from a stale form is refused', stale);
    check((await auditCount(owner.admin.id)) === before, 'and no audit row was written for it');

    let current = (await getAdminProduct(created.productId))!;
    await updateProduct(
      owner.session,
      created.productId,
      { ...PRODUCT_FIELDS, slug: 'stagetest-tea-2', status: 'draft' },
      current.updatedAt.toISOString()
    );
    current = (await getAdminProduct(created.productId))!;
    check(current.slug === 'stagetest-tea-2', 'the slug can change while a draft');

    await updateProduct(
      staff.session,
      created.productId,
      { ...PRODUCT_FIELDS, slug: 'stagetest-tea-2', status: 'active' },
      current.updatedAt.toISOString()
    );
    current = (await getAdminProduct(created.productId))!;
    check(current.status === 'active', 'staff can activate a product (an operational edit)');
    check((await auditCount(staff.admin.id, 'product.status.set')) === 1, 'a status change is audited as product.status.set');

    const lockedSlug = await refusal(() =>
      updateProduct(owner.session, created.productId, { ...PRODUCT_FIELDS, slug: SLUG, status: 'active' }, current.updatedAt.toISOString())
    );
    check(!!lockedSlug && /slug/i.test(lockedSlug), 'the slug is locked once live', lockedSlug);
    const backToDraft = await refusal(() =>
      updateProduct(owner.session, created.productId, { ...PRODUCT_FIELDS, slug: 'stagetest-tea-2', status: 'draft' }, current.updatedAt.toISOString())
    );
    check(!!backToDraft && /draft/i.test(backToDraft), 'active to draft is refused with the reason', backToDraft);

    const variant = current.variants[0];
    const priced = await updateVariant(
      owner.session,
      variant.id,
      { sku: SKU, name: null, pricePaise: 99900, netQuantity: '50 g', status: 'active' },
      variant.updatedAt.toISOString()
    );
    check(priced.priceChanged, 'setting a price reports a price change');
    const [priceRow] = await db.select().from(adminAction).where(and(eq(adminAction.adminUserId, owner.admin.id), eq(adminAction.action, 'variant.price.set')));
    check(
      !!priceRow &&
        (priceRow.before as { pricePaise: number | null }).pricePaise === null &&
        (priceRow.after as { pricePaise: number }).pricePaise === 99900,
      'variant.price.set records before null and after 99900'
    );
    current = (await getAdminProduct(created.productId))!;
    const noChange = await refusal(() =>
      updateVariant(owner.session, variant.id, { sku: SKU, name: null, pricePaise: 99900, netQuantity: '50 g', status: 'active' }, current.variants[0].updatedAt.toISOString())
    );
    check(!!noChange && /nothing changed/i.test(noChange), 'saving with no change is refused rather than audited as a change');

    await createVariant(owner.session, created.productId, { sku: SKU2, name: '100 g tin', netQuantity: '100 g', pricePaise: null });
    current = (await getAdminProduct(created.productId))!;
    check(current.variants.length === 2, 'a second variant can be added');
    const [item2] = await db.select().from(inventoryItem).where(eq(inventoryItem.sku, `INV-${SKU2}`));
    check(!!item2, 'with its own stock item');
    const dupSku = await refusal(() =>
      createVariant(owner.session, created.productId, { sku: SKU2, name: null, netQuantity: '100 g', pricePaise: null })
    );
    check(!!dupSku && /SKU/.test(dupSku), 'a duplicate SKU is refused with a sentence', dupSku);

    const list = await listAdminProducts();
    const listed = list.find((p) => p.id === created.productId);
    check(!!listed && listed.variants.length === 2, 'the list shows the product with both variants');
    check((await getAdminProduct('00000000-0000-0000-0000-000000000000')) === null, 'an unknown id is null, not an error');

    /* 3. Orders and fulfilment (stage 4) ------------------------------------ */

    await adjustStock(item.id, 5, 'stage test: stock to sell');
    const [c] = await db.insert(cart).values({ status: 'completed' }).returning({ id: cart.id });
    const [o] = await db
      .insert(order)
      .values({
        orderNumber: sql`'RJ-' || lpad(nextval('order_number_seq')::text, 5, '0')`,
        cartId: c.id,
        email: `${MARK}buyer@example.test`,
        phone: '9876543210',
        shipName: 'Stage Buyer',
        shipLine1: '1 Test Lane',
        shipCity: 'Guwahati',
        shipState: 'Assam',
        shipPincode: '781001',
        subtotalPaise: 2 * 99900,
        shippingPaise: 0,
        totalPaise: 2 * 99900,
      })
      .returning({ id: order.id, orderNumber: order.orderNumber });
    await db.insert(orderLine).values({
      orderId: o.id,
      variantId: variant.id,
      productName: 'Stage Test Tea',
      quantity: 2,
      unitPricePaise: 99900,
      lineTotalPaise: 2 * 99900,
    });
    await db.insert(orderEvent).values({ orderId: o.id, type: 'placed' });
    const reserved = await reserveForOrder(o.id, [{ variantId: variant.id, quantity: 2 }]);
    check(reserved.ok, 'the test order reserved its stock');

    let od = (await getAdminOrder(o.id))!;
    check(od.state === 'placed' && od.nextFulfilment.length === 0, 'a placed order offers no fulfilment action');
    check(od.lines.length === 1 && od.reservations.length === 1 && od.reservations[0].state === 'held', 'detail shows the line and the held reservation');

    const tooEarly = await refusal(() => fulfilOrder(owner.session, o.id, 'shipped', {}, od.lastEventId));
    check(!!tooEarly && /Awaiting payment/.test(tooEarly), 'marking sent before payment is refused in words', tooEarly);
    check((await auditCount(owner.admin.id, 'order.ship')) === 0, 'and nothing was audited');

    // The payment integration's job, simulated: capture lands as an event.
    const captured = await appendOrderEvent(o.id, 'payment_captured', { simulated: true });
    check(captured.ok, 'payment_captured appends through the appender');
    const illegal = await appendOrderEvent(o.id, 'delivered', {});
    check(!illegal.ok, 'the appender refuses an event the fold would reject');

    od = (await getAdminOrder(o.id))!;
    check(od.nextFulfilment.length === 1 && od.nextFulfilment[0] === 'shipped', 'after capture, exactly "shipped" is offered');

    const staleShip = await refusal(() => fulfilOrder(owner.session, o.id, 'shipped', {}, od.lastEventId! - 1));
    check(!!staleShip && /changed while/i.test(staleShip), 'a stale fulfilment form is refused');

    const shipped = await fulfilOrder(staff.session, o.id, 'shipped', { courier: 'Delhivery', trackingReference: 'DL123' }, od.lastEventId);
    check(shipped.state === 'shipped', 'staff can mark an order sent');
    od = (await getAdminOrder(o.id))!;
    const shipEvent = od.events.find((e) => e.type === 'shipped');
    check(
      !!shipEvent && (shipEvent.payload as { courier?: string }).courier === 'Delhivery',
      'the shipped event carries the courier'
    );
    check((await auditCount(staff.admin.id, 'order.ship')) === 1, 'order.ship was audited');
    check(od.nextFulfilment.length === 1 && od.nextFulfilment[0] === 'delivered', 'then exactly "delivered" is offered');

    await fulfilOrder(owner.session, o.id, 'delivered', { note: 'signed for' }, od.lastEventId);
    od = (await getAdminOrder(o.id))!;
    check(od.state === 'delivered' && od.nextFulfilment.length === 0, 'delivered is terminal: nothing offered');
    check(deriveOrderState(od.events).state === 'delivered', 'the fold agrees');
    const again = await refusal(() => fulfilOrder(owner.session, o.id, 'delivered', {}, od.lastEventId));
    check(!!again, 'delivering twice is refused');

    const delivered = await listAdminOrders({ state: 'delivered', page: 1, pageSize: 50 });
    check(delivered.rows.some((r) => r.id === o.id), 'the list filters by derived state: delivered includes it');
    const placedList = await listAdminOrders({ state: 'placed', page: 1, pageSize: 50 });
    check(!placedList.rows.some((r) => r.id === o.id), 'and placed excludes it');
    const byEmail = await listAdminOrders({ email: `${MARK}BUYER@example.test`, page: 1, pageSize: 50 });
    check(byEmail.rows.length === 1 && byEmail.rows[0].lineCount === 1, 'email filter is case-insensitive and counts lines');
    const guests = await listGuestBuyers();
    check(guests.some((g) => g.email === `${MARK}buyer@example.test` && g.orderCount === 1), 'guest buyers are grouped by email');

    /* 4. Users and invitations (stage 5) ------------------------------------ */

    check(
      (() => {
        try {
          assertAnOwnerRemains(1, true);
          return false;
        } catch (e) {
          return e instanceof RefusedError;
        }
      })(),
      'the last active owner cannot be removed'
    );
    check(
      (() => {
        try {
          assertAnOwnerRemains(2, true);
          assertAnOwnerRemains(1, false);
          return true;
        } catch {
          return false;
        }
      })(),
      'a second owner, or a non-owner target, is fine'
    );

    let staffInvite: unknown = null;
    try {
      await createInvite(staff.session, { email: `${MARK}x@example.test`, role: 'staff' });
    } catch (e) {
      staffInvite = e;
    }
    check(staffInvite instanceof NotAuthorisedError, 'staff cannot invite (NotAuthorisedError)');

    const inviteeEmail = `${MARK}invitee@example.test`;
    const inv = await createInvite(owner.session, { email: inviteeEmail, role: 'staff' });
    const [invRow] = await db.select().from(adminInvite).where(eq(adminInvite.id, inv.id));
    check(!!invRow && invRow.tokenHash !== inv.token && invRow.tokenHash.length === 64, 'the invite token is stored hashed');
    check((await listOpenInvites()).some((i) => i.id === inv.id), 'it is listed as open');
    check((await auditCount(owner.admin.id, 'invite.create')) === 1, 'invite.create was audited');
    const twice = await refusal(() => createInvite(owner.session, { email: inviteeEmail, role: 'owner' }));
    check(!!twice && /already open/i.test(twice), 'a second open invite for the same address is refused');
    const alreadyAdmin = await refusal(() => createInvite(owner.session, { email: staff.session.email, role: 'staff' }));
    check(!!alreadyAdmin && /already an admin/i.test(alreadyAdmin), 'inviting an existing admin is refused');

    const view = await readInvite(inv.token);
    check(view?.email === inviteeEmail && view.hasAccount === false, 'the link resolves to the invite; no account yet');
    check((await readInvite('not-a-token')) === null, 'a bogus link resolves to nothing');

    const noName = await acceptInvite(inv.token, { name: '', password: 'invite-pass-2026' });
    check(!noName.ok, 'accepting without a name is refused');
    const weak = await acceptInvite(inv.token, { name: 'Invitee', password: 'short' });
    check(!weak.ok && /10 characters/.test(weak.ok ? '' : weak.message), 'a weak password is refused');
    const accepted = await acceptInvite(inv.token, { name: 'Invitee', password: 'invite-pass-2026' });
    check(accepted.ok, 'a valid acceptance succeeds');
    const [inviteeUser] = await db.select().from(appUser).where(eq(appUser.email, inviteeEmail));
    const [inviteeAdmin] = inviteeUser ? await db.select().from(adminUser).where(eq(adminUser.authUserId, inviteeUser.id)) : [];
    check(!!inviteeUser && !!inviteeUser.passwordHash && !!inviteeUser.emailVerifiedAt, 'an app_user with a password was created');
    check(inviteeAdmin?.role === 'staff' && inviteeAdmin.status === 'active' && inviteeAdmin.name === 'Invitee', 'an active staff admin_user was created');
    check(
      accepted.ok && (await verifyToken(accepted.session.accessToken, 'access', 'admin')) !== null,
      'and an admin-audience session was minted'
    );
    check(inviteeAdmin ? (await auditCount(inviteeAdmin.id, 'invite.accept')) === 1 : false, 'invite.accept was audited against the new admin');
    const reuse = await acceptInvite(inv.token, { name: 'Again', password: 'invite-pass-2026' });
    check(!reuse.ok, 'the link works once');

    // The existing-account path: a shop customer invited to the admin.
    const custEmail = `${MARK}customer@example.test`;
    const [custUser] = await db
      .insert(appUser)
      .values({ email: custEmail, passwordHash: await hashPassword(PASSWORD), emailVerifiedAt: new Date() })
      .returning();
    const inv2 = await createInvite(owner.session, { email: custEmail, role: 'staff' });
    check((await readInvite(inv2.token))?.hasAccount === true, 'an invite to an existing account says so');
    const wrongPw = await acceptInvite(inv2.token, { name: 'Cust', password: 'not-their-password-1' });
    check(!wrongPw.ok && /already exists/i.test(wrongPw.ok ? '' : wrongPw.message), 'the wrong existing password is refused');
    const linked = await acceptInvite(inv2.token, { name: 'Cust', password: PASSWORD });
    check(linked.ok && linked.userId === custUser.id, 'the right password links the existing account');
    const [{ n: usersForEmail }] = await db.select({ n: sql<number>`count(*)::int` }).from(appUser).where(eq(appUser.email, custEmail));
    check(usersForEmail === 1, 'without creating a second credential');

    await setAdminRole(owner.session, inviteeAdmin!.id, 'owner');
    const [promoted] = await db.select().from(adminUser).where(eq(adminUser.id, inviteeAdmin!.id));
    check(promoted.role === 'owner', 'an owner can promote staff to owner');
    check((await auditCount(owner.admin.id, 'user.role.set')) === 1, 'user.role.set was audited');
    const sameRole = await refusal(() => setAdminRole(owner.session, inviteeAdmin!.id, 'owner'));
    check(!!sameRole && /already/i.test(sameRole), 'setting the same role is refused, not audited');

    const selfDisable = await refusal(() => setAdminStatus(owner.session, owner.admin.id, 'disabled'));
    check(!!selfDisable && /your own/i.test(selfDisable), 'an owner cannot disable their own account');

    const adminSess = await issueSession(inviteeUser.id, 'admin', inviteeUser.tokenVersion);
    const custSess = await issueSession(inviteeUser.id, 'customer', inviteeUser.tokenVersion);
    await setAdminStatus(owner.session, inviteeAdmin!.id, 'disabled');
    const remaining = await db.select().from(refreshToken).where(eq(refreshToken.userId, inviteeUser.id));
    check(
      remaining.length === 1 && remaining[0].audience === 'customer',
      'disabling ends the admin sessions and leaves the customer session alone',
      remaining.map((r) => r.audience)
    );
    check(adminSess.refreshToken !== custSess.refreshToken, '(the two sessions were distinct)');
    await setAdminStatus(owner.session, inviteeAdmin!.id, 'active');
    const [reenabled] = await db.select().from(adminUser).where(eq(adminUser.id, inviteeAdmin!.id));
    check(reenabled.status === 'active', 'and can be enabled again');
    await issueSession(inviteeUser.id, 'admin', inviteeUser.tokenVersion);
    const ended = await signOutAdminEverywhere(owner.session, inviteeAdmin!.id);
    check(ended === 1, 'sign out everywhere reports the sessions it ended');

    const revokeAccepted = await refusal(() => revokeInvite(owner.session, inv.id));
    check(!!revokeAccepted && /already accepted/i.test(revokeAccepted), 'an accepted invite cannot be revoked');
    const inv3 = await createInvite(owner.session, { email: `${MARK}third@example.test`, role: 'staff' });
    await revokeInvite(owner.session, inv3.id);
    check(!(await listOpenInvites()).some((i) => i.id === inv3.id), 'a revoked invite leaves the open list');
    check((await readInvite(inv3.token)) === null, 'and its link stops working');

    /* 5. Customers and the audit viewer (stage 6) --------------------------- */

    const [cust] = await db.insert(customer).values({ email: `${MARK}account@example.test`, name: 'Stage Account', phone: '9876543210' }).returning();
    await db.insert(address).values({
      customerId: cust.id,
      recipientName: 'Stage Account',
      line1: '2 Test Lane',
      city: 'Guwahati',
      state: 'Assam',
      pincode: '781001',
      phone: '9876543210',
    });
    const customers = await listCustomers();
    check(customers.some((r) => r.id === cust.id && r.orderCount === 0 && r.hasAccount === false), 'the customer list shows the row with its order count');
    const custDetail = await getCustomer(cust.id);
    check(custDetail?.addresses.length === 1 && custDetail.orders.length === 0, 'the customer detail shows the address');

    const mine = await listActions({ actorId: owner.admin.id, limit: 100 });
    check(mine.rows.length > 5 && mine.rows.every((r) => r.actorEmail === owner.session.email), 'the audit log filters by actor and names them');
    const priceOnly = await listActions({ action: 'variant.price.set', limit: 10 });
    check(priceOnly.rows.some((r) => r.entityId === variant.id), 'and by action');
    const firstPage = await listActions({ actorId: owner.admin.id, limit: 2 });
    check(firstPage.rows.length === 2 && firstPage.nextBefore !== null, 'pages of two have an older cursor');
    const secondPage = await listActions({ actorId: owner.admin.id, before: firstPage.nextBefore!, limit: 2 });
    check(secondPage.rows.every((r) => r.id < firstPage.nextBefore!), 'the older page is strictly older');
    const facets = await listActionFacets();
    check(facets.actions.includes('product.create') && facets.actors.some((a) => a.id === owner.admin.id), 'the filter facets come from real rows');

    /* 6. The screens, over HTTP ------------------------------------------- */

    let serverUp = true;
    try {
      await fetch(`${BASE}/admin/login`);
    } catch {
      serverUp = false;
    }
    if (!serverUp) {
      skip('screens over HTTP', `no dev server on ${BASE}`);
    } else {
      const ownerSess = await issueSession(owner.user.id, 'admin', owner.user.tokenVersion);
      const staffSess = await issueSession(staff.user.id, 'admin', staff.user.tokenVersion);
      const ownerCookie = `${COOKIE.admin.access}=${ownerSess.accessToken}`;
      const staffCookie = `${COOKIE.admin.access}=${staffSess.accessToken}`;
      const get = async (path: string, cookie?: string) => {
        const res = await fetch(`${BASE}${path}`, { headers: cookie ? { cookie } : {}, redirect: 'manual' });
        return { status: res.status, html: await res.text(), location: res.headers.get('location') ?? '' };
      };

      const screens: [string, string][] = [
        ['/admin', 'Today'],
        ['/admin/inventory', 'Inventory'],
        ['/admin/products', 'Stage Test Tea'],
        [`/admin/products/${created.productId}`, 'Stage Test Tea'],
        [`/admin/products/${created.productId}/variants`, SKU],
        ['/admin/orders', o.orderNumber],
        [`/admin/orders/${o.id}`, 'Delivered'],
        [`/admin/orders/${o.id}/fulfil?event=shipped`, 'cannot be marked sent'],
        ['/admin/customers', 'Stage Account'],
        [`/admin/customers/${cust.id}`, '2 Test Lane'],
        ['/admin/users', 'Invite someone'],
        ['/admin/audit', 'variant.price.set'],
      ];
      for (const [path, marker] of screens) {
        const r = await get(path, ownerCookie);
        check(r.status === 200 && r.html.includes(marker), `owner: ${path} renders (200, shows "${marker}")`, r.status);
      }

      // The shop's chrome leaves three fingerprints in the body: its skip link,
      // its nav list and the app shell it renders inside. None may appear.
      // (The <head> still carries the site's own metadata, so that is not checked.)
      const home = await get('/admin', ownerCookie);
      check(
        !home.html.includes('skip-link') && !home.html.includes('nav-links') && !home.html.includes('rjx-app'),
        'the admin renders without the storefront chrome'
      );

      const staffUsers = await get('/admin/users', staffCookie);
      check(
        staffUsers.status === 200 && staffUsers.html.includes('Only an owner') && !staffUsers.html.includes('Invite someone'),
        'staff: /admin/users explains itself and shows no controls'
      );
      const staffProducts = await get('/admin/products', staffCookie);
      check(staffProducts.status === 200, 'staff: /admin/products is open to them');

      const inv4 = await createInvite(owner.session, { email: `${MARK}fourth@example.test`, role: 'staff' });
      const anon = await get(`/admin/invite/${inv4.token}`);
      check(anon.status === 200 && anon.html.includes(`${MARK}fourth@example.test`), 'signed out: a valid invite link renders (unguarded)');
      const bogus = await get('/admin/invite/bogus-token');
      check(bogus.status === 200 && bogus.html.includes('no longer valid'), 'signed out: a bogus invite link says so');
      const anonUsers = await get('/admin/users');
      check([302, 307].includes(anonUsers.status) && anonUsers.location.includes('/admin/login'), 'signed out: /admin/users still redirects to login');
      check(!anon.html.includes(inv4.token.slice(0, 12)) || anon.html.includes('name="token"'), 'the invite page carries the token only as the form field');
    }
  } finally {
    await cleanup();
    const [leftAdmin] = await db.select().from(appUser).where(like(appUser.email, `${MARK}%`));
    const [leftProduct] = await db.select().from(product).where(like(product.slug, 'stagetest-%'));
    const [leftOrder] = await db.select().from(order).where(like(order.email, `${MARK}%`));
    check(!leftAdmin && !leftProduct && !leftOrder, 'cleanup: nothing left behind');
  }

  console.log(
    `\n${fail === 0 ? 'All checks passed.' : `${fail} FAILED`}  (${pass} passed${skipped ? `, ${skipped} skipped` : ''})`
  );
  process.exit(fail === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await cleanup().catch(() => {});
  process.exit(1);
});
