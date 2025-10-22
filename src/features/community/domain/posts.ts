import { normalizeKeyword } from '@/shared/lib/utils';
import type { PostItem, PostItemByUserId } from '@/entities/post/post-api';

export type SelectRecentPopularPostsOptions = {
  now?: Date;
  limit?: number;
};

export type PostFilterOptions = {
  sort?: string;
  keyword?: string;
};

export const selectRecentPopularPosts = (
  posts: PostItem[],
  options: SelectRecentPopularPostsOptions = {},
): PostItem[] => {
  const { limit = 10 } = options;

  return posts
    .slice() // 원본 배열 보호
    .sort((a, b) => {
      const aScore = (a.views || 0) + (a.likes || 0);
      const bScore = (b.views || 0) + (b.likes || 0);

      if (bScore !== aScore) return bScore - aScore; // 인기순
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ); // 최신순
    })
    .slice(0, limit);
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
