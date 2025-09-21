type KakaoMapsNamespace = {
  load?: (callback: () => void) => void;
} & Record<string, unknown>;

type KakaoNamespace = {
  maps?: KakaoMapsNamespace;
} & Record<string, unknown>;

type KakaoWindow = Window & {
  kakao?: KakaoNamespace;
};

export const getKakao = (): KakaoNamespace | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const { kakao } = window as KakaoWindow;

  return kakao;
};

export const hasKakaoSdk = (): boolean => {
  const kakao = getKakao();

  return typeof kakao?.maps?.load === 'function';
};

export const buildKakaoSdkUrl = (rawAppKey?: string | null): string | undefined => {
  const appKey = rawAppKey?.trim();

  if (!appKey) {
    return undefined;
  }

  const baseUrl = 'https://dapi.kakao.com/v2/maps/sdk.js';
  const search = new URLSearchParams({ appkey: appKey, autoload: 'false' }).toString();

  return `${baseUrl}?${search}&libraries=services,clusterer,drawing`;
};
