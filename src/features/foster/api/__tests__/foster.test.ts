import { vi } from 'vitest';

import {
  AnimalEnvironment,
  AnimalHealth,
} from '@/entities/animal-condition/animal-condition';
import {
  AnimalGender,
  AnimalSize,
  AnimalStatus,
  AnimalType,
} from '@/entities/animal/animal';
import type { AnimalUpsertPayload } from '@/entities/animal/animal-api';

import {
  fallbackFosterDetails,
  fallbackFosterList,
} from '@/test/fixtures/foster';
import {
  fetchFosterAnimalDetail,
  fetchFosterAnimals,
  createAnimal,
  updateAnimal,
  mapFosterDetail,
  mapFosterListItem,
} from '../foster';

vi.mock('@/shared/api/config', () => ({
  resolveEndpoint: (path: string) => `https://example.com${path}`,
}));

vi.mock('@/features/foster/api/redirect', () => ({
  fosterAnimalListRevalid: vi.fn(),
}));

vi.mock('@/features/record/api/redirect', () => ({
  fosterAnimalDetailPageRevalid: vi.fn(),
}));

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('foster api mappers', () => {
  it('maps list items with defaults', () => {
    const result = mapFosterListItem({
      id: 'a-1',
      name: 'Buddy',
      status: 'WAITING',
      shared: false,
      type: 'DOG',
      size: 'SMALL',
      gender: 'MALE',
      breed: 'Jindo',
      birthDate: '2024-01-01T00:00:00.000Z',
      mainImageUrl: null,
      isEmergency: true,
      euthanasiaDate: '2025-10-21T00:00:00.000Z',
      isFosterCondition: false,
      emergencyReason: 'urgent',
      organization: {
        id: 'org-1',
        name: 'Org',
        address: 'Seoul',
        addressDetail: null,
        phoneNumber: '010-0000-0000',
        donationBankName: null,
        donationAccountNumber: null,
        donationAccountHolder: null,
      },
      healthTags: ['NEUTERED'],
      personalityTags: ['QUIET'],
      environmentTags: ['QUIET_ENVIRONMENT'],
      fosterDays: 10,
    });

    expect(result).toMatchObject({
      id: 'a-1',
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      gender: AnimalGender.MALE,
      image: '/images/animal-placeholder.png',
      animal_healths: [AnimalHealth.NEUTERED],
      euthanasia_date: new Date('2025-10-21T00:00:00.000Z'),
      animal_environments: [AnimalEnvironment.QUIET_ENVIRONMENT],
      organization: {
        id: 'org-1',
        address: 'Seoul',
      },
    });
  });

  it('maps detail with fallbacks', () => {
    const result = mapFosterDetail({
      id: 'a-1',
      name: 'Buddy',
      status: 'WAITING',
      shared: false,
      type: null,
      size: null,
      gender: null,
      breed: null,
      birthDate: null,
      mainImageUrl: null,
      isEmergency: false,
      isFosterCondition: false,
      emergencyReason: null,
      organization: null,
      euthanasiaDate: '2025-10-21T00:00:00.000Z',
      healthTags: [],
      personalityTags: [],
      environmentTags: [],
      introduction: null,
      remark: null,
      images: [],
      specialNoteTags: [],
      currentFosterStartDate: null,
      currentFosterEndDate: null,
    });

    expect(result).toMatchObject({
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      gender: AnimalGender.MALE,
      images: ['/images/animal-placeholder.png'],
      organization: {
        id: '',
        name: '',
      },
      emergency_reason: '',
      isFosterCondition: false,
    });
    expect(result.current_foster_start_date).toBeNull();
    expect(result.birth_date).toBeNull();
  });

  it('prepares fallback detail map for 목록 폴백과 연동된다', () => {
    const target = fallbackFosterList[0];

    expect(target).toBeDefined();
    expect(fallbackFosterDetails[target.id]).toBeDefined();
  });

  it('fetchFosterAnimals가 API 응답을 매핑한다', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'a-1',
              name: 'Buddy',
              status: 'WAITING',
              shared: false,
              type: 'DOG',
              size: 'SMALL',
              gender: 'MALE',
              breed: 'Jindo',
              birthDate: '2024-01-01T00:00:00.000Z',
              mainImageUrl: null,
              isEmergency: false,
              isFosterCondition: false,
              organization: null,
              healthTags: [],
              personalityTags: [],
              environmentTags: [],
              fosterDays: 10,
            },
          ],
        }),
      }) as Response,
    );

    const animals = await fetchFosterAnimals();

    expect(animals).toHaveLength(1);
    expect(animals[0].id).toBe('a-1');
  });

  it('fetchFosterAnimals가 실패 시 예외를 전달한다', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: false,
        status: 500,
      }) as Response,
    );

    await expect(fetchFosterAnimals()).rejects.toThrow(
      '임보 동물 목록 요청 실패: 500',
    );
  });

  it('fetchFosterAnimalDetail이 실패하면 예외를 전달한다', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: false,
        status: 404,
      }) as Response,
    );

    await expect(fetchFosterAnimalDetail('unknown')).rejects.toThrow(
      '임보 동물 상세 요청 실패: 404',
    );
  });

  it('createAnimal이 camelCase DTO로 요청한다', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
      }) as Response,
    );

    const payload: AnimalUpsertPayload = {
      name: '돌돌이',
      type: AnimalType.DOG,
      birthDate: new Date('2024-02-01T00:00:00.000Z'),
      currentFosterStartDate: new Date('2024-02-10T00:00:00.000Z'),
      status: AnimalStatus.IN_PROGRESS,
    };

    await createAnimal('token-1', payload);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/foster/animals',
      expect.any(Object),
    );

    const [, init] = fetchMock.mock.calls.at(-1)!;
    expect(init).toMatchObject({
      method: 'POST',
    });
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toStrictEqual({
      name: '돌돌이',
      type: AnimalType.DOG,
      birthDate: '2024-02-01T00:00:00.000Z',
      currentFosterStartDate: '2024-02-10T00:00:00.000Z',
      status: AnimalStatus.IN_PROGRESS,
    });
  });

  it('updateAnimal이 camelCase DTO로 요청한다', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
      }) as Response,
    );

    const payload: AnimalUpsertPayload = {
      name: '초코',
      gender: AnimalGender.FEMALE,
      birthDate: new Date('2023-01-01T00:00:00.000Z'),
    };

    await updateAnimal('token-2', 'animal-2', payload);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/foster/animals/animal-2',
      expect.any(Object),
    );

    const [, init] = fetchMock.mock.calls.at(-1)!;
    expect(init).toMatchObject({
      method: 'PATCH',
    });

    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toStrictEqual({
      name: '초코',
      gender: AnimalGender.FEMALE,
      birthDate: '2023-01-01T00:00:00.000Z',
    });
  });
});
