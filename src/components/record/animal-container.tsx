'use client';

import { Button } from '@/components/ui/button';
import { FosterRecordAnimalItem } from '@/types/animal/animal-api';
import { useEffect, useState } from 'react';
import AnimalTile from './animal-tile';
import { Plus } from 'lucide-react';
import { Card } from '../ui/card';

export default function AnimalContainer({
  animals,
}: {
  animals: FosterRecordAnimalItem[];
}) {
  const [selectedFilter, setSelectedFilter] = useState('IN_PROGRESS');
  const [filteredAnimals, setFilteredAnimals] = useState<
    FosterRecordAnimalItem[] | null
  >(null);

  useEffect(() => {
    setFilteredAnimals(animals);
  }, [animals]);

  useEffect(() => {
    const filteredAnimals = animals?.filter(
      (a: any) => a?.state === selectedFilter,
    );
    setFilteredAnimals(filteredAnimals);
  }, [selectedFilter, animals]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="filter"
            onClick={() => {
              setSelectedFilter('IN_PROGRESS');
            }}
            className={`${selectedFilter === 'IN_PROGRESS' && 'bg-black font-semibold text-white hover:bg-black'}`}
          >
            임시보호 중
          </Button>
          <Button
            variant="filter"
            onClick={() => {
              setSelectedFilter('FOSTERED');
            }}
            className={`${selectedFilter === 'FOSTERED' && 'bg-black font-semibold text-white hover:bg-black'}`}
          >
            임시보호 완료
          </Button>
          <Button
            variant="filter"
            onClick={() => {
              setSelectedFilter('shared');
            }}
            className={`${selectedFilter === 'shared' && 'bg-black font-semibold text-white hover:bg-black'}`}
          >
            공유된 임시보호 기록
          </Button>
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
        {filteredAnimals?.map((filteredAnimal, idx) => (
          <AnimalTile key={idx} animal={filteredAnimal} />
        ))}
      </div>
    </div>
  );
}
