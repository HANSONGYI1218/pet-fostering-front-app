'use client';

import { useEffect, useRef, useState } from 'react';

type KakaoMap = kakao.maps.Map;
type KakaoMarker = kakao.maps.Marker;
type GeocoderResult = kakao.maps.services.GeocoderResult;

const KakaoMapLoader = ({ address }: { address: string }) => {
  const [map, setMap] = useState<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);

  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      setMap(new window.kakao.maps.Map(container, options));
    });
  }, []);
  // 2) 최초 렌더링 시에는 제외하고 map이 변경되면 실행
  useEffect(() => {
    if (map && address) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      // 주소를 좌표로 변환하는 함수
      geocoder.addressSearch(address, (results: GeocoderResult[], status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const result = results[0];
          const coords = new window.kakao.maps.LatLng(result.y, result.x);

          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          markerRef.current = new window.kakao.maps.Marker({
            position: coords,
            map,
          });

          map.setCenter(coords);
        }
      });
    }
  }, [map, address]); // map과 address가 변경될 때마다 실행

  return <div id="map" style={{ height: '200px' }} className="w-full" />;
};

export default KakaoMapLoader;
