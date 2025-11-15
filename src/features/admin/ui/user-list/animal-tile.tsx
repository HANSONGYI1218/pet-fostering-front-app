import { Card } from '@/shared/ui/card';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

import {
  AnimalGender,
  AnimalSize,
  AnimalStatus,
  AnimalType,
} from '@/entities/animal/animal';
import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPeriod,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import {
  ANIMAL_TYPE_LABEL_KO,
  ANIMAL_GENDER_LABEL_KO,
} from '@/shared/constants/enum';
import { formatAnimalAge } from '@/shared/lib/utils';
import { format } from 'date-fns';

type AnimalProps = {
  id: string;
  name?: string;
  size: AnimalSize;
  type: AnimalType;
  breed: string;
  birth_date?: Date | null;
  euthanasia_date?: Date | null;
  gender: AnimalGender;
  images?: string[] | null;
  introduction?: string | null;
  remark?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  current_foster_start_date?: Date | null;
  current_foster_end_date?: Date | null;
  state: AnimalStatus;
  isEmergency: boolean;
  emergency_reason?: string | null;
  organization?: {
    id?: string | null;
    name?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    addressDetail?: string | null;
  };
  animal_condition: {
    animal_healths?: AnimalHealth[] | null;
    animal_personalitys?: AnimalPersonality[] | null;
    foster_environments?: AnimalEnvironment[] | null;
    special_notes_animals?: AnimalSpecialNote[] | null;
    foster_period?: AnimalPeriod | null;
  };
};

export default function AnimalTile({ animal }: { animal: AnimalProps }) {
  return (
    <Link
      href={`/foster-list/${animal?.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="flex w-fit flex-col border-neutral-50 bg-neutral-50">
        <h1 className="line-clamp-2 font-semibold">{animal?.name}</h1>
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground text-sm whitespace-nowrap">
            {animal?.type && ANIMAL_TYPE_LABEL_KO[animal.type]}
            {' · '}
            {animal?.birth_date ? formatAnimalAge(animal.birth_date) : ''}
            {' · '}
            {animal?.gender && ANIMAL_GENDER_LABEL_KO[animal.gender]}
            {' · '}
            {animal?.breed}
          </p>
          <p className="text-muted-foreground text-sm">
            {animal?.current_foster_start_date &&
              format(animal?.current_foster_start_date, 'yyyy.MM.dd')}
            ~
            {animal?.current_foster_end_date &&
              format(animal?.current_foster_end_date, 'yyyy.MM.dd')}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium">{animal?.organization?.name}</p>
          <div className="text-muted-foreground flex items-start gap-1">
            <MapPin className="mt-1 size-2" />
            <span className="line-clamp-1 flex flex-1 gap-1 text-xs">
              {animal?.organization?.address}
              {animal?.organization?.addressDetail}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
