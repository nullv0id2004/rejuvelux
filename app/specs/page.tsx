import type { Metadata } from 'next';
import { SpecsView } from '@/components/pages/SpecsView';

export const metadata: Metadata = {
  title: 'Component sheet',
  description:
    'Buttons, inputs, tiles, evidence rows, accordions, labels, swatches and intensity scales, plus the colour and type specimen in both themes.',
  robots: { index: false, follow: false },
};

export default function SpecsPage() {
  return <SpecsView />;
}
