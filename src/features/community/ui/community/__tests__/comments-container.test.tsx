import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CommentsContainer from '../comments-container';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe('CommentsContainer', () => {
  it('댓글이 없을 때 빈 상태 메시지를 보여준다', () => {
    render(<CommentsContainer comments={[]} />);

    expect(screen.getByText('아직 댓글이 없습니다.')).toBeInTheDocument();
  });

  it('댓글 로딩이 실패한 경우 오류 메시지를 표시한다', () => {
    render(<CommentsContainer comments={[]} isError />);

    expect(
      screen.getByText('댓글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '다시 시도' }),
    ).toBeInTheDocument();
  });
});
