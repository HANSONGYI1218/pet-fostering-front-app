import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { AnimalGender, AnimalType } from '@/entities/animal/animal';

vi.mock('@/shared/api/config', () => ({
  resolveEndpoint: (path: string) => `https://example.com${path}`,
}));

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('fetchAnimalLists', () => {
  it('요청에 limit 파라미터를 포함한다', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const { fetchAnimalLists } = await import('../animal');

    await fetchAnimalLists({ limit: 5 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/public/foster/animals?limit=5',
      { cache: 'no-store' },
    );
  });

  it('응답을 AnimalListItem으로 매핑한다', async () => {
    const euthanasiaDate = '2025-12-24T00:00:00.000Z';

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 'animal-1',
          name: 'Buddy',
          type: 'DOG',
          gender: 'MALE',
          breed: 'Jindo',
          birthDate: '2024-01-01T00:00:00.000Z',
          image: '/images/animal-placeholder.png',
          euthanasia_date: euthanasiaDate,
          isEmergency: true,
        },
      ],
    } as Response);

    const { fetchAnimalLists } = await import('../animal');

    const animals = await fetchAnimalLists({ limit: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/public/foster/animals?limit=10',
      { cache: 'no-store' },
    );
    expect(animals).toHaveLength(1);
    expect(animals[0]).toMatchObject({
      id: 'animal-1',
      type: AnimalType.DOG,
      gender: AnimalGender.MALE,
      isEmergency: true,
    });
    expect(animals[0].birth_date).toBeInstanceOf(Date);
    expect(animals[0].euthanasia_date).toBeInstanceOf(Date);
    expect(animals[0].euthanasia_date?.toISOString()).toBe(euthanasiaDate);
  });
});
