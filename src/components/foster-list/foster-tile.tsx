import { FosterListAnimalItem } from '@/types/animal/animal-api';
import { Card } from '../ui/card';
import { ANIMAL_GENDER_LABEL_KO, ANIMAL_TYPE_LABEL_KO } from '@/constants/enum';
import { Check, MapPin, MoveRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import AnimalBookmark from './animal-bookmark';
import Link from 'next/link';

export default function FosterTile({
  animal,
}: {
  animal: FosterListAnimalItem;
}) {
  return (
    <Card className="relative mb-6 flex cursor-default gap-0 overflow-hidden p-0 transition-all duration-500 hover:shadow-lg">
      <img
        src={animal?.image}
        className="h-64 w-full object-cover"
        alt="profile"
      />
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
      <AnimalBookmark isBookmarked={animal?.isBookmarked} />
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{animal?.name}</h1>
          <div className="flex items-center gap-2">
            {animal?.animal_healths?.map((health, index) => {
              return (
                <span key={index} className="text-sm font-semibold">
                  #{health}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex gap-1 text-neutral-500">
          <span className="">{ANIMAL_TYPE_LABEL_KO[animal?.type]}</span>
          <span>·</span>
          <span className="">{animal?.age}살</span>
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
                  {personality}
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
                  {environment}
                </Badge>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {animal?.organization?.address +
                animal?.organization?.address_detail}
            </div>
            <span className="text-xl font-semibold">
              {animal?.organization?.name}
            </span>
          </div>
          <Link href={`/foster-list/${animal?.id}`}>
            <div className="group relative flex h-8 w-32 cursor-pointer items-center justify-center gap-2 hover:text-white">
              <div className="absolute top-0 right-0 z-0 h-full w-0 rounded-full bg-black opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100" />
              <span className="z-10 font-semibold text-white">자세히 보기</span>
              <MoveRight className="z-10 h-5 w-5" strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
}
