import { ANIMAL_GENDER_LABEL_KO } from '@/constants/enum';
import { Card } from '../ui/card';
import { FosterRecordAnimalItem } from '@/types/animal/animal-api';
import { Badge } from '../ui/badge';
import { ChevronRight, Ellipsis, Pencil, Share2 } from 'lucide-react';
import { Popover } from '../ui/popover';
import { PopoverContent, PopoverTrigger } from '../ui/popover';
import Link from 'next/link';
import { formatAnimalAge } from '@/lib/utils';

export default function AnimalTile({
  animal,
}: {
  animal: FosterRecordAnimalItem;
}) {
  return (
    <Card className="relative mb-6 cursor-default gap-0 overflow-hidden p-0 transition-all duration-500 hover:shadow-lg">
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
      <img
        src={animal?.images[0]}
        className="h-64 w-full object-cover"
        alt="profile"
      />
      <div className="flex flex-col gap-2 p-6">
        <h1 className="text-xl font-semibold">{animal?.name}</h1>
        <div className="flex gap-1 text-sm text-neutral-500">
          <span className="">{animal?.type}</span>
          <span>·</span>
          <span className="">
            {animal?.birth_date ? formatAnimalAge(animal?.birth_date) : ''}
          </span>
          <span>·</span>
          <span className="">
            {animal?.gender && ANIMAL_GENDER_LABEL_KO[animal.gender]}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant={'outline'} className="flex h-8 gap-1 px-4">
            임보기간
            <span className="font-semibold">{animal?.foster_duration}일</span>
          </Badge>
          <Link href={`/record/${animal?.foster_match_id}`}>
            <div className="group relative flex h-8 w-36 cursor-pointer items-center justify-center gap-1 hover:text-white">
              <div className="absolute top-0 right-0 z-0 h-full w-0 rounded-full bg-black opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100" />
              <span className="z-10 font-semibold text-white">
                활동기록 보기
              </span>
              <ChevronRight className="z-10 h-5 w-5" strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
}
