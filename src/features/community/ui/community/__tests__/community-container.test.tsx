import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import CommunityContainer from '../community-container';

describe('CommunityContainer', () => {
  it('게시글이 없으면 빈 상태 안내를 보여준다', () => {
    render(<CommunityContainer posts={[]} />);

    expect(
      screen.getByText('게시글이 아직 없습니다. 첫 글을 남겨보세요!'),
    ).toBeInTheDocument();
  });
});
