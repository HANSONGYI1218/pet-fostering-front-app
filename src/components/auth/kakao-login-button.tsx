'use client';

import { redirectToKakaoLogin } from '@/lib/auth/kakao';
import { Button } from '@/components/ui/button';

export const KakaoLoginButton = () => (
  <Button
    type="button"
    variant="login"
    className="h-12 rounded-full bg-[#FEE500] px-6 text-base font-semibold text-black shadow-sm transition hover:bg-[#fdd835]"
    onClick={() => redirectToKakaoLogin()}
    aria-label="카카오로 시작하기"
  >
    카카오로 시작하기
  </Button>
);
