import { OgrainzationAnimalListItem } from '@/types/animal/animal-api';
import { Card } from '../../ui/card';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_HEALTH_LABEL_KO,
  ANIMAL_PERSONALITYS_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  FOSTER_ENVIRONMENT_LABEL_KO,
} from '@/constants/enum';
import { Check, MoveRight } from 'lucide-react';
import { Badge } from '../../ui/badge';
import Link from 'next/link';
import { FosterApplyListDialog } from './foster-apply-list-dialog';
import { Button } from '@/components/ui/button';
import { FosterState } from '@/types/animal/animal';
import { formatAnimalAge } from '@/lib/utils';
import Image from 'next/image';

export default function FosterTile({
  animal,
}: {
  animal: OgrainzationAnimalListItem;
}) {
  return (
    <Card
      className={`relative mb-6 flex w-full cursor-default gap-0 overflow-hidden p-0 transition-all duration-500 hover:shadow-lg ${animal?.animalStatus === FosterState.FOSTERED || animal?.animalStatus === FosterState.ADOPTED ? 'opacity-70' : 'opacity-100'}`}
    >
      <div className="relative h-64 w-full">
        <Image
          src={animal?.image ?? '/images/placeholder.png'}
          alt={animal?.name ?? 'animal-profile'}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, 100vw"
        />
      </div>
      {animal?.animalStatus === FosterState.FOSTERED ? (
        <div
          className={`absolute top-4 left-4 flex h-9 cursor-default items-center gap-1.5 rounded-md bg-[#FFE081]/70 px-4 text-base font-semibold text-white`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.89174 0.161133C1.47158 0.161133 0.320312 1.3124 0.320312 2.73256V20.8933C0.320312 22.3134 1.47158 23.4647 2.89174 23.4647H21.0524C22.4727 23.4647 23.6238 22.3134 23.6238 20.8933V2.73256C23.6238 1.3124 22.4727 0.161133 21.0524 0.161133H2.89174Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.6055 6.10742C10.1321 6.10742 9.74833 6.49118 9.74833 6.96456V9.37533H7.33761C6.86423 9.37533 6.48047 9.75907 6.48047 10.2325V13.0182C6.48047 13.4916 6.86423 13.8753 7.33761 13.8753H9.74833V16.286C9.74833 16.7594 10.1321 17.1431 10.6055 17.1431H13.3912C13.8646 17.1431 14.2483 16.7594 14.2483 16.286V13.8753H16.659C17.1324 13.8753 17.5163 13.4916 17.5163 13.0182V10.2325C17.5163 9.75907 17.1324 9.37533 16.659 9.37533H14.2483V6.96456C14.2483 6.49118 13.8646 6.10742 13.3912 6.10742H10.6055Z"
              fill="#FFE081"
            />
          </svg>

          <span className="flex-1">임보중</span>
        </div>
      ) : animal?.animalStatus === FosterState.ADOPTED ? (
        <div
          className={`absolute top-4 left-4 flex h-9 cursor-default items-center gap-1.5 rounded-md bg-[#0068D9]/70 px-4 text-base font-semibold text-white`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 11.995L20.56 9.21503L20.9 5.53503L17.29 4.71503L15.4 1.53503L12 2.99503L8.6 1.53503L6.71 4.71503L3.1 5.52503L3.44 9.20503L1 11.995L3.44 14.775L3.1 18.465L6.71 19.285L8.6 22.465L12 20.995L15.4 22.455L17.29 19.275L20.9 18.455L20.56 14.775L23 11.995ZM18.49 14.105L18.75 16.895L16.01 17.515L14.58 19.925L12 18.815L9.42 19.925L7.99 17.515L5.25 16.895L5.51 14.095L3.66 11.995L5.51 9.87503L5.25 7.09503L7.99 6.48503L9.42 4.07503L12 5.17503L14.58 4.06503L16.01 6.47503L18.75 7.09503L18.49 9.88503L20.34 11.995L18.49 14.105ZM11 14.995H13V16.995H11V14.995ZM11 6.99503H13V12.995H11V6.99503Z"
              fill="white"
            />
          </svg>
          <span className="flex-1">입양중</span>
        </div>
      ) : (
        <div
          className={`absolute top-4 left-4 h-9 cursor-default items-center gap-1.5 rounded-md bg-[#EA1B1B]/70 px-4 text-base font-semibold text-white ${animal?.isEmergency ? 'flex' : 'hidden'}`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 11.995L20.56 9.21503L20.9 5.53503L17.29 4.71503L15.4 1.53503L12 2.99503L8.6 1.53503L6.71 4.71503L3.1 5.52503L3.44 9.20503L1 11.995L3.44 14.775L3.1 18.465L6.71 19.285L8.6 22.465L12 20.995L15.4 22.455L17.29 19.275L20.9 18.455L20.56 14.775L23 11.995ZM18.49 14.105L18.75 16.895L16.01 17.515L14.58 19.925L12 18.815L9.42 19.925L7.99 17.515L5.25 16.895L5.51 14.095L3.66 11.995L5.51 9.87503L5.25 7.09503L7.99 6.48503L9.42 4.07503L12 5.17503L14.58 4.06503L16.01 6.47503L18.75 7.09503L18.49 9.88503L20.34 11.995L18.49 14.105ZM11 14.995H13V16.995H11V14.995ZM11 6.99503H13V12.995H11V6.99503Z"
              fill="white"
            />
          </svg>
          <span className="flex-1">긴급 사유</span>
        </div>
      )}
      <div className="flex w-full flex-col gap-2 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{animal?.name}</h1>
          <div className="flex items-center gap-2">
            {animal?.animal_healths?.slice(0, 3)?.map((health, index) => {
              return (
                <span key={index} className="text-sm font-semibold">
                  #{ANIMAL_HEALTH_LABEL_KO[health]}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex gap-1 text-neutral-500">
          <span className="">{ANIMAL_TYPE_LABEL_KO[animal?.type]}</span>
          <span>·</span>
          <span className="">
            {animal?.birth_date ? formatAnimalAge(animal?.birth_date) : ''}
          </span>
          <span>·</span>
          <span className="">
            {animal?.gender && ANIMAL_GENDER_LABEL_KO[animal.gender]}
          </span>
        </div>
        <div className="flex flex-col gap-2 py-2">
          <div className="flex items-center gap-1">
            <Check className="h-5 w-5" />
            <span className="text-sm font-semibold">성격 특성</span>
          </div>
          <div className="flex h-[60px] flex-wrap gap-2 overflow-hidden">
            {animal?.animal_personalitys?.map((personality, index) => {
              return (
                <Badge key={index} variant={'default'} className="font-normal">
                  {ANIMAL_PERSONALITYS_LABEL_KO[personality]}
                </Badge>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 py-2">
          <div className="flex items-center gap-1">
            <Check className="h-5 w-5" />
            <span className="text-sm font-semibold">추천하는 임보자</span>
          </div>
          <div className="flex h-[60px] flex-wrap gap-2 overflow-hidden">
            {animal?.foster_environments?.map((environment, index) => {
              return (
                <Badge
                  key={index}
                  variant={'secondary'}
                  className="font-normal"
                >
                  {FOSTER_ENVIRONMENT_LABEL_KO[environment]}
                </Badge>
              );
            })}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col gap-2">
          <FosterApplyListDialog
            animal_name={animal?.name}
            applicants={animal?.applicants}
            apply_number={animal?.foster_apply_number}
          />
          <Link
            href={`/organization/animal-list/${animal?.id}`}
            className="w-full"
          >
            <Button variant={'destructive'} className="h-10 w-full">
              상세 내용
              <MoveRight />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
