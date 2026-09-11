import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, Icon } from '@/components/ds';
import { NewsletterBand } from '@/components/site/NewsletterBand';
import { Eyebrow, Greybox, SectionHead, TinBox } from '@/components/site/primitives';
import { ScrollShowcase } from '@/components/site/ScrollShowcase';
import { listProducts } from '@/lib/catalogue';
import { POSTS, readingMinutes } from '@/lib/content/journal';
import { SITE_PHOTOS, isInterim } from '@/lib/data';

/** Homepage copy from the content handover (P01). Products and prices come from the database. */
export const metadata: Metadata = {
  title: { absolute: 'RejuveLuxe | Exceptional Assam Tea and Luxury Gifts' },
  description:
    'Discover Assam Matcha, Silver Needle Assam and Assam Golden Tips. Explore refined tea rituals and thoughtful gifting with RejuveLuxe.',
};

/** The three expressions, keyed by database slug, in the handover's order. */
const EXPRESSIONS: { slug: string; eyebrow: string; body: string; cta: string }[] = [
  {
    slug: 'assam-matcha',
    eyebrow: 'Focus',
    body: 'A vibrant whole-leaf ritual. Sift, whisk and give the next few minutes your full attention.',
    cta: 'Discover Assam Matcha',
  },
  {
    slug: 'silver-needle-assam',
    eyebrow: 'Elegance',
    body: 'Delicate buds. Quiet character. A tea that rewards an unhurried cup.',
    cta: 'Discover Silver Needle Assam',
  },
  {
    slug: 'assam-golden-tips',
    eyebrow: 'Legacy',
    body: 'Selected golden tips and a rich black-tea character. Assam, with depth and distinction.',
    cta: 'Discover Assam Golden Tips',
  },
];

function InterimTag({ label }: { label: string }) {
  return (
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
      {label}
    </div>
  );
}

