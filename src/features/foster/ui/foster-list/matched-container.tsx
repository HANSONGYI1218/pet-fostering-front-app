'use client';

import type {
  FosterListAnimalItem,
  MatchedFosterAnimalListItem,
} from '@/entities/animal/animal-api';

import FosterTile from './foster-tile';

export default function MatchedAnimalContainer({
  animals,
}: {
  animals: MatchedFosterAnimalListItem[];
}) {
  const animalsWithoutScore: FosterListAnimalItem[] = animals.map(
    ({ score, ...rest }) => rest,
  );
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {animalsWithoutScore.map((animal) => (
          <FosterTile key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
}
