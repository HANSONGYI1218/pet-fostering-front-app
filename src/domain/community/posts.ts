import { normalizeKeyword, toDate } from '@/lib/utils';
import type { PostItem, PostItemByUserId } from '@/types/post/post-api';

export type SelectRecentPopularPostsOptions = {
  now?: Date;
  limit?: number;
};

export type PostFilterOptions = {
  sort?: string;
  keyword?: string;
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

const sortPosts = (
  posts: PostItemByUserId[],
  sortOrder: string, // 'asc' | 'desc'
): PostItemByUserId[] => {
  return [...posts].sort((a, b) => {
    const aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bValue = b.created_at ? new Date(b.created_at).getTime() : 0;

    return sortOrder === 'asc'
      ? aValue - bValue // 오래된 → 최신
      : bValue - aValue; // 최신 → 오래된
  });
};

const matchesKeyword = (post: PostItemByUserId, keyword: string): boolean => {
  if (!keyword) return true;

  const fields = [post.title, post.content];

  return fields.some((field) => field?.toLowerCase().includes(keyword));
};

export const filterPostList = (
  posts: PostItemByUserId[],
  options: PostFilterOptions = {},
): PostItemByUserId[] => {
  const { sort, keyword } = options;
  const normalizedKeyword = normalizeKeyword(keyword);

  const sortOrder = sort ?? 'desc'; // 기본값 설정 (여기서는 최신순)

  // 1️⃣ 정렬
  const sortedPosts = sortPosts(posts, sortOrder);

  // 2️⃣ 검색 필터 적용
  return sortedPosts.filter((post) => matchesKeyword(post, normalizedKeyword));
};
