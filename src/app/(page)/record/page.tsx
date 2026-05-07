import { fetchRecordAnimals } from '@/features/record/api/record';
import AnimalContainer from '@/features/record/ui/record/animal-container';
import { resolveServerAccessToken } from '@/lib/auth/server-session';
import { createAppMetadata } from '@/shared/config/seo';

export const metadata = createAppMetadata({
  title: '임시보호 돌봄 기록 | 퍼디즈',
  description:
    '임시보호 중인 동물들의 돌봄 기록을 모아보고 따뜻한 케어 여정을 관리하세요.',
  path: '/record',
});

export default async function RecordPage() {
  const token = await resolveServerAccessToken();

  const animals = token ? await fetchRecordAnimals(token).catch(() => []) : [];

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold md:text-4xl">임시보호 돌봄 기록</h1>
          <span className="text-base text-neutral-700 md:text-lg">
            임보 중인 동물들의 기록을 관리하고 공유하세요
          </span>
        </div>
        <AnimalContainer animals={animals} />
      </div>
    </main>
  );
}
