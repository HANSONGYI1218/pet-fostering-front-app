import Link from 'next/link';

import BackButton from '@/components/common/back-button';
import AnimalDetailContainer from '@/components/organization/animal-list/animal-detail-container';
import FetchErrorBox from '@/components/common/fetch-error-box';
import { fetchOrganizationAnimalDetail } from '@/lib/api/organization';
import { logError } from '@/lib/logging';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export default async function AnimalListDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const animal = await fetchOrganizationAnimalDetail(id);

    return (
      <main className="bg-neutral-50">
        <div className="container_12 mx-auto flex min-h-screen w-full flex-col gap-6 pt-20 pb-40">
          <BackButton link="/organization/animal-list" />
          <AnimalDetailContainer animal={animal} />
        </div>
      </main>
    );
  } catch (error) {
    logError('조직 동물 상세를 불러오는 데 실패했습니다.', error);
    const status = error instanceof Error ? (error as Error & { status?: number }).status : undefined;

    if (status === 404) {
      notFound();
    }

    return (
      <main className="bg-neutral-50">
        <div className="container_12 mx-auto flex min-h-screen w-full flex-col gap-6 pt-20 pb-40">
          <BackButton link="/organization/animal-list" />
          <FetchErrorBox errorMessage="동물 상세 정보를 불러오지 못했습니다." />
          <div className="flex justify-center">
            <Button variant="default" asChild>
              <Link href="/organization/animal-list">목록으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
}
