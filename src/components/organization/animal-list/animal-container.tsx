'use client';

import { OgrainzationAnimalListItem } from '@/types/animal/animal-api';
import { useEffect, useState } from 'react';
import AnimalTile from './animal-tile';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  FOSTER_STATE_LABEL_KO,
} from '@/constants/enum';
import { Button } from '@/components/ui/button';
import FosterConditionCard from '../../foster-list/foster-condition-card';
import SearchBox from '@/components/common/search-box';
import { AnimalCreateDialog } from './animal-create-dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FosterState } from '@/types/animal/animal';
import { socket } from '@/lib/socket';
import { dummyOgrainzationAnimals } from '@/lib/dummydata';

const statusOrder = {
  [FosterState.IN_PROGRESS]: 0,
  [FosterState.FOSTERED]: 1,
  [FosterState.ADOPTED]: 2,
};

// async function fetchAnimals() {
//   const res = await fetch('/api/animals');
//   return res.json();
// }
async function fetchAnimals(): Promise<OgrainzationAnimalListItem[]> {
  // 실제 fetch 대신 delay를 주고 더미 반환 가능
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyOgrainzationAnimals), 300); // 300ms 딜레이
  });
}

export default function AnimalContainer() {
  const queryClient = useQueryClient();

  // 1️⃣ 동물 데이터 가져오기
  const {
    data: animals = [],
    isLoading,
    isError,
  } = useQuery<OgrainzationAnimalListItem[]>({
    queryKey: ['animals'],
    queryFn: fetchAnimals,
    // select 옵션으로 서버 데이터 정렬
    select: (data) =>
      data
        .slice()
        .sort(
          (a, b) => statusOrder[a.animalStatus] - statusOrder[b.animalStatus],
        ),
  });

  // 2️⃣ 소켓 실시간 업데이트 처리
  useEffect(() => {
    const handler = (updatedAnimal: OgrainzationAnimalListItem) => {
      queryClient.setQueryData<OgrainzationAnimalListItem[]>(
        ['animals'],
        (old = []) =>
          old
            .map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a))
            .sort(
              (a, b) =>
                statusOrder[a.animalStatus] - statusOrder[b.animalStatus],
            ), // 소켓 업데이트 후에도 정렬 유지
      );
    };

    socket.on('animalUpdated', handler);

    return () => {
      socket.off('animalUpdated', handler);
    };
  }, [queryClient]);

  const [animalEmergency, setEmergency] = useState(false);
  const [animalType, setAnimalType] = useState('전체');
  const [animalSize, setAnimalSize] = useState('전체');
  const [animalGender, setAnimalGender] = useState('전체');
  const [animalStatus, setAnimalStatus] = useState('전체');
  const [search, setSearch] = useState('');
  const [filteredAnimals, setFilteredAnimals] = useState<
    OgrainzationAnimalListItem[] | null
  >(null);

  useEffect(() => {
    if (animals && animals?.length > 0) {
      const sortedAnimals = animals.filter(
        (animal: OgrainzationAnimalListItem) => {
          const matchAnimalEmergency = animalEmergency
            ? animal.isEmergency
            : true;

          const matcheAnimalGender =
            !animalGender ||
            animalGender === '전체' ||
            ANIMAL_GENDER_LABEL_KO[animal.gender] === animalGender;

          const matchesAimalTypes =
            !animalType || animalType === '전체'
              ? true
              : animalType === ANIMAL_TYPE_LABEL_KO[animal?.type];

          const matchesAnimalSize =
            !animalSize || animalSize === '전체'
              ? true
              : animalSize === ANIMAL_SIZE_LABEL_KO[animal?.size];

          const matchesAnimalStatus =
            !animalStatus || animalStatus === '전체'
              ? true
              : animalStatus === FOSTER_STATE_LABEL_KO[animal?.animalStatus];

          const matchesSearch =
            search.length === 0 ||
            animal?.breed.includes(search) ||
            animal?.name.includes(search);

          return (
            matchAnimalEmergency &&
            matcheAnimalGender &&
            matchesAimalTypes &&
            matchesAnimalSize &&
            matchesAnimalStatus &&
            matchesSearch
          );
        },
      );

      setFilteredAnimals(sortedAnimals);
    }
  }, [
    animals,
    animalEmergency,
    animalType,
    animalSize,
    animalGender,
    animalStatus,
    search,
  ]);

  // 3️⃣ 로딩 / 에러 처리
  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant={'outline'}
            onClick={() => {
              setEmergency((prev) => !prev);
            }}
          >
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
            animalStatus={animalStatus}
            setAnimalType={setAnimalType}
            setAnimalSize={setAnimalSize}
            setAnimalGender={setAnimalGender}
            setAnimalStatus={setAnimalStatus}
          />
          <SearchBox placeholder="품종, 동물 이름" onChangeValue={setSearch} />
        </div>
        <AnimalCreateDialog />
      </div>
      <div className="grid w-full grid-cols-3 gap-6 bg-white">
        {filteredAnimals?.map((filteredAnimal, idx) => (
          <AnimalTile key={idx} animal={filteredAnimal} />
        ))}
      </div>
    </div>
  );
}
