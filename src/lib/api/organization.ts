import { AnimalEnvironment, AnimalHealth, AnimalPersonality } from '@/types/animal-condition/animal-condition';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  FosterState,
} from '@/types/animal/animal';
import type { OgrainzationAnimalListItem } from '@/types/animal/animal-api';
import { dummyOgrainzationAnimals } from '@/lib/dummydata';
import type { FosterApplicent } from '@/types/foster-apply/foster-apply-api';
import { resolveEndpoint } from './config';
import { toDate } from '@/lib/utils';
import { logFallbackWarning } from './logging';

type OrganizationApplicantDto = {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  addressDetail?: string | null;
  introduction?: string | null;
};

type OrganizationAnimalDto = {
  id: string;
  name: string;
  type?: keyof typeof AnimalType | null;
  size?: keyof typeof AnimalSize | null;
  breed?: string | null;
  birthDate?: string | null;
  gender?: keyof typeof AnimalGender | null;
  status?: keyof typeof FosterState | null;
  imageUrl?: string | null;
  isEmergency?: boolean | null;
  applicants?: OrganizationApplicantDto[];
  healthTags?: Array<keyof typeof AnimalHealth>;
  personalityTags?: Array<keyof typeof AnimalPersonality>;
  environmentTags?: Array<keyof typeof AnimalEnvironment>;
  fosterApplyNumber?: number | null;
};

type OrganizationAnimalListResponseDto = {
  items: OrganizationAnimalDto[];
};

const mapApplicant = (dto: OrganizationApplicantDto): FosterApplicent => ({
  id: dto.id,
  name: dto.name,
  email: dto.email ?? '',
  phone_number: dto.phoneNumber ?? '',
  address: dto.address ?? '',
  address_detail: dto.addressDetail ?? '',
  introduction: dto.introduction ?? '',
});

export const mapOrganizationAnimal = (
  dto: OrganizationAnimalDto,
): OgrainzationAnimalListItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type ? AnimalType[dto.type] : AnimalType.DOG,
  size: dto.size ? AnimalSize[dto.size] : AnimalSize.SMALL,
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : new Date(),
  gender: dto.gender ? AnimalGender[dto.gender] : AnimalGender.MALE,
  animalStatus: dto.status ? FosterState[dto.status] : FosterState.IN_PROGRESS,
  image: dto.imageUrl ?? '/images/animal-placeholder.png',
  applicants: dto.applicants?.map(mapApplicant) ?? [],
  animal_healths:
    dto.healthTags?.map(
      (tag) => AnimalHealth[tag] ?? AnimalHealth.NEUTERED,
    ) ?? [],
  animal_personalitys:
    dto.personalityTags?.map(
      (tag) => AnimalPersonality[tag] ?? AnimalPersonality.QUIET,
    ) ?? [],
  foster_environments:
    dto.environmentTags?.map(
      (tag) => AnimalEnvironment[tag] ?? AnimalEnvironment.QUIET_ENVIRONMENT,
    ) ?? [],
  isEmergency: Boolean(dto.isEmergency),
  foster_apply_number: dto.fosterApplyNumber ?? 0,
});

export const fetchOrganizationAnimals = async (): Promise<
  OgrainzationAnimalListItem[]
> => {
  try {
    const response = await fetch(resolveEndpoint('/organization/animals'), {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`조직 동물 목록 요청 실패: ${response.status}`);
    }

    const payload = (await response.json()) as OrganizationAnimalListResponseDto;

    return payload.items.map(mapOrganizationAnimal);
  } catch (error) {
    logFallbackWarning(
      '조직 동물 목록을 불러오지 못해 더미 데이터를 사용합니다.',
      error,
    );
    return dummyOgrainzationAnimals;
  }
};
