import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/kakao', () => ({
  redirectToKakaoLogin: vi.fn(),
}));

import { redirectToKakaoLogin } from '@/lib/auth/kakao';
import { KakaoLoginButton } from '../kakao-login-button';

describe('KakaoLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('카카오 로그인 버튼을 렌더링한다', () => {
    render(<KakaoLoginButton />);

    expect(
      screen.getByRole('button', { name: /카카오로 시작하기/i }),
    ).toBeInTheDocument();
  });

  it('클릭 시 카카오 로그인 리다이렉트를 호출한다', async () => {
    const user = userEvent.setup();

    render(<KakaoLoginButton />);

    await user.click(screen.getByRole('button', { name: /카카오로 시작하기/i }));

    expect(redirectToKakaoLogin).toHaveBeenCalledTimes(1);
  });
});
