import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resolveEndpoint } from '@/shared/api/config';

import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  completeKakaoLogin,
  buildKakaoAuthorizeUrl,
  exchangeKakaoAuthorizationCode,
  persistAuthTokens,
  redirectToKakaoLogin,
  USER_PROFILE_STORAGE_KEY,
  buildKakaoLogoutUrl,
  redirectToKakaoLogout,
} from './kakao';
import { AUTH_CHANGE_EVENT_NAME } from './events';

const ORIGINAL_ENV = { ...process.env };

const stubBrowserEnv = () => {
  const cookieJar: string[] = [];
  const documentStub = {
    get cookie() {
      return cookieJar.join('; ');
    },
    set cookie(value: string) {
      cookieJar.push(value);
    },
  } as unknown as Document;
  const windowStub = {
    location: { protocol: 'http:' },
    dispatchEvent: vi.fn(),
  } as unknown as Window;

  const originalDocument = (globalThis as { document?: Document }).document;
  const originalWindow = (globalThis as { window?: Window }).window;

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: documentStub,
  });
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: windowStub,
  });

  return {
    cookieJar,
    windowStub,
    restore: () => {
      if (originalDocument) {
        Object.defineProperty(globalThis, 'document', {
          configurable: true,
          value: originalDocument,
        });
      } else {
        delete (globalThis as { document?: Document }).document;
      }

      if (originalWindow) {
        Object.defineProperty(globalThis, 'window', {
          configurable: true,
          value: originalWindow,
        });
      } else {
        delete (globalThis as { window?: Window }).window;
      }
    },
  };
};

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
    const tokens = {
      token: 'access-token',
      refreshToken: 'refresh-token',
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    };
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
  let browserEnv: ReturnType<typeof stubBrowserEnv>;

  beforeEach(() => {
    browserEnv = stubBrowserEnv();
  });

  afterEach(() => {
    browserEnv.restore();
  });

  it('토큰을 Storage에 저장한다', () => {
    const setItem = vi.fn();
    const storage = { setItem } as Pick<Storage, 'setItem'>;

    persistAuthTokens({
      storage,
      tokens: {
        token: 'access',
        refreshToken: 'refresh',
        displayName: null,
        avatarUrl: null,
      },
    });

    expect(setItem).toHaveBeenCalledWith(ACCESS_TOKEN_STORAGE_KEY, 'access');
    expect(setItem).toHaveBeenCalledWith(REFRESH_TOKEN_STORAGE_KEY, 'refresh');
  });

  it('사용자 프로필 정보를 JSON으로 저장한다', () => {
    const setItem = vi.fn();
    const storage = { setItem } as Pick<Storage, 'setItem'>;

    persistAuthTokens({
      storage,
      tokens: {
        token: 'access',
        refreshToken: 'refresh',
        displayName: '퍼디',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      },
    });

    expect(setItem).toHaveBeenCalledWith(
      USER_PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName: '퍼디',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      }),
    );
  });

  it('토큰 저장 후 인증 변경 이벤트를 전파한다', () => {
    vi.useFakeTimers();
    const setItem = vi.fn();
    const storage = { setItem } as Pick<Storage, 'setItem'>;

    try {
      persistAuthTokens({
        storage,
        tokens: {
          token: 'access',
          refreshToken: 'refresh',
          displayName: null,
          avatarUrl: null,
        },
      });
      vi.runAllTimers();
    } finally {
      vi.useRealTimers();
    }

    expect(browserEnv.windowStub.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: AUTH_CHANGE_EVENT_NAME }),
    );
  });

  it('토큰을 쿠키에 저장한다', () => {
    const setItem = vi.fn();
    const storage = { setItem } as Pick<Storage, 'setItem'>;

    persistAuthTokens({
      storage,
      tokens: {
        token: 'access-token',
        refreshToken: 'refresh-token',
        displayName: null,
        avatarUrl: null,
      },
    });

    expect(
      browserEnv.cookieJar.some((cookie) =>
        cookie.startsWith(`${ACCESS_TOKEN_STORAGE_KEY}=`),
      ),
    ).toBe(true);
    expect(
      browserEnv.cookieJar.some((cookie) =>
        cookie.startsWith(`${REFRESH_TOKEN_STORAGE_KEY}=`),
      ),
    ).toBe(true);
  });
});

describe('logout helpers', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID = 'client-id';
    process.env.NEXT_PUBLIC_KAKAO_LOGOUT_REDIRECT_URI =
      'https://example.com/logout';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('빌드한 카카오 로그아웃 URL을 반환한다', () => {
    expect(buildKakaoLogoutUrl()).toBe(
      'https://kauth.kakao.com/oauth/logout?client_id=client-id&logout_redirect_uri=https%3A%2F%2Fexample.com%2Flogout',
    );
  });

  it('위임한 location.assign으로 리다이렉트를 수행한다', () => {
    const assign = vi.fn();

    redirectToKakaoLogout({ location: { assign } });

    expect(assign).toHaveBeenCalledWith(
      'https://kauth.kakao.com/oauth/logout?client_id=client-id&logout_redirect_uri=https%3A%2F%2Fexample.com%2Flogout',
    );
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
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
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
        displayName: '퍼디',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      },
    });
    expect(onSuccess).toHaveBeenCalledWith({
      tokens: {
        token: 'token',
        refreshToken: 'refresh',
        displayName: '퍼디',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      },
    });
    expect(tokens).toEqual({
      token: 'token',
      refreshToken: 'refresh',
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    });
  });
});
