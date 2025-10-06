'use client';

import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import type { DaumPostcodeData } from '@/app/layout';

type AddressSelection = {
  zipcode: string;
  address: string;
};

type AddressPopUpProps = {
  onSelect: (selection: AddressSelection) => void;
};

export default function AddressPopUp({ onSelect }: AddressPopUpProps) {
  const openAddressPopup = () => {
    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        const addr =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

        onSelect({ zipcode: data.zonecode, address: addr });
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
