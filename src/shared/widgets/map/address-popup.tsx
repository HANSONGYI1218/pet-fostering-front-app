'use client';

import { Search } from 'lucide-react';
import Script from 'next/script';
import { Button } from '@/shared/ui/button';
import { logWarning } from '@/shared/lib/logging';

type DaumPostcodeData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: 'R' | 'J';
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => {
        open: () => void;
        close: () => void;
      };
    };
  }
}

type AddressSelection = {
  zipcode: string;
  address: string;
};

type AddressPopUpProps = {
  onSelect: (selection: AddressSelection) => void;
};

export default function AddressPopUp({ onSelect }: AddressPopUpProps) {
  const openAddressPopup = () => {
    const { daum } = window;

    if (!daum?.Postcode) {
      logWarning('Daum Postcode SDK가 아직 로드되지 않았습니다.');
      return;
    }

    new daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        const addr =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

        onSelect({ zipcode: data.zonecode, address: addr });
      },
    }).open();
  };

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <Button
        type="button"
        variant="outline_black"
        className="flex h-9 gap-2"
        onClick={() => openAddressPopup()}
      >
        <Search className="h-4 w-4" />
        주소 찾기
      </Button>
    </>
  );
}
