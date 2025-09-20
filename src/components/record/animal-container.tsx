'use client';

import { Button } from '@/components/ui/button';
import { FosterRecordAnimalItem } from '@/types/animal/animal-api';
import { useMemo, useState } from 'react';
import AnimalTile from './animal-tile';
import { Plus } from 'lucide-react';
import { Card } from '../ui/card';
import { FosterState } from '@/types/animal/animal';
import { cn } from '@/lib/utils';

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
      <div className="grid w-full grid-cols-3 gap-6">
        <Card className="group relative mb-6 items-center justify-center overflow-hidden bg-transparent">
          <div className="absolute top-0 left-0 z-0 h-full w-full bg-black opacity-0 group-hover:opacity-85" />
          <div className="relative flex flex-col items-center justify-center gap-2">
            <Plus className="h-10 w-10" stroke="#a3a3a3" strokeWidth={1} />
            <span className="flex text-center text-neutral-700 group-hover:text-white">
              임시보호 기록을 작성할
              <br /> 보호동물을 추가해보세요!
            </span>
          </div>
        </Card>
        {filteredAnimals.map((filteredAnimal) => (
          <AnimalTile key={filteredAnimal.id} animal={filteredAnimal} />
        ))}
      </div>
    </div>
  );
}
