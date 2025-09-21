import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PostItem } from '@/types/post/post-api';
import CommunityPost from '../community-post';

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
});
