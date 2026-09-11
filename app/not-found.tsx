import type { Metadata } from 'next';
import { Button } from '@/components/ds';
import { Eyebrow } from '@/components/site/primitives';

export const metadata: Metadata = {
  title: { absolute: 'Page Not Found | RejuveLuxe' },
};

export default function NotFound() {
  return (
    <main>
      <section className="wrap sec">
        <div className="editorial" style={{ gap: 24, alignItems: 'flex-start' }}>
          <Eyebrow>Page not found</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
            We couldn’t find this page.
          </h1>
          <p className="lead">The link may have changed. Explore the collection or return home to begin again.</p>
          <div className="row g3" style={{ flexWrap: 'wrap' }}>
            <Button href="/shop">Explore the Collection</Button>
            <Button variant="outline" href="/">
              Return Home
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
