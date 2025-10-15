import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/types/animal-condition/animal-condition';
import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';
import type {
  FosterAnimalDetailItem,
  FosterListAnimalItem,
} from '@/types/animal/animal-api';

const now = new Date();

const buildListItem = (
  overrides: Partial<FosterListAnimalItem>,
): FosterListAnimalItem => ({
  id: 'foster-dummy',
  name: '퍼디',
  type: AnimalType.DOG,
  size: AnimalSize.MEDIUM,
  breed: '믹스',
  birth_date: now,
  gender: AnimalGender.FEMALE,
  image: '/images/animal01.jpg',
  isBookmarked: false,
  animal_healths: [AnimalHealth.VACCINATED, AnimalHealth.NEUTERED],
  animal_personalitys: [AnimalPersonality.GOOD_WITH_OTHER_ANIMAL],
  animal_environments: [AnimalEnvironment.QUIET_ENVIRONMENT],
  isEmergency: true,
  organization: {
    id: 'org-dummy',
    name: '퍼디 보호소',
    address: '서울시 강남구',
    address_detail: '00길 12-1',
    phone_number: '010-0000-0000',
  },
  ...overrides,
});

export const fallbackFosterList: FosterListAnimalItem[] = [
  buildListItem({
    id: 'dummy-1',
    name: '라떼',
    type: AnimalType.DOG,
    size: AnimalSize.SMALL,
  }),
  buildListItem({
    id: 'dummy-2',
    name: '나비',
    type: AnimalType.CAT,
    size: AnimalSize.MEDIUM,
    gender: AnimalGender.FEMALE,
  }),
  buildListItem({
    id: 'dummy-3',
    name: '몽실',
    type: AnimalType.DOG,
    size: AnimalSize.LARGE,
    gender: AnimalGender.MALE,
    isEmergency: false,
  }),
];

const buildDetail = (item: FosterListAnimalItem): FosterAnimalDetailItem => ({
  id: item.id,
  name: item.name,
  type: item.type,
  size: item.size,
  breed: item.breed,
  birth_date: item.birth_date,
  gender: item.gender,
  images: [item.image],
  introduction: '임시보호자를 기다리고 있는 친구입니다.',
  remark: '사람을 좋아하고 산책을 즐깁니다.',
  euthanasia_date: new Date('2025-10-21'),
  isBookmarked: false,
  current_foster_start_date: now,
  current_foster_end_date: now,
  animal_healths: item.animal_healths,
  animal_personalitys: item.animal_personalitys,
  animal_environments: item.animal_environments,
  special_notes_animals: [AnimalSpecialNote.SEPARATION_ANXIETY],
  isEmergency: item.isEmergency,
  emergency_reason: item.isEmergency ? '긴급 임보 필요' : '',
  organization: {
    id: item.organization.id,
    name: item.organization.name,
    address: item.organization.address,
    address_detail: item.organization.address_detail,
    phone_number: item.organization.phone_number,
    donation_bank_name: '국민은행',
    donation_account_number: '123456-01-123456',
    donation_account_holder: '퍼디 보호소',
  },
});

export const fallbackFosterDetails: Record<string, FosterAnimalDetailItem> =
  Object.fromEntries(
    fallbackFosterList.map((item) => [item.id, buildDetail(item)]),
  );
