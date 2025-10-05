import { toDate } from '@/lib/utils';
import { resolveEndpoint } from './config';
import type { CommentItemByUserId } from '@/types/comment/comment-api';
import type { PostItemByUserId } from '@/types/post/post-api';
import type {
  UpdateUserNotificationSettingPayload,
  UpdateUserProfilePayload,
  UserNotificationSettingItem,
  UserProfileItem,
} from '@/types/user/user-api';

const userHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const expectOk = async (response: Response) => {
  if (!response.ok) {
    const error = new Error(`사용자 API 요청 실패: ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return response;
};

type UserProfileResponseDto = {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  zipcode: string | null;
  address: string | null;
  addressDetail: string | null;
  introduction: string | null;
  isEligibleForFoster: boolean;
};

type UserNotificationResponseDto = {
  commentEmail: boolean;
  fosterAnimalInfoEmail: boolean;
  fosterAnimalInfoKakao: boolean;
  marketingEmail: boolean;
  marketingKakao: boolean;
};

type UserPostListItemDto = {
  id: string;
  title: string;
  content: string;
  views: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

type UserCommentListItemDto = {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  likes: number;
  post: {
    id: string;
    title: string;
  } | null;
};

export const mapUserProfile = (
  dto: UserProfileResponseDto,
): UserProfileItem => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  phoneNumber: dto.phoneNumber,
  zipcode: dto.zipcode,
  address: dto.address,
  addressDetail: dto.addressDetail,
  introduction: dto.introduction,
  isEligibleForFoster: dto.isEligibleForFoster,
});

export const mapUserNotificationSetting = (
  dto: UserNotificationResponseDto,
): UserNotificationSettingItem => ({
  commentEmail: dto.commentEmail,
  fosterAnimalInfoEmail: dto.fosterAnimalInfoEmail,
  fosterAnimalInfoKakao: dto.fosterAnimalInfoKakao,
  marketingEmail: dto.marketingEmail,
  marketingKakao: dto.marketingKakao,
});

export const mapUserPosts = (
  items: UserPostListItemDto[],
): PostItemByUserId[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    views: item.views,
    likes: 0,
    commentCount: item.commentCount,
    images: [],
    created_at: toDate(item.createdAt),
    updated_at: toDate(item.updatedAt),
  }));

export const mapUserComments = (
  items: UserCommentListItemDto[],
): CommentItemByUserId[] =>
  items.map((item) => ({
    id: item.id,
    post: item.post
      ? { id: item.post.id, title: item.post.title }
      : { id: item.postId, title: '삭제된 게시글' },
    content: item.content,
    likes: item.likes,
    created_at: toDate(item.createdAt),
    reply_length: 0,
  }));

export const fetchMyProfile = async (token?: string) => {
  const response = await expectOk(
    await fetch(resolveEndpoint('/users/me/profile'), {
      headers: userHeaders(token),
      cache: 'no-store',
    }),
  );

  const payload = (await response.json()) as UserProfileResponseDto;

  return mapUserProfile(payload);
};

export const fetchMyNotificationSetting = async (token?: string) => {
  const response = await expectOk(
    await fetch(resolveEndpoint('/users/me/notification-settings'), {
      headers: userHeaders(token),
      cache: 'no-store',
    }),
  );

  const payload = (await response.json()) as UserNotificationResponseDto;

  return mapUserNotificationSetting(payload);
};

export const fetchMyPosts = async (token?: string) => {
  const response = await expectOk(
    await fetch(resolveEndpoint('/users/me/posts'), {
      headers: userHeaders(token),
      cache: 'no-store',
    }),
  );

  const payload = (await response.json()) as UserPostListItemDto[];

  return mapUserPosts(payload);
};

export const fetchMyComments = async (token?: string) => {
  const response = await expectOk(
    await fetch(resolveEndpoint('/users/me/comments'), {
      headers: userHeaders(token),
      cache: 'no-store',
    }),
  );

  const payload = (await response.json()) as UserCommentListItemDto[];

  return mapUserComments(payload);
};

export const updateMyProfile = async (
  token: string | undefined,
  payload: UpdateUserProfilePayload,
) => {
  const response = await expectOk(
    await fetch(resolveEndpoint('/users/me/profile'), {
      method: 'PATCH',
      headers: {
        ...userHeaders(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }),
  );

  const dto = (await response.json()) as UserProfileResponseDto;

  return mapUserProfile(dto);
};

export const updateMyNotificationSetting = async (
  token: string | undefined,
  payload: UpdateUserNotificationSettingPayload,
) => {
  const response = await expectOk(
    await fetch(resolveEndpoint('/users/me/notification-settings'), {
      method: 'PATCH',
      headers: {
        ...userHeaders(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }),
  );

  const dto = (await response.json()) as UserNotificationResponseDto;

  return mapUserNotificationSetting(dto);
};

export const deleteMyAccount = async (token: string | undefined) => {
  await expectOk(
    await fetch(resolveEndpoint('/users/me'), {
      method: 'DELETE',
      headers: userHeaders(token),
    }),
  );
};
