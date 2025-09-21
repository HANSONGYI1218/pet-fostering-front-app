import { describe, expect, it } from 'vitest';

import type { PostItem } from '@/types/post/post-api';
import { selectRecentPopularPosts } from '../posts';

const createPost = (overrides: Partial<PostItem>): PostItem => ({
  id: 'post-1',
  user: { id: 'user-1', nickname: '테스터' },
  images: [],
  title: '게시글',
  content: '내용',
  likes: 0,
  views: 0,
  created_at: new Date('2025-01-01T00:00:00Z'),
  ...overrides,
});

describe('selectRecentPopularPosts', () => {
  const now = new Date('2025-02-01T00:00:00Z');

  it('최근 한 달 내 게시글만 조회수 내림차순으로 최대 10개를 반환한다', () => {
    const posts: PostItem[] = [
      createPost({ id: 'old', created_at: new Date('2024-12-01T00:00:00Z'), views: 999 }),
      createPost({ id: 'top', created_at: new Date('2025-01-20T00:00:00Z'), views: 50 }),
      createPost({ id: 'second', created_at: new Date('2025-01-22T00:00:00Z'), views: 30 }),
    ];

    const result = selectRecentPopularPosts(posts, { now });

    expect(result).toHaveLength(2);
    expect(result.map((post) => post.id)).toEqual(['top', 'second']);
  });

  it('조회수 동률일 때는 최신 게시글이 먼저 온다', () => {
    const posts: PostItem[] = [
      createPost({ id: 'older', created_at: new Date('2025-01-10T00:00:00Z'), views: 10 }),
      createPost({ id: 'newer', created_at: new Date('2025-01-15T00:00:00Z'), views: 10 }),
    ];

    const result = selectRecentPopularPosts(posts, { now });

    expect(result.map((post) => post.id)).toEqual(['newer', 'older']);
  });
});
