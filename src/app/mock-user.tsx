'use client';

import { useEffect } from 'react';

export default function MockTokenProvider() {
  useEffect(() => {
    // 클라이언트에서만 실행됨
    if (process.env.NODE_ENV === 'development') {
      if (!localStorage.getItem('pet.accessToken')) {
        console.log('🔥 DEV MODE: 가짜 토큰 자동 주입됨');

        localStorage.setItem('pet.accessToken', 'DEV_FAKE_TOKEN_123');
        localStorage.setItem(
          'pet.accessTokenExpire',
          (Date.now() + 1000 * 60 * 60).toString(),
        );
        localStorage.setItem('pet.refreshToken', 'DEV_FAKE_REFRESH_123');
        localStorage.setItem(
          'pet.userProfile',
          JSON.stringify({ id: 'dev-user', name: '개발자 테스트 유저' }),
        );
      }
    }
  }, []);

  return null; // UI 출력 없음
}
