import { PostItem } from '@/entities/post/post-api';
import { Card } from '@/shared/ui/card';
import TopListTile from './top-list-tile';

export default function CommunityTopList({
  recentPopularPosts,
}: {
  recentPopularPosts: PostItem[];
}) {
  return (
    <Card className="w-72 max-md:hidden">
      <span className="text-lg font-bold">이번 주 HOT 게시글</span>
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
