import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resolveEndpoint } from '@/lib/api/config';

import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  completeKakaoLogin,
  buildKakaoAuthorizeUrl,
  exchangeKakaoAuthorizationCode,
  persistAuthTokens,
  redirectToKakaoLogin,
} from './kakao';

const ORIGINAL_ENV = { ...process.env };

describe('buildKakaoAuthorizeUrl', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('환경 변수로 인가 URL을 생성한다', () => {
    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID = 'client-id';
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI =
      'https://example.com/auth/kakao/callback';

    const url = buildKakaoAuthorizeUrl();

    expect(url).toBe(
      'https://kauth.kakao.com/oauth/authorize?client_id=client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fauth%2Fkakao%2Fcallback&response_type=code',
    );
  });

  it('필수 환경 변수가 없으면 에러를 던진다', () => {
    delete process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    delete process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    expect(() => buildKakaoAuthorizeUrl()).toThrowError(
      '카카오 로그인에 필요한 환경 변수가 설정되지 않았습니다.',
    );
  });
});

describe('redirectToKakaoLogin', () => {
  it('Location.assign을 호출한다', () => {
    const assign = vi.fn();
    const location = { assign } as unknown as Location;

    const authorizeUrl = 'https://kauth.kakao.com/oauth/authorize?foo=bar';
    const builder = vi.fn().mockReturnValue(authorizeUrl);

    redirectToKakaoLogin({ location, buildAuthorizeUrl: builder });

    expect(builder).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith(authorizeUrl);
  });
});

describe('exchangeKakaoAuthorizationCode', () => {
  const endpoint = resolveEndpoint('/auth/kakao');

  it('인가 코드를 서버와 교환한다', async () => {
    const tokens = { token: 'access-token', refreshToken: 'refresh-token' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(tokens),
    });

    const result = await exchangeKakaoAuthorizationCode({
      code: 'auth-code',
      fetcher: fetchMock,
    });

    expect(fetchMock).toHaveBeenCalledWith(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: 'auth-code' }),
    });

    expect(result).toEqual(tokens);
  });

  it('요청 실패 시 에러를 던진다', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('server error'),
    });

    await expect(
      exchangeKakaoAuthorizationCode({
        code: 'bad-code',
        fetcher: fetchMock,
      }),
    ).rejects.toThrowError(
      '카카오 로그인 요청이 실패했습니다 (500). server error',
    );
  });
});

describe('persistAuthTokens', () => {
  it('토큰을 Storage에 저장한다', () => {
    const setItem = vi.fn();
    const storage = { setItem } as Pick<Storage, 'setItem'>;

    persistAuthTokens({
      storage,
      tokens: { token: 'access', refreshToken: 'refresh' },
    });

    expect(setItem).toHaveBeenCalledWith(ACCESS_TOKEN_STORAGE_KEY, 'access');
    expect(setItem).toHaveBeenCalledWith(REFRESH_TOKEN_STORAGE_KEY, 'refresh');
  });
});

describe('completeKakaoLogin', () => {
  it('인가 코드가 없으면 에러를 던진다', async () => {
    await expect(
      completeKakaoLogin({
        code: null,
        exchangeCode: vi.fn(),
        persistTokens: vi.fn(),
      }),
    ).rejects.toThrowError('카카오 인가 코드가 필요합니다.');
  });

  it('인가 코드를 교환하고 토큰을 저장한다', async () => {
    const exchangeCode = vi.fn().mockResolvedValue({
      token: 'token',
      refreshToken: 'refresh',
    });
    const persistTokens = vi.fn();
    const onSuccess = vi.fn();
    const storage = {
      setItem: vi.fn(),
    };

    const tokens = await completeKakaoLogin({
      code: 'auth-code',
      exchangeCode,
      persistTokens,
      onSuccess,
      storage,
    });

    expect(exchangeCode).toHaveBeenCalledWith({
      code: 'auth-code',
    });
    expect(persistTokens).toHaveBeenCalledWith({
      storage,
      tokens: {
        token: 'token',
        refreshToken: 'refresh',
      },
    });
    expect(onSuccess).toHaveBeenCalledWith({
      tokens: {
        token: 'token',
        refreshToken: 'refresh',
      },
    });
    expect(tokens).toEqual({ token: 'token', refreshToken: 'refresh' });
  });
});
