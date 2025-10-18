import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { PostItem } from '@/entities/post/post-api';
import CommunityPost from '../community-post';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

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
  it('content가 없더라도 렌더링 에러가 발생하지 않는다', () => {
    const incompletePost = {
      ...samplePost,
      content: undefined,
    } as unknown as PostItem;

    expect(() => render(<CommunityPost post={incompletePost} />)).not.toThrow();
  });

  it('HTML 줄바꿈 태그를 줄 단위 텍스트로 렌더링한다', () => {
    render(<CommunityPost post={samplePost} />);

    expect(screen.getByText('첫 줄')).toBeInTheDocument();
    expect(screen.getByText('둘째 줄')).toBeInTheDocument();
  });

  it('게시글이 없을 때 안내 메시지를 표시한다', () => {
    render(<CommunityPost post={undefined} />);

    expect(screen.getByText('게시글을 찾을 수 없습니다.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '다시 시도' }),
    ).toBeInTheDocument();
  });
});
