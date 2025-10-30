import type { Metadata } from 'next';
import { cache } from 'react';
import FosterInfoCard from '@/features/record/ui/record/foster-info-tile';
import RecordContainer from '@/features/record/ui/record/record-container';
import { AnimalType } from '@/entities/animal/animal';
import { FosterRecord } from '@/entities/foster-record/foster-record';
import { FosterMatchInfo } from '@/entities/foster-record/foster-record-api';
import { fetchRecordDetail } from '@/features/record/api/record';
import { notFound, redirect } from 'next/navigation';
import BackButton from '@/shared/widgets/navigation/back-button';
import type { AsyncParams } from '@/shared/types/next';
import { createAppMetadata } from '@/shared/config/seo';
import { resolveServerAccessToken } from '@/lib/auth/server-session';

const token = await resolveServerAccessToken();

if (!token) {
  redirect('/record');
}

const getRecordDetail = cache((id: string) => fetchRecordDetail(id, token));

export async function generateMetadata({
  params,
}: AsyncParams<{ id: string }>): Promise<Metadata> {
  const { id } = await params;

  try {
    const { info } = await getRecordDetail(id);
    const animalName = info.animal.name;
    const organizationName = info.organization.name || '보호소';
    const primaryImage = info.animal.images?.[0];

    return createAppMetadata({
      title: `${animalName} 돌봄 기록 | 퍼디즈`,
      description: `${organizationName}와 퍼디즈가 함께하는 ${animalName}의 임시보호 기록을 확인하세요.`,
      path: `/record/${id}`,
      image: primaryImage
        ? {
            url: primaryImage,
            alt: `${animalName} 돌봄 기록 이미지`,
          }
        : undefined,
    });
  } catch {
    return createAppMetadata({
      title: '임시보호 돌봄 기록 상세 | 퍼디즈',
      description: '퍼디즈의 임시보호 돌봄 기록을 확인하세요.',
      path: `/record/${id}`,
    });
  }
}

export default async function RecordDetailPage({
  params,
}: AsyncParams<{ id: string }>) {
  const { id } = await params;

  const { info, records } = await fetchRecordDetail(id, token!).catch(
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
