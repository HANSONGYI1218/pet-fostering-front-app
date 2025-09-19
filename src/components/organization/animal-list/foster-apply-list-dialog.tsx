import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { ApplyAcceptDialog } from './applicent-accept-dialog';

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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="">
            <DialogTitle className="flex items-center gap-2">
              임시보호 신청자 목록
              <Badge variant={'outline'}>{animal_name}</Badge>
            </DialogTitle>
            <DialogDescription className="self-end text-base">
              {apply_number}건
            </DialogDescription>
          </DialogHeader>
          {applicants?.map((applicant, index) => {
            return (
              <Card key={index} className="cursor-default gap-2 p-3">
                <div className="flex w-full items-start gap-2">
                  <Image
                    src="/icons/profile.svg"
                    width={44}
                    height={44}
                    alt="/profile"
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="text-lg font-semibold">
                      {applicant?.name}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {applicant?.phone_number + ' · ' + applicant?.email}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {applicant?.address + ' ' + applicant?.address_detail}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-3">{applicant?.introduction}</span>
                <div className="flex w-full gap-3">
                  <Button variant={'outline_green'} className="px-6">
                    이력보기
                  </Button>
                  <ApplyAcceptDialog
                    animal_name={animal_name}
                    applicant_name={applicant?.name}
                  />
                </div>
              </Card>
            );
          })}
        </DialogContent>
      </form>
    </Dialog>
  );
}
