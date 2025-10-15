'use client';

import { FosterListAnimalItem } from '@/types/animal/animal-api';
import { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

import { filterFosterList } from '@/domain/foster-list/filters';
import type { FosterFilterValue } from '@/domain/foster-list/filters';
import { FILTER_ALL_VALUE } from '@/constants/filter';
import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';

import SearchBox from '../common/search-box';
import FosterConditionCard from './foster-condition-card';
import FosterTile from './foster-tile';
import { Button } from '../ui/button';
import { Card, CardAction, CardHeader } from '../ui/card';
import EmptyBox from '../common/empty-box';

export default function FosterContainer({
  animals,
}: {
  animals: FosterListAnimalItem[];
}) {
  const [animalType, setAnimalType] =
    useState<FosterFilterValue<AnimalType>>(FILTER_ALL_VALUE);
  const [animalSize, setAnimalSize] =
    useState<FosterFilterValue<AnimalSize>>(FILTER_ALL_VALUE);
  const [animalGender, setAnimalGender] =
    useState<FosterFilterValue<AnimalGender>>(FILTER_ALL_VALUE);
  const [search, setSearch] = useState('');
  const [isEmergencyOnly, setIsEmergencyOnly] = useState(false);
  const filteredAnimals = useMemo(() => {
    const result = filterFosterList(animals ?? [], {
      type: animalType,
      size: animalSize,
      gender: animalGender,
      keyword: search,
    });

    if (!isEmergencyOnly) {
      return result;
    }

    return result.filter((animal) => animal.isEmergency);
  }, [animals, animalGender, animalType, animalSize, isEmergencyOnly, search]);

  return (
    <div className="flex flex-col gap-8">
      <Card className="flex cursor-auto flex-col border-none p-0 shadow-none md:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={isEmergencyOnly ? 'destructive' : 'outline'}
            aria-pressed={isEmergencyOnly}
            onClick={() => setIsEmergencyOnly((prev) => !prev)}
            className="gap-2 max-md:text-sm"
          >
            <AlertTriangle className="size-4" />
            긴급
          </Button>
          <FosterConditionCard
            animalType={animalType}
            animalSize={animalSize}
            animalGender={animalGender}
            setAnimalType={setAnimalType}
            setAnimalSize={setAnimalSize}
            setAnimalGender={setAnimalGender}
          />
        </div>
        <CardAction>
          <SearchBox
            placeholder="품종, 기관/동물 이름"
            onChangeValue={setSearch}
            className="md:w-72"
          />
        </CardAction>
      </Card>
      {filteredAnimals?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAnimals.map((filteredAnimal) => (
            <FosterTile key={filteredAnimal.id} animal={filteredAnimal} />
          ))}
        </div>
      ) : (
        <EmptyBox className="min-h-96" text="조건에 맞는 보호동물이 없어요." />
      )}{' '}
    </div>
  );
}
