'use client';

import { FosterConditionItem } from '@/types/foster-condition/foster-condition-api';
import { Card } from '../ui/card';
import FosterRegisterForm from './foster/foster-register-form';

export default function FosterTab() {
  const fosterCondition: FosterConditionItem | undefined = undefined;

  return (
    <div className="flex w-full flex-col gap-10">
      <Card className="gap-2">
        <h1 className="text-xl font-semibold">
          임시보호자{' '}
          <span
            className={`${fosterCondition ? 'text-[#00592d]' : 'text-[#FF5F57]'}`}
          >
            {fosterCondition ? '등록' : '미등록'}
          </span>{' '}
          상태입니다.
        </h1>
        <span className="text-neutral-700">
          {fosterCondition
            ? '임시보호 경력을 등록하고 임시보호 매칭률을 높여 보세요.'
            : '임시보호자로 등록해야만 보호동물 신청이 가능합니다.'}
        </span>
      </Card>
      <FosterRegisterForm fosterCondition={fosterCondition} />
    </div>
  );
}
