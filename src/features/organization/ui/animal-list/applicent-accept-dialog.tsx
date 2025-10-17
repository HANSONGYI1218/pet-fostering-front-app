import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

export function ApplyAcceptDialog({
  animal_name,
  applicant_name,
}: {
  animal_name: string;
  applicant_name: string;
}) {
  return (
    <Dialog>
      <form className="w-full">
        <DialogTrigger asChild>
          <Button variant={'destructive'} className="px-6">
            수락하기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle className="flex items-center gap-2 text-center text-xl">
              {applicant_name}님을 <br />
              {animal_name}의 임시보호자로 수락할까요?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <Image
              src="/images/apply-accept.png"
              height={160}
              width={160}
              alt="apply-accept"
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
