import { ContentView, contentMetadata } from '@/components/site/ContentView';
import { page } from '@/lib/content/pages';

const content = page('gifting');

export const metadata = contentMetadata(content);

export default function Page() {
  return <ContentView page={content} />;
}

/** Lists live products, so prices and stock refresh on the same hour as the shop. */
export const revalidate = 3600;
