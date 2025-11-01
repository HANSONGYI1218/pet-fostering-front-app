/* eslint-disable import/no-restricted-paths */
'use client';

import { VerifyType } from '@/features/mypage/ui/profile-tab';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function EmailVerifyButton({
  email,
  setEmailVerify,
}: {
  email: string;
  setEmailVerify: (v: VerifyType) => void;
}) {
  const [isSending, setIsSending] = useState(false);

  const isValidEmail = (): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const result = emailRegex.test(email);
    if (!result) {
      setEmailVerify(VerifyType.INVALID);
    }

    return result;
  };

  const emailSend = async () => {
    setIsSending(true);
    //서버 이메일 인증 로직 -> 서버에서 인증 코드 생성 후 이메일 전송 -> 사용자가 이메일 인증버튼 누름 -> 서버로 콜백
    setEmailVerify(VerifyType.ACCESS);
  };

  return (
    <Button
      type="button"
      variant={'outline_black'}
      className="flex h-9 w-24 gap-2"
      disabled={!email}
      onClick={() => {
        if (isValidEmail()) {
          emailSend();
        }
      }}
    >
      {isSending ? <Loader2 className="animate-spin" /> : '인증하기'}
    </Button>
  );
}
