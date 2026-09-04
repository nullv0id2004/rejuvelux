'use client';

import { useEffect, useState } from 'react';
import { ANNOUNCEMENTS } from '@/lib/data';
import { withSlots } from './primitives';

/** 36px ink strip, three rotating messages. Values are placeholders (brief §14). */
export function Announcement() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="ann" role="status" aria-live="polite">
      <span key={i}>{withSlots(ANNOUNCEMENTS[i])}</span>
    </div>
  );
}
