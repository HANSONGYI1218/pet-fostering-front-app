'use client';

import { AnimalCarousel } from '@/features/foster/ui/foster-list/animal-carousel';
import { AnimalCreateDialog } from './animal-create-dialog';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_HEALTH_LABEL_KO,
  ANIMAL_PERSONALITY_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_SPECIAL_NOTE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  ANIMAL_ENVIRONMENT_LABEL_KO,
} from '@/shared/constants/enum';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import KakaoMapLoader from '@/shared/widgets/map/kakaomap-loader';
import {
  formatAnimalAge,
  fosterRemaingDuration,
  fosterTotalDuration,
} from '@/shared/lib/utils';
import { AnimalHealth } from '@/entities/animal-condition/animal-condition';
import { OrganizationAnimalDetailItem } from '@/entities/animal/animal-api';
import { useState, useCallback } from 'react';
import ChartContainer from '@/features/record/widgets/record-chart/chart-container';
import { format } from 'date-fns';
import RecordFiltered from './record-filtered';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import { toast } from 'sonner';
import { deleteOrganizationAnimal } from '@/features/organization/api/foster-admin';
import { ORGANIZATION_ANIMALS_QUERY_KEY } from './hooks/use-organization-animals';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';

export default function AnimalDetailContainer({
  animal,
}: {
  animal: OrganizationAnimalDetailItem;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    const token = resolveStoredAccessToken();

    if (!token) {
      toast('로그인이 필요합니다.');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteOrganizationAnimal(token, animal.id);
      await queryClient.invalidateQueries({
        queryKey: ORGANIZATION_ANIMALS_QUERY_KEY,
      });
      toast.success('보호 동물을 삭제했어요.');
      router.push('/organization/animal-list');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '삭제에 실패했어요. 잠시 뒤 다시 시도해 주세요.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }, [animal.id, queryClient, router]);

  const total_address = `${animal?.organization?.address} ${animal?.organization?.address_detail}`;

  const healthData = [
    AnimalHealth.VACCINATED,
    AnimalHealth.HEARTWORM_TESTED,
    AnimalHealth.DEWORMED,
    AnimalHealth.FLEA_TICK_TREATED,
  ]
    .map((health) => {
      return `✓ ${ANIMAL_HEALTH_LABEL_KO[health]}`;
    })
    .join('\n');

  const animalDatas = [
    {
      title: '구분',
      data: animal ? ANIMAL_TYPE_LABEL_KO[animal.type] : '',
    },
    {
      title: '품종',
      data: animal?.breed,
    },
    {
      title: '크기',
      data: animal ? ANIMAL_SIZE_LABEL_KO[animal?.size] : '',
    },
    {
      title: '성별',
      data: animal ? ANIMAL_GENDER_LABEL_KO[animal?.gender] : '',
    },
    {
      title: '나이',
      data: animal?.birth_date ? formatAnimalAge(animal?.birth_date) : '',
    },
    {
      title: '임보 기간',
      data: `${animal?.current_foster_start_date && animal?.current_foster_end_date && fosterTotalDuration(animal?.current_foster_start_date, animal?.current_foster_end_date)}일`,
    },
    {
      title: '마이크로칩 여부',
      data: animal?.animal_healths.find((a) => a === AnimalHealth.MICROCHIPPED)
        ? '등록'
        : '미등록',
    },
    {
      title: '중성화',
      data: animal?.animal_healths.find((a) => a === AnimalHealth.NEUTERED)
        ? '완료'
        : '미완료',
    },
    {
      title: '건강 상태',
      data: healthData,
    },
  ];

  const centerDatas = [
    {
      title: '기관명',
      data: animal?.organization?.name,
    },
    {
      title: '연락처',
      data: animal?.organization?.phone_number,
    },
    {
      title: '주소',
      data: total_address,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center rounded-full bg-white p-2">
          <Button
            variant={'secondary'}
            onClick={() => {
              if (currentPage !== 0) {
                setCurrentPage(0);
              }
            }}
            className={`h-10 rounded-full font-semibold text-[#00592d] hover:bg-[D0EFE0] ${currentPage === 0 ? 'bg-[#D0EFE0]' : ''}`}
          >
            임보 기록
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              if (currentPage !== 1) {
                setCurrentPage(1);
              }
            }}
            className={`h-10 rounded-full font-semibold text-[#00592d] hover:bg-[D0EFE0] ${currentPage === 1 ? 'bg-[#D0EFE0]' : ''}`}
          >
            상세 정보
          </Button>
        </div>{' '}
        <div className="flex items-center gap-2">
          <AnimalCreateDialog
            mode="edit"
            animal={animal}
            organizationId={animal.organization?.id}
            onSuccess={() => router.refresh()}
            trigger={
              <Button
                variant="outline_black"
                className={`h-10 ${currentPage === 0 ? 'flex' : 'hidden'}`}
              >
                <Pencil />
                정보 수정하기
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className={`h-10 ${currentPage === 0 ? 'flex' : 'hidden'}`}
                disabled={isDeleting}
              >
                <Trash2 />
                삭제하기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>보호 동물을 삭제할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  삭제하면 {animal.name}에 대한 모든 정보와 돌봄 기록이
                  사라집니다. 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-600/90"
                >
                  {isDeleting ? '삭제 중...' : '삭제하기'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {currentPage === 0 ? (
        <>
          <div className="flex w-full justify-between gap-6 rounded-lg bg-white p-10">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex w-full flex-col gap-6">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-xl font-semibold">
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
                        d="M7.1882 9.45898C6.07455 9.45898 5.00338 9.88639 4.1956 10.653C3.79448 11.0339 3.47488 11.4927 3.25662 12.001C3.03834 12.5093 2.92578 13.0567 2.92578 13.6098C2.92578 14.163 3.03834 14.7104 3.25662 15.2187C3.4742 15.7254 3.79228 16.1827 4.19163 16.5629L11.4043 23.5732C11.737 23.8966 12.2665 23.8966 12.5991 23.5732L19.8119 16.5629C20.2111 16.1827 20.5293 15.7254 20.7468 15.2187C20.9651 14.7104 21.0777 14.163 21.0777 13.6098C21.0777 13.0567 20.9651 12.5093 20.7468 12.001C20.5286 11.4927 20.2091 11.0341 19.8079 10.6532C19.0001 9.88656 17.9289 9.45898 16.8152 9.45898C15.7016 9.45898 14.6304 9.88639 13.8226 10.653L13.8066 10.6687L12.0017 12.4735L10.1968 10.6687L10.1808 10.653C9.37304 9.88639 8.30187 9.45898 7.1882 9.45898Z"
                        fill="#60B88D"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0001 0.183594C9.80814 0.183594 8.03125 1.9605 8.03125 4.15242C8.03125 6.34434 9.80814 8.12125 12.0001 8.12125C14.192 8.12125 15.9689 6.34434 15.9689 4.15242C15.9689 1.9605 14.192 0.183594 12.0001 0.183594Z"
                        fill="#00592D"
                      />
                    </svg>
                    임보기간 :{' '}
                    {animal?.current_foster_start_date &&
                      format(
                        animal?.current_foster_start_date,
                        'yyyy.MM.dd',
                      )}{' '}
                    -{' '}
                    {animal?.current_foster_end_date &&
                      format(animal?.current_foster_end_date, 'yyyy.MM.dd')}
                  </div>
                  <Badge>
                    총{' '}
                    {animal?.current_foster_start_date &&
                      animal?.current_foster_end_date &&
                      fosterTotalDuration(
                        animal?.current_foster_start_date,
                        animal?.current_foster_end_date,
                      )}
                    일
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2365_3240)">
                      <path
                        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                        fill="#C71717"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.5385 5C12.3881 5 13.0769 5.68879 13.0769 6.53846V9.92308H16.4615C17.3112 9.92308 18 10.6119 18 11.4615C18 12.3112 17.3112 13 16.4615 13H11.5385C10.6888 13 10 12.3112 10 11.4615V6.53846C10 5.68879 10.6888 5 11.5385 5Z"
                        fill="#F69D9D"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2365_3240">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  남은기간 :{' '}
                  {animal?.current_foster_end_date &&
                    fosterRemaingDuration(animal?.current_foster_end_date)}
                  일
                </div>
              </div>
            </div>
            <Badge variant={'destructive'} className="h-8 px-3 text-base">
              임시보호 상세
            </Badge>
          </div>
          <div className="flex w-full gap-6 rounded-lg bg-white p-10">
            <div className="relative flex w-3/5 flex-col justify-between">
              {animal?.images && animal?.images?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <AnimalCarousel images={animal?.images} />
                </div>
              ) : (
                <div>없어요~!</div>
              )}
            </div>
            <div className="flex w-2/5 flex-col gap-6">
              <Card className="h-full w-full cursor-default p-10">
                {animal?.isEmergency && (
                  <div className="flex items-center gap-2 bg-[#FDE8E8] px-3 py-1.5 text-lg font-semibold text-[#EA1B1B]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23 11.995L20.56 9.21503L20.9 5.53503L17.29 4.71503L15.4 1.53503L12 2.99503L8.6 1.53503L6.71 4.71503L3.1 5.52503L3.44 9.20503L1 11.995L3.44 14.775L3.1 18.465L6.71 19.285L8.6 22.465L12 20.995L15.4 22.455L17.29 19.275L20.9 18.455L20.56 14.775L23 11.995ZM18.49 14.105L18.75 16.895L16.01 17.515L14.58 19.925L12 18.815L9.42 19.925L7.99 17.515L5.25 16.895L5.51 14.095L3.66 11.995L5.51 9.87503L5.25 7.09503L7.99 6.48503L9.42 4.07503L12 5.17503L14.58 4.06503L16.01 6.47503L18.75 7.09503L18.49 9.88503L20.34 11.995L18.49 14.105ZM11 14.995H13V16.995H11V14.995ZM11 6.99503H13V12.995H11V6.99503Z"
                        fill="#EA1B1B"
                      />
                    </svg>
                    긴급 동물
                  </div>
                )}
                <span className="text-2xl font-semibold">{animal?.name}</span>
                <div className="grid w-full grid-cols-2 gap-6">
                  {animalDatas?.slice(0, 6)?.map((a) => (
                    <div key={a?.data} className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-neutral-400">
                        {a?.title}
                      </span>
                      <span className="font-medium whitespace-pre-line">
                        {a?.data}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex w-full gap-4">
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-neutral-400">
                        {animalDatas[6].title}
                      </span>
                      <span className="font-medium whitespace-pre-line">
                        {animalDatas[6].data}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-neutral-400">
                        {animalDatas[7].title}
                      </span>
                      <span className="font-medium whitespace-pre-line">
                        {animalDatas[7].data}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-400">
                      {animalDatas[8].title}
                    </span>
                    <span className="font-medium whitespace-pre-line">
                      {animalDatas[8].data}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="flex min-h-96 gap-6">
            <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-10">
              <h1 className="flex items-center gap-1 text-lg font-semibold">
                <Image
                  src="/icons/foster-story.svg"
                  alt="foster-story"
                  width={24}
                  height={24}
                />
                {animal?.name} 이야기
              </h1>
              <div className="flex w-full flex-1 flex-col justify-between gap-10">
                <span>{animal?.introduction}</span>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <Check className="h-5 w-5" stroke="#298C5B" />
                      <span className="font-medium text-[#298C5B]">
                        임보기간
                      </span>
                    </div>
                    <span>
                      {animal?.current_foster_start_date &&
                        format(
                          animal?.current_foster_start_date,
                          'yyyy.MM.dd',
                        )}{' '}
                      -{' '}
                      {animal?.current_foster_end_date &&
                        format(animal?.current_foster_end_date, 'yyyy.MM.dd')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <Check className="h-5 w-5" stroke="#298C5B" />
                      <span className="font-medium text-[#298C5B]">
                        성격 특성
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-hidden">
                      {animal?.animal_personalitys?.map(
                        (personality, index) => (
                          <Badge
                            key={index}
                            variant={'default'}
                            className="h-9 px-4 text-base font-normal"
                          >
                            {ANIMAL_PERSONALITY_LABEL_KO[personality]}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <Check className="h-5 w-5" stroke="#298C5B" />
                      <span className="font-medium text-[#298C5B]">
                        특이 사항
                      </span>
                    </div>
                    <span className="min-h-12">{animal?.remark}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col justify-between rounded-lg bg-white p-10">
              <div className="flex w-full flex-col gap-10">
                <div className="flex flex-col gap-6">
                  <h1 className="flex items-center gap-1 text-lg font-semibold">
                    <Image
                      src="/icons/foster-match.svg"
                      alt="foster-match"
                      width={24}
                      height={24}
                    />
                    이런 임보자와 잘 맞을 것 같아요
                  </h1>
                  <div className="flex flex-wrap gap-2 overflow-hidden">
                    {animal?.foster_environments?.map((environment, index) => {
                      return (
                        <Badge
                          key={index}
                          variant={'secondary'}
                          className="h-9 px-4 text-base font-normal"
                        >
                          {ANIMAL_ENVIRONMENT_LABEL_KO[environment]}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <h1 className="flex items-center gap-1 text-lg font-semibold">
                    <Image
                      src="/icons/foster-attention.svg"
                      alt="foster-attention"
                      width={24}
                      height={24}
                    />
                    유의사항
                  </h1>
                  <div className="flex h-[60px] flex-wrap gap-6 overflow-hidden">
                    {animal?.special_notes_animals?.map((note, index) => {
                      return (
                        <Badge
                          key={index}
                          variant={'destructive'}
                          className="h-9 px-4 text-base font-normal"
                        >
                          {ANIMAL_SPECIAL_NOTE_LABEL_KO[note]}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#F5F5F5] p-3 text-sm text-[#1B1B1B]">
                위 조건은 참고용 권장사항입니다. 모두 해당되지 않아도 신청할 수
                있어요 :&#41;
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-10">
            <div className="flex flex-col gap-2">
              <h1 className="flex items-center gap-1 text-lg font-semibold">
                <Image
                  src="/icons/foster-center-info.svg"
                  alt="foster-center-info"
                  width={24}
                  height={24}
                />
                보호기관 정보
              </h1>
            </div>
            <div className="flex items-center justify-between gap-16">
              <KakaoMapLoader address={total_address ?? ''} />

              <div className="grid w-full grid-cols-2 items-end gap-6">
                {centerDatas?.map((a) => (
                  <div key={a?.data} className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-400">
                      {a?.title}
                    </span>
                    <span className="font-medium">{a?.data}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-10">
            <h1 className="flex items-center gap-1 text-lg font-semibold">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_2474_1546"
                  style={{ maskType: 'alpha' }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_2474_1546)">
                  <path
                    d="M4 20V12H8V20H4ZM10 20V4H14V20H10ZM16 20V9H20V20H16Z"
                    fill="#60B88D"
                  />
                </g>
              </svg>
              통계
            </h1>
            <ChartContainer
              start_date={animal?.current_foster_start_date}
              end_date={animal?.current_foster_end_date}
              foster_records={animal?.foster_records}
            />
          </div>
          <div className="flex w-full gap-6">
            <div className="flex h-fit w-96 flex-col gap-6 rounded-lg bg-white p-10">
              <h1 className="text-xl font-bold">{animal?.name}</h1>
              <div className="relative h-64 w-full">
                <Image
                  src={animal?.images[0] ?? '/images/placeholder.png'}
                  alt={animal?.name ?? 'animal-img'}
                  fill
                  className="rounded-lg border object-cover"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">종</span>
                  <span className="font-medium">{animal?.breed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">나이</span>
                  <span className="font-medium">
                    {animal?.birth_date
                      ? formatAnimalAge(animal?.birth_date)
                      : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">성별</span>
                  <span className="font-medium">
                    {ANIMAL_GENDER_LABEL_KO[animal?.gender]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">임보 기간</span>
                  <span className="font-medium">
                    {animal?.current_foster_start_date &&
                      animal?.current_foster_end_date &&
                      fosterTotalDuration(
                        animal?.current_foster_start_date,
                        animal?.current_foster_end_date,
                      )}
                    일
                  </span>
                </div>
              </div>
              <hr className="w-full" />
              <div className="flex flex-col gap-2 pb-4">
                <span className="text-sm text-neutral-700">특이사항</span>
                <span className="font-medium">{animal?.remark}</span>
              </div>
            </div>
            <RecordFiltered records={animal?.foster_records} />
          </div>
        </>
      )}
    </div>
  );
}
