import { FosterMatchInfo } from '@/types/foster-record/foster-record-api';
import { Card } from '../ui/card';
import { ANIMAL_GENDER_LABEL_KO } from '@/constants/enum';
import { formatAnimalAge, getDDay } from '@/lib/utils';

export default function FosterInfoCard({
  fosterInfo,
  recordCnt,
}: {
  fosterInfo: FosterMatchInfo;
  recordCnt: number;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="h-fit w-72 cursor-default border-none">
        <h1 className="text-xl font-bold">{fosterInfo?.animal?.name}</h1>
        <img
          src={fosterInfo?.animal?.images[0]}
          alt="animal_img"
          className="h-64 w-full rounded-lg border object-cover"
        />
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
              {fosterInfo?.created_at && getDDay(fosterInfo?.created_at)}일
            </span>
          </div>
        </div>
        <hr className="w-full" />
        <div className="flex flex-col gap-2 pb-4">
          <span className="text-sm text-neutral-700">특이사항</span>
          <span className="font-medium">{fosterInfo?.animal?.remark}</span>
        </div>
      </Card>
      <Card className="h-fit w-72 cursor-default items-center justify-center gap-2 border-none">
        <span className="font-medium">내가 쓴 돌봄기록</span>
        <hr className="w-full" />
        <span className="py-2 text-2xl font-semibold">{recordCnt}개</span>
      </Card>
    </div>
  );
}
