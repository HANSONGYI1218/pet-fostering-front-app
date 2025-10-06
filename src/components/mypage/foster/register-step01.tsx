'use client';

import { UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { FosterformSchema } from './foster-register-form';
import { Card } from '@/components/ui/card';
import { Controller } from 'react-hook-form';
import { CheckButton } from '@/components/mypage/foster/check-button';
import { CircleCheck } from 'lucide-react';

export type FosterformValues = z.infer<typeof FosterformSchema>;

export default function RegisterStep01({
  form,
  isValidStep01,
}: {
  form: UseFormReturn<FosterformValues>;
  isValidStep01: boolean;
}) {
  return (
    <Card className="cursor-default gap-12 px-12 py-10">
      <div className="relative flex flex-col gap-2">
        <h1 className="text-xl font-semibold">
          임시보호 동물에 대한 조건을 선택해 주세요.
        </h1>
        <span className="text-sm text-red-500">
          * 모든 항목은 복수 선택으로 가능한 조건을 최대한 선택해주세요.
        </span>
        <CircleCheck
          className={`absolute top-0 right-0 h-7 w-7 stroke-white ${isValidStep01 ? 'fill-[#00592d]' : 'fill-neutral-300'}`}
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-medium">
          <span className="mr-1 text-[#00592d]">Q.</span>임시보호 하실{' '}
          <span className="text-[#00592d]">동물</span>을 선택해 주세요.
        </span>
        <div className="pl-5">
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <CheckButton
                type="type"
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-medium">
          <span className="text-[#00592d]">Q. 선호하는 크기</span>를 선택해
          주세요.
        </span>
        <div className="pl-5">
          <Controller
            control={form.control}
            name="size"
            render={({ field }) => (
              <CheckButton
                type="size"
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-medium">
          <span className="text-[#00592d]">Q. 선호하는 나이</span>를 선택해
          주세요.
        </span>
        <div className="pl-5">
          <Controller
            control={form.control}
            name="animal_age"
            render={({ field }) => (
              <CheckButton
                type="age"
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
