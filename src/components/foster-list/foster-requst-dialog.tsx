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

export default function FosterRequestDialog({ name }: { name: string }) {
  return (
    <Dialog>
      <form className="flex-1">
        <DialogTrigger asChild>
          <Button
            className="h-12 w-full text-lg font-semibold"
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
            <DialogDescription className="text-center text-sm text-[#F26F6F]">
              이력서 작성하셨나요? 이력서를 작성하면 매칭성공률이 높아져요
              <br />
              <Link href={'#'}>
                <span className="underline decoration-[#F26F6F] underline-offset-4">
                  이력서 작성하러 가기 →
                </span>
              </Link>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/images/fostser-request.png"
              width={160}
              height={160}
              alt="foster-request"
              className="py-6"
            />
            <span className="text-center">
              임시보호 요청을 하기 전,
              <br />
              신중히 고민해 주신 후 요청해 주세요.
            </span>
          </div>
          <DialogFooter className="mt-6 w-full px-4">
            <DialogClose asChild>
              <Button variant="outline_black" className="flex-1">
                취소
              </Button>
            </DialogClose>
            <Button variant="destructive" className="flex-1">
              요청하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
