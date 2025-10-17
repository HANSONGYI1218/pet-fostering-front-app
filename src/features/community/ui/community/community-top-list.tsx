import { PostItem } from '@/types/post/post-api';
import { Card } from '@/components/ui/card';
import TopListTile from './top-list-tile';

export default function CommunityTopList({
  recentPopularPosts,
}: {
  recentPopularPosts: PostItem[];
}) {
  return (
    <Card>
      <span className="text-xl font-bold">이번 주 HOT 게시글</span>
      <div className="flex w-full flex-1 flex-col gap-5">
        {recentPopularPosts?.map((recentPopularPost: PostItem, idx: number) => (
          <TopListTile
            key={recentPopularPost.id}
            index={idx}
            recentPopularPost={recentPopularPost}
          />
        ))}
      </div>
    </Card>
  );
}
