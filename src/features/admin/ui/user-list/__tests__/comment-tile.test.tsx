import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CommentTile from '../comment-tile';

describe('CommentTile', () => {
  it('렌더링 테스트', () => {
    const comment = {
      id: 'comment-1',
      content: '댓글 내용입니다.',
      likeCount: 5,
      post: { id: 'post-1', title: '게시글 제목', content: '게시글 내용' },
    };

    render(<CommentTile comment={comment} />);

    expect(screen.getByText('댓글 내용입니다.')).toBeInTheDocument();
    expect(screen.getByText('게시글 제목에 대한 댓글')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/community/post-1');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
