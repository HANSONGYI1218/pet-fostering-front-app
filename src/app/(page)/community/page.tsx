import CommunityBanner from '@/features/community/ui/community/community-banner';
import CommunityContainer from '@/features/community/ui/community/community-container';
import { fetchCommunityPosts } from '@/features/community/api/community';
import { logError } from '@/shared/lib/logging';
import type { PostItem } from '@/entities/post/post-api';
import { createAppMetadata } from '@/shared/config/seo';

const DEFAULT_POST_LIMIT = 20;

export const metadata = createAppMetadata({
  title: '커뮤니티 | 퍼디즈',
  description:
    '임시보호 경험을 나누고 정보를 공유하는 퍼디즈 커뮤니티를 만나보세요.',
  path: '/community',
});

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
