/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KakaoCallbackHandler } from '../ui/kakao-callback-handler';
import * as kakao from '@/lib/auth/kakao';

vi.mock('@/lib/auth/kakao', () => ({
  completeKakaoLogin: vi.fn(),
}));

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

describe('KakaoCallbackHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    replaceMock.mockClear();
    (globalThis as any).reportError = vi.fn(); // 👈 여기서 추가
  });

  it('로그인 성공 시 router.replace 호출', async () => {
    vi.spyOn(kakao, 'completeKakaoLogin').mockResolvedValueOnce({});

    render(<KakaoCallbackHandler code="dummy-code" />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/');
    });
  });

  it('code가 없으면 reportGlobalError 호출', async () => {
    render(<KakaoCallbackHandler code={null} />);

    await waitFor(() => {
      expect((globalThis as any).reportError).toHaveBeenCalledWith(
        expect.objectContaining({ message: '카카오 인가 코드가 필요합니다.' }),
      );
    });
  });
});
