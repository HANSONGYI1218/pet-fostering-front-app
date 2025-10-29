'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { clearStoredAuthTokens } from '@/lib/auth/session';
import { Loader2 } from 'lucide-react';

export const KakaoLogoutHandler = () => {
  const router = useRouter();

  useEffect(() => {
    clearStoredAuthTokens();

    const timer = setTimeout(() => {
      router.replace('/');
    }, 1200);

    return () => {
      clearTimeout(timer);
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
