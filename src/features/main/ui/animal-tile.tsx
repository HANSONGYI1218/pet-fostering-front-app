import Image from 'next/image';
import type { AnimalListItem } from '@/entities/animal/animal-api';
import { formatAnimalAge } from '@/shared/lib/utils';
import { ANIMAL_TYPE_LABEL_KO } from '@/shared/constants/enum';
import Link from 'next/link';
import { Badge } from '@/shared/ui/badge';

export default function AnimalTile({ animal }: { animal: AnimalListItem }) {
  const detailItems = [
    animal.breed,
    animal?.birth_date ? formatAnimalAge(animal.birth_date) : null,
    animal?.type ? ANIMAL_TYPE_LABEL_KO[animal.type] : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Link href={`/foster-list/${animal?.id}`}>
      <div className="relative flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-xl">
        <Badge className="absolute top-3 right-3 h-14 w-14 rounded-full bg-[#FF5F4D] text-lg text-white">
          긴급
        </Badge>
        <Image
          src={animal?.image}
          width={315}
          height={315}
          alt="dog-image"
          className="aspect-square object-cover"
        />
        <div className="flex w-full flex-col gap-2 bg-white p-6">
          <h1 className="text-xl font-semibold">{animal?.name}</h1>
          <span className="text-neutral-800">{detailItems}</span>
        </div>
      </div>
    </Link>
  );
}
