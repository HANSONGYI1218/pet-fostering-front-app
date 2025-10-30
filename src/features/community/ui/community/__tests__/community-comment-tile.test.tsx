import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  CommentItem,
  ReplyCommentItem,
} from '@/entities/comment/comment-api';
import CommunityCommentTile from '../community-comment-tile';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

const sessionMocks = vi.hoisted(() => ({
  resolveStoredAccessTokenMock: vi.fn<() => string | null>(),
  resolveStoredAuthClaimsMock: vi.fn(),
}));

const communityApiMocks = vi.hoisted(() => ({
  deleteComment: vi.fn(),
  createCommentLike: vi.fn(),
  deleteCommentLike: vi.fn(),
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
    deleteComment: communityApiMocks.deleteComment,
    createCommentLike: communityApiMocks.createCommentLike,
    deleteCommentLike: communityApiMocks.deleteCommentLike,
  };
});

vi.mock('@/features/community/api/community', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/community/api/community')
  >('@/features/community/api/community');

  return {
    ...actual,
    deleteComment: communityApiMocks.deleteComment,
    createCommentLike: communityApiMocks.createCommentLike,
    deleteCommentLike: communityApiMocks.deleteCommentLike,
  };
});

const baseComment: CommentItem = {
  id: 'comment-1',
  parent_id: null,
  post_id: 'post-1',
  user: { id: 'author-1', nickname: '작성자' },
  content: '내용',
  likes: 0,
  liked: false,
  created_at: new Date('2025-01-01T00:00:00.000Z'),
  reply_comments: [],
};

describe('CommunityCommentTile', () => {
  beforeEach(async () => {
    sessionMocks.resolveStoredAccessTokenMock.mockReset();
    sessionMocks.resolveStoredAuthClaimsMock.mockReset();
    sessionMocks.resolveStoredAccessTokenMock.mockReturnValue('token-1');
    sessionMocks.resolveStoredAuthClaimsMock.mockReturnValue({
      userId: 'author-1',
      displayName: '작성자',
      avatarUrl: null,
    });
    communityApiMocks.deleteComment.mockReset();
    communityApiMocks.deleteComment.mockResolvedValue(undefined);
    communityApiMocks.createCommentLike.mockResolvedValue(undefined);
    communityApiMocks.deleteCommentLike.mockResolvedValue(undefined);
    vi.mocked(toast).mockClear();
    const communityModule = await import('@/features/community/api/community');
    expect(communityModule.deleteComment).toBe(communityApiMocks.deleteComment);
  });

  it('상위 댓글을 삭제하고 상태를 갱신한다', async () => {
    const user = userEvent.setup();
    const handleComments = vi.fn((updater) => updater([baseComment]));

    render(
      <CommunityCommentTile
        comment={baseComment}
        onSelectComment={vi.fn()}
        onUpdateComments={handleComments}
      />,
    );

    await waitFor(() =>
      expect(sessionMocks.resolveStoredAccessTokenMock).toHaveBeenCalled(),
    );

    const menuTrigger = screen.getByRole('menuitem', { name: '댓글 옵션' });
    await user.click(menuTrigger);

    const deleteItem = await screen.findByRole('menuitem', {
      name: '삭제하기',
    });
    await user.click(deleteItem);

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '지우기' }));

    await waitFor(() =>
      expect(communityApiMocks.deleteComment).toHaveBeenCalledWith(
        'token-1',
        'post-1',
        'comment-1',
      ),
    );

    expect(handleComments).toHaveBeenCalledTimes(1);
    expect(handleComments.mock.results[0].value).toEqual([]);
    expect(toast).toHaveBeenCalledWith('댓글을 삭제했어요.');
  });

  it('대댓글을 삭제하면 부모 댓글의 목록에서 제거한다', async () => {
    const user = userEvent.setup();
    const reply: ReplyCommentItem = {
      id: 'reply-1',
      parent_id: 'comment-1',
      post_id: 'post-1',
      user: { id: 'author-1', nickname: '작성자' },
      content: '대댓글',
      likes: 0,
      liked: false,
      created_at: new Date('2025-01-01T01:00:00.000Z'),
    };

    const handleComments = vi.fn((updater) =>
      updater([{ ...baseComment, reply_comments: [reply] }]),
    );

    render(
      <CommunityCommentTile
        comment={reply}
        onSelectComment={vi.fn()}
        onUpdateComments={handleComments}
      />,
    );

    await waitFor(() =>
      expect(sessionMocks.resolveStoredAccessTokenMock).toHaveBeenCalled(),
    );

    const menuTrigger = screen.getByRole('menuitem', { name: '댓글 옵션' });
    await user.click(menuTrigger);
    await user.click(await screen.findByRole('menuitem', { name: '삭제하기' }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '지우기' }));

    await waitFor(() =>
      expect(communityApiMocks.deleteComment).toHaveBeenCalledWith(
        'token-1',
        'post-1',
        'reply-1',
      ),
    );

    expect(handleComments).toHaveBeenCalledTimes(1);
    expect(handleComments.mock.results[0].value).toEqual([
      { ...baseComment, reply_comments: null },
    ]);
    expect(toast).toHaveBeenCalledWith('댓글을 삭제했어요.');
  });
});
