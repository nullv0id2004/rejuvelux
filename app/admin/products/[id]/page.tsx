/**
 * /admin/products/[id] — edit a product (features/admin.md §4, stage 3).
 *
 * Editable: name, slug (draft only), short description, brewing, territory,
 * status, sort order — roadmap.md §5.1's field split. Shown but not editable:
 * kind of tea, origin, ingredients, hero flag, set components, each for a
 * reason stated beside it.
 *
 * Retiring confirms (§6.3): the form comes back once with the consequence in
 * a sentence and the same values, and a second submit does it. The form also
 * carries the `updated_at` it was rendered from, so an edit against a row that
 * changed underneath is refused rather than overwriting (§5, Stale).
 */

import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth/session';
import {
  PRODUCT_STATUSES,
  TERRITORIES,
  getAdminProduct,
  updateProduct,
  type ProductStatus,
  type Territory,
} from '@/lib/server/admin/products';
import { explainRefusal } from '@/lib/server/admin/refusal';
import { formatDateTime } from '../../format';
import {
  backTo,
  carry,
  checked,
  initial,
  integer,
  optionalText,
  prefilled,
  readNotice,
  text,
  type SearchParams,
} from '../../form';
import { ConfirmNotice, Notices } from '../../notices';
import shell from '../../admin.module.css';
import ui from '../../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit product' };

const FIELDS = [
  'name',
  'slug',
  'teaType',
  'ingredients',
  'shortDescription',
  'brewingLeaf',
  'brewingWater',
  'brewingTime',
  'territory',
  'sortOrder',
  'status',
] as const;

