import {
  type PublicFosterAnimalListItemDto,
  type PublicFosterAnimalListResponseDto,
  mapFosterListItem,
} from '@/features/foster/api/foster';
import type {
  AnimalListItem,
  FosterListAnimalItem,
} from '@/entities/animal/animal-api';
import { resolveEndpoint } from '@/shared/api/config';
import { apiFetch } from '@/shared/api/http';
import { logError } from '@/shared/lib/logging';

const toMainListItem = (item: FosterListAnimalItem): AnimalListItem => ({
  id: item.id,
  name: item.name,
  type: item.type,
  breed: item.breed,
  birth_date: item.birth_date,
  gender: item.gender,
  image: item.image,
  euthanasia_date: item.euthanasia_date,
  isEmergency: item.isEmergency,
});

export const fetchAnimalLists = async ({
  limit,
}: {
  limit: number;
}): Promise<AnimalListItem[]> => {
  try {
    const endpoint = new URL(resolveEndpoint('/public/foster/animals'));

    if (Number.isFinite(limit) && limit > 0) {
      endpoint.searchParams.set('limit', String(limit));
    }

    const response = await apiFetch(endpoint.toString(), {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      auth: 'none',
    });

    if (!response.ok) {
      throw new Error(`보호동물 목록 요청 실패: ${response.status}`);
    }

    const payload =
      ((await response.json()) as
        | PublicFosterAnimalListResponseDto
        | PublicFosterAnimalListItemDto[]) ?? [];

    const items = Array.isArray(payload) ? payload : (payload.items ?? []);
    const fosterItems = items.map((item) => mapFosterListItem(item));

    return fosterItems.map(toMainListItem);
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
