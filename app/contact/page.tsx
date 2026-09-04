import type { Metadata } from 'next';
import { Placeholder } from '@/components/site/Placeholder';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to reach RejuveLuxe.',
};

export default function ContactPage() {
  return (
    <Placeholder
      eyebrow="Contact"
      title="Reach the people who packed it."
      body="Contact details are pending. The nav carries this page because the brief specifies it; the slots below are sized and visibly empty until the real values arrive."
      rows={[
        ['Email', '[HELLO@DOMAIN]'],
        ['Phone', '[+91 00000 00000]'],
        ['Registered office', '[ADDRESS], Assam'],
        ['FSSAI Lic. No.', '[00000000000000]'],
      ]}
    />
  );
}
