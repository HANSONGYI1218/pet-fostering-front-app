'use client';

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

  throw new Error('NEXT_PUBLIC_GOOGLE_LOGIN_URL 환경 변수가 필요합니다.');
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
