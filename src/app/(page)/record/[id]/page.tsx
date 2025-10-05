import FosterInfoCard from '@/components/record/foster-info-tile';
import RecordContainer from '@/components/record/record-container';
import { AnimalType } from '@/types/animal/animal';
import { FosterRecord } from '@/types/foster-record/foster-record';
import { FosterMatchInfo } from '@/types/foster-record/foster-record-api';
import { fetchRecordDetail } from '@/lib/api/record';
import { notFound } from 'next/navigation';

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { info, records } = await fetchRecordDetail(id).catch(
    (error: unknown) => {
      if (error instanceof Error && /404/.test(error.message)) {
        notFound();
      }
      throw error;
    },
  );

  const sortedRecords: FosterRecord[] = [...records].sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime(),
  );

  const fosterInfo: FosterMatchInfo = info;

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] gap-6 pt-20 pb-40">
        <FosterInfoCard
          fosterInfo={fosterInfo}
          recordCnt={sortedRecords.length}
        />
        <RecordContainer
          records={sortedRecords}
          isDog={fosterInfo.animal.type === AnimalType.DOG}
        />
      </div>
    </main>
  );
}
