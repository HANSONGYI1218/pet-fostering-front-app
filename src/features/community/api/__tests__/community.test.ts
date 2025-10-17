import { describe, expect, it } from 'vitest';

import {
  mapCommunityComments,
  mapCommunityPost,
  mapPostListItems,
} from '../community';
import { toDate } from '@/lib/utils';

describe('mapPostListItems', () => {
  it('API 응답을 프런트엔드 게시글 도메인 모델로 변환한다', () => {
    const apiResponse = {
      items: [
        {
          id: 'p-1',
          authorId: 'user-1',
          author: {
            id: 'user-1',
            displayName: '테스터',
          },
          title: '테스트 제목',
          content: '<p>본문</p>',
          viewCount: 42,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
          _count: {
            comments: 3,
          },
        },
      ],
      limit: 20,
      nextCursor: null,
    };

    expect(mapPostListItems(apiResponse)).toEqual([
      {
        id: 'p-1',
        authorId: 'user-1',
        title: '테스트 제목',
        content: '<p>본문</p>',
        views: 42,
        likes: 0,
        commentCount: 3,
        created_at: new Date('2025-01-01T00:00:00.000Z'),
        updated_at: new Date('2025-01-02T00:00:00.000Z'),
        user: {
          id: 'user-1',
          nickname: '테스터',
        },
      },
    ]);
  });

  it('카운트 정보가 없을 때 기본값을 사용한다', () => {
    const apiResponse = {
      items: [
        {
          id: 'p-2',
          authorId: 'user-2',
          author: {
            id: 'user-2',
            displayName: null,
          },
          title: '다른 게시글',
          content: '내용',
          viewCount: 0,
          createdAt: '2025-01-03T00:00:00.000Z',
          updatedAt: '2025-01-03T00:00:00.000Z',
        },
      ],
      limit: 20,
      nextCursor: null,
    };

    expect(mapPostListItems(apiResponse)).toEqual([
      {
        id: 'p-2',
        authorId: 'user-2',
        title: '다른 게시글',
        content: '내용',
        views: 0,
        likes: 0,
        commentCount: 0,
        created_at: new Date('2025-01-03T00:00:00.000Z'),
        updated_at: new Date('2025-01-03T00:00:00.000Z'),
        user: {
          id: 'user-2',
          nickname: null,
        },
      },
    ]);
  });
});

describe('mapCommunityPost', () => {
  it('상세 게시글 응답을 PostItem으로 변환한다', () => {
    const dto = {
      id: 'p-10',
      authorId: 'user-10',
      author: { id: 'user-10', displayName: '닉네임' },
      title: '상세 제목',
      content: '<p>본문</p>',
      viewCount: 100,
      likeCount: 5,
      images: ['img-1'],
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-02T00:00:00.000Z',
    };

    expect(mapCommunityPost(dto)).toEqual({
      id: 'p-10',
      authorId: 'user-10',
      user: {
        id: 'user-10',
        nickname: '닉네임',
      },
      title: '상세 제목',
      content: '<p>본문</p>',
      views: 100,
      likes: 5,
      images: ['img-1'],
      created_at: new Date('2025-02-01T00:00:00.000Z'),
      updated_at: new Date('2025-02-02T00:00:00.000Z'),
    });
  });
});

describe('mapCommunityComments', () => {
  it('루트 댓글과 대댓글을 날짜 기준으로 정렬해 반환한다', () => {
    const dto = [
      {
        id: 'c-2',
        postId: 'p-1',
        parentId: null,
        content: '두번째 댓글',
        likeCount: 1,
        createdAt: '2025-03-02T10:00:00.000Z',
        author: { id: 'user-2', displayName: null },
        replies: [],
      },
      {
        id: 'c-1',
        postId: 'p-1',
        parentId: null,
        content: '첫 댓글',
        likeCount: 0,
        createdAt: '2025-03-01T09:00:00.000Z',
        author: { id: 'user-1', displayName: '작성자' },
        replies: [
          {
            id: 'c-1-1',
            postId: 'p-1',
            parentId: 'c-1',
            content: '대댓글',
            likeCount: 3,
            createdAt: '2025-03-01T11:00:00.000Z',
            author: { id: 'user-3', displayName: '답글러' },
          },
        ],
      },
    ];

    expect(mapCommunityComments(dto)).toEqual([
      {
        id: 'c-1',
        parent_id: null,
        post_id: 'p-1',
        user: { id: 'user-1', nickname: '작성자' },
        content: '첫 댓글',
        likes: 0,
        created_at: toDate('2025-03-01T09:00:00.000Z'),
        reply_comments: [
          {
            id: 'c-1-1',
            parent_id: 'c-1',
            post_id: 'p-1',
            user: { id: 'user-3', nickname: '답글러' },
            content: '대댓글',
            likes: 3,
            created_at: toDate('2025-03-01T11:00:00.000Z'),
          },
        ],
      },
      {
        id: 'c-2',
        parent_id: null,
        post_id: 'p-1',
        user: { id: 'user-2', nickname: '' },
        content: '두번째 댓글',
        likes: 1,
        created_at: toDate('2025-03-02T10:00:00.000Z'),
        reply_comments: [],
      },
    ]);
  });
});
