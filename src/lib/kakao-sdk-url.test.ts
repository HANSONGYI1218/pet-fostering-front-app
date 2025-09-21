import { afterEach, describe, expect, it } from 'vitest';

import { buildKakaoSdkUrl, hasKakaoSdk } from '@/lib/kakao-sdk';

type TestWindow = typeof globalThis & { window?: unknown };

const globalRef = globalThis as TestWindow;
const originalWindow = globalRef.window;

afterEach(() => {
  if (originalWindow === undefined) {
    delete globalRef.window;
    return;
  }

  globalRef.window = originalWindow;
});

describe('buildKakaoSdkUrl', () => {
  it('환경 변수가 존재하면 카카오 SDK URL을 만든다', () => {
    expect(buildKakaoSdkUrl('some-key')).toBe(
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=some-key&autoload=false&libraries=services,clusterer,drawing',
    );
  });

  it('환경 변수가 없거나 공백이면 undefined를 반환한다', () => {
    expect(buildKakaoSdkUrl('')).toBeUndefined();
    expect(buildKakaoSdkUrl('   ')).toBeUndefined();
    expect(buildKakaoSdkUrl()).toBeUndefined();
  });
});

describe('hasKakaoSdk', () => {
  it('window 객체가 없으면 false를 반환한다', () => {
    delete globalRef.window;

    expect(hasKakaoSdk()).toBe(false);
  });

  it('kakao.maps.load가 존재하면 true를 반환한다', () => {
    globalRef.window = {
      kakao: {
        maps: {
          load: () => {},
        },
      },
    };

    expect(hasKakaoSdk()).toBe(true);
  });

  it('load 함수가 없으면 false를 반환한다', () => {
    globalRef.window = {
      kakao: {
        maps: {},
      },
    };

    expect(hasKakaoSdk()).toBe(false);
  });
});
