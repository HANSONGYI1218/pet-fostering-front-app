import FosterInfoCard from '@/components/record/foster-info-tile';
import RecordContainer from '@/components/record/record-container';
import { fosterRecordDummyData } from '@/lib/dummydata';
import { AnimalType } from '@/types/animal/animal';
import { FosterRecord } from '@/types/foster-record/foster-record';
import { FosterMatchInfo } from '@/types/foster-record/foster-record-api';
import { toDate } from '@/lib/utils';

// 해당 월 이전 달 말과 이후 달 초의 기록도 포함해서 가져오기 (즉, 6주 분량)
// 월이 바뀔 때마다 해당 기록 데이터 api 호출
export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const target = fosterRecordDummyData.find((item) => item.id === id);

  if (!target) throw new Error('해당 ID에 대한 데이터 없음');

  const foster_info: FosterMatchInfo = {
    id: target.id,
    state: target.state,
    organization: target.organization,
    animal: target.animal,
    created_at: toDate(target.created_at),
  };

  const sortedRecords: FosterRecord[] = [...target.foster_records].sort(
    (a, b) =>
      toDate(a.created_at).getTime() - toDate(b.created_at).getTime(),
  );

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] gap-6 pt-20 pb-40">
        <FosterInfoCard
          fosterInfo={foster_info}
          recordCnt={sortedRecords?.length}
        />
        <RecordContainer
          records={sortedRecords}
          isDog={foster_info?.animal?.type === AnimalType.DOG ? true : false}
        />
      </div>
    </main>
  );
}
