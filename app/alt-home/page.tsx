import type { Metadata } from 'next';
import { AltHome } from '@/components/home/AltHome';

export const metadata: Metadata = {
  title: 'Homepage, brief order',
  description:
    "The homepage in the design brief's fixed section order: objection bar, comparison, collection ladder, brew guide, sets, garden, reviews, gifting, guarantees, FAQ.",
  robots: { index: false, follow: false },
};

export default function AltHomePage() {
  return <AltHome />;
}
