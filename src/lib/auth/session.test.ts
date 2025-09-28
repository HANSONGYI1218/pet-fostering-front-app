import { Buffer } from 'node:buffer';

import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from '@/lib/auth/kakao';
import { describe, expect, it } from 'vitest';

import {
  clearStoredAuthTokens,
  parseAuthClaims,
  resolveStoredAuthClaims,
} from './session';
import { USER_PROFILE_STORAGE_KEY } from './kakao';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const createToken = (payload: Record<string, unknown>) => {
  const encode = (value: string) =>
    Buffer.from(value, 'utf-8').toString('base64url');

  const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encode(JSON.stringify(payload));

  return `${header}.${body}.signature`;
};

describe('session utilities', () => {
  const createStorage = (): StorageLike => {
    const map = new Map<string, string>();
    return {
      getItem: (key) => map.get(key) ?? null,
      setItem: (key, value) => {
        map.set(key, value);
      },
      removeItem: (key) => {
        map.delete(key);
      },
    };
  };

  it('JWT에서 사용자 정보를 파싱한다', () => {
    const token = createToken({
      sub: 'user-123',
      role: 'USER',
      displayName: ' 퍼디 ',
      avatarUrl: ' https://cdn.kakao/avatar.png ',
    });

    const claims = parseAuthClaims(token);

    expect(claims).toMatchObject({
      userId: 'user-123',
      role: 'USER',
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    });
  });

  it('필수 sub가 없으면 null을 반환한다', () => {
    const token = createToken({ role: 'USER' });

    expect(parseAuthClaims(token)).toBeNull();
  });

  it('저장소에서 토큰을 읽어 클레임을 반환한다', () => {
    const storage = createStorage();
    const token = createToken({ sub: 'user-id', displayName: '퍼디' });

    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);

    const claims = resolveStoredAuthClaims(storage);

    expect(claims).toMatchObject({
      userId: 'user-id',
      displayName: '퍼디',
      avatarUrl: null,
    });
  });

  it('토큰에 닉네임이나 아바타가 없으면 저장된 프로필로 보완한다', () => {
    const storage = createStorage();
    const token = createToken({ sub: 'user-id' });

    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    storage.setItem(
      USER_PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName: '퍼디',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      }),
    );

    const claims = resolveStoredAuthClaims(storage);

    expect(claims).toMatchObject({
      userId: 'user-id',
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    });
  });

  it('저장소 토큰을 제거한다', () => {
    const storage = createStorage();

    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'access');
    storage.setItem(REFRESH_TOKEN_STORAGE_KEY, 'refresh');
    storage.setItem(
      USER_PROFILE_STORAGE_KEY,
      JSON.stringify({ displayName: '퍼디', avatarUrl: null }),
    );

    clearStoredAuthTokens(storage);

    expect(storage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(USER_PROFILE_STORAGE_KEY)).toBeNull();
  });
});
