import CommunityBanner from '@/components/community/community-banner';
import CommunityContainer from '@/components/community/community-container';
import { dummyPosts } from '@/lib/dummydata';

export default async function CommunityPage() {
  const posts = dummyPosts;

  return (
    <main className="mb-24 flex min-h-screen w-full flex-col">
      <CommunityBanner />
      <CommunityContainer posts={posts} />
    </main>
  );
}
