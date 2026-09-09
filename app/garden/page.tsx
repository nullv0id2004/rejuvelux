import type { Metadata } from 'next';
import Link from 'next/link';
import { Evidence, Eyebrow, Greybox, Ph, Swatch } from '@/components/site/primitives';
import { listProducts } from '@/lib/catalogue';
import { rangeWordCap, SLOT, STORY } from '@/lib/data';

export const metadata: Metadata = {
  title: 'The Garden',
  description:
    'One garden, on purpose. A single estate in Assam: its district, elevation, flush and the people who work it.',
};

/**
 * Long-form editorial: a single 720px column with full-bleed photography
 * breaking it at intervals, and the evidence rows at the head of the page.
 */
export default async function GardenPage() {
  const products = await listProducts();
  const rangeCap = rangeWordCap(products.length);
  return (
    <main>
      <section className="wrap" style={{ padding: '96px 0 48px' }}>
        <div className="editorial" style={{ gap: 32 }}>
          <Eyebrow>
            The Garden · <Ph>{SLOT.district}</Ph>, Assam
          </Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
            One garden, on purpose.
          </h1>
          <Evidence
            rows={[
              ['Estate', SLOT.estate],
              ['District', SLOT.district],
              ['Elevation', SLOT.elevation],
              ['Area under tea', '[000 ha]'],
              ['Current flush', SLOT.flush],
              ['Manager', '[MANAGER NAME]'],
            ]}
          />
        </div>
      </section>

      <Greybox
        label="The garden · rows under overcast sky"
        ratio="16 / 9"
        className="bleed"
        style={{ maxHeight: 720 }}
        sizes="100vw"
        priority
      />

      <section className="wrap sec">
        <div className="editorial">
          {STORY.slice(0, 2).map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>

      <div className="wrap">
        <div className="grid cols-2">
          <div className="stack g2">
            <Greybox label="Sorting table · working conditions" ratio="3 / 2" />
            <span className="cap">
              <Ph>[PLUCKER NAME]</Ph> and <Ph>[PLUCKER NAME]</Ph> at the sorting table,{' '}
              <Ph>[MONTH]</Ph>.
            </span>
          </div>
          <div className="stack g2">
            <Greybox label="Withering shed · interior" ratio="3 / 2" />
            <span className="cap">
              The withering shed. Silver Needle spends its longest stage here.
            </span>
          </div>
        </div>
      </div>

      <section className="wrap sec">
        <div className="editorial">
          {STORY.slice(2).map((t) => (
            <p key={t}>{t}</p>
          ))}
          <div className="row g4 rule-t" style={{ paddingTop: 24, alignItems: 'flex-start' }}>
            <Greybox
              label="Portrait"
              ratio="4 / 5"
              style={{ width: 120, flex: 'none' }}
              sizes="120px"
            />
            <div className="stack g2" style={{ paddingTop: 4 }}>
              <span className="body" style={{ color: 'var(--text-primary)' }}>
                <Ph>[MANAGER NAME]</Ph>
              </span>
              <span className="small">
                Estate manager, <Ph>{SLOT.estate}</Ph>. <Ph>[00]</Ph> years in tea. Photographed in
                the factory, not in a field at sunset.
              </span>
            </div>
          </div>
        </div>
      </section>

      <Greybox
        label="Garden · sheds and factory · flat light"
        ratio="16 / 9"
        className="bleed"
        style={{ maxHeight: 560 }}
        sizes="100vw"
      />

      <section className="wrap sec">
        <div className="editorial" style={{ alignItems: 'flex-start' }}>
          <Eyebrow>From this garden</Eyebrow>
          <h2 className="h1">{rangeCap} expressions of one leaf.</h2>
          <div className="row g3" style={{ flexWrap: 'wrap' }}>
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                className="row g2 hair"
                style={{
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  font: 'var(--type-body-sm)',
                  minHeight: 44,
                }}
              >
                <Swatch p={p} size={14} />
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
