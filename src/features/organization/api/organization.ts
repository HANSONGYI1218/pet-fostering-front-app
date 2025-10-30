import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  AnimalStatus,
  FosterState,
} from '@/entities/animal/animal';
import type {
  OrganizationAnimalDetailItem,
  OrganizationAnimalListItem,
} from '@/entities/animal/animal-api';
import type { FosterApplicant } from '@/entities/foster-apply/foster-apply-api';
import { resolveEndpoint } from '@/shared/api/config';
import { toDate } from '@/shared/lib/utils';
import type { FosterRecord } from '@/entities/foster-record/foster-record';
import { logError } from '@/shared/lib/logging';

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
  status?: keyof typeof AnimalStatus | null;
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

type OrganizationAnimalDetailDto = OrganizationAnimalDto & {
  introduction?: string | null;
  remark?: string | null;
  imageUrls?: string[] | null;
  emergencyReason?: string | null;
  currentFosterStartDate?: string | null;
  currentFosterEndDate?: string | null;
  specialNoteTags?: Array<keyof typeof AnimalSpecialNote>;
  organization?: {
    id: string;
    name: string;
    phoneNumber?: string | null;
    address?: string | null;
    addressDetail?: string | null;
    donationBankName?: string | null;
    donationAccountNumber?: string | null;
    donationAccountHolder?: string | null;
  } | null;
  fosterRecords?: Array<{
    id: string;
    content?: string | null;
    healthNote?: string | null;
    createdAt: string;
    updatedAt: string;
    images?: string[] | null;
  }>;
};

const mapApplicant = (dto: OrganizationApplicantDto): FosterApplicant => ({
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
): OrganizationAnimalListItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type ? AnimalType[dto.type] : AnimalType.DOG,
  size: dto.size ? AnimalSize[dto.size] : AnimalSize.SMALL,
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : new Date(),
  gender: dto.gender ? AnimalGender[dto.gender] : AnimalGender.MALE,
  animalStatus: dto.status ? AnimalStatus[dto.status] : AnimalStatus.WAITING,
  image: dto.imageUrl ?? '/images/animal-placeholder.png',
  applicants: dto.applicants?.map(mapApplicant) ?? [],
  animal_healths:
    dto.healthTags?.map((tag) => AnimalHealth[tag] ?? AnimalHealth.NEUTERED) ??
    [],
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
  OrganizationAnimalListItem[]
> => {
  try {
    const response = await fetch(resolveEndpoint('/organization/animals'), {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`조직 동물 목록 요청 실패: ${response.status}`);
    }

    const payload =
      (await response.json()) as OrganizationAnimalListResponseDto;

    return payload.items.map(mapOrganizationAnimal);
  } catch (error) {
    logError('조직 동물 목록을 불러오지 못했습니다.', error);
    throw error;
  }
};

const mapDetailStatusToFosterState = (
  status?: keyof typeof AnimalStatus | null,
): FosterState => {
  if (status === 'COMPLETED') {
    return FosterState.FOSTERED;
  }
  return FosterState.IN_PROGRESS;
};

const mapOrganizationRecord = (
  dto: NonNullable<OrganizationAnimalDetailDto['fosterRecords']>[number],
): FosterRecord => ({
  id: dto.id,
  images: dto.images?.slice() ?? [],
  content: dto.content ?? '',
  health_note: dto.healthNote ?? '',
  created_at: toDate(dto.createdAt),
  updated_at: toDate(dto.updatedAt),
});

const mapOrganizationDetail = (
  dto: OrganizationAnimalDetailDto,
): OrganizationAnimalDetailItem => ({
  id: dto.id,
  name: dto.name,
  animalStatus: mapDetailStatusToFosterState(dto.status),
  type: dto.type ? AnimalType[dto.type] : AnimalType.DOG,
  size: dto.size ? AnimalSize[dto.size] : AnimalSize.SMALL,
  breed: dto.breed ?? '',
  birth_date: dto.birthDate ? toDate(dto.birthDate) : new Date(),
  gender: dto.gender ? AnimalGender[dto.gender] : AnimalGender.MALE,
  images:
    dto.imageUrls && dto.imageUrls.length > 0
      ? dto.imageUrls
      : ['/images/animal-placeholder.png'],
  introduction: dto.introduction ?? '',
  remark: dto.remark ?? '',
  isBookmarked: false,
  current_foster_start_date: dto.currentFosterStartDate
    ? toDate(dto.currentFosterStartDate)
    : new Date(),
  current_foster_end_date: dto.currentFosterEndDate
    ? toDate(dto.currentFosterEndDate)
    : new Date(),
  foster_records: dto.fosterRecords?.map(mapOrganizationRecord) ?? [],
  animal_healths:
    dto.healthTags?.map((tag) => AnimalHealth[tag] ?? AnimalHealth.NEUTERED) ??
    [],
  animal_personalitys:
    dto.personalityTags?.map(
      (tag) => AnimalPersonality[tag] ?? AnimalPersonality.QUIET,
    ) ?? [],
  foster_environments:
    dto.environmentTags?.map(
      (tag) => AnimalEnvironment[tag] ?? AnimalEnvironment.QUIET_ENVIRONMENT,
    ) ?? [],
  special_notes_animals:
    dto.specialNoteTags?.map(
      (tag) => AnimalSpecialNote[tag] ?? AnimalSpecialNote.SEPARATION_ANXIETY,
    ) ?? [],
  isEmergency: Boolean(dto.isEmergency),
  emergency_reason: dto.emergencyReason ?? '',
  organization: {
    id: dto.organization?.id ?? '',
    name: dto.organization?.name ?? '',
    address: dto.organization?.address ?? '',
    address_detail: dto.organization?.addressDetail ?? '',
    phone_number: dto.organization?.phoneNumber ?? '',
    donation_bank_name: dto.organization?.donationBankName ?? '',
    donation_account_number: dto.organization?.donationAccountNumber ?? '',
    donation_account_holder: dto.organization?.donationAccountHolder ?? '',
  },
});

export const fetchOrganizationAnimalDetail = async (
  id: string,
): Promise<OrganizationAnimalDetailItem> => {
  const response = await fetch(resolveEndpoint(`/organization/animals/${id}`), {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const error = new Error(
      `조직 동물 상세 요청 실패: ${response.status}`,
    ) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const payload = (await response.json()) as OrganizationAnimalDetailDto;

  return mapOrganizationDetail(payload);
};
