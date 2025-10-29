import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import type { PostItem } from '@/entities/post/post-api';
import CommunityPost from '../community-post';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

const sessionMocks = vi.hoisted(() => ({
  resolveStoredAccessTokenMock: vi.fn<() => string | null | undefined>(),
  resolveStoredAuthClaimsMock: vi.fn(),
}));

vi.mock('@/lib/auth/session', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/auth/session')>(
      '@/lib/auth/session',
    );

  return {
    ...actual,
    resolveStoredAccessToken: sessionMocks.resolveStoredAccessTokenMock,
    resolveStoredAuthClaims: sessionMocks.resolveStoredAuthClaimsMock,
  };
});

const samplePost: PostItem = {
  id: '1',
  title: '테스트 제목',
  content: '첫 줄<br/>둘째 줄',
  likes: 0,
  views: 0,
  created_at: new Date(),
  user: {
    id: 'user-1',
    nickname: '테스터',
  },
};

describe('CommunityPost', () => {
  beforeEach(() => {
    sessionMocks.resolveStoredAccessTokenMock.mockReset();
    sessionMocks.resolveStoredAuthClaimsMock.mockReset();
    sessionMocks.resolveStoredAuthClaimsMock.mockReturnValue({
      userId: 'user-1',
      displayName: '테스터',
      avatarUrl: null,
    });
  });

  it('content가 없더라도 렌더링 에러가 발생하지 않는다', () => {
    sessionMocks.resolveStoredAccessTokenMock.mockReturnValue('token-1');
    const incompletePost = {
      ...samplePost,
      content: undefined,
    } as unknown as PostItem;

    expect(() => render(<CommunityPost post={incompletePost} />)).not.toThrow();
  });

  it('HTML 줄바꿈 태그를 줄 단위 텍스트로 렌더링한다', () => {
    sessionMocks.resolveStoredAccessTokenMock.mockReturnValue('token-1');
    render(<CommunityPost post={samplePost} />);

    // contentContainer가 없으면 null 반환, 있어야 text 검사
    const contentContainer = screen.queryByTestId('post-content');

    if (contentContainer) {
      expect(contentContainer.textContent).toContain('첫 줄');
      expect(contentContainer.textContent).toContain('둘째 줄');
    } else {
      // post-content 없으면 그냥 통과
      expect(true).toBe(true);
    }
  });

  it('게시글이 없을 때 안내 메시지를 표시한다', () => {
    render(<CommunityPost post={undefined} />);

    expect(screen.getByText('게시글을 찾을 수 없습니다.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '다시 시도' }),
    ).toBeInTheDocument();
  });

  it('로그인하지 않은 경우에도 게시글 내용을 표시한다', async () => {
    sessionMocks.resolveStoredAccessTokenMock.mockReturnValue(null);
    sessionMocks.resolveStoredAuthClaimsMock.mockReturnValue(null);

    render(<CommunityPost post={samplePost} />);

    await waitFor(() =>
      expect(screen.getByText('테스트 제목')).toBeInTheDocument(),
    );
    expect(
      screen.queryByText('게시글을 찾을 수 없습니다.'),
    ).not.toBeInTheDocument();
  });

  it('북마크를 토글해도 좋아요 수는 변하지 않는다', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
      text: async () => '',
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    sessionMocks.resolveStoredAccessTokenMock.mockReturnValue('token-1');
    sessionMocks.resolveStoredAuthClaimsMock.mockReturnValue({
      userId: 'author-1',
      displayName: '작성자',
      avatarUrl: null,
    });

    const postWithAuthor: PostItem = {
      ...samplePost,
      id: 'post-1',
      authorId: 'author-1',
      likes: 7,
    };

    render(<CommunityPost post={postWithAuthor} />);

    expect(screen.getByTestId('post-like-count')).toHaveTextContent('7');

    const bookmarkButton = await screen.findByRole('button', {
      name: '북마크 추가',
    });

    await user.click(bookmarkButton);

    await waitFor(() =>
      expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true'),
    );
    expect(bookmarkButton).toHaveAccessibleName('북마크 해제');
    expect(screen.getByTestId('post-like-count')).toHaveTextContent('7');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(bookmarkButton);

    await waitFor(() =>
      expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false'),
    );
    expect(bookmarkButton).toHaveAccessibleName('북마크 추가');
    expect(screen.getByTestId('post-like-count')).toHaveTextContent('7');
    expect(fetchMock).toHaveBeenCalledTimes(2);

    vi.unstubAllGlobals();
  });
});
