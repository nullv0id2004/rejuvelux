import type { Metadata } from 'next';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ds';
import { NewsletterBand } from '@/components/site/NewsletterBand';
import { Eyebrow, Greybox, SectionHead, TinBox } from '@/components/site/primitives';
import { ProductRow, type PendingTea } from '@/components/site/ProductRow';
import { ScrollShowcase } from '@/components/site/ScrollShowcase';
import { listProducts } from '@/lib/catalogue';
import { POSTS, readingMinutes } from '@/lib/content/journal';
import { SITE_PHOTOS, isInterim } from '@/lib/data';
import { PRESENTATION } from '@/lib/presentation';

/** Homepage copy from the content handover (P01). Products and prices come from the database. */
export const metadata: Metadata = {
  title: { absolute: 'RejuveLuxe | Exceptional Assam Tea and Luxury Gifts' },
  description:
    'Discover Assam Matcha, Silver Needle Assam and Assam Golden Tips. Explore refined tea rituals and thoughtful gifting with RejuveLuxe.',
};

/**
 * Teas in the range that may not have a database row yet. While a row is
 * missing the tea is listed by enquiry; once it exists it sells like the rest.
 */
const PENDING_TEAS: Omit<PendingTea, 'tin' | 'ink' | 'image' | 'tagline'>[] = [
  { slug: 'ctc-tea', name: 'CTC Tea', teaType: 'CTC tea', netQuantity: '250 g', enquireHref: '/contact?topic=ctc' },
  { slug: 'ube', name: 'Ube', teaType: 'Ube', netQuantity: '50 g', enquireHref: '/contact?topic=ube' },
];

