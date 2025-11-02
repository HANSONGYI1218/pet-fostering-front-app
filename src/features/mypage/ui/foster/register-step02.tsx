'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { CircleCheck } from 'lucide-react';

import { CheckButton } from '@/features/mypage/ui/foster/check-button';
import { cn } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/card';
import type { FosterFormValues } from './foster-register-form';

export default function RegisterStep02({
  form,
  isValidStep02,
}: {
  form: UseFormReturn<FosterFormValues>;
  isValidStep02: boolean;
}) {
  return (
    <Card className="cursor-default gap-12 px-12 py-10">
      <div className="relative flex flex-col gap-2">
        <h1 className="text-xl font-semibold">
          임시보호자에 대한 정보를 선택해 주세요.
        </h1>
        <span className="text-sm text-red-500">
          * 모든 항목은 복수 선택으로 가능한 조건을 최대한 선택해주세요.
        </span>
        <CircleCheck
          className={cn(
            'absolute top-0 right-0 h-7 w-7 stroke-white',
            isValidStep02 ? 'fill-[#00592d]' : 'fill-neutral-300',
          )}
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-medium">
          <span className="mr-1 text-[#00592d]">Q.</span>임시보호
          <span className="ml-1 text-[#00592d]">환경</span>을 선택해 주세요.
        </span>
        <div className="pl-5">
          <Controller
            control={form.control}
            name="foster_environments"
            render={({ field }) => (
              <CheckButton
                type="environment"
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-medium">
          <span className="mr-1 text-[#00592d]">Q.</span>
          <span>임시보호</span>
          <span className="text-[#00592d]">가능 기간</span>
          <span>을 선택해 주세요.</span>
          <span className="px-2 text-sm text-neutral-600">
            &#40;단일 선택&#41;
          </span>
        </span>
        <div className="pl-5">
          <Controller
            control={form.control}
            name="foster_period"
            render={({ field }) => (
              <CheckButton
                isOnly
                type="period"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-medium">
          <span className="mr-1 text-[#00592d]">Q.</span>임시보호
          <span className="ml-1 text-[#00592d]">가능한 보호동물</span>의 상태를
          선택해 주세요.
        </span>
        <div className="pl-5">
          <Controller
            control={form.control}
            name="special_notes_animals"
            render={({ field }) => (
              <CheckButton
                type="note"
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Card>
  );
}
