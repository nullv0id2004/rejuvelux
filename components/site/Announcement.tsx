'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ANNOUNCEMENTS } from '@/lib/data';

/** 36px ink strip. Rotates only when there is more than one message. */
export function Announcement() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (ANNOUNCEMENTS.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const a = ANNOUNCEMENTS[i];
  return (
    <div className="ann" role={ANNOUNCEMENTS.length > 1 ? 'status' : undefined}>
      <Link key={i} href={a.href}>
        {a.text}
      </Link>
    </div>
  );
}
