import AnimalContainer from '@/components/record/animal-container';
import { fetchRecordAnimals } from '@/lib/api/record';

export default async function RecordPage() {
  const animals = await fetchRecordAnimals();

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 pt-20 pb-40">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">임시보호 돌봄 기록</h1>
          <span className="text-neutral-700">
            임보 중인 동물들의 기록을 관리하고 공유하세요
          </span>
        </div>
        <AnimalContainer animals={animals} />
      </div>
    </main>
  );
}
