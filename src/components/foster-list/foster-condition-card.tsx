import type { Dispatch, SetStateAction } from 'react';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  FOSTER_STATE_LABEL_KO,
} from '@/constants/enum';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  FosterState,
} from '@/types/animal/animal';
import type { FosterFilterValue } from '@/domain/foster-list/filters';
import { FILTER_ALL_LABEL_KO, FILTER_ALL_VALUE } from '@/constants/filter';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { RotateCcwIcon, SlidersHorizontal } from 'lucide-react';

const OPTION_BUTTON_TEXT = '옵션';
const RESET_BUTTON_TEXT = '초기화';

/**
 * @file [training-center] training-center 파일 안에 Training-center_Condition Card 컴포넌트
 * @description 훈련소의 조건을 필터링하는 컴포넌트입니다.
 * @author 'HANSONGYI'
 */

export default function FosterConditionCard({
  animalType,
  animalSize,
  animalGender,
  animalStatus,
  setAnimalType,
  setAnimalSize,
  setAnimalGender,
  setAnimalStatus,
}: {
  animalType: FosterFilterValue<AnimalType>;
  animalSize: FosterFilterValue<AnimalSize>;
  animalGender: FosterFilterValue<AnimalGender>;
  animalStatus?: FosterFilterValue<FosterState>;
  setAnimalType: Dispatch<SetStateAction<FosterFilterValue<AnimalType>>>;
  setAnimalSize: Dispatch<SetStateAction<FosterFilterValue<AnimalSize>>>;
  setAnimalGender: Dispatch<SetStateAction<FosterFilterValue<AnimalGender>>>;
  setAnimalStatus?: Dispatch<SetStateAction<FosterFilterValue<FosterState>>>;
}) {
  const handleChangeAnimalType = (value: string) => {
    setAnimalType(value as FosterFilterValue<AnimalType>);
  };

  const handleChangeAnimalSize = (value: string) => {
    setAnimalSize(value as FosterFilterValue<AnimalSize>);
  };

  const handleChangeAnimalGender = (value: string) => {
    setAnimalGender(value as FosterFilterValue<AnimalGender>);
  };

  const handleChangeAnimalStatus = (value: string) => {
    setAnimalStatus?.(value as FosterFilterValue<FosterState>);
  };

  const conditionTypes = [
    {
      title: '종류',
      options: [
        {
          label: FILTER_ALL_LABEL_KO,
          value: FILTER_ALL_VALUE,
        },
        {
          label: ANIMAL_TYPE_LABEL_KO[AnimalType.DOG],
          value: AnimalType.DOG,
        },
        {
          label: ANIMAL_TYPE_LABEL_KO[AnimalType.CAT],
          value: AnimalType.CAT,
        },
      ],
      selected: animalType,
      onChange: handleChangeAnimalType,
      resetValue: FILTER_ALL_VALUE,
    },
    {
      title: '사이즈',
      options: [
        {
          label: FILTER_ALL_LABEL_KO,
          value: FILTER_ALL_VALUE,
        },
        {
          label: ANIMAL_SIZE_LABEL_KO[AnimalSize.SMALL],
          value: AnimalSize.SMALL,
        },
        {
          label: ANIMAL_SIZE_LABEL_KO[AnimalSize.MEDIUM],
          value: AnimalSize.MEDIUM,
        },
        {
          label: ANIMAL_SIZE_LABEL_KO[AnimalSize.LARGE],
          value: AnimalSize.LARGE,
        },
      ],
      selected: animalSize,
      onChange: handleChangeAnimalSize,
      resetValue: FILTER_ALL_VALUE,
    },
    {
      title: '성별',
      options: [
        {
          label: FILTER_ALL_LABEL_KO,
          value: FILTER_ALL_VALUE,
        },
        {
          label: ANIMAL_GENDER_LABEL_KO[AnimalGender.MALE],
          value: AnimalGender.MALE,
        },
        {
          label: ANIMAL_GENDER_LABEL_KO[AnimalGender.FEMALE],
          value: AnimalGender.FEMALE,
        },
      ],
      selected: animalGender,
      onChange: handleChangeAnimalGender,
      resetValue: FILTER_ALL_VALUE,
    },
    // animalStatus가 존재할 때만 포함
    ...(animalStatus && setAnimalStatus
      ? [
          {
            title: '상태',
            options: [
              { label: FILTER_ALL_LABEL_KO, value: FILTER_ALL_VALUE },
              {
                label: FOSTER_STATE_LABEL_KO[FosterState.IN_PROGRESS],
                value: FosterState.IN_PROGRESS,
              },
              {
                label: FOSTER_STATE_LABEL_KO[FosterState.FOSTERED],
                value: FosterState.FOSTERED,
              },
              {
                label: FOSTER_STATE_LABEL_KO[FosterState.ADOPTED],
                value: FosterState.ADOPTED,
              },
            ],
            selected: animalStatus,
            onChange: handleChangeAnimalStatus,
            resetValue: FILTER_ALL_VALUE,
          },
        ]
      : []),
  ];

  const handleResetFilters = () => {
    conditionTypes.forEach((conditionType) => {
      conditionType.onChange(conditionType.resetValue);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">
          <SlidersHorizontal className="size-4" />
          {OPTION_BUTTON_TEXT}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-full max-w-md flex-col gap-6 p-6">
        <h2 className="text-lg font-semibold">필터</h2>
        <div className="flex flex-col gap-4">
          {conditionTypes.map((conditionType) => {
            const controlId = `foster-${conditionType.title}`;
            const resetLabel =
              conditionType.options.find(
                (option) => option.value === conditionType.resetValue,
              )?.label ?? conditionType.options[0]?.label ?? '';

            return (
              <div key={conditionType.title} className="flex flex-col gap-2">
                <Label
                  htmlFor={controlId}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {conditionType.title}
                </Label>
                <Select
                  value={conditionType.selected}
                  onValueChange={conditionType.onChange}
                >
                  <SelectTrigger
                    id={controlId}
                    aria-label={conditionType.title}
                    className="w-full justify-between"
                  >
                    <SelectValue placeholder={resetLabel} />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionType.options.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-end gap-2"
          onClick={handleResetFilters}
        >
          <RotateCcwIcon className="size-4" />
          {RESET_BUTTON_TEXT}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
