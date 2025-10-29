'use client';

import { redirectToKakaoLogin } from '@/lib/auth/kakao';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

export const KakaoLoginButton = () => (
  <Button
    type="button"
    variant="login"
    className="h-12 w-full gap-4 rounded-lg bg-[#FEE500] px-6 text-base font-semibold text-black shadow-sm transition hover:bg-[#fdd835]"
    onClick={() => redirectToKakaoLogin()}
    aria-label="카카오로 시작하기"
  >
    <Image src="/images/login/kakao.png" width={24} height={24} alt="kakao" />
    <span className="w-32 text-start">카카오로 시작하기</span>
  </Button>
);