async function save(formData: FormData) {
  'use server';
  const session = await requireAdmin();
  const id = text(formData, 'id');
  const path = `/admin/products/${id}`;
  const carried = carry(formData, FIELDS);

  const current = await getAdminProduct(id);
  if (!current) notFound();

  const status = text(formData, 'status') as ProductStatus;
  const territory = text(formData, 'territory');

  // Retiring takes the product off the shop for everyone holding its link.
  // Consequential, so it confirms (features/admin.md §6.3).
  const retiring = status === 'retired' && current.status !== 'retired';
  if (retiring && !checked(formData, 'confirm')) {
    redirect(backTo(path, { confirm: true, carry: carried }));
  }

  let refused: string | null = null;
  try {
    await updateProduct(
      session,
      id,
      {
        name: text(formData, 'name'),
        slug: text(formData, 'slug'),
        teaType: text(formData, 'teaType'),
        ingredients: text(formData, 'ingredients'),
        shortDescription: text(formData, 'shortDescription'),
        brewingLeaf: optionalText(formData, 'brewingLeaf'),
        brewingWater: optionalText(formData, 'brewingWater'),
        brewingTime: optionalText(formData, 'brewingTime'),
        territory: territory === '' ? null : (territory as Territory),
        sortOrder: integer(formData, 'sortOrder'),
        status,
      },
      text(formData, 'updatedAt')
    );
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  if (refused) redirect(backTo(path, { refused, carry: carried }));

  revalidatePath('/', 'layout');
  redirect(
    backTo(path, {
      done:
        status === 'active'
          ? 'Saved. Changes reach the shop within the hour.'
          : status === 'retired'
            ? 'Saved. The product is retired and no longer on the shop.'
            : 'Saved.',
    })
  );
}

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const p = await getAdminProduct(id);
  if (!p) notFound();

  const notice = readNotice(sp);
  const v = (name: string, fallback: string) => initial(sp, name, fallback);
  const confirmingRetire = notice.confirm && prefilled(sp, 'status') === 'retired';
  const slugLocked = p.status !== 'draft';

  return (
    <>
      <h1 className={shell.pageTitle}>{p.name}</h1>
      <p className={shell.pageIntro}>
        Status <strong>{p.status}</strong> · last changed {formatDateTime(p.updatedAt)} ·{' '}
        <Link href={`/admin/products/${p.id}/variants`}>Price and variants</Link>
        {p.status === 'active' ? (
          <>
            {' '}
            · <Link href={`/shop/${p.slug}`}>View on the shop</Link>
          </>
        ) : null}
      </p>

      <Notices notice={notice} />
      {confirmingRetire ? (
        <ConfirmNotice>
          Retiring takes <strong>{p.name}</strong> off the shop. Anyone holding
          its link sees nothing. Past orders keep their record. Submit again to
          confirm.
        </ConfirmNotice>
      ) : null}

      <form className={`${ui.form} ${ui.formWide}`} action={save}>
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="updatedAt" value={p.updatedAt.toISOString()} />
        {confirmingRetire ? <input type="hidden" name="confirm" value="1" /> : null}

        <fieldset className={ui.fieldset}>
          <legend className={ui.legend}>On the shop</legend>

          <label className={ui.field}>
            <span className={ui.label}>Name</span>
            <input className={ui.input} name="name" required maxLength={120} defaultValue={v('name', p.name)} />
          </label>

          <label className={ui.field}>
            <span className={ui.label}>Slug</span>
            <span className={ui.hint}>
              {slugLocked
                ? 'Locked: this product has been live, and its address is one customers hold.'
                : 'The address: /shop/slug. Changeable only while the product is a draft.'}
            </span>
            {slugLocked ? (
              <>
                <span className={ui.readOnly}>/shop/{p.slug}</span>
                <input type="hidden" name="slug" value={p.slug} />
              </>
            ) : (
              <input
                className={ui.input}
                name="slug"
                required
                maxLength={80}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                defaultValue={v('slug', p.slug)}
              />
            )}
          </label>

          <label className={ui.field}>
            <span className={ui.label}>Short description</span>
            <textarea className={ui.textarea} name="shortDescription" required maxLength={600} defaultValue={v('shortDescription', p.shortDescription)} />
          </label>

          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>Brewing: leaf</span>
              <input className={ui.input} name="brewingLeaf" maxLength={40} defaultValue={v('brewingLeaf', p.brewingLeaf ?? '')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Brewing: water</span>
              <input className={ui.input} name="brewingWater" maxLength={40} defaultValue={v('brewingWater', p.brewingWater ?? '')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Brewing: time</span>
              <input className={ui.input} name="brewingTime" maxLength={40} defaultValue={v('brewingTime', p.brewingTime ?? '')} />
            </label>
          </div>

          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>Territory</span>
              <select className={ui.select} name="territory" defaultValue={v('territory', p.territory ?? '')}>
                <option value="">None</option>
                {TERRITORIES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Sort order</span>
              <span className={ui.hint}>Lower comes first.</span>
              <input className={ui.input} type="number" name="sortOrder" min={0} max={9999} step={1} required defaultValue={v('sortOrder', String(p.sortOrder))} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Status</span>
              <span className={ui.hint}>
                {p.status === 'draft'
                  ? 'Active puts it on the shop.'
                  : p.status === 'active'
                    ? 'Retired takes it off the shop. It cannot go back to draft.'
                    : 'Active puts it back on the shop.'}
              </span>
              <select className={ui.select} name="status" defaultValue={v('status', p.status)}>
                {PRODUCT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className={ui.fieldset}>
          <legend className={ui.legend}>Specification</legend>
          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>Kind of tea</span>
              <input className={ui.input} name="teaType" required maxLength={80} defaultValue={v('teaType', p.teaType)} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Origin</span>
              <span className={ui.hint}>Fixed until the sub-region is verified (R-03).</span>
              <span className={ui.readOnly}>{p.origin}</span>
            </label>
          </div>
          <label className={ui.field}>
            <span className={ui.label}>Ingredients</span>
            <input className={ui.input} name="ingredients" required maxLength={200} defaultValue={v('ingredients', p.ingredients)} />
          </label>
          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>Hero</span>
              <span className={ui.hint}>Which three lead the range is a catalogue decision made by a developer.</span>
              <span className={ui.readOnly}>{p.isHero ? 'One of the three heroes' : 'Not a hero'}</span>
            </label>
            {p.components ? (
              <label className={ui.field}>
                <span className={ui.label}>Set contents</span>
                <span className={ui.hint}>Managed by migration until the contents are decided (R-12).</span>
                <span className={ui.readOnly}>{p.components.join(', ')}</span>
              </label>
            ) : null}
          </div>
        </fieldset>

        <div className={ui.actions}>
          <button className={ui.primary} type="submit">
            {confirmingRetire ? 'Yes, retire this product' : 'Save'}
          </button>
          <Link className={ui.link} href="/admin/products">
            Back to products
          </Link>
        </div>
      </form>
    </>
  );
}
