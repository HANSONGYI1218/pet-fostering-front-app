import { describe, expect, it } from 'vitest';

import { mapPostListItems } from '../community';

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
