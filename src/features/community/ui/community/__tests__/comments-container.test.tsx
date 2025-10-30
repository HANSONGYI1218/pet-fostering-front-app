/* eslint-disable @next/next/no-assign-module-variable */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

import CommentsContainer from '../comments-container';
import type { CommentItem } from '@/entities/comment/comment-api';

const sessionMocks = vi.hoisted(() => ({
  resolveStoredAccessTokenMock: vi.fn<() => string | null>(),
  resolveStoredAuthClaimsMock: vi.fn(),
}));

const communityApiMocks = vi.hoisted(() => ({
  createComment: vi.fn(),
  fetchCommunityComments: vi.fn(),
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

vi.mock('../../api/community', async () => {
  const actual = await vi.importActual<typeof import('../../api/community')>(
    '../../api/community',
  );

  return {
    ...actual,
    createComment: communityApiMocks.createComment,
    fetchCommunityComments: communityApiMocks.fetchCommunityComments,
  };
});

vi.mock('@/features/community/api/community', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/community/api/community')
  >('@/features/community/api/community');

  return {
    ...actual,
    createComment: communityApiMocks.createComment,
    fetchCommunityComments: communityApiMocks.fetchCommunityComments,
  };
});

const baseComment: CommentItem = {
  id: 'comment-1',
  parent_id: null,
  post_id: 'post-1',
  user: { id: 'author-1', nickname: '작성자' },
  content: '기존 댓글',
  likes: 0,
  liked: false,
  created_at: new Date('2025-01-01T00:00:00.000Z'),
  reply_comments: [],
};

describe('CommentsContainer', () => {
  beforeEach(async () => {
    sessionMocks.resolveStoredAccessTokenMock.mockReset();
    sessionMocks.resolveStoredAccessTokenMock.mockReturnValue('token-1');
    sessionMocks.resolveStoredAuthClaimsMock.mockReset();
    sessionMocks.resolveStoredAuthClaimsMock.mockReturnValue({
      userId: 'author-1',
      displayName: '작성자',
      avatarUrl: null,
    });
    communityApiMocks.createComment.mockReset();
    communityApiMocks.createComment.mockResolvedValue(undefined);
    communityApiMocks.fetchCommunityComments.mockReset();
    communityApiMocks.fetchCommunityComments.mockResolvedValue([baseComment]);
    const communityModule = await import('@/features/community/api/community');
    expect(communityModule.createComment).toBe(communityApiMocks.createComment);
  });

  it('댓글을 작성한 뒤 최신 목록을 표시한다', async () => {
    const user = userEvent.setup();
    const nextComment: CommentItem = {
      ...baseComment,
      id: 'comment-2',
      content: '새 댓글',
      created_at: new Date('2025-01-02T00:00:00.000Z'),
    };
    communityApiMocks.fetchCommunityComments.mockResolvedValue([
      nextComment,
      baseComment,
    ]);

    render(<CommentsContainer initialComments={[baseComment]} />);

    await waitFor(() =>
      expect(sessionMocks.resolveStoredAccessTokenMock).toHaveBeenCalled(),
    );

    const textarea = screen.getByPlaceholderText('댓글을 남겨주세요.');
    await user.type(textarea, '새 댓글');
    const submitButton = screen.getByRole('button', { name: '작성하기' });
    await waitFor(() => expect(submitButton).not.toBeDisabled());

    const form = submitButton.closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() =>
      expect(communityApiMocks.createComment).toHaveBeenCalledWith(
        'token-1',
        'post-1',
        { content: '새 댓글', parentId: undefined },
      ),
    );
    await waitFor(() =>
      expect(communityApiMocks.fetchCommunityComments).toHaveBeenCalledWith(
        'post-1',
        'token-1',
      ),
    );

    expect(screen.getByText('새 댓글')).toBeInTheDocument();
    expect(screen.getByText('기존 댓글')).toBeInTheDocument();
    expect(screen.getByText('2개의 답변이 있어요')).toBeInTheDocument();
  });
});
