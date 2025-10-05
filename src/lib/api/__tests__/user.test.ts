import { describe, expect, it } from 'vitest';

import {
  mapUserComments,
  mapUserNotificationSetting,
  mapUserPosts,
  mapUserProfile,
} from '../user';

describe('user api mappers', () => {
  it('mapUserProfile converts nullable fields 그대로 유지', () => {
    expect(
      mapUserProfile({
        id: 'user-1',
        name: '홍길동',
        email: 'hong@example.com',
        phoneNumber: null,
        zipcode: '01234',
        address: null,
        addressDetail: null,
        introduction: '소개',
        isEligibleForFoster: true,
      }),
    ).toEqual({
      id: 'user-1',
      name: '홍길동',
      email: 'hong@example.com',
      phoneNumber: null,
      zipcode: '01234',
      address: null,
      addressDetail: null,
      introduction: '소개',
      isEligibleForFoster: true,
    });
  });

  it('mapUserNotificationSetting 그대로 반환한다', () => {
    expect(
      mapUserNotificationSetting({
        commentEmail: true,
        fosterAnimalInfoEmail: false,
        fosterAnimalInfoKakao: true,
        marketingEmail: false,
        marketingKakao: true,
      }),
    ).toEqual({
      commentEmail: true,
      fosterAnimalInfoEmail: false,
      fosterAnimalInfoKakao: true,
      marketingEmail: false,
      marketingKakao: true,
    });
  });

  it('mapUserPosts 날짜와 카운트를 변환한다', () => {
    const [post] = mapUserPosts([
      {
        id: 'post-1',
        title: '제목',
        content: '내용',
        views: 10,
        commentCount: 3,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-02T00:00:00.000Z',
      },
    ]);

    expect(post).toMatchObject({
      id: 'post-1',
      title: '제목',
      content: '내용',
      views: 10,
      commentCount: 3,
      likes: 0,
    });
    expect(post.created_at).toBeInstanceOf(Date);
    expect(post.updated_at).toBeInstanceOf(Date);
  });

  it('mapUserComments 댓글 정보를 변환한다', () => {
    const [comment] = mapUserComments([
      {
        id: 'comment-1',
        postId: 'post-1',
        content: '댓글',
        createdAt: '2025-01-03T00:00:00.000Z',
        likes: 2,
        post: {
          id: 'post-1',
          title: '첫 글',
        },
      },
    ]);

    expect(comment).toMatchObject({
      id: 'comment-1',
      content: '댓글',
      likes: 2,
      post: { id: 'post-1', title: '첫 글' },
      reply_length: 0,
    });
    expect(comment.created_at).toBeInstanceOf(Date);
  });
});
