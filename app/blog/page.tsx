import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, Greybox } from '@/components/site/primitives';
import { POSTS_BY_DATE, formatDate } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes on brewing, provenance and the work behind the tin — from the people who pack RejuveLuxe single-origin Assam tea.',
};

/** Byline row: category, date, reading time. Shared by the lead and the cards. */
function Meta({ category, date, minutes }: { category: string; date: string; minutes: number }) {
  return (
    <div className="row g4 cap" style={{ color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--accent)' }}>{category}</span>
      <time dateTime={date}>{formatDate(date)}</time>
      <span>{minutes} min read</span>
    </div>
  );
}

export default function BlogPage() {
  const [lead, ...rest] = POSTS_BY_DATE;

  return (
    <main>
      <section className="wrap" style={{ padding: '96px 0 40px' }}>
        <div className="editorial" style={{ gap: 24 }}>
          <Eyebrow>Blog</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
            Notes from the tin.
          </h1>
          <p className="lead">
            Brewing that works, provenance we can prove, and the parts of the process that decide
            what ends up in the cup. Written by the people who pack it.
          </p>
        </div>
      </section>

      {/* Lead story — full width, so the newest post is unmistakably the newest. */}
      <section className="wrap" style={{ paddingBottom: 64 }}>
        <Link href={`/blog/${lead.id}`} className="post-lead">
          <Greybox label={lead.hero} ratio="21 / 9" sizes="100vw" priority />
          <div className="stack g3" style={{ paddingTop: 24, maxWidth: 720 }}>
            <Meta category={lead.category} date={lead.date} minutes={lead.minutes} />
            <h2 className="h2">{lead.title}</h2>
            <p className="lead" style={{ color: 'var(--text-secondary)' }}>
              {lead.dek}
            </p>
            <span className="cap" style={{ color: 'var(--accent)' }}>
              Read the piece
            </span>
          </div>
        </Link>
      </section>

      <section className="wrap sec rule-t">
        <div className="grid cols-3">
          {rest.map((p) => (
            <Link key={p.id} href={`/blog/${p.id}`} className="post-card stack g3">
              <Greybox label={p.hero} ratio="3 / 2" sizes="(max-width: 800px) 100vw, 33vw" />
              <Meta category={p.category} date={p.date} minutes={p.minutes} />
              <h3 className="h3">{p.title}</h3>
              <p className="small" style={{ color: 'var(--text-secondary)' }}>
                {p.dek}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
