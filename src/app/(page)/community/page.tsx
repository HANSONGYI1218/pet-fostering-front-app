import CommunityBanner from '@/features/community/ui/community/community-banner';
import CommunityContainer from '@/features/community/ui/community/community-container';
import { fetchCommunityPosts } from '@/features/community/api/community';
import { logError } from '@/lib/logging';
import type { PostItem } from '@/types/post/post-api';

const DEFAULT_POST_LIMIT = 20;

export default async function CommunityPage() {
  let posts: PostItem[] = [];

  try {
    const { items } = await fetchCommunityPosts({ limit: DEFAULT_POST_LIMIT });
    posts = items;
  } catch (error) {
    logError('커뮤니티 게시글 불러오기 실패', error);
  }

  return (
    <main className="mb-24 flex min-h-screen w-full flex-col">
      <CommunityBanner />
      <CommunityContainer posts={posts} />
    </main>
  );
}
