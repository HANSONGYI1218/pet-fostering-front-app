import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import { AnimalGender, AnimalSize, AnimalType } from '@/entities/animal/animal';
import type {
  FosterAnimalDetailItem,
  FosterListAnimalItem,
} from '@/entities/animal/animal-api';
import { toDate } from '@/shared/lib/utils';

import { resolveEndpoint } from '@/shared/api/config';
import { logError } from '@/shared/lib/logging';

type PublicFosterOrganizationDto = {
  id: string;
  name: string;
  address?: string | null;
  addressDetail?: string | null;
  phoneNumber?: string | null;
  donationBankName?: string | null;
  donationAccountNumber?: string | null;
  donationAccountHolder?: string | null;
};

type PublicFosterAnimalBaseDto = {
  id: string;
  name: string;
  type?: keyof typeof AnimalType | null;
  size?: keyof typeof AnimalSize | null;
  gender?: keyof typeof AnimalGender | null;
  breed?: string | null;
  birthDate?: string | null;
  euthanasia_date?: Date | null;
  status: string;
  shared: boolean;
  mainImageUrl?: string | null;
  isEmergency: boolean;
  emergencyReason?: string | null;
  organization: PublicFosterOrganizationDto | null;
  healthTags: Array<keyof typeof AnimalHealth>;
  personalityTags: Array<keyof typeof AnimalPersonality>;
  environmentTags: Array<keyof typeof AnimalEnvironment>;
};

type PublicFosterAnimalListItemDto = PublicFosterAnimalBaseDto & {
  fosterDays: number;
};

type PublicFosterAnimalDetailDto = PublicFosterAnimalBaseDto & {
  introduction?: string | null;
  remark?: string | null;
  isFosterCondition?: boolean | null;
  images: string[];
  specialNoteTags: Array<keyof typeof AnimalSpecialNote>;
  currentFosterStartDate?: string | null;
  currentFosterEndDate?: string | null;
};

type PublicFosterAnimalListResponseDto = {
  items: PublicFosterAnimalListItemDto[];
};

const mapOrganization = (
  dto: PublicFosterOrganizationDto | null,
): FosterListAnimalItem['organization'] | null => {
  if (!dto) return null;

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address ?? '',
    address_detail: dto.addressDetail ?? '',
    phone_number: dto.phoneNumber ?? '',
  };
};

const mapListItem = (
  dto: PublicFosterAnimalListItemDto,
): FosterListAnimalItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type ? AnimalType[dto.type] : AnimalType.DOG,
  size: dto.size ? AnimalSize[dto.size] : AnimalSize.SMALL,
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : null,
  gender: dto.gender ? AnimalGender[dto.gender] : AnimalGender.MALE,
  image: dto.mainImageUrl ?? '/images/animal-placeholder.png',
  isBookmarked: false,
  euthanasia_date: dto.euthanasia_date ? toDate(dto.euthanasia_date) : null,
  animal_healths: dto.healthTags.map(
    (value) => AnimalHealth[value] ?? AnimalHealth.NEUTERED,
  ),
  animal_personalitys: dto.personalityTags.map(
    (value) => AnimalPersonality[value] ?? AnimalPersonality.QUIET,
  ),
  animal_environments: dto.environmentTags.map(
    (value) => AnimalEnvironment[value] ?? AnimalEnvironment.QUIET_ENVIRONMENT,
  ),
  isEmergency: dto.isEmergency,
  organization: mapOrganization(dto.organization) ?? {
    id: '',
    name: '',
    address: '',
    address_detail: '',
    phone_number: '',
  },
});

const mapDetail = (
  dto: PublicFosterAnimalDetailDto,
): FosterAnimalDetailItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type ? AnimalType[dto.type] : AnimalType.DOG,
  size: dto.size ? AnimalSize[dto.size] : AnimalSize.SMALL,
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : null,
  gender: dto.gender ? AnimalGender[dto.gender] : AnimalGender.MALE,
  images:
    dto.images.length > 0 ? dto.images : ['/images/animal-placeholder.png'],
  introduction: dto.introduction ?? '',
  euthanasia_date: dto.euthanasia_date ? toDate(dto.euthanasia_date) : null,
  remark: dto.remark ?? '',
  isBookmarked: false,
  isFosterCondition: dto.isFosterCondition ?? false,
  current_foster_start_date: dto.currentFosterStartDate
    ? toDate(dto.currentFosterStartDate)
    : null,
  current_foster_end_date: dto.currentFosterEndDate
    ? toDate(dto.currentFosterEndDate)
    : null,
  animal_healths: dto.healthTags.map(
    (value) => AnimalHealth[value] ?? AnimalHealth.NEUTERED,
  ),
  animal_personalitys: dto.personalityTags.map(
    (value) => AnimalPersonality[value] ?? AnimalPersonality.QUIET,
  ),
  animal_environments: dto.environmentTags.map(
    (value) => AnimalEnvironment[value] ?? AnimalEnvironment.QUIET_ENVIRONMENT,
  ),
  special_notes_animals: dto.specialNoteTags.map(
    (value) => AnimalSpecialNote[value] ?? AnimalSpecialNote.SEPARATION_ANXIETY,
  ),
  isEmergency: dto.isEmergency,
  organization: dto.organization
    ? {
        id: dto.organization.id,
        name: dto.organization.name,
        address: dto.organization.address ?? '',
        address_detail: dto.organization.addressDetail ?? '',
        phone_number: dto.organization.phoneNumber ?? '',
        donation_bank_name: dto.organization.donationBankName ?? '',
        donation_account_number: dto.organization.donationAccountNumber ?? '',
        donation_account_holder: dto.organization.donationAccountHolder ?? '',
      }
    : {
        id: '',
        name: '',
        address: '',
        address_detail: '',
        phone_number: '',
        donation_bank_name: '',
        donation_account_number: '',
        donation_account_holder: '',
      },
  emergency_reason: dto.emergencyReason ?? '',
});

export const fetchFosterAnimals = async (): Promise<FosterListAnimalItem[]> => {
  try {
    const endpoint = resolveEndpoint('/public/foster/animals');
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`임보 동물 목록 요청 실패: ${response.status}`);
    }

    const result: PublicFosterAnimalListResponseDto = await response.json();

    return result.items.map(mapListItem);
  } catch (error) {
    logError('임보 동물 목록을 불러오지 못했습니다.', error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      '임보 동물 목록을 불러오는 중 알 수 없는 오류가 발생했습니다.',
    );
  }
};

export const fetchFosterAnimalDetail = async (
  id: string,
): Promise<FosterAnimalDetailItem> => {
  try {
    const endpoint = resolveEndpoint(`/public/foster/animals/${id}`);
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`임보 동물 상세 요청 실패: ${response.status}`);
    }

    const result: PublicFosterAnimalDetailDto = await response.json();

    return mapDetail(result);
  } catch (error) {
    logError(`임보 동물 상세(${id})를 불러오지 못했습니다.`, error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      '임보 동물 상세를 불러오는 중 알 수 없는 오류가 발생했습니다.',
    );
  }
};

export { mapListItem as mapFosterListItem, mapDetail as mapFosterDetail };
