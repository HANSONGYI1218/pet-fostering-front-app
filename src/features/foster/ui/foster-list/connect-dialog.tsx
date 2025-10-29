import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Phone } from 'lucide-react';
import Image from 'next/image';

export default function ConnectDialog({
  name,
  phone_number,
}: {
  name: string;
  phone_number: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-12 flex-1 font-semibold md:text-lg"
          variant="outline_black"
        >
          <Phone stroke="#000000" fill="#000000" />
          기관 연락하기
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center sm:max-w-96">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-black">{name}로 연락주세요</DialogTitle>
          <DialogDescription className="text-lg leading-none font-semibold text-black">
            {phone_number}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/images/pink-dog.png"
            width={160}
            height={160}
            alt="pink-dog"
            className="py-6"
          />
          <span className="text-center">
            문의하실 때 보호동물의 이름을 알려주면
            <br />
            보다 빠르고 정확한 상담이 가능합니다.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
