import { resolveEndpoint } from '@/shared/api/config';
import type { FosterRecordAnimalItem } from '@/types/animal/animal-api';
import type {
  FosterMatchInfo,
  FosterRecord,
} from '@/types/foster-record/foster-record-api';
import { AnimalGender, AnimalType, FosterState } from '@/types/animal/animal';
import { toDate } from '@/shared/lib/utils';
import { logError } from '@/shared/lib/logging';

type RecordAnimalDto = {
  id: string;
  name: string;
  type: keyof typeof AnimalType | null;
  breed: string | null;
  birthDate: string | null;
  gender: keyof typeof AnimalGender | null;
  images: string[];
  fosterDuration: number;
  state: keyof typeof FosterState;
  matchId: string;
};

type RecordListResponseDto = {
  items: RecordAnimalDto[];
};

const mapRecordAnimal = (dto: RecordAnimalDto): FosterRecordAnimalItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type ? AnimalType[dto.type] : AnimalType.DOG,
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : null,
  gender: dto.gender ? AnimalGender[dto.gender] : AnimalGender.MALE,
  images: dto.images,
  foster_duration: dto.fosterDuration,
  state: FosterState[dto.state] ?? FosterState.IN_PROGRESS,
  foster_match_id: dto.matchId,
});

type RecordDetailDto = {
  id: string;
  info: {
    id: string;
    state: keyof typeof FosterState;
    createdAt: string;
    organization: {
      id: string;
      name: string;
      phoneNumber: string | null;
      zipcode: string | null;
      address: string | null;
      addressDetail: string | null;
      email: string | null;
    } | null;
    animal: {
      name: string;
      type: keyof typeof AnimalType | null;
      breed: string | null;
      birthDate: string | null;
      gender: keyof typeof AnimalGender | null;
      remark: string | null;
      images: string[];
    };
  };
  records: Array<{
    id: string;
    content: string | null;
    healthNote: string | null;
    createdAt: string;
    updatedAt: string;
    images: string[];
  }>;
};

const mapRecordDetail = (
  dto: RecordDetailDto,
): {
  info: FosterMatchInfo;
  records: FosterRecord[];
} => {
  const organization = dto.info.organization;
  const mappedInfo: FosterMatchInfo = {
    id: dto.info.id,
    state: FosterState[dto.info.state] ?? FosterState.IN_PROGRESS,
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
      name: dto.info.animal.name,
      type: dto.info.animal.type
        ? AnimalType[dto.info.animal.type]
        : AnimalType.DOG,
      breed: dto.info.animal.breed ?? '',
      birth_date: dto.info.animal.birthDate
        ? toDate(dto.info.animal.birthDate)
        : new Date(),
      gender: dto.info.animal.gender
        ? AnimalGender[dto.info.animal.gender]
        : AnimalGender.MALE,
      remark: dto.info.animal.remark ?? '',
      images: dto.info.animal.images,
    },
    created_at: toDate(dto.info.createdAt),
  };

  const mappedRecords: FosterRecord[] = dto.records.map((record) => ({
    id: record.id,
    images: record.images,
    content: record.content ?? '',
    health_note: record.healthNote ?? '',
    created_at: toDate(record.createdAt),
    updated_at: toDate(record.updatedAt),
  }));

  return { info: mappedInfo, records: mappedRecords };
};

export const fetchRecordAnimals = async (): Promise<
  FosterRecordAnimalItem[]
> => {
  try {
    const endpoint = resolveEndpoint('/public/foster/records/animals');
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`기록 동물 목록 요청 실패: ${response.status}`);
    }

    const result: RecordListResponseDto = await response.json();
    return result.items.map(mapRecordAnimal);
  } catch (error) {
    logError('기록 동물 목록을 불러오지 못했습니다.', error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('기록 동물 목록을 불러오는 중 알 수 없는 오류가 발생했습니다.');
  }
};

export const fetchRecordDetail = async (
  id: string,
): Promise<{ info: FosterMatchInfo; records: FosterRecord[] }> => {
  try {
    const endpoint = resolveEndpoint(`/public/foster/records/animals/${id}`);
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`기록 상세 요청 실패: ${response.status}`);
    }

    const result: RecordDetailDto = await response.json();
    return mapRecordDetail(result);
  } catch (error) {
    logError(`기록 상세(${id})를 불러오지 못했습니다.`, error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('기록 상세를 불러오는 중 알 수 없는 오류가 발생했습니다.');
  }
};
