import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@/features/community/api/community', () => ({
  fetchCommunityPost: vi.fn().mockResolvedValue({
    id: 'post-1',
    title: '테스트',
    content: '내용',
    user: { id: 'u-1', nickname: '닉네임' },
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: new Date('2024-01-02T00:00:00.000Z'),
    likes: 0,
    views: 0,
    images: [],
    commentCount: 0,
  }),
  fetchCommunityComments: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/features/community/ui/community/community-post', () => ({
  __esModule: true,
  default: (props: unknown) => (
    <div data-testid="post" data-props={JSON.stringify(props)} />
  ),
}));

vi.mock('@/features/community/ui/community/comments-container', () => ({
  __esModule: true,
  default: (props: unknown) => (
    <div data-testid="comments" data-props={JSON.stringify(props)} />
  ),
}));

describe('CommunityPostPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('awaits params before fetching post and comments', async () => {
    const { fetchCommunityPost, fetchCommunityComments } = await import(
      '@/features/community/api/community'
    );
    const { default: CommunityPostPage } = await import('./page');

    const element = await CommunityPostPage({
      params: Promise.resolve({ id: 'post-1' }),
    });

    render(element);

    expect(fetchCommunityPost).toHaveBeenCalledWith('post-1');
    expect(fetchCommunityComments).toHaveBeenCalledWith('post-1');
  });
});
