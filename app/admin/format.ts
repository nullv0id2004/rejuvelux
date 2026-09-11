/**
 * Display formatting for the admin. Dates in Indian English, times in IST,
 * because the client team is in India and an order timestamp shown in UTC
 * would be a support ticket. Money reuses the storefront's formatter so the
 * shop and the admin never disagree about how a rupee looks.
 */

export { formatPrice as rupees } from '@/lib/catalogue';

const TZ = 'Asia/Kolkata';

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: TZ,
  });
}

export function formatDateTime(d: Date): string {
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TZ,
  });
}

/** Whole rupees from paise, for a price input's default value. */
export function paiseToRupees(paise: number | null): string {
  return paise === null ? '' : String(Math.round(paise / 100));
}

/** Paise from a whole-rupee field; null when the field is empty. */
export function rupeesToPaise(rupees: string): number | null {
  const v = rupees.trim();
  if (v === '') return null;
  if (!/^\d+$/.test(v)) return Number.NaN;
  return Number.parseInt(v, 10) * 100;
}
