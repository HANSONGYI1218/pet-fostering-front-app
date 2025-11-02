import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resolveEndpoint } from '@/shared/api/config';

import {
  ACCESS_TOKEN_EXPIRE_KEY,
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  completeKakaoLogin,
  buildKakaoAuthorizeUrl,
  exchangeKakaoAuthorizationCode,
  persistAuthTokens,
  redirectToKakaoLogin,
  USER_PROFILE_STORAGE_KEY,
} from './kakao';

import { clearStoredAuthTokens } from './session';
import { AUTH_CHANGE_EVENT_NAME, dispatchAuthChangeEvent } from './events';
import { DEFAULT_MAX_AGE_SECONDS } from './cookie-utils';

const ORIGINAL_ENV = { ...process.env };
const toBase64 = (value: string) =>
  Buffer.from(value, 'utf-8').toString('base64');

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
      displayName: '퍼디즈',
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
        displayName: '퍼디즈',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      },
    });

    expect(setItem).toHaveBeenCalledWith(
      USER_PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName: '퍼디즈',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      }),
    );
  });

  it('액세스 토큰 exp 클레임을 만료 시각으로 저장한다', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const expInSeconds = Math.floor(now.getTime() / 1000) + 900;
    const payload = {
      exp: expInSeconds,
      sub: 'user-1',
    };
    const token = [
      toBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
      toBase64(JSON.stringify(payload)),
      'signature',
    ].join('.');

    const setItem = vi.fn();
    const storage = { setItem } as Pick<Storage, 'setItem'>;

    try {
      persistAuthTokens({
        storage,
        tokens: {
          token,
          refreshToken: 'refresh',
          displayName: null,
          avatarUrl: null,
        },
      });
    } finally {
      vi.useRealTimers();
    }

    expect(setItem).toHaveBeenCalledWith(
      ACCESS_TOKEN_EXPIRE_KEY,
      String(expInSeconds * 1000),
    );
  });

  it('exp가 없으면 기본 만료 시각을 저장한다', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const payload = {
      sub: 'user-1',
    };
    const token = [
      toBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
      toBase64(JSON.stringify(payload)),
      'signature',
    ].join('.');

    const setItem = vi.fn();
    const storage = { setItem } as Pick<Storage, 'setItem'>;

    try {
      persistAuthTokens({
        storage,
        tokens: {
          token,
          refreshToken: 'refresh',
          displayName: null,
          avatarUrl: null,
        },
      });
    } finally {
      vi.useRealTimers();
    }

    expect(setItem).toHaveBeenCalledWith(
      ACCESS_TOKEN_EXPIRE_KEY,
      String(now.getTime() + DEFAULT_MAX_AGE_SECONDS * 1000),
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

describe('clearStoredAuthTokens', () => {
  let storageMock: Storage;

  beforeEach(() => {
    // 브라우저 환경 localStorage mock
    const store: Record<string, string> = {};
    storageMock = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key in store) delete store[key];
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };
    // 전역으로 설정
    Object.defineProperty(globalThis, 'localStorage', {
      value: storageMock,
      writable: true,
    });

    // dispatchAuthChangeEvent mock
    vi.spyOn(
      { dispatchAuthChangeEvent },
      'dispatchAuthChangeEvent',
    ).mockImplementation(() => {});
  });

  it('토큰과 쿠키를 삭제하고 이벤트를 발생시킨다', () => {
    // 테스트용 localStorage 세팅
    localStorage.setItem('pet.accessToken', 'token');
    localStorage.setItem('pet.refreshToken', 'refreshToken');
    localStorage.setItem('pet.userProfile', '{}');

    // storageMock을 명시적으로 전달
    clearStoredAuthTokens(storageMock);

    expect(localStorage.getItem('pet.accessToken')).toBeNull();
    expect(localStorage.getItem('pet.refreshToken')).toBeNull();
    expect(localStorage.getItem('pet.userProfile')).toBeNull();
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
      displayName: '퍼디즈',
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
        displayName: '퍼디즈',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      },
    });
    expect(onSuccess).toHaveBeenCalledWith({
      tokens: {
        token: 'token',
        refreshToken: 'refresh',
        displayName: '퍼디즈',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      },
    });
    expect(tokens).toEqual({
      token: 'token',
      refreshToken: 'refresh',
      displayName: '퍼디즈',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    });
  });
});
