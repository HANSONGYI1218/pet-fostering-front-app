'use client';

import { useEffect, useRef, useState } from 'react';

const KakaoMapLoader = ({ address }: { address: string }) => {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();

  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      setMap(new window.kakao.maps.Map(container, options));
      setMarker(new window.kakao.maps.Marker());
    });
  }, []);
  // 2) 최초 렌더링 시에는 제외하고 map이 변경되면 실행
  useEffect(() => {
    if (map && address) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      // 주소를 좌표로 변환하는 함수
      geocoder.addressSearch(address, (results: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const result = results[0];
          const coords = new window.kakao.maps.LatLng(result.y, result.x);

          // 기존 마커가 있으면 제거
          if (marker) {
            marker.setMap(null);
          }

          // 새로운 마커를 생성하고 위치 설정
          const newMarker = new window.kakao.maps.Marker({
            position: coords,
            map: map, // 기존 맵에 마커를 추가
          });
          setMarker(newMarker); // 상태 업데이트

          // 지도 중심을 해당 좌표로 변경
          map.setCenter(coords);
        }
      });
    }
  }, [map, address]); // map과 address가 변경될 때마다 실행

  return <div id="map" style={{ height: '200px' }} className="w-full" />;
};

export default KakaoMapLoader;
