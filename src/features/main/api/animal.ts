import { AnimalListItem } from '@/entities/animal/animal-api';
import { AnimalGender, AnimalType } from '@/entities/animal/animal';
import { toDate } from '@/shared/lib/utils';
import { resolveEndpoint } from '@/shared/api/config';
import { logError } from '@/shared/lib/logging';

type AnimalListDto = {
  id: string;
  name: string;
  type?: keyof typeof AnimalType | null;
  gender?: keyof typeof AnimalGender | null;
  breed?: string | null;
  birthDate?: string | null;
  image: string;
  euthanasia_date?: Date | null;
  isEmergency: boolean;
};

const mapListItem = (dto: AnimalListDto): AnimalListItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type ? AnimalType[dto.type] : AnimalType.DOG,
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : null,
  gender: dto.gender ? AnimalGender[dto.gender] : AnimalGender.MALE,
  image: dto.image ?? '/images/animal-placeholder.png',
  euthanasia_date: new Date('2025-10-21'),
  isEmergency: dto.isEmergency,
});

export const fetchAnimalLists = async ({
  limit,
}: {
  limit: number;
}): Promise<AnimalListItem[]> => {
  try {
    const endpoint = resolveEndpoint('/public/foster/animals');
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`보호동물 목록 요청 실패: ${response.status}`);
    }

    const result: AnimalListDto[] = await response.json();

    return result.map(mapListItem);
  } catch (error) {
    logError('보호동물 목록을 불러오지 못했습니다.', error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      '보호동물 목록을 불러오는 중 알 수 없는 오류가 발생했습니다.',
    );
  }
};
