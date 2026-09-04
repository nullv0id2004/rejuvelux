import { Evidence, Eyebrow } from './primitives';
import { Button } from '@/components/ds';

/**
 * An honest stub for a nav destination that is specified in the brief but has
 * no content yet. It says what is missing rather than faking a page.
 */
export function Placeholder({
  eyebrow,
  title,
  body,
  rows,
}: {
  eyebrow: string;
  title: string;
  body: string;
  rows: [string, string][];
}) {
  return (
    <main>
      <section className="wrap sec">
        <div className="editorial" style={{ alignItems: 'flex-start', gap: 32 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>
            {title}
          </h1>
          <p className="lead">{body}</p>
          <Evidence rows={rows} style={{ width: '100%' }} />
          <Button variant="outline" href="/">
            Back to the collection
          </Button>
        </div>
      </section>
    </main>
  );
}
