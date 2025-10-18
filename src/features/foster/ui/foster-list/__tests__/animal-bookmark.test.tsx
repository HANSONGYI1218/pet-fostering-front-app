import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import AnimalBookmark from '../animal-bookmark';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/lib/auth/kakao';

describe('AnimalBookmark', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('로그인 토큰이 없으면 버튼을 렌더링하지 않는다', () => {
    render(<AnimalBookmark isBookmarked={false} />);

    expect(screen.queryByRole('button', { name: '즐겨찾기 토글' })).toBeNull();
  });

  it('로그인 토큰이 있으면 버튼을 렌더링한다', async () => {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'token');

    render(<AnimalBookmark isBookmarked />);

    await screen.findByRole('button', { name: '즐겨찾기 토글' });
  });
});
