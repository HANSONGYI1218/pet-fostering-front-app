'use client';

import { Button } from '@/shared/ui/button';
import { FosterRecordAnimalItem } from '@/entities/animal/animal-api';
import { useMemo, useState } from 'react';
import AnimalTile from './animal-tile';
import { AnimalStatus } from '@/entities/animal/animal';
import { cn } from '@/shared/lib/utils';

import EmptyBox from '@/shared/widgets/feedback/empty-box';
import { AniamlCreateDialog } from './animal-create-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export default function AnimalContainer({
  animals,
}: {
  animals: FosterRecordAnimalItem[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<AnimalStatus>(
    AnimalStatus.IN_PROGRESS,
  );

  const filteredAnimals = useMemo(
    () => animals.filter((animal) => animal?.state === selectedFilter),
    [animals, selectedFilter],
  );

  const filters: { label: string; value: AnimalStatus }[] = [
    { label: '임시보호 중', value: AnimalStatus.IN_PROGRESS },
    { label: '임시보호 완료', value: AnimalStatus.COMPLETED },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex w-full items-end justify-between">
        <div className="flex items-center gap-4 max-md:hidden">
          {filters.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant="filter"
              onClick={() => setSelectedFilter(value)}
              className={cn(
                'border',
                selectedFilter === value &&
                  'bg-[#3B3B3B] font-semibold text-white hover:bg-black',
              )}
            >
              {label}
            </Button>
          ))}
        </div>
        <Select
          value={selectedFilter}
          onValueChange={(v: AnimalStatus) => {
            setSelectedFilter(v);
          }}
        >
          <SelectTrigger className="w-[180px] md:hidden">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            {filters.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AniamlCreateDialog />
      </div>
      {animals?.length > 0 ? (
        filteredAnimals?.length > 0 ? (
          <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
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
