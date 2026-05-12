import type { MatchedFosterAnimalListItem } from '@/entities/animal/animal-api';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  ANIMAL_HEALTH_LABEL_KO,
  ANIMAL_PERSONALITY_LABEL_KO,
} from '@/shared/constants/enum';
import { getDDay } from '@/shared/lib/utils';

import { AspectRatio } from '@/shared/ui/aspect-ratio';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

export default function MatchedAnimalTile({
  animal,
  index,
}: {
  animal: MatchedFosterAnimalListItem;
  index: number;
}) {
  const euthanasiaDate = animal?.euthanasia_date
    ? parseInt(getDDay(animal.euthanasia_date))
    : 0;

  const winners = [
    '/images/first.png',

    '/images/second.png',

    '/images/third.png',
  ];

  const socreCoclor =
    animal.score >= 80
      ? 'text-red-600'
      : animal.score >= 50
        ? 'text-yellow-500'
        : 'text-neutral-700';

  return (
    <Card className="w-full cursor-default p-0 duration-300 hover:shadow-lg">
      {index < 3 && (
        <Image
          src={winners[index]}
          alt={`${index + 1}등`}
          width={72}
          height={72}
          className="absolute top-0 left-2 z-10"
        />
      )}
      <CardHeader className="p-0">
        <div className="relative">
          <AspectRatio ratio={3 / 2}>
            <Image
              src={animal?.image}
              alt={animal?.name ?? 'animal-profile'}
              fill
              className="rounded-lg object-cover"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </AspectRatio>
          {animal.isEmergency && (
            <Badge variant="red" className="absolute top-4 left-4">
              긴급 동물
            </Badge>
          )}
          {animal?.euthanasia_date &&
            0 <= euthanasiaDate &&
            euthanasiaDate < 30 && (
              <Badge
                variant="outline"
                className="absolute top-4 right-4 flex gap-2 border-red-300 text-xl font-black text-red-500"
              >
                <span className="text-sm font-medium">안락사</span> D-
                {euthanasiaDate === 0 ? 'day' : euthanasiaDate}
              </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-6">
        <div className="flex w-full items-center justify-between">
          <CardTitle className="ext-xl">{animal?.name}</CardTitle>
          <div className="flex flex-wrap justify-end text-xs font-medium">
            {animal?.animal_healths?.slice(0, 2)?.map((health) => (
              <Badge key={health} variant="outline_none" className="px-1">
                #{ANIMAL_HEALTH_LABEL_KO[health]}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex h-[4.1rem] flex-wrap gap-2 overflow-hidden">
            {animal.animal_personalitys.length > 0
              ? animal.animal_personalitys.map((personality) => (
                  <Badge key={personality} variant="secondary">
                    {ANIMAL_PERSONALITY_LABEL_KO[personality]}
                  </Badge>
                ))
              : null}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-1 border-t py-4">
        <p className={`text-xl font-extrabold ${socreCoclor}`}>
          {animal?.score}%
        </p>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/foster-list/${animal?.id}`}
            className="inline-flex items-center gap-1 hover:rounded-full hover:bg-neutral-100"
          >
            자세히 보기
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
