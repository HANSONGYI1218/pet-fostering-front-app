'use client';

import AnimalContainer from '@/components/organization/animal-list/animal-container';
import FosterApplyProviders from '@/providers/foster-apply-provider';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AnimalListPage() {
  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 pt-20 pb-40">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">보호 동물 관리</h1>
          <span className="text-neutral-700">
            사랑과 보살핌이 필요한 아이들을 관리해 보세요!
          </span>
        </div>
        <FosterApplyProviders queryClient={queryClient}>
          <AnimalContainer />
        </FosterApplyProviders>
      </div>
    </main>
  );
}
