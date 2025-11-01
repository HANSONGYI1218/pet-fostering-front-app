import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fetchOrganizationAnimalDetail,
  fetchOrganizationAnimals,
} from '@/features/organization/api/organization';
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
      applicants: [
        {
          id: 'apply-1',
          name: '김민지',
          email: 'minji@example.com',
          phoneNumber: '010-1234-5678',
          address: '서울특별시 마포구',
          addressDetail: '201호',
          introduction: '산책이 가능한 직장인입니다.',
        },
      ],
      fosterApplyNumber: 1,
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

    expect(result.id).toBe('animal-1');
    expect(result.name).toBe('퍼디즈');
    expect(result.type).toBe(AnimalType.DOG);
    expect(result.size).toBe(AnimalSize.SMALL);
    expect(result.gender).toBe(AnimalGender.FEMALE);
    expect(result.introduction).toBe('소개');
    expect(result.remark).toBe('비고');
    expect(result.animal_healths).toEqual([AnimalHealth.VACCINATED]);
    expect(result.animal_personalitys).toEqual([AnimalPersonality.QUIET]);
    expect(result.foster_environments).toEqual([
      AnimalEnvironment.QUIET_ENVIRONMENT,
    ]);
    expect(result.special_notes_animals).toEqual([
      AnimalSpecialNote.SEPARATION_ANXIETY,
    ]);
    expect(result.emergency_reason).toBe('긴급');
    expect(result.foster_records[0]).toMatchObject({
      id: 'record-1',
      content: '기록',
      health_note: '메모',
    });
    expect(result.organization).toMatchObject({
      id: 'org-1',
      name: '퍼디즈 보호소',
    });
    expect(result.foster_apply_number).toBe(1);
    expect(result.applicants).toEqual([
      expect.objectContaining({
        id: 'apply-1',
        phone_number: '010-1234-5678',
      }),
    ]);
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

describe('fetchOrganizationAnimals', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('조직 동물 목록을 임보 신청자 데이터와 함께 매핑한다', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          items: [
            {
              id: 'animal-1',
              name: '퍼디즈',
              type: 'DOG',
              size: 'SMALL',
              breed: '믹스',
              birthDate: '2024-05-01T00:00:00Z',
              gender: 'FEMALE',
              imageUrl: '/image.jpg',
              status: 'IN_PROGRESS',
              applicants: [
                {
                  id: 'apply-1',
                  name: '김민지',
                  phoneNumber: '010-1234-5678',
                  address: '서울특별시 마포구',
                  addressDetail: '201호',
                  introduction: '산책이 가능한 직장인입니다.',
                },
              ],
              fosterApplyNumber: 1,
            },
          ],
        }),
    } as Response);

    const result = await fetchOrganizationAnimals();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'animal-1',
      foster_apply_number: 1,
      applicants: [
        expect.objectContaining({
          id: 'apply-1',
          phone_number: '010-1234-5678',
        }),
      ],
    });
  });
});
