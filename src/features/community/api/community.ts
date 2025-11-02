import type {
  CommentItem,
  ReplyCommentItem,
  UpsertCommentPayload,
} from '@/entities/comment/comment-api';
import type { PostUpsertPayload, PostItem } from '@/entities/post/post-api';
import { toDate } from '@/shared/lib/utils';
import { resolveEndpoint } from '@/shared/api/config';
import { apiFetch } from '@/shared/api/http';
import { communityDetailPageRevalid, communityPageRevalid } from './redirect';

type PostCountDto = {
  comments: number;
  likes: number;
};

type PostAuthorDto = {
  id: string;
  displayName: string | null;
};

type PostListItemDto = {
  id: string;
  authorId: string;
  author?: PostAuthorDto | null;
  title: string;
  content: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  likeCount?: number | null;
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

type CommunityPostDto = {
  id: string;
  authorId: string;
  author?: PostAuthorDto | null;
  title: string;
  content: string;
  viewCount: number;
  likeCount?: number | null;
  liked?: boolean;
  isBookmarked?: boolean;
  images?: string[] | null;
  commentCount?: number | null;
  createdAt: string;
  updatedAt?: string | null;
};

type CommunityCommentAuthorDto = {
  id: string;
  displayName: string | null;
};

type CommunityReplyDto = {
  id: string;
  parentId: string;
  postId: string;
  content: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  author?: CommunityCommentAuthorDto | null;
};

type CommunityCommentDto = {
  id: string;
  parentId: string | null;
  postId: string;
  content: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  author?: CommunityCommentAuthorDto | null;
  replies?: CommunityReplyDto[] | null;
};

export const mapPostListItems = (dto: PostListResponseDto): PostItem[] =>
  dto.items.map((item) => ({
    id: item.id,
    authorId: item.authorId,
    user: {
      id: item.author?.id ?? item.authorId,
      nickname: item.author?.displayName ?? null,
    },
    title: item.title,
    content: item.content,
    likes: item.likeCount ?? item._count?.likes ?? 0,
    commentCount: item._count?.comments ?? 0,
    views: item.viewCount,
    created_at: toDate(item.createdAt),
    updated_at: item.updatedAt ? toDate(item.updatedAt) : undefined,
  }));

const requestJson = async (
  url: string,
  {
    method,
    body,
    cache,
    token,
    auth,
    headers,
    errorMessage,
  }: {
    method?: string;
    body?: BodyInit | null;
    cache?: RequestCache;
    token?: string;
    auth: 'none' | 'optional' | 'required';
    headers?: Record<string, string>;
    errorMessage: string;
  },
) => {
  const response = await apiFetch(url, {
    method,
    body,
    cache,
    token,
    auth,
    headers: {
      Accept: 'application/json',
      ...(headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }

  return response;
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

  const response = await requestJson(endpoint, {
    cache: 'no-store',
    token: params.token,
    auth: params.token ? 'optional' : 'none',
    errorMessage: '커뮤니티 게시글 요청 실패',
  });

  const result: PostListResponseDto = await response.json();

  return {
    items: mapPostListItems(result),
    nextCursor: result.nextCursor ?? null,
    limit: result.limit,
  };
};

const mapAuthor = (
  author?: PostAuthorDto | CommunityCommentAuthorDto | null,
) => ({
  id: author?.id ?? '',
  nickname: author?.displayName ?? '',
});

export const mapCommunityPost = (dto: CommunityPostDto): PostItem => ({
  id: dto.id,
  authorId: dto.authorId,
  user: mapAuthor(dto.author),
  title: dto.title,
  content: dto.content,
  views: dto.viewCount,
  likes: dto.likeCount ?? 0,
  liked: dto.liked ?? false,
  isBookmarked: dto.isBookmarked ?? false,
  images: dto.images ?? [],
  commentCount: dto.commentCount ?? undefined,
  created_at: toDate(dto.createdAt),
  updated_at: dto.updatedAt ? toDate(dto.updatedAt) : undefined,
});

const mapReply = (reply: CommunityReplyDto): ReplyCommentItem => ({
  id: reply.id,
  parent_id: reply.parentId,
  post_id: reply.postId,
  user: mapAuthor(reply.author),
  content: reply.content,
  likes: reply.likeCount,
  liked: reply.liked,
  created_at: toDate(reply.createdAt),
});

export const mapCommunityComments = (
  items: CommunityCommentDto[],
): CommentItem[] =>
  items
    .map<CommentItem>((item) => {
      const replies =
        item.replies?.map(mapReply).sort((a, b) => {
          return a.created_at.getTime() - b.created_at.getTime();
        }) ?? [];

      return {
        id: item.id,
        parent_id: item.parentId,
        post_id: item.postId,
        user: mapAuthor(item.author),
        content: item.content,
        likes: item.likeCount,
        liked: item.liked,
        created_at: toDate(item.createdAt),
        reply_comments: replies,
      };
    })
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

export const fetchCommunityPost = async (id: string, token?: string) => {
  const endpoint = resolveEndpoint(`/community/posts/${id}`);

  const response = await requestJson(endpoint, {
    cache: 'no-store',
    token,
    auth: token ? 'optional' : 'none',
    errorMessage: '커뮤니티 게시글 상세 요청 실패',
  });

  const dto = (await response.json()) as CommunityPostDto;

  return mapCommunityPost(dto);
};

export const fetchCommunityComments = async (
  postId: string,
  token?: string,
) => {
  const endpoint = resolveEndpoint(`/community/posts/${postId}/comments`);

  const response = await requestJson(endpoint, {
    cache: 'no-store',
    token,
    auth: token ? 'optional' : 'none',
    errorMessage: '커뮤니티 댓글 목록 요청 실패',
  });

  const payload = (await response.json()) as
    | CommunityCommentDto[]
    | { items: CommunityCommentDto[] };

  const items = Array.isArray(payload) ? payload : (payload.items ?? []);

  return mapCommunityComments(items);
};

export const createPost = async (
  token: string | undefined,
  payload: PostUpsertPayload,
) => {
  await requestJson(resolveEndpoint(`/community/posts`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    token,
    auth: 'required',
    errorMessage: '게시글 생성 요청 실패',
  });

  communityPageRevalid();
};

export const updatePost = async (
  token: string | undefined,
  postId: string,
  payload: PostUpsertPayload,
) => {
  await requestJson(resolveEndpoint(`/community/posts/${postId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    token,
    auth: 'required',
    errorMessage: '게시물 업데이트 요청 실패',
  });

  communityDetailPageRevalid({ postId });
};

export const deletePost = async (token: string | undefined, id: string) => {
  await requestJson(resolveEndpoint(`/community/posts/${id}`), {
    method: 'DELETE',
    token,
    auth: 'required',
    errorMessage: '게시물 삭제 요청 실패',
  });
};

export const createCommentLike = async (
  token: string | undefined,
  commentId: string,
) => {
  await requestJson(resolveEndpoint(`/community/comments/${commentId}/likes`), {
    method: 'POST',
    token,
    auth: 'required',
    errorMessage: '댓글 좋아요 요청 실패',
  });
};

export const deleteCommentLike = async (
  token: string | undefined,
  commentId: string,
) => {
  await requestJson(resolveEndpoint(`/community/comments/${commentId}/likes`), {
    method: 'DELETE',
    token,
    auth: 'required',
    errorMessage: '댓글 좋아요 취소 요청 실패',
  });
};

export const createBookmark = async (token: string | undefined, id: string) => {
  await requestJson(resolveEndpoint(`/community/posts/${id}/bookmarks`), {
    method: 'POST',
    token,
    auth: 'required',
    errorMessage: '게시글 북마크 생성 요청 실패',
  });
};

export const deleteBookmark = async (token: string | undefined, id: string) => {
  await requestJson(resolveEndpoint(`/community/posts/${id}/bookmarks`), {
    method: 'DELETE',
    token,
    auth: 'required',
    errorMessage: '게시글 북마크 취소 요청 실패',
  });
};

export const createComment = async (
  token: string | undefined,
  id: string,
  payload: UpsertCommentPayload,
) => {
  await requestJson(resolveEndpoint(`/community/posts/${id}/comments`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    token,
    auth: 'required',
    errorMessage: '댓글 생성 요청 실패',
  });

  communityDetailPageRevalid({ postId: id });
};

export const updateComment = async (
  token: string | undefined,
  postId: string,
  commentId: string,
  payload: UpsertCommentPayload,
) => {
  await requestJson(
    resolveEndpoint(`/community/posts/${postId}/comments/${commentId}`),
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      token,
      auth: 'required',
      errorMessage: '댓글 업데이트 요청 실패',
    },
  );

  communityDetailPageRevalid({ postId });
};

export const deleteComment = async (
  token: string | undefined,
  postId: string,
  commentId: string,
) => {
  await requestJson(
    resolveEndpoint(`/community/posts/${postId}/comments/${commentId}`),
    {
      method: 'DELETE',
      token,
      auth: 'required',
      errorMessage: '댓글 삭제 요청 실패',
    },
  );

  communityDetailPageRevalid({ postId });
};

type PostLikeResponseDto = {
  postId: string;
  liked: boolean;
  likeCount: number;
};

export const createPostLike = async (
  token: string | undefined,
  id: string,
): Promise<PostLikeResponseDto> => {
  const response = await requestJson(
    resolveEndpoint(`/community/posts/${id}/likes`),
    {
      method: 'POST',
      token,
      auth: 'required',
      errorMessage: '게시물 좋아요 요청 실패',
    },
  );

  const payload = (await response.json()) as PostLikeResponseDto;
  return payload;
};

export const deletePostLike = async (
  token: string | undefined,
  id: string,
): Promise<PostLikeResponseDto> => {
  const response = await requestJson(
    resolveEndpoint(`/community/posts/${id}/likes`),
    {
      method: 'DELETE',
      token,
      auth: 'required',
      errorMessage: '게시물 좋아요 취소 요청 실패',
    },
  );

  const payload = (await response.json()) as PostLikeResponseDto;
  return payload;
};

export const updatePostView = async (id: string) => {
  await requestJson(resolveEndpoint(`/community/posts/${id}/views`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    auth: 'none',
    errorMessage: '게시물 뷰 증가 요청 실패',
  });
};
