import { PostItem } from '@/types/post/post-api';
import { toDate } from '@/lib/utils';

import { resolveEndpoint } from './config';

type PostCountDto = {
  comments: number;
};

type PostListItemDto = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  _count?: PostCountDto;
};

type PostListResponseDto = {
  items: PostListItemDto[];
  nextCursor: string | null;
  limit: number;
};

type CommunityListParams = {
  limit?: number;
  cursor?: string;
  token?: string;
};

export const mapPostListItems = (dto: PostListResponseDto): PostItem[] =>
  dto.items.map((item) => ({
    id: item.id,
    authorId: item.authorId,
    user: {
      id: item.authorId,
      nickname: null,
    },
    title: item.title,
    content: item.content,
    likes: 0,
    commentCount: item._count?.comments ?? 0,
    views: item.viewCount,
    created_at: toDate(item.createdAt),
    updated_at: item.updatedAt ? toDate(item.updatedAt) : undefined,
  }));

const communityHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const buildQueryString = ({ limit, cursor }: CommunityListParams) => {
  const params = new URLSearchParams();

  if (limit) {
    params.set('limit', String(limit));
  }

  if (cursor) {
    params.set('cursor', cursor);
  }

  const query = params.toString();

  return query ? `?${query}` : '';
};

export const fetchCommunityPosts = async (
  params: CommunityListParams = {},
): Promise<{
  items: PostItem[];
  nextCursor: string | null;
  limit: number;
}> => {
  const query = buildQueryString(params);
  const endpoint = resolveEndpoint(`/community/posts${query}`);

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
      ...communityHeaders(params.token),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`커뮤니티 게시글 요청 실패: ${response.status}`);
  }

  const result: PostListResponseDto = await response.json();

  return {
    items: mapPostListItems(result),
    nextCursor: result.nextCursor ?? null,
    limit: result.limit,
  };
};