/** The three expressions featured in the spotlight, in the handover's order. */
const HERO_SLUGS = ['assam-matcha', 'silver-needle-assam', 'assam-golden-tips'];

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
  // A product retired in the admin simply drops out of both sections.
  const heroes = HERO_SLUGS.flatMap((slug) => products.filter((p) => p.slug === slug));
  // Kits carry a components list; the row is for the teas themselves.
  const teas = products.filter((p) => (p.range ?? 'tea') === 'tea' && !p.components);
  const gifts = products.filter((p) => p.range === 'gift');
  const pending: PendingTea[] = PENDING_TEAS.filter((t) => !products.some((p) => p.slug === t.slug)).map((t) => {
    const art = PRESENTATION[t.slug];
    return { ...t, tin: art.tin, ink: art.ink, image: art.image, tagline: art.tagline };
  });
  const stories = POSTS.slice(0, 2);

  // One LCP candidate per viewport, so no preload (the docs advise against it
  // when the image differs by viewport); eager with high fetch priority instead.
  const heroCommon = {
    alt: SITE_PHOTOS.heroAlt,
    sizes: '100vw',
    quality: 85,
    loading: 'eager' as const,
    fetchPriority: 'high' as const,
  };
  const {
    props: { srcSet: heroDesktop },
  } = getImageProps({ ...heroCommon, src: SITE_PHOTOS.heroDesktop, width: 1672, height: 941 });
  const {
    props: { srcSet: heroMobile, ...heroImg },
  } = getImageProps({ ...heroCommon, src: SITE_PHOTOS.heroMobile, width: 941, height: 1672 });

  return (
    <main>
      {/* Hero: the supplied banner, landscape on wide screens and portrait on
          narrow ones. The banner is light in both themes, so the copy uses fixed
          ink and gold rather than theme tokens. */}
      <section className="hero-banner">
        <div className="wrap hero-banner-copy">
          <div className="stack g6">
            <Eyebrow style={{ color: 'var(--gold-700)' }}>The Assam Collection</Eyebrow>
            <h1 className="display" style={{ color: 'var(--ink-900)' }}>
              Earned, <em style={{ color: 'var(--gold-600)' }}>not indulged.</em>
            </h1>
            <p className="lead" style={{ color: 'var(--ink-700)' }}>
              Exceptional Assam tea, selected with care and made part of a moment worth taking.
            </p>
            <div className="row g3" style={{ flexWrap: 'wrap' }}>
              <Button
                size="lg"
                href="/collections/assam-collection"
                style={{ background: 'var(--ink-900)', color: 'var(--bone-100)', borderColor: 'var(--ink-900)' }}
              >
                Explore the Assam Collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="/our-story"
                style={{ color: 'var(--ink-900)', borderColor: 'var(--ink-900)' }}
              >
                Discover Our Story
              </Button>
            </div>
          </div>
        </div>
        <picture className="hero-banner-media">
          <source media="(min-width: 801px)" srcSet={heroDesktop} />
          <img {...heroImg} srcSet={heroMobile} />
        </picture>
        <div className="hero-banner-shade" aria-hidden="true" />
      </section>

      {/* Spotlight: the collections to begin with */}
      <section className="wrap sec">
        <SectionHead
          eyebrow="Spotlight"
          title="Find your expression."
          aside="Begin with the tea, the ritual or the person you are choosing for."
        />
        <div className="spot">
          <Link href="/collections/assam-collection" className="spot-card spot-feature">
            <div className="spot-tins">
              {heroes.map((p) => (
                <TinBox key={p.slug} p={p} style={{ background: 'transparent' }} sizes="(max-width: 900px) 30vw, 240px" />
              ))}
            </div>
            <div className="spot-body">
              <Eyebrow style={{ color: 'var(--gold-300)' }}>The Assam Collection</Eyebrow>
              <h3 className="h2" style={{ color: 'var(--bone-100)' }}>
                Three expressions. One origin.
              </h3>
              <p className="small" style={{ color: 'var(--ink-300)' }}>
                Three teas with a shared origin and distinctly different characters.
              </p>
              <span className="cap" style={{ color: 'var(--gold-300)' }}>
                Explore the Assam Collection
              </span>
            </div>
          </Link>
          <div className="spot-side">
            <Link href="/collections/gift-sets" className="spot-card">
              <Greybox
                label="A RejuveLuxe tea gift set, presented"
                src="/assets/gift-sets/complete-tasting-open.jpg"
                alt="Complete Tasting Gift Set open, showing four tea tubes, a cup, a tea infuser and a wooden spoon."
                ratio="21 / 9"
                sizes="(max-width: 900px) 100vw, 440px"
              />
              <div className="spot-body">
                <Eyebrow muted>Tea Gift Sets</Eyebrow>
                <h3 className="h3">A considered gift. A lasting ritual.</h3>
                <p className="small">Considered selections for personal moments and meaningful occasions.</p>
                <span className="cap" style={{ color: 'var(--accent)' }}>
                  Explore Gift Sets
                </span>
              </div>
            </Link>
            <Link href="/shop/matcha-ritual-set" className="spot-card">
              <Greybox label="Matcha bowl, whisk and tin" ratio="21 / 9" sizes="(max-width: 900px) 100vw, 440px" />
              <div className="spot-body">
                <Eyebrow muted>Matcha Ritual Set</Eyebrow>
                <h3 className="h3">Preparation is part of the product.</h3>
                <p className="small">The tea and the tools for a more deliberate preparation.</p>
                <span className="cap" style={{ color: 'var(--accent)' }}>
                  Discover the Ritual Set
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Every tea in one row, each with quantity and Add to cart */}
      <section className="wrap sec rule-t">
        <SectionHead
          eyebrow="Shop Tea"
          title="Tea, chosen with intention."
          aside="A distinctive cup begins with a distinctive leaf. Explore our teas through their character, the way they are prepared and the moments you would like to make for them."
        />
        <ProductRow products={teas} pending={pending} />
        <div style={{ paddingTop: 24 }}>
          <Button variant="outline" href="/shop">
            Shop All Tea
          </Button>
        </div>
      </section>

      {/* Gift sets, each with quantity and Add to cart */}
      {gifts.length > 0 && (
        <section className="wrap sec rule-t">
          <SectionHead
            eyebrow="Gift Sets"
            title="A considered gift. A lasting ritual."
            aside="Tea gifts chosen for the pleasure of discovering, preparing and sharing something exceptional."
          />
          <ProductRow products={gifts} />
          <div style={{ paddingTop: 24 }}>
            <Button variant="outline" href="/collections/gift-sets">
              Explore Gift Sets
            </Button>
          </div>
        </section>
      )}

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

      {/* The full range, as the scroll-driven showcase. Hidden on phones (see CSS). */}
      <div className="home-showcase">
      <div id="collection" className="wrap" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="stack g3" style={{ textAlign: 'center', alignItems: 'center' }}>
          <Eyebrow>The collection</Eyebrow>
          <h2 className="h1 it">Find a character you enjoy</h2>
          <p className="small" style={{ maxWidth: 560 }}>
            Choose Matcha for the whisked whole-leaf experience. Turn to Silver Needle for delicacy, or Golden Tips
            for a fuller black tea.
          </p>
        </div>
      </div>

      <ScrollShowcase />
      </div>

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
            <Greybox
              label="A RejuveLuxe gift box, presented"
              src="/assets/gift-sets/heritage-duo-open.jpg"
              alt="Heritage Duo Gift Set open, showing two tea tubes, a cup, a tea infuser and a wooden spoon."
              ratio="3 / 2"
            />
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
