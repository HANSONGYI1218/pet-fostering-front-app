import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/google', () => ({
  redirectToGoogleLogin: vi.fn(),
}));

import { GoogleLoginButton } from '../google-login-button';
import { redirectToGoogleLogin } from '@/lib/auth/google';

describe('GoogleLoginButton', () => {
  it('구글 로그인 플로우를 호출한다', () => {
    render(<GoogleLoginButton />);

    fireEvent.click(screen.getByRole('button', { name: /구글로 시작하기/i }));

    expect(redirectToGoogleLogin).toHaveBeenCalledTimes(1);
  });
});
