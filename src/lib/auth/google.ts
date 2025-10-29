'use client';

import { resolveEndpoint } from '@/shared/api/config';

const DEFAULT_GOOGLE_LOGIN_PATH = '/auth/google';

type Maybe<T> = T | null | undefined;

const resolveBrowserLocation = (
  location: Maybe<Pick<Location, 'assign'>>,
): Pick<Location, 'assign'> => {
  if (location) {
    return location;
  }

  if (typeof window !== 'undefined' && window.location) {
    return window.location;
  }

  throw new Error('브라우저 환경에서만 구글 로그인을 시작할 수 있습니다.');
};

export const buildGoogleLoginUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL?.trim();

  if (explicit) {
    return explicit;
  }

  return resolveEndpoint(DEFAULT_GOOGLE_LOGIN_PATH);
};

export const redirectToGoogleLogin = ({
  location,
  buildUrl = buildGoogleLoginUrl,
}: {
  location?: Pick<Location, 'assign'>;
  buildUrl?: () => string;
} = {}) => {
  const targetLocation = resolveBrowserLocation(location);
  const loginUrl = buildUrl();

  targetLocation.assign(loginUrl);
};
