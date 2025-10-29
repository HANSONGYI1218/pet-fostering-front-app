import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalBookmark from '../animal-bookmark';
import * as authSession from '@/lib/auth/session';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('AnimalBookmark', () => {
  beforeEach(() => {
    // 로그인 토큰이 있는 상태로 mock
    vi.spyOn(authSession, 'resolveStoredAccessToken').mockReturnValue(
      'mock-token',
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('즐겨찾기 버튼이 보이고 클릭 시 상태가 변경된다', async () => {
    render(<AnimalBookmark isBookmarked={false} />);

    // 버튼이 렌더링될 때까지 대기
    const bookmarkButton = await screen.findByRole('button', {
      name: '즐겨찾기 토글',
    });

    // 초기 상태 확인
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false');

    // 클릭
    await userEvent.click(bookmarkButton);

    // 클릭 후 상태 확인
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('초기 즐겨찾기 상태가 true이면 버튼이 눌린 상태로 렌더링된다', async () => {
    render(<AnimalBookmark isBookmarked={true} />);

    const bookmarkButton = await screen.findByRole('button', {
      name: '즐겨찾기 토글',
    });
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');
  });
});
