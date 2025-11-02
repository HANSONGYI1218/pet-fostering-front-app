import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import type { FosterApplicant } from '@/entities/foster-apply/foster-apply-api';
import Image from 'next/image';
import { ApplyAcceptDialog } from './applicent-accept-dialog';

export function FosterApplyListDialog({
  animalName,
  applicants,
  applyNumber,
}: {
  animalName: string;
  applicants: FosterApplicant[];
  applyNumber: number;
}) {
  return (
    <Dialog>
      <form className="w-full">
        <DialogTrigger asChild>
          <Button
            variant="outline_green"
            className="h-10 w-full font-semibold text-[#00592d]"
          >
            임보 신청자 {applyNumber > 0 && `(${applyNumber})`}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="">
            <DialogTitle className="flex items-center gap-2">
              임시보호 신청자 목록
              <Badge variant="outline">{animalName}</Badge>
            </DialogTitle>
            <DialogDescription className="self-end text-base">
              {applyNumber}건
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
                  <Button variant="outline_green" className="px-6">
                    이력보기
                  </Button>
                  <ApplyAcceptDialog
                    animalName={animalName}
                    applicantName={applicant?.name}
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
