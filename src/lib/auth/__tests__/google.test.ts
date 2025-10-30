import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { buildGoogleLoginUrl, redirectToGoogleLogin } from '../google';

const ORIGINAL_ENV = { ...process.env };

describe('google auth helpers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('buildGoogleLoginUrl', () => {
    it('환경 변수에서 로그인 URL을 읽어온다', () => {
      process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL = ' https://example.com/login ';

      expect(buildGoogleLoginUrl()).toBe('https://example.com/login');
    });

    it('환경 변수가 없으면 명확한 오류를 던진다', () => {
      delete process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL;

      expect(() => buildGoogleLoginUrl()).toThrow(
        'NEXT_PUBLIC_GOOGLE_LOGIN_URL 환경 변수가 필요합니다.',
      );
    });
  });

  describe('redirectToGoogleLogin', () => {
    it('주입된 location.assign을 호출한다', () => {
      const assign = vi.fn();
      const stubUrl = 'https://example.com/login';

      redirectToGoogleLogin({
        location: { assign },
        buildUrl: () => stubUrl,
      });

      expect(assign).toHaveBeenCalledWith(stubUrl);
    });
  });
});
