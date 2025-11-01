import type { Metadata } from 'next';
import { cache } from 'react';
import BackButton from '@/shared/widgets/navigation/back-button';
import AnimalBookmark from '@/features/foster/ui/foster-list/animal-bookmark';
import { AnimalCarousel } from '@/features/foster/ui/foster-list/animal-carousel';
import { Card } from '@/shared/ui/card';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_HEALTH_LABEL_KO,
  ANIMAL_PERSONALITY_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_SPECIAL_NOTE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  ANIMAL_ENVIRONMENT_LABEL_KO,
} from '@/shared/constants/enum';
import { fetchFosterAnimalDetail } from '@/features/foster/api/foster';
import { Check } from 'lucide-react';
import ConnectDialog from '@/features/foster/ui/foster-list/connect-dialog';
import FosterRequestDialog from '@/features/foster/ui/foster-list/foster-request-dialog';
import { Badge } from '@/shared/ui/badge';
import KakaoMapLoader from '@/shared/widgets/map/kakaomap-loader';
import {
  formatAnimalAge,
  fosterTotalDuration,
  getDDay,
} from '@/shared/lib/utils';
import { AnimalHealth } from '@/entities/animal-condition/animal-condition';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import KakaoMapsScript from '@/shared/widgets/map/kakao-maps-script';
import type { AsyncParams } from '@/shared/types/next';
import { createAppMetadata } from '@/shared/config/seo';

const getFosterAnimalDetail = cache((id: string) =>
  fetchFosterAnimalDetail(id),
);

export async function generateMetadata({
  params,
}: AsyncParams<{ id: string }>): Promise<Metadata> {
  const { id } = await params;

  try {
    const animal = await getFosterAnimalDetail(id);
    const organizationName = animal.organization.name || '보호소';
    const breedLabel = animal.breed ? ` ${animal.breed}` : '';
    const description = `${organizationName}에서 보호 중인${breedLabel} ${animal.name}의 임시보호 정보를 확인하세요.`;
    const primaryImage = animal.images?.[0];

    return createAppMetadata({
      title: `${animal.name} | 임시보호 동물 상세 - 퍼디즈`,
      description,
      path: `/foster-list/${id}`,
      image: primaryImage
        ? {
            url: primaryImage,
            alt: `${animal.name}의 사진`,
          }
        : undefined,
    });
  } catch {
    return createAppMetadata({
      title: '임시보호 동물 상세 | 퍼디즈',
      description: '임시보호 동물 상세 정보를 확인하세요.',
      path: `/foster-list/${id}`,
    });
  }
}

