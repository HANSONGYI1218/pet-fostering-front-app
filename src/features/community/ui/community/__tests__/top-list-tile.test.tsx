import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TopListTile from '../top-list-tile';
import type { PostItem } from '@/entities/post/post-api';

describe('TopListTile', () => {
  it('댓글 수를 실제 데이터에 맞춰 보여준다', () => {
    const post: PostItem = {
      id: 'post-1',
      title: '테스트',
      content: '내용',
      likes: 0,
      views: 10,
      created_at: new Date(),
      user: { id: 'user-1', nickname: '닉네임' },
      commentCount: 7,
    };

    render(<TopListTile index={0} recentPopularPost={post} />);

    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
