import { resolveEndpoint } from '@/lib/api/config';

import {
  REFRESH_TOKEN_STORAGE_KEY,
  persistAuthTokens,
  type AuthTokenPair,
} from './kakao';

const resolveStorage = (
  candidate?: Pick<Storage, 'getItem' | 'setItem'> | null,
) => {
  if (candidate) {
    return candidate;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  return null;
};

type RefreshDependencies = {
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  fetcher?: typeof fetch;
  persistTokens?: typeof persistAuthTokens;
};

const parseTokens = async (
  response: Response,
): Promise<AuthTokenPair | null> => {
  try {
    const data = (await response.json()) as AuthTokenPair;

    if (
      typeof data?.token !== 'string' ||
      typeof data?.refreshToken !== 'string'
    ) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

export const tryRefreshAuthTokens = async ({
  storage,
  fetcher = typeof fetch === 'function' ? fetch : undefined,
  persistTokens: persist = persistAuthTokens,
}: RefreshDependencies = {}): Promise<AuthTokenPair | null> => {
  const targetStorage = resolveStorage(storage);

  if (!targetStorage || typeof targetStorage.getItem !== 'function') {
    return null;
  }

  const refreshToken = targetStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

  if (!refreshToken) {
    return null;
  }

  if (!fetcher) {
    return null;
  }

  try {
    const response = await fetcher(resolveEndpoint('/auth/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const tokens = await parseTokens(response);

    if (!tokens) {
      return null;
    }

    persist({ tokens, storage: targetStorage });

    return tokens;
  } catch {
    return null;
  }
};