export default async function FosterListDetailPage({
  params,
}: AsyncParams<{ id: string }>) {
  const { id } = await params;
  const animal = await getFosterAnimalDetail(id).catch((error: unknown) => {
    if (error instanceof Error && /404/.test(error.message)) {
      notFound();
    }
    throw error;
  });
  const total_address =
    `${animal.organization.address} ${animal.organization.address_detail}`.trim();

  const healthData = animal.animal_healths
    .map((health) => `✓ ${ANIMAL_HEALTH_LABEL_KO[health]}`)
    .join('\n');

  const fosterDurationText =
    animal.current_foster_start_date && animal.current_foster_end_date
      ? `${fosterTotalDuration(
          animal.current_foster_start_date,
          animal.current_foster_end_date,
        )}일`
      : '';

  const animalDatas = [
    {
      title: '구분',
      data: ANIMAL_TYPE_LABEL_KO[animal.type],
    },
    {
      title: '품종',
      data: animal.breed,
    },
    {
      title: '크기',
      data: ANIMAL_SIZE_LABEL_KO[animal.size],
    },
    {
      title: '성별',
      data: ANIMAL_GENDER_LABEL_KO[animal.gender],
    },
    {
      title: '나이',
      data: animal.birth_date ? formatAnimalAge(animal.birth_date) : '',
    },
    {
      title: '임보 기간',
      data: fosterDurationText,
    },
    {
      title: '마이크로칩 여부',
      data: animal.animal_healths.find((a) => a === AnimalHealth.MICROCHIPPED)
        ? '등록'
        : '미등록',
    },
    {
      title: '중성화',
      data: animal.animal_healths.find((a) => a === AnimalHealth.NEUTERED)
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
      data: animal.organization.name,
    },
    {
      title: '연락처',
      data: animal.organization.phone_number,
    },
    {
      title: '주소',
      data: total_address,
    },
  ];

  return (
    <>
      <KakaoMapsScript />
      <main className="bg-neutral-50">
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16">
          <BackButton link="/foster-list" />
          {animal?.isEmergency && (
            <div className="flex w-full items-center gap-10 rounded-lg bg-[#FDE8E8] px-6 py-3">
              <span className="flex items-center gap-2 text-xl font-semibold text-[#EA1B1B]">
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
              </span>
              <span className="text-[#EA1B1B]/90">
                * {animal?.emergency_reason}
              </span>
            </div>
          )}
          <div className="flex w-full flex-col rounded-lg bg-white md:flex-row">
            <div className="relative flex w-full flex-col md:w-3/5 md:p-10">
              {animal?.images && animal?.images?.length > 0 ? (
                <div className="relative flex w-full">
                  <AnimalBookmark isBookmarked={animal?.isBookmarked} />
                  <AnimalCarousel images={animal?.images} />
                </div>
              ) : (
                <Card className="flex h-full w-full items-center justify-center bg-neutral-100">
                  <span>사진을 준비중이에요.</span>
                </Card>
              )}
            </div>
            <div className="flex w-full flex-col gap-6 p-10 md:w-2/5">
              <Card className="w-full cursor-default p-0 max-md:border-none max-md:shadow-none md:p-10">
                <div className="flex items-center gap-6 font-semibold">
                  <span className="text-2xl">{animal?.name}</span>
                  {animal?.euthanasia_date && (
                    <Badge
                      variant="outline"
                      className="flex gap-2 border-red-300 text-xl font-black text-red-500"
                    >
                      <span className="text-sm font-medium">안락사</span> D-
                      {parseInt(getDDay(animal.euthanasia_date)) <= 0
                        ? '0'
                        : getDDay(animal.euthanasia_date)}
                    </Badge>
                  )}
                </div>
                <div className="grid w-full grid-cols-2 gap-6">
                  {animalDatas?.slice(0, 6)?.map((a, index) => (
                    <div
                      key={a?.title ?? index}
                      className="flex flex-col gap-1"
                    >
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
              <div className="flex w-full flex-col gap-4 md:flex-row">
                <ConnectDialog
                  name={animal?.organization?.name ?? ''}
                  phone_number={animal?.organization?.phone_number ?? ''}
                />
                <FosterRequestDialog
                  type={animal?.type}
                  name={animal?.name ?? ''}
                  isFosterCondition={animal?.isFosterCondition}
                />
              </div>
            </div>
          </div>
          <div className="flex min-h-96 flex-col gap-6 md:flex-row">
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
                    <span>{animal?.remark}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col justify-between gap-6 rounded-lg bg-white p-10">
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
                    {animal?.animal_environments?.map((environment, index) => {
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
                  <div className="flex flex-wrap gap-6 overflow-hidden">
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
          <div className="flex w-full flex-col justify-between gap-2 rounded-lg border border-neutral-200 bg-[#F5F5F5] p-3 shadow-xs md:flex-row md:items-center md:gap-0">
            <span className="flex items-end gap-1 font-medium">
              <Image
                src="/images/support.png"
                alt="support"
                width={28}
                height={28}
                className="h-7 w-7"
              />{' '}
              {animal?.name}에게 작지만 따뜻한 후원을 해주세요.
            </span>
            <span className="text-end text-sm text-neutral-700">
              <span className="underline decoration-neutral-700">
                {animal?.organization?.donation_bank_name}{' '}
                {animal?.organization?.donation_account_number}
              </span>
              <br />
              예금주: {animal?.organization?.donation_account_holder}
            </span>
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
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-16">
              <KakaoMapLoader address={total_address ?? ''} />

              <div className="grid w-full grid-cols-2 items-start gap-6">
                {centerDatas?.map((a, index) => (
                  <div
                    key={a?.title ?? index}
                    className="flex flex-col gap-1"
                  >
                    <span className="text-sm font-medium text-neutral-400">
                      {a?.title}
                    </span>
                    <span className="font-medium">{a?.data}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
