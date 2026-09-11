/**
 * /admin/products/new — create a product (features/admin.md §4, stage 3).
 *
 * A product is created as a draft with one variant and an empty stock item
 * behind it, so three separate, visible steps stand between "created" and
 * "on sale": give it a price, count its stock, set it active. Nothing here can
 * put an unpriced or unstocked product in front of a customer.
 *
 * Origin is fixed at "Assam, India" (R-03, open call #11) and is not asked.
 */

import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth/session';
import {
  TERRITORIES,
  createProduct,
  type Territory,
} from '@/lib/server/admin/products';
import { explainRefusal } from '@/lib/server/admin/refusal';
import { rupeesToPaise } from '../../format';
import {
  backTo,
  carry,
  initial,
  integer,
  optionalText,
  readNotice,
  text,
  type SearchParams,
} from '../../form';
import { Notices } from '../../notices';
import shell from '../../admin.module.css';
import ui from '../../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Add a product' };

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
  'sku',
  'netQuantity',
  'price',
] as const;

const PATH = '/admin/products/new';

async function create(formData: FormData) {
  'use server';
  const session = await requireAdmin();
  const carried = carry(formData, FIELDS);

  const territory = text(formData, 'territory');
  const price = rupeesToPaise(text(formData, 'price'));

  let created: { productId: string } | null = null;
  let refused: string | null = null;
  try {
    created = await createProduct(
      session,
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
      },
      {
        sku: text(formData, 'sku').toUpperCase(),
        name: null,
        netQuantity: text(formData, 'netQuantity'),
        pricePaise: price,
      }
    );
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  if (refused || !created) redirect(backTo(PATH, { refused: refused ?? undefined, carry: carried }));

  revalidatePath('/', 'layout');
  redirect(
    backTo(`/admin/products/${created.productId}`, {
      done: 'Created as a draft. It is not on the shop until its status is active, and cannot be bought until it has a price and stock.',
    })
  );
}

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const v = (name: string, fallback = '') => initial(sp, name, fallback);

  return (
    <>
      <h1 className={shell.pageTitle}>Add a product</h1>
      <p className={shell.pageIntro}>
        Starts as a draft, unseen by customers. Origin is always Assam, India.
      </p>

      <Notices notice={readNotice(sp)} />

      <form className={`${ui.form} ${ui.formWide}`} action={create}>
        <fieldset className={ui.fieldset}>
          <legend className={ui.legend}>The product</legend>

          <label className={ui.field}>
            <span className={ui.label}>Name</span>
            <span className={ui.hint}>As it appears on the tin and the shop.</span>
            <input className={ui.input} name="name" required maxLength={120} defaultValue={v('name')} autoFocus />
          </label>

          <label className={ui.field}>
            <span className={ui.label}>Slug</span>
            <span className={ui.hint}>
              The address: /shop/<em>slug</em>. Lowercase letters, digits and hyphens. It can
              be changed only while the product is a draft.
            </span>
            <input
              className={ui.input}
              name="slug"
              required
              maxLength={80}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              defaultValue={v('slug')}
            />
          </label>

          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>Kind of tea</span>
              <span className={ui.hint}>For example "White tea, young buds".</span>
              <input className={ui.input} name="teaType" required maxLength={80} defaultValue={v('teaType')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Territory</span>
              <span className={ui.hint}>Only the three heroes carry one.</span>
              <select className={ui.select} name="territory" defaultValue={v('territory')}>
                <option value="">None</option>
                {TERRITORIES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={ui.field}>
            <span className={ui.label}>Short description</span>
            <span className={ui.hint}>One or two sentences. Shown on the shop.</span>
            <textarea className={ui.textarea} name="shortDescription" required maxLength={600} defaultValue={v('shortDescription')} />
          </label>

          <label className={ui.field}>
            <span className={ui.label}>Ingredients</span>
            <input className={ui.input} name="ingredients" required maxLength={200} defaultValue={v('ingredients')} />
          </label>

          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>Brewing: leaf</span>
              <span className={ui.hint}>e.g. 3 g</span>
              <input className={ui.input} name="brewingLeaf" maxLength={40} defaultValue={v('brewingLeaf')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Brewing: water</span>
              <span className={ui.hint}>e.g. 80 °C</span>
              <input className={ui.input} name="brewingWater" maxLength={40} defaultValue={v('brewingWater')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Brewing: time</span>
              <span className={ui.hint}>e.g. 3-4 min</span>
              <input className={ui.input} name="brewingTime" maxLength={40} defaultValue={v('brewingTime')} />
            </label>
          </div>

          <label className={ui.field}>
            <span className={ui.label}>Sort order</span>
            <span className={ui.hint}>Lower comes first on the shop. Existing products use 10, 20, 30.</span>
            <input className={ui.input} type="number" name="sortOrder" min={0} max={9999} step={1} required defaultValue={v('sortOrder', '60')} />
          </label>
        </fieldset>

        <fieldset className={ui.fieldset}>
          <legend className={ui.legend}>The first variant</legend>

          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>SKU</span>
              <span className={ui.hint}>Capitals, digits, hyphens. e.g. RJ-SILVER-50</span>
              <input className={ui.input} name="sku" required maxLength={40} pattern="[A-Za-z0-9]+(-[A-Za-z0-9]+)*" defaultValue={v('sku')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Net quantity</span>
              <span className={ui.hint}>e.g. 50 g</span>
              <input className={ui.input} name="netQuantity" required maxLength={40} defaultValue={v('netQuantity')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Price, in rupees</span>
              <span className={ui.hint}>Leave empty if not confirmed. It can be set later.</span>
              <input className={ui.input} type="number" name="price" min={0} step={1} defaultValue={v('price')} />
            </label>
          </div>
        </fieldset>

        <div className={ui.actions}>
          <button className={ui.primary} type="submit">
            Create as a draft
          </button>
          <Link className={ui.link} href="/admin/products">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
