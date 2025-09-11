import { Badge } from '@/components/ui/badge';
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
import { FosterApplicent } from '@/types/foster-apply/foster-apply-api';
import Image from 'next/image';

export function FosterApplyListDialog({
  animal_name,
  applicants,
  apply_number,
}: {
  animal_name: string;
  applicants: FosterApplicent[];
  apply_number: number;
}) {
  return (
    <Dialog>
      <form className="w-full">
        <DialogTrigger asChild>
          <Button
            variant="outline_green"
            className="h-10 w-full font-semibold text-[#00592d]"
          >
            임보 신청자 {apply_number > 0 && `(${apply_number})`}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex gap-2">
              임시보호 신청자 목록
              <Badge variant={'outline'}>{animal_name}</Badge>
            </DialogTitle>
            <DialogDescription className="self-end text-base">
              {apply_number}건
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full items-center gap-2">
            <Image
              src="/icons/profile.svg"
              width={24}
              height={24}
              alt="/profile"
            />
            <div className="">
              <span className=""></span>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
