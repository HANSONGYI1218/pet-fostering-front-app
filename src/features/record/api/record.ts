import {
  AnimalGender,
  AnimalSize,
  AnimalStatus,
  AnimalType,
} from '@/entities/animal/animal';
import type { FosterRecordAnimalItem } from '@/entities/animal/animal-api';
import type {
  FosterMatchInfo,
  FosterRecord,
  RecordUpsertPayload,
} from '@/entities/foster-record/foster-record-api';
import { resolveEndpoint } from '@/shared/api/config';
import { fetchJson } from '@/shared/api/http';
import { logError } from '@/shared/lib/logging';
import { toDate } from '@/shared/lib/utils';
import { fosterAnimalDetailPageRevalid } from './redirect';

import type { components } from '@/shared/api/generated/pet-schema';

type PublicRecordAnimalDto = components['schemas']['PublicRecordAnimalDto'];
type PublicRecordListResponseDto =
  components['schemas']['PublicRecordListResponseDto'];
type PublicRecordDetailDto = components['schemas']['PublicRecordDetailDto'];

const coerceAnimalType = (value: PublicRecordAnimalDto['type']): AnimalType => {
  if (!value) return AnimalType.DOG;
  return AnimalType[value as keyof typeof AnimalType] ?? AnimalType.DOG;
};

const coerceAnimalGender = (
  value: PublicRecordAnimalDto['gender'],
): AnimalGender => {
  if (!value) return AnimalGender.MALE;
  return AnimalGender[value as keyof typeof AnimalGender] ?? AnimalGender.MALE;
};

const coerceAnimalStatus = (
  value: PublicRecordAnimalDto['state'] | null | undefined,
): AnimalStatus => {
  if (!value) {
    return AnimalStatus.WAITING;
  }
  return (
    AnimalStatus[value as keyof typeof AnimalStatus] ?? AnimalStatus.WAITING
  );
};

const coerceAnimalInfoSize = (value: unknown): AnimalSize => {
  if (typeof value !== 'string') {
    return AnimalSize.SMALL;
  }

  return AnimalSize[value as keyof typeof AnimalSize] ?? AnimalSize.SMALL;
};

const mapRecordAnimal = (
  dto: PublicRecordAnimalDto,
): FosterRecordAnimalItem => ({
  id: dto.id,
  name: dto.name,
  type: coerceAnimalType(dto.type ?? null),
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : null,
  gender: coerceAnimalGender(dto.gender ?? null),
  images: dto.images,
  foster_duration: dto.fosterDuration,
  state: coerceAnimalStatus(dto.state),
});

const mapRecordDetail = (
  dto: PublicRecordDetailDto,
): {
  info: FosterMatchInfo;
  records: FosterRecord[];
} => {
  const organization = dto?.info?.organization ?? null;
  const animal = dto?.info?.animal ?? null;
  const animalSize = coerceAnimalInfoSize(
    (animal as { size?: string | null | undefined })?.size ?? null,
  );
  const mappedInfo: FosterMatchInfo = {
    id: dto?.info?.id ?? undefined,
    state: dto?.info?.state
      ? AnimalStatus[dto.info.state as keyof typeof AnimalStatus]
      : AnimalStatus.WAITING,
    organization: {
      id: organization?.id ?? '',
      name: organization?.name ?? '',
      phone_number: organization?.phoneNumber ?? '',
      zipcode: organization?.zipcode ?? '',
      address_detail: organization?.addressDetail ?? '',
      address: organization?.address ?? '',
      email: organization?.email ?? '',
    },
    animal: {
      name: animal?.name ?? undefined,
      size: animalSize,
      type: animal?.type
        ? AnimalType[animal.type as keyof typeof AnimalType]
        : AnimalType.DOG,
      introduction: animal?.introduction ?? '',
      breed: animal?.breed ?? '',
      birth_date: animal?.birthDate ? toDate(animal.birthDate) : null,
      gender: animal?.gender
        ? AnimalGender[animal.gender as keyof typeof AnimalGender]
        : AnimalGender.MALE,
      remark: animal?.remark ?? '',
      images: animal?.images,
      current_foster_start_date: animal?.currentFosterStartDate
        ? toDate(animal.currentFosterStartDate)
        : null,
      current_foster_end_date: animal?.currentFosterEndDate
        ? toDate(animal.currentFosterEndDate)
        : null,
    },
    created_at: dto?.info?.createdAt ? toDate(dto.info.createdAt) : new Date(),
  };

  const mappedRecords: FosterRecord[] = dto?.records?.map((record) => ({
    id: record?.id ?? undefined,
    images: record?.images ?? [],
    content: record?.content ?? '',
    health_note: record?.healthNote ?? '',
    created_at: toDate(record?.createdAt),
    updated_at: toDate(record?.updatedAt),
  }));

  return { info: mappedInfo, records: mappedRecords };
};

export const fetchRecordAnimals = async (
  token: string | undefined,
): Promise<FosterRecordAnimalItem[]> => {
  try {
    const endpoint = resolveEndpoint(`/public/foster/user/animals`);
    const response = await fetchJson(endpoint, {
      cache: 'no-store',
      token,
      auth: 'required',
      errorMessage: '기록 동물 목록 요청 실패',
    });

    const result: PublicRecordListResponseDto = await response.json();
    return result.items.map(mapRecordAnimal);
  } catch (error) {
    logError('기록 동물 목록을 불러오지 못했습니다.', error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      '기록 동물 목록을 불러오는 중 알 수 없는 오류가 발생했습니다.',
    );
  }
};

export const fetchRecordDetail = async (
  id: string,
): Promise<{ info: FosterMatchInfo; records: FosterRecord[] }> => {
  try {
    const endpoint = resolveEndpoint(`/public/foster/records/animals/${id}`);
    const response = await fetchJson(endpoint, {
      cache: 'no-store',
      auth: 'none',
      errorMessage: '기록 상세 요청 실패',
    });

    const result: PublicRecordDetailDto = await response.json();
    console.log('fetchRecordDetail result', result);

    return mapRecordDetail(result);
  } catch (error) {
    logError(`기록 상세(${id})를 불러오지 못했습니다.`, error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('기록 상세를 불러오는 중 알 수 없는 오류가 발생했습니다.');
  }
};

export const createRecord = async (
  token: string | undefined,
  id: string,
  payload: RecordUpsertPayload,
) => {
  await fetchJson(resolveEndpoint(`/foster/animals/${id}/records`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    token,
    auth: 'required',
    errorMessage: '보호동물 돌봄기록 생성 요청 실패',
  });
  fosterAnimalDetailPageRevalid({ animalId: id });
};

export const updateRecord = async (
  token: string | undefined,
  id: string,
  recordId: string,
  payload: RecordUpsertPayload,
) => {
  await fetchJson(
    resolveEndpoint(`/foster/animals/${id}/records/${recordId}`),
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      token,
      auth: 'required',
      errorMessage: '보호동물 돌봄기록 업데이트 요청 실패',
    },
  );

  fosterAnimalDetailPageRevalid({ animalId: id });
};
