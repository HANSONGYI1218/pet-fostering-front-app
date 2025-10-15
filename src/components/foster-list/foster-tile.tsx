import { FosterListAnimalItem } from '@/types/animal/animal-api';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';

import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_HEALTH_LABEL_KO,
  ANIMAL_PERSONALITY_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  ANIMAL_ENVIRONMENT_LABEL_KO,
} from '@/constants/enum';
import { formatAnimalAge } from '@/lib/utils';

import AnimalBookmark from './animal-bookmark';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { AspectRatio } from '../ui/aspect-ratio';
import { resolveStoredAccessToken } from '@/lib/auth/session';

export default function FosterTile({
  animal,
}: {
  animal: FosterListAnimalItem;
}) {
  const token = resolveStoredAccessToken();
  return (
    <Card className="overflow-hidden p-0 duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={animal?.image}
              alt={animal?.name ?? 'animal-profile'}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </AspectRatio>
          {animal.isEmergency ? (
            <Badge variant="red" className="absolute top-4 left-4">
              긴급 동물
            </Badge>
          ) : null}
          {token && <AnimalBookmark isBookmarked={animal?.isBookmarked} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{animal?.name}</CardTitle>
              <div className="flex flex-wrap justify-end gap-1 text-xs font-medium">
                {animal?.animal_healths?.slice(0, 3)?.map((health) => (
                  <Badge key={health} variant="outline_none">
                    #{ANIMAL_HEALTH_LABEL_KO[health]}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              {animal?.type && ANIMAL_TYPE_LABEL_KO[animal.type]}
              {' · '}
              {animal?.birth_date ? formatAnimalAge(animal.birth_date) : ''}
              {' · '}
              {animal?.gender && ANIMAL_GENDER_LABEL_KO[animal.gender]}
            </p>
          </div>
        </div>
        {animal?.animal_personalitys?.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">성격 특성</h3>
            <div className="flex flex-wrap gap-2">
              {animal.animal_personalitys.map((personality) => (
                <Badge key={personality} variant="secondary">
                  {ANIMAL_PERSONALITY_LABEL_KO[personality]}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
        {animal?.animal_environments?.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">추천하는 임보자</h3>
            <div className="flex flex-wrap gap-2">
              {animal.animal_environments.map((environment) => (
                <Badge key={environment} variant="default">
                  {ANIMAL_ENVIRONMENT_LABEL_KO[environment]}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between border-t py-4">
        <div className="space-y-1 text-sm">
          <div className="text-muted-foreground flex items-center gap-1">
            <MapPin className="size-4" />
            <span>
              {animal?.organization?.address}
              {animal?.organization?.address_detail}
            </span>
          </div>
          <p className="font-medium">{animal?.organization?.name}</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/foster-list/${animal?.id}`}
            className="inline-flex items-center gap-1"
          >
            자세히 보기
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
