import { describe, expect, it, vi } from 'vitest';

import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
} from './kakao';
import { tryRefreshAuthTokens } from './refresh';
import { resolveEndpoint } from '@/lib/api/config';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

const createStorage = (): StorageLike & { setCalls: Array<[string, string]> } => {
  const map = new Map<string, string>();
  const setCalls: Array<[string, string]> = [];

  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
      setCalls.push([key, value]);
    },
    setCalls,
  };
};

describe('tryRefreshAuthTokens', () => {
  it('refresh 토큰이 없으면 null을 반환한다', async () => {
    const storage = createStorage();
    const fetcher = vi.fn();

    const result = await tryRefreshAuthTokens({ storage, fetcher });

    expect(result).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('성공 시 새 토큰을 저장하고 반환한다', async () => {
    const storage = createStorage();

    storage.setItem(REFRESH_TOKEN_STORAGE_KEY, 'refresh-token');
    storage.setCalls.length = 0;

    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'new-access',
        refreshToken: 'new-refresh',
        displayName: 'Muna',
        avatarUrl: null,
      }),
    });

    const result = await tryRefreshAuthTokens({ storage, fetcher });

    expect(fetcher).toHaveBeenCalledWith(resolveEndpoint('/auth/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken: 'refresh-token' }),
      cache: 'no-store',
    });
    expect(result).toMatchObject({ token: 'new-access', refreshToken: 'new-refresh' });
    expect(storage.setCalls).toEqual([
      [ACCESS_TOKEN_STORAGE_KEY, 'new-access'],
      [REFRESH_TOKEN_STORAGE_KEY, 'new-refresh'],
      [
        USER_PROFILE_STORAGE_KEY,
        JSON.stringify({ displayName: 'Muna', avatarUrl: null }),
      ],
    ]);
  });

  it('요청 실패 시 null을 반환한다', async () => {
    const storage = createStorage();

    storage.setItem(REFRESH_TOKEN_STORAGE_KEY, 'refresh-token');
    storage.setCalls.length = 0;

    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await tryRefreshAuthTokens({ storage, fetcher });

    expect(result).toBeNull();
    expect(storage.setCalls).toHaveLength(0);
  });
});
