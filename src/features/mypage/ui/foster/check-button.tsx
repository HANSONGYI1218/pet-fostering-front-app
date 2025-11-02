import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/lib/utils';
import {
  ANIMAL_TYPE_LABEL_KO,
  ANIMAL_AGE_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  FOSTER_ENVIRONMENT_LABEL_KO,
  ANIMAL_PERIOD_LABEL_KO,
  ANIMAL_SPECIAL_NOTE_LABEL_KO,
} from '@/shared/constants/enum';

const LABEL_MAP = {
  type: ANIMAL_TYPE_LABEL_KO,
  size: ANIMAL_SIZE_LABEL_KO,
  age: ANIMAL_AGE_LABEL_KO,
  environment: FOSTER_ENVIRONMENT_LABEL_KO,
  period: ANIMAL_PERIOD_LABEL_KO,
  note: ANIMAL_SPECIAL_NOTE_LABEL_KO,
} as const;

type LabelMapKey = keyof typeof LABEL_MAP;

interface CheckButtonProps {
  isOnly?: boolean;
  isExperience?: boolean;
  type: LabelMapKey;
  value: string[] | string;
  onChange: (value: string[] | string) => void;
}

export function CheckButton({
  isOnly,
  isExperience,
  type,
  value,
  onChange,
}: CheckButtonProps) {
  const labelObject = LABEL_MAP[type];

  // 내부에서는 항상 배열로 다룸
  const valueArray = isOnly ? [value as string] : (value as string[]);

  const handleToggle = (optionValue: string) => {
    if (isOnly) {
      // 단일 선택: 클릭한 값만 전달
      onChange(optionValue);
    } else {
      // 다중 선택: 배열 처리
      if (valueArray.includes(optionValue)) {
        onChange(valueArray.filter((v) => v !== optionValue));
      } else {
        onChange([...valueArray, optionValue]);
      }
    }
  };

  return (
    <div
      className={cn(
        'w-full',
        type === 'environment'
          ? 'flex flex-wrap gap-x-12 gap-y-2'
          : 'grid grid-cols-4 gap-6',
      )}
    >
      {Object.entries(labelObject).map(([optionValue, label]) => (
        <label
          key={optionValue}
          htmlFor={`${type}-${optionValue}`}
          className="flex cursor-pointer items-center gap-3"
        >
          <Checkbox
            id={`${type}-${optionValue}`}
            checked={valueArray.includes(optionValue)}
            onCheckedChange={() => {
              if (isExperience) {
                onChange(optionValue);
                return;
              }

              handleToggle(optionValue);
            }}
            isCircleicon
            className="rounded-full data-[state=checked]:bg-transparent"
          />
          <Label
            htmlFor={`${type}-${optionValue}`}
            className="cursor-pointer text-sm font-normal"
          >
            {label}
          </Label>
        </label>
      ))}
    </div>
  );
}
