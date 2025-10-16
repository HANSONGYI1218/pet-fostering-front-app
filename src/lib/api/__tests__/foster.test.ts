import {
  AnimalEnvironment,
  AnimalHealth,
} from '@/types/animal-condition/animal-condition';
import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';

import { fallbackFosterDetails, fallbackFosterList } from '../foster.dummy';
import { mapFosterDetail, mapFosterListItem } from '../foster';

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
      euthanasia_date: new Date('2025-10-21'),
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
      euthanasia_date: new Date('2025-10-21'),
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
      euthanasia_date: new Date('2025-10-21'),
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
});
