import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { Button, Card } from '@/components/ds';
import { CONTACT } from '@/lib/data';
import type { ContentPage, Cta, Section } from '@/lib/content/types';
import { ContactForm } from './ContactForm';
import { GiftingForm } from './GiftingForm';
import { Accordion } from './interactive';
import { Evidence, Eyebrow, withSlots } from './primitives';

/** Metadata straight from the content record. Titles are full strings, not the layout template. */
export function contentMetadata(page: ContentPage): Metadata {
  return {
    title: { absolute: page.seoTitle },
    description: page.description,
    openGraph: { title: page.seoTitle, description: page.description },
    ...(page.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

function Ctas({ cta, inverse }: { cta?: Cta[]; inverse?: boolean }) {
  if (!cta?.length) return null;
  return (
    <div className="row g3" style={{ flexWrap: 'wrap', paddingTop: 8 }}>
      {cta.map((c, i) => (
        <Button
          key={c.href + c.label}
          href={c.href}
          variant={i === 0 ? (inverse ? 'inverse' : undefined) : 'outline'}
          style={i > 0 && inverse ? { color: 'var(--bone-100)', borderColor: 'var(--bone-100)' } : undefined}
        >
          {c.label}
        </Button>
      ))}
    </div>
  );
}

function Heading({ eyebrow, title, intro }: { eyebrow?: string; title?: string; intro?: string }) {
  return (
    <>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && <h2 className="h2">{title}</h2>}
      {intro && <p className="lead">{withSlots(intro)}</p>}
    </>
  );
}

function Block({ s }: { s: Section }) {
  switch (s.t) {
    case 'text':
      return (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ alignItems: 'flex-start' }}>
            <Heading eyebrow={s.eyebrow} title={s.title} />
            {s.body.map((p) => (
              <p key={p}>{withSlots(p)}</p>
            ))}
            <Ctas cta={s.cta} />
          </div>
        </section>
      );

    case 'cards':
      return (
        <section className="wrap sec rule-t">
          <div className="stack g6">
            {(s.eyebrow || s.title || s.intro) && (
              <div className="stack g3" style={{ maxWidth: 720 }}>
                <Heading eyebrow={s.eyebrow} title={s.title} intro={s.intro} />
              </div>
            )}
            <div className={`grid ${s.cards.length === 3 ? 'cols-3' : 'cols-2'}`}>
              {s.cards.map((c) => (
                <Card key={c.title} padding={c.image ? 0 : 28}>
                  {c.image && (
                    <div className="card-media" style={{ aspectRatio: c.image.ratio ?? '1 / 1' }}>
                      <Image
                        src={c.image.src}
                        alt={c.image.alt}
                        fill
                        sizes="(max-width: 800px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="stack g3" style={{ flex: 1, padding: c.image ? 24 : 0 }}>
                    {c.eyebrow && <Eyebrow muted>{c.eyebrow}</Eyebrow>}
                    <h3 className="h3">{c.title}</h3>
                    <p className="small">{withSlots(c.body)}</p>
                    {c.cta && (
                      <div style={{ paddingTop: 8, marginTop: 'auto' }}>
                        <Button size="sm" variant="outline" href={c.cta.href}>
                          {c.cta.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <Ctas cta={s.cta} />
          </div>
        </section>
      );

    case 'table':
      return (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ alignItems: 'flex-start' }}>
            <Heading title={s.title} intro={s.intro} />
            <div className="ctable-wrap">
              <table className="ctable">
                <thead>
                  <tr>
                    {s.head.map((th) => (
                      <th key={th} scope="col">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.rows.map((row) => (
                    <tr key={row.join('|')}>
                      {row.map((cell, i) =>
                        i === 0 ? (
                          <th key={cell} scope="row">
                            {withSlots(cell)}
                          </th>
                        ) : (
                          <td key={cell}>{withSlots(cell)}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Ctas cta={s.cta} />
          </div>
        </section>
      );

    case 'steps': {
      const List = s.ordered ? 'ol' : 'ul';
      return (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ alignItems: 'flex-start' }}>
            <Heading title={s.title} intro={s.intro} />
            <List className="stack g3" style={{ paddingLeft: 22, margin: 0 }}>
              {s.items.map((item) => (
                <li key={item}>{withSlots(item)}</li>
              ))}
            </List>
            <Ctas cta={s.cta} />
          </div>
        </section>
      );
    }

    case 'gallery':
      return (
        <section className="wrap sec rule-t">
          <div className="stack g6">
            {s.title && <h2 className="h2">{s.title}</h2>}
            <div className="grid cols-2">
              {s.images.map((img) => (
                <figure key={img.src} className="stack g2" style={{ margin: 0 }}>
                  <div className="content-photo" style={{ aspectRatio: img.ratio ?? '1 / 1' }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 800px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {img.caption && <figcaption className="cap">{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    case 'faq':
      return (
        <section className="wrap sec rule-t">
          <div className="split-wide" style={{ alignItems: 'start' }}>
            <div className="stack g4">
              <h2 className="h2">{s.title}</h2>
              <Ctas cta={s.cta} />
            </div>
            <Accordion items={s.items} />
          </div>
        </section>
      );

    case 'details':
      return (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ alignItems: 'flex-start' }}>
            <Heading title={s.title} />
            <Evidence rows={s.rows} style={{ width: '100%' }} />
          </div>
        </section>
      );

    case 'band':
      return (
        <section data-theme="dark" style={{ background: 'var(--ink-900)', color: 'var(--bone-100)' }}>
          <div className="wrap" style={{ padding: '88px var(--gutter-lg)' }}>
            <div className="stack g5" style={{ maxWidth: 680 }}>
              {s.eyebrow && <Eyebrow style={{ color: 'var(--gold-300)' }}>{s.eyebrow}</Eyebrow>}
              <h2 className="h1 it" style={{ color: 'var(--bone-100)' }}>
                {s.title}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="lead" style={{ color: 'var(--ink-300)' }}>
                  {withSlots(p)}
                </p>
              ))}
              <Ctas cta={s.cta} inverse />
            </div>
          </div>
        </section>
      );

    case 'form':
      return (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ alignItems: 'flex-start' }}>
            <Heading title={s.title} intro={s.intro} />
            {s.form === 'contact' ? (
              // useSearchParams reads ?topic=, so the form renders on the client
              // inside its own boundary while the page around it prerenders.
              <Suspense fallback={<div style={{ minHeight: 480, width: '100%' }} />}>
                <ContactForm />
              </Suspense>
            ) : (
              <GiftingForm />
            )}
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ alignItems: 'flex-start' }}>
            <Heading title={s.title} />
            <Evidence
              style={{ width: '100%' }}
              rows={[
                ['Email', CONTACT.email],
                ['Phone', CONTACT.phone],
                ['Support hours', '[SUPPORT_HOURS_AND_TIME_ZONE]'],
                ['Business name and address', `${CONTACT.entity}, ${CONTACT.address}`],
                ['FSSAI Lic. No.', CONTACT.fssai],
              ]}
            />
            <div className="row g3" style={{ flexWrap: 'wrap' }}>
              <Button href={`mailto:${CONTACT.email}`}>Email Customer Care</Button>
              <Button variant="outline" href={`tel:${CONTACT.phoneHref}`}>
                {CONTACT.phone}
              </Button>
            </div>
          </div>
        </section>
      );
  }
}

/** One editorial page from a content record: a heading block, then its sections in order. */
export function ContentView({ page }: { page: ContentPage }) {
  return (
    <main>
      <section className="wrap" style={{ padding: '96px 0 48px' }}>
        <div className={page.image ? 'split-wide' : undefined} style={page.image ? { alignItems: 'center' } : undefined}>
          <div className="editorial" style={{ gap: 24, alignItems: 'flex-start' }}>
            {page.eyebrow && <Eyebrow>{page.eyebrow}</Eyebrow>}
            <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
              {page.title}
            </h1>
            {page.lead?.map((p) => (
              <p key={p} className="lead">
                {withSlots(p)}
              </p>
            ))}
            <Ctas cta={page.cta} />
          </div>
          {page.image?.photo ? (
            <div className="content-photo" style={{ aspectRatio: page.image.ratio ?? '1 / 1' }}>
              <Image
                src={page.image.src}
                alt={page.image.alt}
                fill
                sizes="(max-width: 800px) 100vw, 560px"
                loading="eager"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : page.image ? (
            <div className="tinbox" style={{ background: page.image.tin, aspectRatio: '1 / 1', width: '100%' }}>
              <Image
                src={page.image.src}
                alt={page.image.alt}
                width={900}
                height={900}
                sizes="(max-width: 800px) 90vw, 480px"
                priority
              />
            </div>
          ) : null}
        </div>
      </section>
      {page.sections.map((s, i) => (
        <Block key={i} s={s} />
      ))}
    </main>
  );
}
