/* eslint-disable import/no-restricted-paths */
'use client';

import { VerifyType } from '@/features/mypage/ui/profile-tab';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PhoneNumberVerifyPopup({
  phoneNumber,
  setPhoneNumberVerify,
}: {
  phoneNumber: string;
  setPhoneNumberVerify: (v: VerifyType) => void;
}) {
  const [isSending, setIsSending] = useState(false);

  const isValidPhoneNumber = () => {
    // 010 또는 011로 시작, 숫자 3자리-숫자 4자리-숫자 4자리
    const regex = /^(010|011)-\d{4}-\d{4}$/;

    const result = regex.test(phoneNumber);
    if (!result) {
      setPhoneNumberVerify(VerifyType.INVALID);
    }
    return result;
  };

  const phoneNumberSend = async () => {
    setIsSending(true);

    setPhoneNumberVerify(VerifyType.ACCESS);
  };

  return (
    <Button
      type="button"
      variant={'outline_black'}
      className="flex h-9 w-24 gap-2"
      disabled={!phoneNumber?.length}
      onClick={() => {
        if (isValidPhoneNumber()) phoneNumberSend();
      }}
    >
      {isSending ? <Loader2 className="animate-spin" /> : '인증하기'}
    </Button>
  );
}
