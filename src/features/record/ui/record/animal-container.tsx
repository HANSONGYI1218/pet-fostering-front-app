'use client';

import { Button } from '@/shared/ui/button';
import { FosterRecordAnimalItem } from '@/entities/animal/animal-api';
import { useMemo, useState } from 'react';
import AnimalTile from './animal-tile';
import { FosterState } from '@/entities/animal/animal';
import { cn } from '@/shared/lib/utils';

import EmptyBox from '@/shared/widgets/feedback/empty-box';
import { AniamlCreateDialog } from './animal-create-dialog';

export default function AnimalContainer({
  animals,
}: {
  animals: FosterRecordAnimalItem[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<FosterState>(
    FosterState.IN_PROGRESS,
  );

  const filteredAnimals = useMemo(
    () => animals.filter((animal) => animal?.state === selectedFilter),
    [animals, selectedFilter],
  );

  const filters: { label: string; value: FosterState }[] = [
    { label: '임시보호 중', value: FosterState.IN_PROGRESS },
    { label: '임시보호 완료', value: FosterState.FOSTERED },
    { label: '입양 중', value: FosterState.ADOPTED },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {filters.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant="filter"
              onClick={() => setSelectedFilter(value)}
              className={cn(
                selectedFilter === value &&
                  'bg-black font-semibold text-white hover:bg-black',
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      {animals?.length > 0 ? (
        filteredAnimals?.length > 0 ? (
          <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AniamlCreateDialog />
            {filteredAnimals.map((filteredAnimal) => (
              <AnimalTile key={filteredAnimal.id} animal={filteredAnimal} />
            ))}
          </div>
        ) : (
          <EmptyBox
            className="min-h-96"
            text="조건에 맞는 돌봄 기록이 없어요."
          />
        )
      ) : (
        <EmptyBox className="min-h-96" text="아직 돌봄 기록이 없어요." />
      )}
    </div>
  );
}
