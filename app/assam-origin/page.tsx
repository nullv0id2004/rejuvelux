import { ContentView, contentMetadata } from '@/components/site/ContentView';
import { page } from '@/lib/content/pages';

const content = page('assam-origin');

export const metadata = contentMetadata(content);

export default function Page() {
  return <ContentView page={content} />;
}
