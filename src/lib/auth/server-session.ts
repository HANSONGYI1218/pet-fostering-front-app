import { cookies } from 'next/headers';

import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './kakao';
import { parseAuthClaims } from './session';
import type { AuthClaims } from './session';

const decodeCookieValue = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const resolveServerAccessToken = async (): Promise<string | null> => {
  const store = await cookies();

  return decodeCookieValue(store.get(ACCESS_TOKEN_STORAGE_KEY)?.value);
};

export const resolveServerRefreshToken = async (): Promise<string | null> => {
  const store = await cookies();

  return decodeCookieValue(store.get(REFRESH_TOKEN_STORAGE_KEY)?.value);
};

export const resolveServerAuthClaims = async (): Promise<AuthClaims | null> => {
  const token = await resolveServerAccessToken();

  if (!token) {
    return null;
  }

  return parseAuthClaims(token);
};
