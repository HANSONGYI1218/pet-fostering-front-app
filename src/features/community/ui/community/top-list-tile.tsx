import type { PostItem } from '@/entities/post/post-api';
import { Eye, MessageSquareText } from 'lucide-react';

export default function TopListTile({
  index,
  recentPopularPost,
}: {
  index: number;
  recentPopularPost: PostItem;
}) {
  return (
    <div className="group flex w-full gap-2 rounded-2xl">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D0EFE0] group-hover:bg-[#00592D]">
        <span className="text-xs text-[#00592D] group-hover:text-white">
          {index + 1}
        </span>
      </div>
      <div className="flex w-full flex-1 flex-col gap-2">
        <span className="line-clamp-1 font-semibold">
          {recentPopularPost.title}
        </span>
        <div className="flex w-full gap-5">
          <span className="text-sm text-[#525252]">
            {recentPopularPost.user.nickname}
          </span>
          <div className="flex items-center gap-1">
            <MessageSquareText className="h-3.5 w-3.5" stroke="#525252" />
            <span className="text-sm text-[#525252]">
              {recentPopularPost.commentCount ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" stroke="#525252" />
            <span className="text-sm text-[#525252]">
              {recentPopularPost.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
