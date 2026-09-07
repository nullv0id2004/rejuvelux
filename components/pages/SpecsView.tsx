'use client';

import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Icon,
  IconButton,
  Input,
  Select,
  Switch,
  Tabs,
  Tag,
} from '@/components/ds';
import { Accordion, Ladder, Tile } from '@/components/site/interactive';
import { Evidence, Eyebrow, Greybox, Scale, Swatch, Wordmark } from '@/components/site/primitives';
import { useCatalogue, useProduct } from '@/lib/catalogue-context';
import { FAQS, rangeWordCap, SLOT } from '@/lib/data';
import { useCart } from '@/lib/cart';

function Block({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div className="spec-block">
      <div className="stack g2">
        <Eyebrow>{label}</Eyebrow>
        {note && <p className="cap">{note}</p>}
      </div>
      <div className="stack g6">{children}</div>
    </div>
  );
}

const TOKEN_SWATCHES: [string, string][] = [
  ['--bg-page', 'Page'],
  ['--surface-card', 'Surface'],
  ['--bg-page-alt', 'Inset'],
  ['--text-primary', 'Ink'],
  ['--text-secondary', 'Ink 2'],
  ['--text-tertiary', 'Muted'],
  ['--border-subtle', 'Line'],
  ['--border-strong', 'Line strong'],
  ['--accent', 'Gold'],
];

function Specimen({ theme }: { theme: 'light' | 'dark' }) {
  const catalogue = useCatalogue();
  const rangeCap = rangeWordCap(catalogue.length);
  return (
    <div className="theme-pane" data-theme={theme}>
      <div className="between">
        <Eyebrow>{theme} theme</Eyebrow>
        <span className="cap">Tokens redefined on [data-theme]</span>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(96px,1fr))', gap: 12 }}
      >
        {TOKEN_SWATCHES.map(([token, label]) => (
          <div key={token} className="sw">
            <i style={{ background: `var(${token})` }} />
            <span>
              {label}
              <br />
              {token}
            </span>
          </div>
        ))}
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(88px,1fr))', gap: 12 }}
      >
        {catalogue.map((p) => (
          <div key={p.slug} className="sw">
            <i style={{ background: p.tin, boxShadow: `inset 0 -16px 0 ${p.ink}` }} />
            <span>
              {p.name}
              <br />
              tin / ink
            </span>
          </div>
        ))}
      </div>

      <div className="stack g4 rule-t" style={{ paddingTop: 24 }}>
        <p className="display" style={{ fontSize: 'clamp(36px,6cqw,64px)' }}>
          Earned, <em>not</em> indulged.
        </p>
        <span className="cap">Display · Playfair Display 400 · italic for emphasis</span>

        <h2 className="h1">{rangeCap} expressions. One garden.</h2>
        <span className="cap">H1 · Playfair Display 400 · balanced</span>

        <h3 className="h3 it">Golden Tips</h3>
        <span className="cap">H3 italic · product names</span>

        <p className="lead">
          India doesn&rsquo;t need better tea. India needs better access to its best tea.
        </p>
        <span className="cap">Lead · Figtree 300 18/1.65 · editorial</span>

        <p className="body">
          Made almost entirely from young, tender buds, minimally processed to preserve every
          delicate note.
        </p>
        <span className="cap">Body · Figtree 400 15/1.5</span>

        <Eyebrow>Evidence · Lot [LOT-0000]</Eyebrow>
        <span className="cap">Eyebrow · Figtree 500 11 · 0.22em caps · gold</span>

        <span className="price">₹1,250 · 0.80 g</span>
        <span className="cap">Price and data · Playfair 18 · tabular numerals</span>
      </div>

      <div className="row g4" style={{ flexWrap: 'wrap' }}>
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Input placeholder="Input" size="sm" style={{ width: 160 }} />
      </div>
    </div>
  );
}

/**
 * Deliverables 4, 5, 8, 9 and 10 on one page. Every object here is the live
 * component the pages use, not a drawing of it.
 */
