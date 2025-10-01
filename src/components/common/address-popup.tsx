'use client';

import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { DaumPostcodeData } from '@/app/layout';
import { UseFormReturn } from 'react-hook-form';
import { ProfileformSchema } from '../mypage/profile-tab';
import z from 'zod';

export type ProfileFormValues = z.infer<typeof ProfileformSchema>;

export default function AddressPopUp({
  form,
}: {
  form: UseFormReturn<ProfileFormValues>;
}) {
  const openAddressPopup = () => {
    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        const addr =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

        form.setValue('zipcode', data.zonecode);
        form.setValue('address', addr);
      },
    }).open();
  };

  return (
    <Button
      type="button"
      variant={'outline_black'}
      className="flex h-10 gap-2"
      onClick={() => openAddressPopup()}
    >
      <Search className="h-4 w-4" />
      주소 찾기
    </Button>
  );
}
