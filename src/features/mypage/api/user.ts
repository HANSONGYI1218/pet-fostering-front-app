import { toDate } from '@/shared/lib/utils';
import { apiFetch } from '@/shared/api/http';
import type { CommentItemByUserId } from '@/entities/comment/comment-api';
import type { PostItemByUserId } from '@/entities/post/post-api';
import type {
  UpdateUserNotificationSettingPayload,
  UpdateUserProfilePayload,
  UserNotificationSettingItem,
  UserProfileItem,
} from '@/entities/user/user-api';

export const expectOk = async (response: Response) => {
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
    await apiFetch('/users/me/profile', {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      auth: 'required',
      token,
    }),
  );

  const payload = (await response.json()) as UserProfileResponseDto;

  return mapUserProfile(payload);
};

export const fetchMyNotificationSetting = async (token?: string) => {
  const response = await expectOk(
    await apiFetch('/users/me/notification-settings', {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      auth: 'required',
      token,
    }),
  );

  const payload = (await response.json()) as UserNotificationResponseDto;

  return mapUserNotificationSetting(payload);
};

export const fetchMyPosts = async (token?: string) => {
  const response = await expectOk(
    await apiFetch('/users/me/posts', {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      auth: 'required',
      token,
    }),
  );

  const payload = (await response.json()) as UserPostListItemDto[];

  return mapUserPosts(payload);
};

export const fetchMyComments = async (token?: string) => {
  const response = await expectOk(
    await apiFetch('/users/me/comments', {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      auth: 'required',
      token,
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
    await apiFetch('/users/me/profile', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      auth: 'required',
      token,
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
    await apiFetch('/users/me/notification-settings', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      auth: 'required',
      token,
    }),
  );

  const dto = (await response.json()) as UserNotificationResponseDto;

  return mapUserNotificationSetting(dto);
};

export const deleteMyAccount = async (token: string | undefined) => {
  await expectOk(
    await apiFetch('/users/me', {
      method: 'DELETE',
      auth: 'required',
      token,
    }),
  );
};