export function SpecsView() {
  const catalogue = useCatalogue();
  const [state, setState] = useState('assam-golden-tips');
  const [sw, setSw] = useState(false);
  const { replace, setOpen } = useCart();
  const activeStop = useProduct(state);

  return (
    <main>
      <div className="wrap sec spec">
        <div className="stack g4">
          <Eyebrow>Deliverables 4, 5, 8, 9, 10</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
            Components and specimen.
          </h1>
          <p className="lead">
            Every object on this page is the live component used in the pages, not a drawing of it.
          </p>
        </div>

        <Block
          label="10 · Wordmark"
          note="Cinzel substitute for the Trajan-style small caps. Strapline in eyebrow style. One colour. No crest until the client supplies an SVG."
        >
          <div className="grid cols-2">
            {(['light', 'dark'] as const).map((t) => (
              <div
                key={t}
                className="theme-pane"
                data-theme={t}
                style={{ gap: 40, alignItems: 'flex-start' }}
              >
                <Wordmark size={28} />
                <Wordmark stacked size={34} />
                <span className="cap">{t} · horizontal, stacked</span>
              </div>
            ))}
          </div>
        </Block>

        <Block
          label="9 · Colour and type"
          note="Both themes side by side. Dark redefines semantic tokens only; base palette is unchanged."
        >
          <div className="grid cols-2" style={{ alignItems: 'start' }}>
            <Specimen theme="light" />
            <Specimen theme="dark" />
          </div>
        </Block>

        <Block
          label="4 · Collection ladder"
          note="Three states. Rest, active stop (hover, focus or touch), and narrow viewport where the track scrolls inside its own container."
        >
          <div className="stack g3">
            <Eyebrow muted>At rest</Eyebrow>
            <div className="hair" style={{ padding: 24 }}>
              <Ladder linkToProduct={false} />
            </div>
          </div>
          <div className="stack g3">
            <div className="between">
              <Eyebrow muted>Active stop · {activeStop?.name ?? '—'}</Eyebrow>
              <Tabs
                variant="underline"
                items={catalogue.map((p) => ({ value: p.slug, label: p.name }))}
                value={state}
                onChange={setState}
              />
            </div>
            <div className="hair" style={{ padding: 24 }}>
              <Ladder active={state} onSelect={setState} linkToProduct={false} />
            </div>
          </div>
          <div className="stack g3">
            <Eyebrow muted>Narrow · 390 px · horizontal scroll, snap per stop</Eyebrow>
            <div
              className="hair rjx-app"
              style={{
                width: 390,
                maxWidth: '100%',
                padding: 16,
                minHeight: 0,
                background: 'var(--bg-page)',
              }}
            >
              <Ladder compact linkToProduct={false} />
            </div>
          </div>
        </Block>

        <Block
          label="5 · Cart drawer"
          note="Empty and filled states open the real drawer. Free-shipping progress in ink on inset surface, 4 px. Focus is trapped while open; Escape closes."
        >
          <div className="row g3" style={{ flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              onClick={() => {
                replace([]);
                setOpen(true);
              }}
            >
              Open empty
            </Button>
            <Button
              onClick={() => {
                // Fills from whatever the catalogue actually holds, so the
                // demo cannot reference a slug the database has retired.
                replace(
                  catalogue
                    .filter((p) => !p.unavailable)
                    .slice(0, 2)
                    .map((p, i) => ({ slug: p.slug, qty: i + 1 })),
                );
                setOpen(true);
              }}
            >
              Open filled
            </Button>
          </div>
        </Block>

        <Block
          label="8 · Buttons"
          note="Ink primary, hairline outline that fills on hover, ghost that goes gold. Three sizes. 2 px radius. No shadow, no transform."
        >
          <div className="row g3" style={{ flexWrap: 'wrap' }}>
            <Button size="lg">Add to cart</Button>
            <Button>Add to cart</Button>
            <Button size="sm">Add</Button>
            <Button variant="outline">Details</Button>
            <Button variant="ghost" iconRight={<Icon name="arrow-right" size={14} />}>
              Brew guide
            </Button>
            <Button disabled>Sold out</Button>
            <IconButton label="Cart" badge={3}>
              <Icon name="shopping-bag" size={20} />
            </IconButton>
          </div>
        </Block>

        <Block label="8 · Inputs" note="1 px border, 2 px radius, gold focus ring. Eyebrow label above.">
          <div className="grid cols-3">
            <Input label="Email" placeholder="name@domain.in" />
            <Input label="Pincode" placeholder="000000" hint="Six digits" />
            <Input label="Voucher" error="Code not recognised" defaultValue="ASSAM10" />
            <Select
              label="Size"
              options={[
                { value: '50', label: '50 g' },
                { value: '100', label: '100 g' },
              ]}
              defaultValue="50"
            />
            <div className="stack g3" style={{ paddingTop: 22 }}>
              <Checkbox label="Gift wrap" />
              <Switch label="Subscribe and save" checked={sw} onChange={setSw} />
            </div>
          </div>
        </Block>

        <Block
          label="8 · Evidence rows and labels"
          note="The core repeating object. Eyebrow label left, tabular value right, hairline between rows. Bracketed slots are visibly empty."
        >
          <div className="grid cols-2">
            <Evidence
              rows={[
                ['Garden', SLOT.estate],
                ['District', SLOT.district],
                ['Elevation', SLOT.elevation],
                ['Grade', SLOT.grade],
                ['Flush', SLOT.flush],
                ['Pluck month', SLOT.pluck],
                ['Lot', SLOT.lot],
                ['Net weight', '100 g'],
              ]}
            />
            <div className="stack g6">
              <div className="stack g2">
                <Eyebrow>Gold eyebrow · section label</Eyebrow>
                <Eyebrow muted>Muted eyebrow · field label</Eyebrow>
              </div>
              <div className="row g3" style={{ flexWrap: 'wrap' }}>
                <Badge>Neutral</Badge>
                <Badge tone="ink">Rare</Badge>
                <Badge tone="gold">New</Badge>
                <Tag>Whole leaf</Tag>
                <Tag>Second flush</Tag>
              </div>
            </div>
          </div>
        </Block>

        <Block
          label="8 · Swatches and intensity scales"
          note="24 px tin colour with a 1 px ring in the tin's ink. Scales fill in the ink colour, five segments, labelled Body and Briskness."
        >
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))' }}
          >
            {catalogue.map((p) => (
              <div key={p.slug} className="stack g3">
                <div className="row g3">
                  <Swatch p={p} />
                  <span className="small" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </span>
                </div>
                <div className="stack g3" style={{ color: p.ink }}>
                  <Scale label="Body" value={p.body ?? 0} />
                  <Scale label="Briskness" value={p.brisk ?? 0} />
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block
          label="8 · Product tile"
          note="The only card on the site. Tin on its colour, name, italic descriptor, evidence rows, price, both CTAs. Ink colour as a 3 px top rule."
        >
          <div className="grid cols-3">
            {catalogue.slice(0, 3).map((p) => (
              <Tile key={p.slug} p={p} />
            ))}
          </div>
        </Block>

        <Block
          label="8 · Accordion"
          note="Full-width row, hairline bottom, plus/minus, closed by default, 200 ms height ease."
        >
          <div style={{ maxWidth: 640 }}>
            <Accordion items={FAQS.slice(0, 3)} />
          </div>
        </Block>

        <Block
          label="8 · Greybox"
          note="Photography placeholder at the correct ratio, labelled with the asset direction. Never stock imagery."
        >
          <div className="grid cols-3">
            <Greybox label="Product · seamless surface" ratio="4 / 5" />
            <Greybox label="Editorial · 3:2" ratio="3 / 2" />
            <Greybox label="Garden · 16:9" ratio="16 / 9" />
          </div>
        </Block>
      </div>
    </main>
  );
}
