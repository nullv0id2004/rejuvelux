import Image from 'next/image';
import { Button, Card, Icon, type IconName } from '@/components/ds';
import { NewsletterBand } from '@/components/site/NewsletterBand';
import { Evidence, Eyebrow, Greybox, Ph, withSlots } from '@/components/site/primitives';
import { ScrollShowcase } from '@/components/site/ScrollShowcase';
import { RANGE_WORD, RANGE_WORD_CAP, SLOT, STORY } from '@/lib/data';

const CARDS: { eyebrow: string; title: string; body: string; shot: string; href: string; cta: string }[] =
  [
    {
      eyebrow: 'The collection',
      title: `${RANGE_WORD_CAP} expressions of one garden`,
      body: 'Silver Needle to CTC, arranged from ceremonial to everyday. Each carries its grade, lot and pluck month.',
      shot: 'Product set · tins on seamless surface',
      href: '#collection',
      cta: 'See the range',
    },
    {
      eyebrow: 'Sets and subscription',
      title: 'Taste the ladder, or settle on a rung',
      body: `A tasting box of all ${RANGE_WORD}, a flight of three, or one tin every four or eight weeks from the same lot.`,
      shot: `Tasting box · open · ${RANGE_WORD} tins`,
      href: '/alt-home#sets',
      cta: 'Discover',
    },
    {
      eyebrow: 'Gifting',
      title: 'A box that says what is in it',
      body: 'Two tins, a brew card and the lot sheet. The label carries the garden, the flush and the pluck month.',
      shot: 'Gift box · closed · lot number visible',
      href: '/alt-home#gifting',
      cta: 'Discover',
    },
  ];

const WHY: [IconName, string, string][] = [
  ['map-pin', 'One estate', 'A single garden in Assam. Its name, district and elevation are printed on every tin.'],
  ['calendar', 'Named flush', 'Picked in a stated month and sold within the season. The pluck date is printed, not implied.'],
  [
    'clipboard-list',
    'Graded and lotted',
    'Grade, lot and brew parameters on every product. Nothing is claimed without a number beside it.',
  ],
  ['package', 'Packed at source', 'Sealed in the tin at the garden. Ships within [00] hours, free above ₹[0,000].'],
];

