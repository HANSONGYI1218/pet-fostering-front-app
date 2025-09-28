'use client';

import { Search } from 'lucide-react';
import { Button } from '../ui/button';

export default function AddressPopUp({ form }: { form: any }) {
  const openAddressPopup = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const addr =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

        form.setValue('zipCode', data.zonecode);
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
