'use client';

import { useEffect, useRef, useState } from 'react';

import {
  getKakao,
  hasKakaoSdk,
  type KakaoGeocoderResult,
  type KakaoMap,
  type KakaoMarker,
} from '@/lib/kakao-sdk';
import { logWarning } from '@/shared/lib/logging';

const KakaoMapLoader = ({ address }: { address: string }) => {
  const [map, setMap] = useState<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // SDK가 준비될 때까지 반복 체크
  useEffect(() => {
    if (!hasKakaoSdk()) {
      logWarning('Kakao Maps SDK가 준비되지 않아 지도를 초기화하지 않습니다.');
      return;
    }

    const interval = setInterval(() => {
      if (hasKakaoSdk()) {
        clearInterval(interval); // 준비되면 체크 멈춤
        const kakao = getKakao();
        kakao?.maps?.load?.(() => {
          const container = containerRef.current;
          const { Map, LatLng } = kakao.maps ?? {};
          if (!container || !Map || !LatLng) return;

          const mapInstance = new Map(container, {
            center: new LatLng(33.450701, 126.570667),
            level: 3,
          });
          setMap(mapInstance);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // map 초기화 후 주소 기반 마커 표시
  useEffect(() => {
    if (!map || !address || !hasKakaoSdk()) return;

    const kakao = getKakao();
    const { services, LatLng, Marker } = kakao?.maps ?? {};
    if (!services?.Geocoder || !services.Status || !LatLng || !Marker) return;

    const geocoder = new services.Geocoder();

    geocoder.addressSearch(
      address,
      (results: KakaoGeocoderResult[], status) => {
        if (status !== services.Status.OK) return;
        const result = results[0];
        if (!result) return;

        const coords = new LatLng(result.y, result.x);

        // 이전 마커 제거
        if (markerRef.current) markerRef.current.setMap(null);

        // 새 마커 생성
        markerRef.current = new Marker({ position: coords, map });
        map.setCenter(coords);
      },
    );
  }, [map, address]);

  return (
    <div ref={containerRef} style={{ height: '200px' }} className="w-full" />
  );
};

export default KakaoMapLoader;
