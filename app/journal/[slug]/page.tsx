import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ds';
import { PostBody } from '@/components/site/PostBody';
import { Eyebrow, Greybox, Swatch } from '@/components/site/primitives';
import { getProduct } from '@/lib/catalogue';
import { POSTS, postById, readingMinutes, relatedPosts } from '@/lib/content/journal';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.id }));
}

export const dynamicParams = false;

/** The tea links read the catalogue, so revalidate on the same hour as the shop. */
export const revalidate = 3600;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = postById(slug);
  if (!post) return {};
  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    openGraph: { type: 'article', title: post.seoTitle, description: post.description },
  };
}

export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const post = postById(slug);
  if (!post) notFound();

  const mentioned = (await Promise.all(post.products.map((s) => getProduct(s)))).filter((p) => p !== null);
  const related = relatedPosts(post.id);

  return (
    <main>
      <section className="wrap" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="editorial" style={{ gap: 24 }}>
          <Eyebrow>{post.category}</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(36px,4.2cqw,58px)' }}>
            {post.title}
          </h1>
          <p className="lead">{post.dek}</p>
          <div className="row g4 cap rule-t" style={{ color: 'var(--text-tertiary)', paddingTop: 20, flexWrap: 'wrap' }}>
            <span>{post.author}</span>
            <span>{readingMinutes(post)} min read</span>
          </div>
        </div>
      </section>

      <Greybox label={post.hero} ratio="21 / 9" className="bleed" style={{ maxHeight: 620 }} sizes="100vw" priority />

      <section className="wrap sec">
        <div className="editorial">
          <PostBody blocks={post.body} />
          <div className="row g3" style={{ flexWrap: 'wrap', paddingTop: 16 }}>
            {post.cta.map((c, i) => (
              <Button key={c.href} href={c.href} variant={i === 0 ? undefined : 'outline'}>
                {c.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {mentioned.length > 0 && (
        <section className="wrap sec rule-t">
          <div className="editorial" style={{ gap: 20 }}>
            <Eyebrow muted>Teas in this story</Eyebrow>
            <div className="row g6" style={{ flexWrap: 'wrap' }}>
              {mentioned.map((p) => (
                <Link key={p.slug} href={`/shop/${p.slug}`} className="row g3 tea-link" style={{ gap: 10 }}>
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
            {related.map((r) => (
              <Link key={r.id} href={`/journal/${r.id}`} className="post-card stack g3">
                <Greybox label={r.hero} ratio="3 / 2" sizes="(max-width: 800px) 100vw, 50vw" />
                <div className="row g4 cap" style={{ color: 'var(--text-tertiary)' }}>
                  <span style={{ color: 'var(--accent)' }}>{r.category}</span>
                  <span>{readingMinutes(r)} min read</span>
                </div>
                <h3 className="h3">{r.title}</h3>
              </Link>
            ))}
          </div>
          <div>
            <Button variant="outline" href="/journal">
              Read the Journal
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
