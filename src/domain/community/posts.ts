import { toDate } from '@/lib/utils';
import type { PostItem } from '@/types/post/post-api';

export type SelectRecentPopularPostsOptions = {
  now?: Date;
  limit?: number;
};

const ONE_MONTH = 1;

const createRange = (now: Date): { from: Date; to: Date } => {
  const to = new Date(now);
  const from = new Date(now);
  from.setMonth(from.getMonth() - ONE_MONTH);

  return { from, to };
};

export const selectRecentPopularPosts = (
  posts: PostItem[],
  options: SelectRecentPopularPostsOptions = {},
): PostItem[] => {
  const { now = new Date(), limit = 10 } = options;
  const { from, to } = createRange(now);

  return posts
    .map((post) => ({
      post,
      createdAt: toDate(post.created_at),
    }))
    .filter(({ createdAt }) => createdAt >= from && createdAt <= to)
    .sort((a, b) => {
      if (b.post.views !== a.post.views) {
        return b.post.views - a.post.views;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
};
