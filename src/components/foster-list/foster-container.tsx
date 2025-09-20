'use client';

import { FosterListAnimalItem } from '@/types/animal/animal-api';
import { Button } from '../ui/button';
import SearchBox from '../common/search-box';
import { useMemo, useState } from 'react';
import FosterTile from './foster-tile';
import FosterConditionCard from './foster-condition-card';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
} from '@/constants/enum';

export default function FosterContainer({
  animals,
}: {
  animals: FosterListAnimalItem[];
}) {
  const [animalType, setAnimalType] = useState('전체');
  const [animalSize, setAnimalSize] = useState('전체');
  const [animalGender, setAnimalGender] = useState('전체');
  const [search, setSearch] = useState('');
  const filteredAnimals = useMemo(() => {
    if (!animals?.length) return [];

    const keyword = search.trim();

    return animals.filter((animal: FosterListAnimalItem) => {
      const matchesGender =
        animalGender === '전체' ||
        ANIMAL_GENDER_LABEL_KO[animal.gender] === animalGender;

      const matchesType =
        animalType === '전체' ||
        ANIMAL_TYPE_LABEL_KO[animal?.type] === animalType;

      const matchesSize =
        animalSize === '전체' ||
        ANIMAL_SIZE_LABEL_KO[animal?.size] === animalSize;

      const matchesKeyword =
        keyword.length === 0 ||
        animal?.breed.includes(keyword) ||
        animal?.name.includes(keyword) ||
        animal?.organization?.name.includes(keyword);

      return matchesGender && matchesType && matchesSize && matchesKeyword;
    });
  }, [animals, animalGender, animalType, animalSize, search]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant={'outline'}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 10.995L19.56 8.21503L19.9 4.53503L16.29 3.71503L14.4 0.535034L11 1.99503L7.6 0.535034L5.71 3.71503L2.1 4.52503L2.44 8.20503L0 10.995L2.44 13.775L2.1 17.465L5.71 18.285L7.6 21.465L11 19.995L14.4 21.455L16.29 18.275L19.9 17.455L19.56 13.775L22 10.995ZM17.49 13.105L17.75 15.895L15.01 16.515L13.58 18.925L11 17.815L8.42 18.925L6.99 16.515L4.25 15.895L4.51 13.095L2.66 10.995L4.51 8.87503L4.25 6.09503L6.99 5.48503L8.42 3.07503L11 4.17503L13.58 3.06503L15.01 5.47503L17.75 6.09503L17.49 8.88503L19.34 10.995L17.49 13.105ZM10 13.995H12V15.995H10V13.995ZM10 5.99503H12V11.995H10V5.99503Z"
                fill="#595959"
              />
            </svg>
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
        <SearchBox
          placeholder="품종, 기관/동물 이름"
          onChangeValue={setSearch}
        />
      </div>
      <div className="grid w-full grid-cols-3 gap-6 bg-white">
        {filteredAnimals.map((filteredAnimal) => (
          <FosterTile key={filteredAnimal.id} animal={filteredAnimal} />
        ))}
      </div>
    </div>
  );
}
