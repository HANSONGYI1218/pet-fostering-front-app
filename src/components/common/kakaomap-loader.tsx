'use client';

import { useEffect, useRef, useState } from 'react';

import {
  getKakao,
  hasKakaoSdk,
  type KakaoGeocoderResult,
  type KakaoMap,
  type KakaoMarker,
} from '@/lib/kakao-sdk';

const KakaoMapLoader = ({ address }: { address: string }) => {
  const [map, setMap] = useState<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasKakaoSdk()) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Kakao Maps SDK가 준비되지 않아 지도를 초기화하지 않습니다.');
      }
      return;
    }

    const kakao = getKakao();

    kakao?.maps?.load?.(() => {
      const container = containerRef.current;
      const { Map, LatLng } = kakao.maps ?? {};

      if (!container || !Map || !LatLng) {
        return;
      }

      const options = {
        center: new LatLng(33.450701, 126.570667),
        level: 3,
      };
      setMap(new Map(container, options));
    });
  }, []);
  // 2) 최초 렌더링 시에는 제외하고 map이 변경되면 실행
  useEffect(() => {
    if (!map || !address || !hasKakaoSdk()) {
      return;
    }

    const kakao = getKakao();
    const { services, LatLng, Marker } = kakao?.maps ?? {};

    if (!services?.Geocoder || !services.Status || !LatLng || !Marker) {
      return;
    }

    const geocoder = new services.Geocoder();
    // 주소를 좌표로 변환하는 함수
    geocoder.addressSearch(address, (results: KakaoGeocoderResult[], status) => {
      if (status === services.Status.OK) {
        const result = results[0];

        if (!result) {
          return;
        }

        const coords = new LatLng(result.y, result.x);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new Marker({
          position: coords,
          map,
        });

        map.setCenter(coords);
      }
    });
  }, [map, address]); // map과 address가 변경될 때마다 실행

  return (
    <div
      ref={containerRef}
      style={{ height: '200px' }}
      className="w-full"
    />
  );
};

export default KakaoMapLoader;
