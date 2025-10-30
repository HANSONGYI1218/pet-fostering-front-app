'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { clearStoredAuthTokens, resolveStoredAccessToken } from '@/lib/auth/session';
import { Loader2 } from 'lucide-react';
import { resolveEndpoint } from '@/shared/api/config';
import { logError } from '@/shared/lib/logging';

export const KakaoLogoutHandler = () => {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const performLogout = async () => {
      const token = resolveStoredAccessToken();

      try {
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        await fetch(resolveEndpoint('/auth/logout'), {
          method: 'POST',
          headers,
        });
      } catch (error) {
        logError('백엔드 로그아웃에 실패했습니다.', error);
      } finally {
        clearStoredAuthTokens();
        timer = setTimeout(() => {
          router.replace('/');
        }, 1200);
      }
    };

    void performLogout();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-neutral-50 p-10">
        <Loader2 className="animate-pulse" />
      </div>
    </div>
  );
};
