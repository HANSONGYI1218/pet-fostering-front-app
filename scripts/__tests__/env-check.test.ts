import { describe, expect, it } from 'vitest';

import { findMissingKeys } from '../env-check';

describe('findMissingKeys', () => {
  const required = ['NEXT_PUBLIC_KAKAO_CLIENT_ID', 'NEXT_PUBLIC_MAP_KEY'];

  it('필요한 키가 모두 채워져 있으면 빈 배열을 반환한다', () => {
    const env = {
      NEXT_PUBLIC_KAKAO_CLIENT_ID: 'client-id',
      NEXT_PUBLIC_MAP_KEY: 'map-key',
    };

    expect(findMissingKeys(env, required)).toEqual([]);
  });

  it('누락되었거나 공백인 키를 반환한다', () => {
    const env = {
      NEXT_PUBLIC_KAKAO_CLIENT_ID: '   ',
    };

    expect(findMissingKeys(env, required)).toEqual([
      'NEXT_PUBLIC_KAKAO_CLIENT_ID',
      'NEXT_PUBLIC_MAP_KEY',
    ]);
  });
});
