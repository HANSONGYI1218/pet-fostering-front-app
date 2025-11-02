import type { FosterMatchInfo } from '@/entities/foster-record/foster-record-api';
import { Card } from '@/shared/ui/card';
import { ANIMAL_GENDER_LABEL_KO } from '@/shared/constants/enum';
import { formatAnimalAge, fosterDuration } from '@/shared/lib/utils';
import Image from 'next/image';
import { AniamlCreateDialog } from './animal-create-dialog';

export default function FosterInfoCard({
  fosterInfo,
  recordCnt,
}: {
  fosterInfo: FosterMatchInfo;
  recordCnt: number;
}) {
  const fosterDays =
    fosterInfo?.animal?.current_foster_start_date != null
      ? fosterDuration(fosterInfo.animal.current_foster_start_date)
      : null;

  return (
    <div className="flex w-full flex-col gap-6 md:w-md">
      <Card className="w-full cursor-default border-none">
        <h1 className="text-xl font-bold">{fosterInfo?.animal?.name}</h1>
        <div className="relative h-64 w-full">
          <Image
            src={fosterInfo?.animal?.images[0] ?? '/images/placeholder.png'}
            alt={fosterInfo?.animal?.name ?? 'animal-img'}
            fill
            className="rounded-lg border object-cover"
            sizes="(min-width: 1024px) 20vw, 100vw"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">종</span>
            <span className="font-medium">{fosterInfo?.animal?.breed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">나이</span>
            <span className="font-medium">
              {fosterInfo?.animal?.birth_date
                ? formatAnimalAge(fosterInfo?.animal?.birth_date)
                : ''}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">성별</span>
            <span className="font-medium">
              {ANIMAL_GENDER_LABEL_KO[fosterInfo?.animal?.gender]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">임보 기간</span>
            <span className="font-medium">
              {fosterDays !== null ? `${fosterDays}일` : '-'}
            </span>
          </div>
        </div>
        <hr className="w-full" />
        <div className="flex flex-col gap-2 pb-4">
          <span className="text-sm text-neutral-700">특이사항</span>
          <span className="font-medium">{fosterInfo?.animal?.remark}</span>
        </div>
        <AniamlCreateDialog animal={fosterInfo?.animal ?? undefined} />
      </Card>
      <Card className="w-full cursor-default items-center justify-center gap-2 border-none">
        <span className="font-medium">내가 쓴 돌봄기록</span>
        <hr className="w-full" />
        <span className="py-2 text-2xl font-semibold">{recordCnt}개</span>
      </Card>
    </div>
  );
}
