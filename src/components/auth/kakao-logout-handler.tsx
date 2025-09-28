'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { clearStoredAuthTokens } from '@/lib/auth/session';

const messages = {
  heading: '카카오 로그아웃',
  body: '로그아웃이 완료되었어요. 잠시 후 로그인 페이지로 이동합니다.',
};

export const KakaoLogoutHandler = () => {
  const router = useRouter();

  useEffect(() => {
    clearStoredAuthTokens();

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-lg">
        <h1 className="text-xl font-semibold text-neutral-900">{messages.heading}</h1>
        <p className="text-neutral-600">{messages.body}</p>
      </div>
    </div>
  );
};

