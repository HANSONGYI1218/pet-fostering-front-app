import { normalizeKeyword } from '@/shared/lib/utils';
import { CommentItemByUserId } from '@/types/comment/comment-api';

export type CommentFilterOptions = {
  sort?: string;
  keyword?: string;
};

const sortComments = (
  comments: CommentItemByUserId[],
  sortOrder: string, // 'asc' | 'desc'
): CommentItemByUserId[] => {
  return [...comments].sort((a, b) => {
    const aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bValue = b.created_at ? new Date(b.created_at).getTime() : 0;

    return sortOrder === 'asc'
      ? aValue - bValue // 오래된 → 최신
      : bValue - aValue; // 최신 → 오래된
  });
};

const matchesKeyword = (
  comment: CommentItemByUserId,
  keyword: string,
): boolean => {
  if (!keyword) return true;

  const fields = [comment.content, comment.post.title];

  return fields.some((field) => field?.toLowerCase().includes(keyword));
};

export const filterCommentList = (
  comments: CommentItemByUserId[],
  options: CommentFilterOptions = {},
): CommentItemByUserId[] => {
  const { sort, keyword } = options;
  const normalizedKeyword = normalizeKeyword(keyword);

  const sortOrder = sort ?? 'desc'; // 기본값 설정 (여기서는 최신순)

  // 1️⃣ 정렬
  const sortedComments = sortComments(comments, sortOrder);

  // 2️⃣ 검색 필터 적용
  return sortedComments.filter((comment) =>
    matchesKeyword(comment, normalizedKeyword),
  );
};
