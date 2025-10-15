'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { completeKakaoLogin } from '@/lib/auth/kakao';

type KakaoCallbackHandlerProps = {
  code: string | null;
};

type Status = 'loading' | 'success' | 'error';

const messages: Record<Status, string> = {
  loading: '카카오 로그인 처리 중이에요...',
  success: '로그인이 완료되었어요. 잠시 후 이동합니다.',
  error: '로그인에 실패했어요. 다시 시도해주세요.',
};

const reportGlobalError = (error: unknown) => {
  const reporter = (
    globalThis as {
      reportError?: (err: unknown) => void;
    }
  ).reportError;

  if (typeof reporter === 'function') {
    reporter(error);
  }
};

export const KakaoCallbackHandler = ({ code }: KakaoCallbackHandlerProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const loginAttemptRef = useRef<{
    code: string;
    promise: Promise<unknown>;
  } | null>(null);

  useEffect(() => {
    if (!code) {
      setStatus('error');

      reportGlobalError(new Error('카카오 인가 코드가 필요합니다.'));

      return;
    }

    const storage =
      typeof window !== 'undefined' ? window.localStorage : undefined;

    if (loginAttemptRef.current?.code !== code) {
      loginAttemptRef.current = {
        code,
        promise: completeKakaoLogin({
          code,
          storage,
        }),
      };
    }

    const loginPromise = loginAttemptRef.current?.promise;

    if (!loginPromise) {
      setStatus('error');
      return;
    }

    let cancelled = false;

    loginPromise
      .then(() => {
        if (cancelled) {
          return;
        }

        setStatus('success');
        router.replace('/main');
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setStatus('error');

        reportGlobalError(error);
      });

    return () => {
      cancelled = true;
    };
  }, [code, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-lg">
        <h1 className="text-xl font-semibold text-neutral-900">
          카카오 로그인
        </h1>
        <p className="text-neutral-600">{messages[status]}</p>
      </div>
    </div>
  );
};
