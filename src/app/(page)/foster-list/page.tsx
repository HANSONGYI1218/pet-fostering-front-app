import FosterContainer from '@/components/foster-list/foster-container';
import { dummyFosterAnimals } from '@/lib/dummydata';

export default async function FosterListPage() {
  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 pt-20 pb-40">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">임시보호를 기다리는 동물들</h1>
          <span className="text-neutral-700">
            사랑과 보살핌이 필요한 아이들을 만나보세요!
          </span>
        </div>
        <FosterContainer animals={dummyFosterAnimals} />
      </div>
    </main>
  );
}