export default async function HomePage() {
  const products = await listProducts();
  // An expression whose product is retired in the admin drops out rather than
  // rendering a card for a tea that cannot be viewed.
  const expressions = EXPRESSIONS.flatMap((e) => {
    const p = products.find((q) => q.slug === e.slug);
    return p ? [{ ...e, p }] : [];
  });
  const stories = POSTS.slice(0, 2);

  return (
    <main>
      {/* Hero: full-bleed photograph, headline overlaid. */}
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
          aria-label={isInterim(SITE_PHOTOS.hero) ? 'Tea, interim photograph' : 'RejuveLuxe hero photograph'}
        >
          <Image src={SITE_PHOTOS.hero} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              // Sized so the eyebrow, headline and subhead all clear 4.5:1
              // against this photograph (brief §12).
              background:
                'linear-gradient(90deg, rgba(20,19,17,.86) 0%, rgba(20,19,17,.60) 55%, rgba(20,19,17,.30) 100%)',
            }}
          />
          {isInterim(SITE_PHOTOS.hero) && <InterimTag label="Hero · 21:9 · Interim" />}
        </div>

        <div className="wrap" style={{ position: 'relative', padding: '96px var(--gutter-lg)' }}>
          <div className="stack g6" style={{ maxWidth: 620 }}>
            <Eyebrow>The Assam Collection</Eyebrow>
            <h1 className="display" style={{ color: 'var(--bone-100)' }}>
              Earned, <em style={{ color: 'var(--gold-300)' }}>not indulged.</em>
            </h1>
            <p className="lead" style={{ color: 'var(--ink-300)' }}>
              Exceptional Assam tea, selected with care and made part of a moment worth taking.
            </p>
            <div className="row g3" style={{ flexWrap: 'wrap' }}>
              <Button size="lg" variant="inverse" href="/collections/assam-collection">
                Explore the Assam Collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="/our-story"
                style={{ color: 'var(--bone-100)', borderColor: 'var(--bone-100)' }}
              >
                Discover Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three expressions. One origin. */}
      <section className="wrap sec">
        <SectionHead
          eyebrow="The Assam Collection"
          title="Three expressions. One origin."
          aside="The freshness of finely milled green tea. The delicacy of tender buds. The depth of carefully crafted black tea. Meet three distinct expressions of Assam, each with its own character and its own place in your day."
        />
        <div className="grid cols-3">
          {expressions.map(({ p, eyebrow, body, cta }) => (
            <Card key={p.slug} padding={0} interactive>
              <TinBox p={p} sizes="(max-width: 800px) 90vw, 380px" style={{ aspectRatio: '4 / 3' }} />
              <div className="stack g3" style={{ padding: 24 }}>
                <Eyebrow muted>{eyebrow}</Eyebrow>
                <h3 className="h3">{p.name}</h3>
                <p className="small">{body}</p>
                <div style={{ paddingTop: 8 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    href={`/shop/${p.slug}`}
                    iconRight={<Icon name="arrow-right" size={14} />}
                  >
                    {cta}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* The search behind the cup */}
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
          aria-label={isInterim(SITE_PHOTOS.storyBand) ? 'Tea, interim photograph' : 'RejuveLuxe story photograph'}
        >
          <Image
            src={SITE_PHOTOS.storyBand}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '50% 70%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,19,17,.62)' }} />
          {isInterim(SITE_PHOTOS.storyBand) && <InterimTag label="Story · 21:9 · Interim" />}
        </div>

        <div className="wrap" style={{ position: 'relative', padding: '80px var(--gutter-lg)' }}>
          <div className="stack g6" style={{ color: 'var(--bone-100)', maxWidth: 680 }}>
            <Eyebrow style={{ color: 'var(--gold-300)' }}>Our Story</Eyebrow>
            <h2 className="h1 it" style={{ color: 'var(--bone-100)' }}>
              The search behind the cup
            </h2>
            <p className="lead" style={{ color: 'var(--ink-300)' }}>
              RejuveLuxe began with a question: why should some of India’s most exceptional teas be so difficult
              to discover at home? That question took us closer to the source, through tasting, comparison and the
              discipline to keep looking. The result is a collection built around character, craft and the
              pleasure of choosing well.
            </p>
            <div>
              <Button variant="inverse" href="/our-story">
                Read Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The full range, as the scroll-driven showcase */}
      <div id="collection" className="wrap" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="stack g3" style={{ textAlign: 'center', alignItems: 'center' }}>
          <Eyebrow>All Tea</Eyebrow>
          <h2 className="h1 it">Find your expression.</h2>
          <p className="small" style={{ maxWidth: 520 }}>
            Begin with the tea, the ritual or the person you are choosing for.
          </p>
        </div>
      </div>

      <ScrollShowcase />

      {/* Ritual and gifting */}
      <section className="wrap sec">
        <div className="grid cols-2">
          <div className="stack g4">
            <Greybox label="A cup being prepared, loose leaf in an infuser" ratio="3 / 2" />
            <Eyebrow>Tea Rituals</Eyebrow>
            <h2 className="h2">Tea deserves time.</h2>
            <p>
              Watch the leaf open. Notice the aroma. Learn how a little attention to water, quantity and time can
              change the cup. Our guides make the ritual easier to enjoy.
            </p>
            <div>
              <Button variant="outline" href="/tea-rituals">
                Find Your Tea Ritual
              </Button>
            </div>
          </div>
          <div className="stack g4">
            <Greybox label="A RejuveLuxe gift box, presented" ratio="3 / 2" />
            <Eyebrow>Gifting</Eyebrow>
            <h2 className="h2">A gift with something to say</h2>
            <p>
              For a milestone, a thank-you or a shared celebration, give a moment that can be enjoyed slowly.
              Discover tea gifts and Matcha rituals with thoughtful presentation at their heart.
            </p>
            <div>
              <Button variant="outline" href="/gifting">
                Explore Gifting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* From the Journal */}
      <section className="wrap sec rule-t">
        <SectionHead eyebrow="Journal" title="From the RejuveLuxe Journal">
          <Button variant="outline" href="/journal">
            Read the Journal
          </Button>
        </SectionHead>
        <div className="grid cols-2">
          {stories.map((post) => (
            <Link key={post.id} href={`/journal/${post.id}`} className="post-card stack g3">
              <Greybox label={post.hero} ratio="3 / 2" sizes="(max-width: 800px) 100vw, 50vw" />
              <div className="row g4 cap" style={{ color: 'var(--text-tertiary)' }}>
                <span style={{ color: 'var(--accent)' }}>{post.category}</span>
                <span>{readingMinutes(post)} min read</span>
              </div>
              <h3 className="h3">{post.title}</h3>
              <p className="small" style={{ color: 'var(--text-secondary)' }}>
                {post.dek}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand promise */}
      <section className="wrap sec rule-t">
        <div className="stack g4" style={{ textAlign: 'center', alignItems: 'center', maxWidth: 680, margin: '0 auto' }}>
          <h2 className="h1 it">Exceptional Tea. Uncompromising Quality.</h2>
          <p className="lead">
            Our standard begins with what we choose. It continues in how we present it, explain it and help you
            enjoy it.
          </p>
        </div>
      </section>

      <NewsletterBand />
    </main>
  );
}
