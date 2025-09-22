export type KakaoLatLng = {
  getLat?: () => number;
  getLng?: () => number;
};

export type KakaoMap = {
  setCenter: (position: KakaoLatLng) => void;
};

export type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
};

export type KakaoGeocoderResult = {
  x: number;
  y: number;
};

type KakaoLatLngConstructor = new (lat: number, lng: number) => KakaoLatLng;
type KakaoMapConstructor = new (
  container: HTMLElement,
  options: { center: KakaoLatLng; level: number },
) => KakaoMap;
type KakaoMarkerConstructor = new (options: {
  position: KakaoLatLng;
  map?: KakaoMap;
}) => KakaoMarker;
type KakaoGeocoderConstructor = new () => {
  addressSearch: (
    address: string,
    callback: (result: KakaoGeocoderResult[], status: string) => void,
  ) => void;
};

type KakaoMapsServicesNamespace = {
  Geocoder: KakaoGeocoderConstructor;
  Status: Record<string, string>;
};

type KakaoMapsNamespace = {
  load?: (callback: () => void) => void;
  LatLng?: KakaoLatLngConstructor;
  Map?: KakaoMapConstructor;
  Marker?: KakaoMarkerConstructor;
  services?: KakaoMapsServicesNamespace;
};

export type KakaoNamespace = {
  maps?: KakaoMapsNamespace;
};

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

export const buildKakaoSdkUrl = (
  rawAppKey?: string | null,
): string | undefined => {
  const appKey = rawAppKey?.trim();

  if (!appKey) {
    return undefined;
  }

  const baseUrl = 'https://dapi.kakao.com/v2/maps/sdk.js';
  const search = new URLSearchParams({
    appkey: appKey,
    autoload: 'false',
  }).toString();

  return `${baseUrl}?${search}&libraries=services,clusterer,drawing`;
};
