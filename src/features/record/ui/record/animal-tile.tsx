import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
} from '@/shared/constants/enum';
import { Card } from '@/shared/ui/card';
import { FosterRecordAnimalItem } from '@/entities/animal/animal-api';
import { Badge } from '@/shared/ui/badge';
import { Ellipsis, Pencil, Share2 } from 'lucide-react';
import { Popover } from '@/shared/ui/popover';
import { PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import Link from 'next/link';
import { formatAnimalAge } from '@/shared/lib/utils';
import Image from 'next/image';

export default function AnimalTile({
  animal,
}: {
  animal: FosterRecordAnimalItem;
}) {
  return (
    <Link href={`/record/${animal?.id}`}>
      <Card className="relative mb-6 gap-0 overflow-hidden p-0 transition-all duration-500 hover:shadow-lg">
        <Popover>
          <PopoverTrigger className="absolute top-3 right-3 flex cursor-pointer rounded-lg bg-white p-2 shadow-2xl hover:bg-neutral-100">
            <Ellipsis className="h-5 w-5" />
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={5}
            className="w-fit gap-2 px-3 py-1"
          >
            <div className="my-2 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-[550] hover:bg-neutral-100">
              <Share2 className="h-4 w-4" />
              공유하기
            </div>
            <hr className="w-full" />
            <div className="my-2 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-[550] hover:bg-neutral-100">
              <Pencil className="h-4 w-4" />
              프로필 편집
            </div>
          </PopoverContent>
        </Popover>
        <div className="relative h-72 w-full">
          <Image
            src={animal?.images[0] ?? '/images/placeholder.png'}
            alt={animal?.name ?? 'animal-profile'}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, 100vw"
          />
        </div>
        <div className="flex flex-col px-6">
          <div className="flex w-full border-b py-4">
            <Badge
              variant={'outline_green'}
              className="flex h-9 gap-1 rounded-lg border-2 px-4 font-semibold"
            >
              임보기간
              <span className="font-semibold">{animal?.foster_duration}일</span>
            </Badge>
          </div>
          <div className="flex flex-col gap-1 py-4">
            <h1 className="text-lg font-semibold lg:text-2xl">
              {animal?.name}
            </h1>
            <div className="flex gap-1 text-sm text-neutral-500">
              <span className="text-base text-neutral-800">
                {animal?.type && ANIMAL_TYPE_LABEL_KO[animal.type]}
              </span>
              <span>·</span>
              <span className="text-base text-neutral-800">
                {animal?.birth_date ? formatAnimalAge(animal.birth_date) : ''}
              </span>
              <span>·</span>
              <span className="text-base text-neutral-800">
                {animal?.gender && ANIMAL_GENDER_LABEL_KO[animal.gender]}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
