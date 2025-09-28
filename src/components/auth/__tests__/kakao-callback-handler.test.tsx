import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock('@/lib/auth/kakao', () => ({
  completeKakaoLogin: vi.fn(),
}));

import { completeKakaoLogin } from '@/lib/auth/kakao';
import { KakaoCallbackHandler } from '../kakao-callback-handler';

describe('KakaoCallbackHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(completeKakaoLogin).mockResolvedValue({
      token: 'token',
      refreshToken: 'refresh',
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    });
  });

  it('로딩 메시지를 표시한다', async () => {
    render(<KakaoCallbackHandler code="some-code" />);

    expect(screen.getByText(/카카오 로그인 처리 중/i)).toBeInTheDocument();

    await waitFor(() => expect(completeKakaoLogin).toHaveBeenCalled());
  });

  it('성공 시 토큰 저장 및 페이지 이동을 수행한다', async () => {
    render(<KakaoCallbackHandler code="some-code" />);

    await waitFor(() => expect(completeKakaoLogin).toHaveBeenCalled());

    expect(completeKakaoLogin).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'some-code' }),
    );

    const callArgs = vi.mocked(completeKakaoLogin).mock.calls[0]?.[0];

    expect(callArgs?.storage).toBeDefined();

    await waitFor(() =>
      expect(screen.getByText(/로그인이 완료되었어요/i)).toBeInTheDocument(),
    );

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/main'));
  });

  it('에러 시 에러 메시지를 표기한다', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(completeKakaoLogin).mockRejectedValue(new Error('bad'));

    render(<KakaoCallbackHandler code="bad-code" />);

    await waitFor(() =>
      expect(screen.getByText(/로그인에 실패했어요/i)).toBeInTheDocument(),
    );
    expect(replaceMock).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
