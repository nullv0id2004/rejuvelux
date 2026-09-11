import { Evidence, Greybox, withSlots } from './primitives';
import type { Block } from '@/lib/content/journal';

/**
 * Renders a post's blocks into the editorial column. Paragraphs run through
 * `withSlots` so an unfilled `[SLOT]` in copy reads as a placeholder here the
 * same way it does everywhere else on the site.
 */
export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h':
            return (
              <h2 key={i} className="h3" style={{ marginTop: 16 }}>
                {b.v}
              </h2>
            );

          case 'quote':
            return (
              <blockquote
                key={i}
                className="stack g2"
                style={{
                  borderLeft: '2px solid var(--accent)',
                  paddingLeft: 24,
                  margin: '16px 0',
                }}
              >
                <p className="lead" style={{ fontStyle: 'italic' }}>
                  {withSlots(b.v)}
                </p>
                {b.who && <span className="cap">{b.who}</span>}
              </blockquote>
            );

          case 'list':
            return (
              <ul key={i} className="stack g3" style={{ paddingLeft: 20 }}>
                {b.v.map((li) => (
                  <li key={li}>{withSlots(li)}</li>
                ))}
              </ul>
            );

          case 'evidence':
            return <Evidence key={i} rows={b.rows} style={{ width: '100%', margin: '8px 0' }} />;

          case 'image':
            return (
              <div key={i} className="stack g2" style={{ margin: '8px 0' }}>
                <Greybox label={b.label} ratio="16 / 9" sizes="(max-width: 800px) 100vw, 720px" />
                {b.caption && <span className="cap">{b.caption}</span>}
              </div>
            );

          default:
            return <p key={i}>{withSlots(b.v)}</p>;
        }
      })}
    </>
  );
}
