import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PostTile from '../post-tile';

describe('PostTile', () => {
  it('렌더링 테스트', () => {
    const post = {
      id: 'post-1',
      title: '게시글 제목',
      content: '게시글 내용입니다.',
      likeCount: 10,
      viewCount: 100,
    };

    render(<PostTile post={post} />);

    expect(screen.getByText('게시글 제목')).toBeInTheDocument();
    expect(screen.getByText('게시글 내용입니다.')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/community/post-1');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
