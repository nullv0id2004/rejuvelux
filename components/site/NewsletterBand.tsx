import { NewsletterForm } from './NewsletterForm';
import { Eyebrow } from './primitives';

/** Dark full-bleed Journal sign-up that closes the homepage. */
export function NewsletterBand() {
  return (
    <section data-theme="dark" style={{ background: 'var(--ink-900)', color: 'var(--bone-100)' }}>
      <div className="wrap" style={{ padding: '96px var(--gutter-lg)' }}>
        <div className="stack g6" style={{ alignItems: 'center', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <Eyebrow style={{ color: 'var(--gold-300)' }}>The RejuveLuxe Journal</Eyebrow>
          <h2 className="h1 it" style={{ color: 'var(--bone-100)' }}>
            A little more time for tea.
          </h2>
          <p className="lead" style={{ color: 'var(--ink-300)' }}>
            Join the RejuveLuxe journal for tea stories, preparation guides and considered gifting ideas.
          </p>
          <div style={{ width: '100%', maxWidth: 480, textAlign: 'left' }}>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
