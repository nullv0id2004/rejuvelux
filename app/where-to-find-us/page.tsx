import { ContentView, contentMetadata } from '@/components/site/ContentView';
import { page } from '@/lib/content/pages';

const content = page('where-to-find-us');

export const metadata = contentMetadata(content);

export default function Page() {
  return <ContentView page={content} />;
}