export default function HomePage() {
  return (
    <main>
      {/* Hero — full-bleed photograph, headline overlaid. Sized to content, not
          to the viewport, so the objection-closing sections stay near the fold. */}
      <section
        data-theme="dark"
        style={{
          position: 'relative',
          minHeight: 620,
          display: 'grid',
          alignItems: 'center',
          background: 'var(--ink-800)',
          color: 'var(--bone-100)',
          overflow: 'hidden',
        }}
      >
        <div
          className="greybox"
          style={{ position: 'absolute', inset: 0 }}
          role="img"
          aria-label="The garden — interim photograph"
        >
          <Image
            src="/assets/tea-field.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(20,19,17,.72) 0%, rgba(20,19,17,.45) 55%, rgba(20,19,17,.2) 100%)',
            }}
          />
          <div
            className="gl"
            style={{
              position: 'absolute',
              right: 16,
              bottom: 12,
              padding: '5px 8px',
              background: 'rgba(20,19,17,.6)',
              color: 'var(--bone-100)',
              fontSize: 9,
            }}
          >
            Hero · 21:9 · Interim
          </div>
        </div>

        <div className="wrap" style={{ position: 'relative', padding: '96px var(--gutter-lg)' }}>
          <div className="stack g6" style={{ maxWidth: 620 }}>
            <Eyebrow>
              Single-origin Assam · <Ph>{SLOT.estate}</Ph>
            </Eyebrow>
            <h1 className="display" style={{ color: 'var(--bone-100)' }}>
              Earned, <em style={{ color: 'var(--gold-300)' }}>not indulged.</em>
            </h1>
            <p className="lead" style={{ color: 'var(--ink-300)' }}>
              India doesn&rsquo;t need better tea. India needs better access to its best tea.
            </p>
            <div className="row g3" style={{ flexWrap: 'wrap' }}>
              <Button size="lg" variant="inverse" href="#collection">
                Shop the collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="/garden"
                style={{ color: 'var(--bone-100)', borderColor: 'var(--bone-100)' }}
              >
                The garden
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three image-topped cards */}
      <section className="wrap sec">
        <div className="stack g3" style={{ marginBottom: 40 }}>
          <Eyebrow>RejuveLuxe</Eyebrow>
          <h2 className="h1">Not for the excess. For the earned.</h2>
        </div>
        <div className="grid cols-3">
          {CARDS.map((c) => (
            <Card key={c.eyebrow} padding={0} interactive>
              <Greybox label={c.shot} ratio="3 / 2" sizes="(max-width: 800px) 100vw, 380px" />
              <div className="stack g3" style={{ padding: 24 }}>
                <Eyebrow muted>{c.eyebrow}</Eyebrow>
                <h3 className="h3">{c.title}</h3>
                <p className="small">{c.body}</p>
                <div style={{ paddingTop: 8 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    href={c.href}
                    iconRight={<Icon name="arrow-right" size={14} />}
                  >
                    {c.cta}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Dark story band over the garden photograph */}
      <section
        style={{
          position: 'relative',
          minHeight: 520,
          display: 'grid',
          alignItems: 'center',
          background: 'var(--ink-800)',
          overflow: 'hidden',
        }}
      >
        <div
          className="greybox"
          style={{ position: 'absolute', inset: 0 }}
          role="img"
          aria-label="The garden — interim photograph"
        >
          <Image
            src="/assets/tea-field.jpeg"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '50% 70%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,19,17,.62)' }} />
          <div
            className="gl"
            style={{
              position: 'absolute',
              right: 16,
              bottom: 12,
              padding: '5px 8px',
              background: 'rgba(20,19,17,.6)',
              color: 'var(--bone-100)',
              fontSize: 9,
            }}
          >
            The garden · 21:9 · Interim
          </div>
        </div>

        <div className="wrap" style={{ position: 'relative', padding: '80px var(--gutter-lg)' }}>
          <div className="split-wide" style={{ alignItems: 'end' }}>
            <div className="stack g6" style={{ color: 'var(--bone-100)' }}>
              <Eyebrow style={{ color: 'var(--gold-300)' }}>The garden</Eyebrow>
              <h2 className="h1 it" style={{ color: 'var(--bone-100)' }}>
                We went to the source.
              </h2>
              <p className="lead" style={{ color: 'var(--ink-300)' }}>
                {STORY[2]}
              </p>
              <div>
                <Button variant="inverse" href="/garden">
                  Read about the garden
                </Button>
              </div>
            </div>
            <div style={{ maxWidth: 360, justifySelf: 'end', width: '100%' }}>
              <Evidence
                inverse
                rows={[
                  ['Estate', SLOT.estate],
                  ['District', SLOT.district],
                  ['Elevation', SLOT.elevation],
                  ['Flush', SLOT.flush],
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* The collection ladder as a scroll-driven showcase */}
      <div id="collection" className="wrap" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="stack g3" style={{ textAlign: 'center', alignItems: 'center' }}>
          <Eyebrow>The collection</Eyebrow>
          <h2 className="h1 it">{RANGE_WORD_CAP} expressions. One garden.</h2>
          <p className="small" style={{ maxWidth: 520 }}>
            Ceremonial to everyday. Scroll through the range; each tea holds the screen for one turn
            of the wheel.
          </p>
        </div>
      </div>

      <ScrollShowcase />

      <div className="wrap" style={{ paddingTop: 16 }}>
        <p className="cap">*All prices are a single placeholder value pending pricing.</p>
      </div>

      {/* Why RejuveLuxe — the objection bar as a round-badge row */}
      <section className="wrap sec rule-t">
        <div
          className="stack g3"
          style={{ textAlign: 'center', alignItems: 'center', marginBottom: 48 }}
        >
          <Eyebrow>Why RejuveLuxe</Eyebrow>
          <h2 className="h1 it">Proven, not asserted.</h2>
        </div>
        <div className="grid cols-4" style={{ gap: 40 }}>
          {WHY.map(([icon, title, body]) => (
            <div
              key={title}
              className="stack g4"
              style={{ alignItems: 'center', textAlign: 'center' }}
            >
              <span
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--accent-soft)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--gold-600)',
                }}
              >
                <Icon name={icon} size={26} />
              </span>
              <h3 className="h3">{title}</h3>
              <p className="small">{withSlots(body)}</p>
            </div>
          ))}
        </div>
      </section>

      <NewsletterBand />
    </main>
  );
}
