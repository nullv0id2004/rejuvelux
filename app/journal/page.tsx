import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, Greybox } from '@/components/site/primitives';
import { POSTS, readingMinutes, type Post } from '@/lib/content/journal';

export const metadata: Metadata = {
  title: { absolute: 'The RejuveLuxe Journal | Tea, Craft and Ritual' },
  description:
    'Read RejuveLuxe stories about tea origin, selection, preparation and gifting. Find thoughtful guidance for the cup and the ritual around it.',
};

function Meta({ post }: { post: Post }) {
  return (
    <div className="row g4 cap" style={{ color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--accent)' }}>{post.category}</span>
      <span>{readingMinutes(post)} min read</span>
    </div>
  );
}

export default function JournalPage() {
  const [lead, ...rest] = POSTS;

  return (
    <main>
      <section className="wrap" style={{ padding: '96px 0 40px' }}>
        <div className="editorial" style={{ gap: 24 }}>
          <Eyebrow>Journal</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
            The RejuveLuxe Journal
          </h1>
          <p className="lead">
            Stories from the leaf to the cup. Explore the choices behind the tea, the pleasure of preparing it
            and the moments that make it meaningful.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 64 }}>
        <Link href={`/journal/${lead.id}`} className="post-lead">
          <Greybox label={lead.hero} ratio="21 / 9" sizes="100vw" priority />
          <div className="stack g3" style={{ paddingTop: 24, maxWidth: 720 }}>
            <Meta post={lead} />
            <h2 className="h2">{lead.title}</h2>
            <p className="lead" style={{ color: 'var(--text-secondary)' }}>
              {lead.dek}
            </p>
            <span className="cap" style={{ color: 'var(--accent)' }}>
              Read the Story
            </span>
          </div>
        </Link>
      </section>

      <section className="wrap sec rule-t">
        <div className="grid cols-3">
          {rest.map((post) => (
            <Link key={post.id} href={`/journal/${post.id}`} className="post-card stack g3">
              <Greybox label={post.hero} ratio="3 / 2" sizes="(max-width: 800px) 100vw, 33vw" />
              <Meta post={post} />
              <h3 className="h3">{post.title}</h3>
              <p className="small" style={{ color: 'var(--text-secondary)' }}>
                {post.dek}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
