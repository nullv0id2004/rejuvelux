import type { Metadata } from 'next';
import { CraftView } from '@/components/pages/CraftView';

export const metadata: Metadata = {
  title: 'The Craft',
  description:
    'Three teas, three distinct journeys. The process for Matcha, Silver Needle and Golden Tips, step by step, as it is run at the estate.',
};

export default function CraftPage() {
  return <CraftView />;
}
