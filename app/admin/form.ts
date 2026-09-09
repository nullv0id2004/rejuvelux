/**
 * The admin's form conventions, shared by every stage 3-6 screen.
 *
 * The admin ships no client JavaScript (features/admin.md §6.6), so a form is
 * a plain POST to a server action and the answer is a redirect. Three things
 * travel back in the query string, and this file is the one place that names
 * them:
 *
 *   ?done=<sentence>      the mutation happened; say so once
 *   ?refused=<sentence>   the domain declined; say why (§6.5, §5 "Refused")
 *   ?confirm=1            a consequential action needs a second submit (§6.3)
 *   ?f.<name>=<value>     the submitted fields, so a refused or unconfirmed
 *                         form re-renders with what the person typed
 *
 * A redirect carrying the field values is the price of having no client
 * state. It is bounded: the longest admin form is a product's description.
 */

export type SearchParams = Record<string, string | string[] | undefined>;

/** The first value of a query key, or undefined. */
export function one(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

/** A submitted field carried back through `?f.<name>=`. */
export function prefilled(sp: SearchParams, name: string): string | undefined {
  return one(sp, `f.${name}`);
}

/** The submitted value, else the carried-back value, else the row's. */
export function initial(sp: SearchParams, name: string, fallback: string): string {
  return prefilled(sp, name) ?? fallback;
}

export interface Notice {
  done?: string;
  refused?: string;
  confirm: boolean;
}

export function readNotice(sp: SearchParams): Notice {
  return {
    ...(one(sp, 'done') ? { done: one(sp, 'done') } : {}),
    ...(one(sp, 'refused') ? { refused: one(sp, 'refused') } : {}),
    confirm: one(sp, 'confirm') === '1',
  };
}

/** Everything the person typed, as `f.<name>` pairs, for the round trip. */
export function carry(formData: FormData, names: readonly string[]): URLSearchParams {
  const out = new URLSearchParams();
  for (const name of names) {
    const v = formData.get(name);
    if (typeof v === 'string' && v !== '') out.set(`f.${name}`, v);
  }
  return out;
}

/** Build the redirect target: path plus whichever of these are present. */
export function backTo(
  path: string,
  extra: { done?: string; refused?: string; confirm?: boolean; carry?: URLSearchParams } = {}
): string {
  const q = new URLSearchParams(extra.carry ?? undefined);
  if (extra.done) q.set('done', extra.done);
  if (extra.refused) q.set('refused', extra.refused);
  if (extra.confirm) q.set('confirm', '1');
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

/** A trimmed string field, or '' when absent. */
export function text(formData: FormData, name: string): string {
  const v = formData.get(name);
  return typeof v === 'string' ? v.trim() : '';
}

/** An optional string field: '' becomes null, so an emptied field clears. */
export function optionalText(formData: FormData, name: string): string | null {
  const v = text(formData, name);
  return v === '' ? null : v;
}

/** A whole-number field, or NaN when absent or malformed. */
export function integer(formData: FormData, name: string): number {
  const v = text(formData, name);
  if (v === '' || !/^-?\d+$/.test(v)) return Number.NaN;
  return Number.parseInt(v, 10);
}

export function checked(formData: FormData, name: string): boolean {
  return formData.get(name) === 'on' || formData.get(name) === '1';
}
