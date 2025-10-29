import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchOrganizationAnimalDetail } from '@/features/organization/api/organization';
import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import { AnimalGender, AnimalSize, AnimalType } from '@/entities/animal/animal';

const originalFetch = globalThis.fetch;

describe('fetchOrganizationAnimalDetail', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('조직 동물 상세 DTO를 도메인 모델로 변환한다', async () => {
    const dto = {
      id: 'animal-1',
      name: '퍼디즈',
      type: 'DOG',
      size: 'SMALL',
      breed: '믹스',
      birthDate: '2024-05-01T00:00:00Z',
      gender: 'FEMALE',
      introduction: '소개',
      remark: '비고',
      imageUrls: ['/image.jpg'],
      currentFosterStartDate: '2024-06-01T00:00:00Z',
      currentFosterEndDate: '2024-07-01T00:00:00Z',
      healthTags: ['VACCINATED'],
      personalityTags: ['QUIET'],
      environmentTags: ['QUIET_ENVIRONMENT'],
      specialNoteTags: ['SEPARATION_ANXIETY'],
      emergencyReason: '긴급',
      fosterRecords: [
        {
          id: 'record-1',
          content: '기록',
          healthNote: '메모',
          createdAt: '2024-06-10T00:00:00Z',
          updatedAt: '2024-06-11T00:00:00Z',
          images: ['/record.png'],
        },
      ],
      organization: {
        id: 'org-1',
        name: '퍼디즈 보호소',
        phoneNumber: '010-0000-0000',
        address: '서울시',
        addressDetail: '강남구',
        donationBankName: '은행',
        donationAccountNumber: '123-456',
        donationAccountHolder: '퍼디즈',
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(dto),
    } as Response);

    const result = await fetchOrganizationAnimalDetail('animal-1');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'animal-1',
        name: '퍼디즈',
        type: AnimalType.DOG,
        size: AnimalSize.SMALL,
        breed: '믹스',
        gender: AnimalGender.FEMALE,
        introduction: '소개',
        remark: '비고',
        animal_healths: [AnimalHealth.VACCINATED],
        animal_personalitys: [AnimalPersonality.QUIET],
        foster_environments: [AnimalEnvironment.QUIET_ENVIRONMENT],
        special_notes_animals: [AnimalSpecialNote.SEPARATION_ANXIETY],
        emergency_reason: '긴급',
        foster_records: [
          expect.objectContaining({
            id: 'record-1',
            content: '기록',
            health_note: '메모',
          }),
        ],
        organization: expect.objectContaining({
          id: 'org-1',
          name: '퍼디즈 보호소',
        }),
      }),
    );
  });

  it('요청 실패 시 상태 코드를 포함한 에러를 던진다', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(
      fetchOrganizationAnimalDetail('missing'),
    ).rejects.toMatchObject({
      status: 404,
    });
  });
});
