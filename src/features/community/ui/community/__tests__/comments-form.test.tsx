import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CommentItem } from '@/entities/comment/comment-api';
import CommentsForm from '../comments-form';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

const sessionMocks = vi.hoisted(() => ({
  resolveStoredAccessTokenMock: vi.fn<() => string | null>(),
}));

const communityApiMocks = vi.hoisted(() => ({
  createComment: vi.fn(),
  updateComment: vi.fn(),
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
  };
});

vi.mock('@/features/community/api/community', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/community/api/community')
  >('@/features/community/api/community');

  return {
    ...actual,
    createComment: communityApiMocks.createComment,
    updateComment: communityApiMocks.updateComment,
    fetchCommunityComments: communityApiMocks.fetchCommunityComments,
  };
});

vi.mock('../../api/community', async () => {
  const actual = await vi.importActual<typeof import('../../api/community')>(
    '../../api/community',
  );

  return {
    ...actual,
    createComment: communityApiMocks.createComment,
    updateComment: communityApiMocks.updateComment,
    fetchCommunityComments: communityApiMocks.fetchCommunityComments,
  };
});

vi.mock('../../api/community', async () => {
  const actual = await vi.importActual<typeof import('../../api/community')>(
    '../../api/community',
  );

  return {
    ...actual,
    createComment: communityApiMocks.createComment,
    updateComment: communityApiMocks.updateComment,
    fetchCommunityComments: communityApiMocks.fetchCommunityComments,
  };
});

const sampleComment: CommentItem = {
  id: 'comment-1',
  parent_id: null,
  post_id: 'post-1',
  user: { id: 'user-1', nickname: 'tester' },
  content: '작성된 댓글',
  likes: 0,
  liked: false,
  created_at: new Date('2025-01-01T00:00:00.000Z'),
  reply_comments: [],
};

describe('CommentsForm', () => {
  beforeEach(async () => {
    sessionMocks.resolveStoredAccessTokenMock.mockReset();
    sessionMocks.resolveStoredAccessTokenMock.mockReturnValue('token-1');
    communityApiMocks.createComment.mockReset();
    communityApiMocks.updateComment.mockReset();
    communityApiMocks.fetchCommunityComments.mockReset();
    communityApiMocks.createComment.mockResolvedValue(undefined);
    communityApiMocks.updateComment.mockResolvedValue(sampleComment);
    communityApiMocks.fetchCommunityComments.mockResolvedValue([sampleComment]);
    const communityModule = await import('@/features/community/api/community');
    expect(communityModule.createComment).toBe(communityApiMocks.createComment);
    expect(communityModule.fetchCommunityComments).toBe(
      communityApiMocks.fetchCommunityComments,
    );
  });

  it('댓글을 생성하고 최신 목록으로 갱신한다', async () => {
    const user = userEvent.setup();
    const handleComments = vi.fn();

    render(<CommentsForm postId="post-1" draft={{ mode: 'create' }} />);

    await waitFor(() =>
      expect(sessionMocks.resolveStoredAccessTokenMock).toHaveBeenCalled(),
    );

    const textarea = await screen.findByPlaceholderText('댓글을 남겨주세요.');
    await user.type(textarea, '새 댓글');

    const submitButton = await screen.findByRole('button', {
      name: '작성하기',
    });
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

    expect(toast).not.toHaveBeenCalledWith('잠시 뒤 다시 시도해 주세요.');
    expect(textarea).toHaveValue('');
  });

  it('댓글을 수정하고 최신 목록으로 갱신한다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <CommentsForm
        postId="post-1"
        draft={{
          mode: 'edit',
          id: 'comment-1',
          parentId: undefined,
          content: '작성된 댓글',
        }}
        onClose={onClose}
      />,
    );

    await waitFor(() =>
      expect(sessionMocks.resolveStoredAccessTokenMock).toHaveBeenCalled(),
    );
    const textarea = await screen.findByPlaceholderText('댓글을 남겨주세요.');
    await user.clear(textarea);
    await user.type(textarea, '수정된 댓글');
    const submitButton = await screen.findByRole('button', {
      name: '작성하기',
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() =>
      expect(communityApiMocks.updateComment).toHaveBeenCalledWith(
        'token-1',
        'post-1',
        'comment-1',
        { content: '수정된 댓글', parentId: undefined },
      ),
    );
    expect(toast).not.toHaveBeenCalledWith('잠시 뒤 다시 시도해 주세요.');
    expect(onClose).toHaveBeenCalled();
  });
});
