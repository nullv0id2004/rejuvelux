import type { Metadata } from 'next';
import { Placeholder } from '@/components/site/Placeholder';

export const metadata: Metadata = {
  title: 'Wholesale',
  description: 'Wholesale and hospitality enquiries for RejuveLuxe single-origin Assam tea.',
};

export default function WholesalePage() {
  return (
    <Placeholder
      eyebrow="Wholesale"
      title="For hotels, cafés and tea rooms."
      body="The wholesale programme is not written yet. The nav carries this page because the brief specifies it; the terms below are the slots it will fill, sized and visibly empty."
      rows={[
        ['Minimum order', '[000 kg]'],
        ['Lead time', '[00] days'],
        ['Pricing', '[ON APPLICATION]'],
        ['Contact', '[WHOLESALE EMAIL]'],
      ]}
    />
  );
}
