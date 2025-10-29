'use client';

import { redirectToKakaoLogin } from '@/lib/auth/kakao';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

export const GoogleLoginButton = () => (
  <Button
    type="button"
    variant="login"
    className="h-12 w-full gap-4 rounded-lg border bg-[#ffffff] px-6 text-base font-semibold text-black shadow-sm transition hover:bg-neutral-50"
    onClick={() => redirectToKakaoLogin()}
    aria-label="구글로 시작하기"
  >
    <Image src="/images/login/google.png" width={24} height={24} alt="google" />
    <span className="w-32 text-start">구글로 시작하기</span>
  </Button>
);
