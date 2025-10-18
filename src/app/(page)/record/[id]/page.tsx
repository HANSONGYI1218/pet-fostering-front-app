import FosterInfoCard from '@/features/record/ui/record/foster-info-tile';
import RecordContainer from '@/features/record/ui/record/record-container';
import { AnimalType } from '@/types/animal/animal';
import { FosterRecord } from '@/types/foster-record/foster-record';
import { FosterMatchInfo } from '@/types/foster-record/foster-record-api';
import { fetchRecordDetail } from '@/features/record/api/record';
import { notFound } from 'next/navigation';
import BackButton from '@/shared/widgets/navigation/back-button';

export default async function RecordDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const { info, records } = await fetchRecordDetail(id).catch(
    (error: unknown) => {
      if (error instanceof Error && /404/.test(error.message)) {
        notFound();
      }
      throw error;
    },
  );

  const sortedRecords: FosterRecord[] = [...records].sort(
    (a, b) => b.created_at.getTime() - a.created_at.getTime(),
  );

  const fosterInfo: FosterMatchInfo = info;

  return (
    <main className="flex flex-col gap-6 bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16">
        <BackButton link="/record" />
        <div className="flex flex-col gap-6 md:flex-row">
          <FosterInfoCard
            fosterInfo={fosterInfo}
            recordCnt={sortedRecords.length}
          />
          <RecordContainer
            records={sortedRecords}
            isDog={fosterInfo.animal.type === AnimalType.DOG}
          />
        </div>
      </div>
    </main>
  );
}
