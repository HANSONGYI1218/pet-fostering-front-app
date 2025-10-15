import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FosterRequestDialog({
  name,
  isFosterCondition,
}: {
  name: string;
  isFosterCondition: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-12 flex-1 font-semibold md:text-lg"
          variant="destructive"
        >
          <PawPrint stroke="#ffffff" fill="#ffffff" />
          임보 요청하기
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="text-black">
            {name}의 임시보호를 요청할까요?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/images/fostser-request.png"
            width={160}
            height={160}
            alt="foster-request"
            className="py-6 max-md:h-1/2 max-md:w-1/2"
          />
          {isFosterCondition ? (
            <span className="text-center">
              임시보호 요청을 하기 전,
              <br />
              신중히 고민해 주신 후 요청해 주세요.
            </span>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-center text-[#F26F6F]">
                임시보호 자격이 없어요! <br className="md:hidden" />
                내 정보에서 자격을 등록해보세요.
                <br />
              </span>
              <Link href={'#'}>
                <span className="font-semibold text-red-500 underline decoration-[#F26F6F] underline-offset-4">
                  자격 등록하러 가기 →
                </span>
              </Link>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6 w-full px-4">
          <DialogClose asChild>
            <Button variant="outline_black" className="flex-1">
              취소
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={!isFosterCondition}
            className="flex-1"
          >
            요청하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
