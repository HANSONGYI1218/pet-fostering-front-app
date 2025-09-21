'use client';

import CheckBox from '@/components/common/check-box';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { RotateCcwIcon } from 'lucide-react';

type ConditionOption = {
  label: string;
  value: string;
};

type ConditionType = {
  title: string;
  options: ConditionOption[];
  selected: string;
  onChange: (value: string) => void;
  resetValue: string;
};

/**
 * @file [common] common 파일 안에 Condition 안의 요소 Item 컴포넌트
 * @description 훈련소, 동물 등 조건을 필터링하는 Condition 안의 작은 조각 컴포넌트입니다.
 * @author 'HANSONGYI'
 */

export default function ConditionItem({
  conditionTypes,
}: {
  conditionTypes: ConditionType[];
}) {
  const handleReset = () => {
    conditionTypes.forEach((conditionType) => {
      conditionType.onChange(conditionType.resetValue);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-normal hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 font-medium whitespace-nowrap shadow-xs has-[>svg]:px-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_2365_2441"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_2365_2441)">
              <path
                d="M11 21V15H13V17H21V19H13V21H11ZM3 19V17H9V19H3ZM7 15V13H3V11H7V9H9V15H7ZM11 13V11H21V13H11ZM15 9V3H17V5H21V7H17V9H15ZM3 7V5H13V7H3Z"
                fill="#595959"
              />
            </g>
          </svg>
          옵션
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-full max-w-md flex-col gap-6 p-8"
        align="start"
      >
        <h1 className="text-lg font-semibold">필터</h1>
        <div className="flex flex-col gap-6">
          {conditionTypes.map((conditionType) => (
            <div key={conditionType.title} className="flex flex-col gap-1">
              <span className="font-semibold">{conditionType.title}</span>
              <div className="flex flex-wrap items-center gap-2">
                {conditionType.options.map(({ label, value }) => (
                  <CheckBox
                    key={value}
                    id={`${conditionType.title}-${value}`}
                    label={label}
                    value={value}
                    selectedValue={conditionType.selected}
                    onChangeValue={conditionType.onChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button
          variant={'default'}
          className="group mt-8 flex w-fit items-center gap-1 self-end"
          onClick={handleReset}
        >
          <RotateCcwIcon stroke="#ffffff" className="h-4 w-4" strokeWidth={3} />
          초기화
        </Button>
      </PopoverContent>
    </Popover>
  );
}
