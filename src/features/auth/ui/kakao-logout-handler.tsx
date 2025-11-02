'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { clearStoredAuthTokens } from '@/lib/auth/session';
import { Loader2 } from 'lucide-react';
import { resolveEndpoint } from '@/shared/api/config';
import { apiFetch } from '@/shared/api/http';
import { logError } from '@/shared/lib/logging';
import { readAccessToken } from '@/shared/lib/auth/access-token';

export const KakaoLogoutHandler = () => {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const performLogout = async () => {
      const token = readAccessToken();

      try {
        await apiFetch(resolveEndpoint('/auth/logout'), {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          auth: token ? 'optional' : 'none',
          token,
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
