import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ds';
import { PostBody } from '@/components/site/PostBody';
import { Eyebrow, Greybox, Swatch } from '@/components/site/primitives';
import { POSTS, POSTS_BY_DATE, formatDate, postById, relatedPosts } from '@/lib/blog';
import { byId } from '@/lib/data';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = postById(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.dek,
    openGraph: {
      type: 'article',
      title: `${post.title} · RejuveLuxe`,
      description: post.dek,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = postById(slug);
  if (!post) notFound();

  const mentioned = post.products.map(byId).filter((p) => p !== undefined);
  const related = relatedPosts(post.id);

  return (
    <main>
      <section className="wrap" style={{ padding: '96px 0 40px' }}>
        <div className="editorial" style={{ gap: 24 }}>
          <Eyebrow>{post.category}</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(36px,4.2cqw,58px)' }}>
            {post.title}
          </h1>
          <p className="lead">{post.dek}</p>
          <div
            className="row g4 cap rule-t"
            style={{ color: 'var(--text-tertiary)', paddingTop: 20, flexWrap: 'wrap' }}
          >
            <span>{post.author}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.minutes} min read</span>
          </div>
        </div>
      </section>

      <Greybox
        label={post.hero}
        ratio="21 / 9"
        className="bleed"
        style={{ maxHeight: 620 }}
        sizes="100vw"
        priority
      />

      <section className="wrap sec">
        <div className="editorial">
          <PostBody blocks={post.body} />
        </div>
      </section>

      {mentioned.length > 0 && (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ gap: 20 }}>
            <Eyebrow muted>Teas in this piece</Eyebrow>
            <div className="row g6" style={{ flexWrap: 'wrap' }}>
              {mentioned.map((p) => (
                <Link key={p.id} href={`/shop/${p.id}`} className="row g3" style={{ gap: 10 }}>
                  <Swatch p={p} size={28} />
                  <span>{p.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wrap sec rule-t">
        <div className="stack g6">
          <Eyebrow muted>Keep reading</Eyebrow>
          <div className="grid cols-2">
            {related.map((p) => (
              <Link key={p.id} href={`/blog/${p.id}`} className="post-card stack g3">
                <Greybox label={p.hero} ratio="3 / 2" sizes="(max-width: 800px) 100vw, 50vw" />
                <div className="row g4 cap" style={{ color: 'var(--text-tertiary)' }}>
                  <span style={{ color: 'var(--accent)' }}>{p.category}</span>
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </div>
                <h3 className="h3">{p.title}</h3>
              </Link>
            ))}
          </div>
          <div>
            <Button variant="outline" href="/blog">
              All {POSTS_BY_DATE.length} pieces
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
