import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import Image from 'next/image';

export function ApplyAcceptDialog({
  animalName,
  applicantName,
}: {
  animalName: string;
  applicantName: string;
}) {
  return (
    <Dialog>
      <form className="w-full">
        <DialogTrigger asChild>
          <Button variant="destructive" className="px-6">
            수락하기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle className="flex items-center gap-2 text-center text-xl">
              {applicantName}님을 <br />
              {animalName}의 임시보호자로 수락할까요?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <Image
              src="/images/white-poodle-dog6.png"
              height={160}
              width={160}
              alt="white-poodle-dog6"
            />
          </div>
          <DialogFooter className="w-full sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                className="h-12 flex-1"
                variant="outline_black"
              >
                취소
              </Button>
            </DialogClose>
            <Button type="submit" className="h-12 flex-1" variant="destructive">
              수락
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
