import { afterEach, describe, expect, it } from 'vitest';

import { getApiBaseUrl, resolveEndpoint } from '../config';

const ORIGINAL_ENV = process.env;

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.NEXT_PUBLIC_API_BASE_URL;
});

describe('getApiBaseUrl', () => {
  it('환경 변수를 우선 적용한다', () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://example.com/api/';

    expect(getApiBaseUrl()).toBe('https://example.com/api');
  });

  it('환경 변수가 없으면 기본 URL을 반환한다', () => {
    expect(getApiBaseUrl()).toBe('http://localhost:3000');
  });
});

describe('resolveEndpoint', () => {
  it('선행 슬래시를 정규화하고 기본 URL과 결합한다', () => {
    expect(resolveEndpoint('/community/posts')).toBe(
      'http://localhost:3000/community/posts',
    );
  });
});
