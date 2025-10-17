import type { FosterFilterValue } from '@/domain/foster-list/filters';
import type { OgrainzationAnimalListItem } from '@/types/animal/animal-api';
import { AnimalGender, AnimalSize, AnimalType, FosterState } from '@/types/animal/animal';
import { normalizeKeyword } from '@/lib/utils';

export type OrganizationAnimalFilters = {
  emergencyOnly?: boolean;
  type?: FosterFilterValue<AnimalType>;
  size?: FosterFilterValue<AnimalSize>;
  gender?: FosterFilterValue<AnimalGender>;
  status?: FosterFilterValue<FosterState>;
  keyword?: string;
};

const STATUS_PRIORITY: Record<FosterState, number> = {
  [FosterState.IN_PROGRESS]: 0,
  [FosterState.FOSTERED]: 1,
  [FosterState.ADOPTED]: 2,
};

const isAll = <T>(value?: FosterFilterValue<T>): value is 'ALL' | undefined =>
  !value || value === 'ALL';

const matchesFilter = <T>(value: T, filter?: FosterFilterValue<T>): boolean =>
  isAll(filter) || value === filter;

const matchesKeyword = (
  animal: OgrainzationAnimalListItem,
  keyword: string,
): boolean => {
  if (!keyword) return true;

  return [animal.name, animal.breed]
    .filter(Boolean)
    .some((candidate) => candidate.toLowerCase().includes(keyword));
};

export const sortOrganizationAnimals = (
  animals: OgrainzationAnimalListItem[],
): OgrainzationAnimalListItem[] =>
  animals.slice().sort((left, right) => {
    const leftPriority = STATUS_PRIORITY[left.animalStatus];
    const rightPriority = STATUS_PRIORITY[right.animalStatus];

    if (leftPriority === rightPriority) {
      return left.name.localeCompare(right.name, 'ko');
    }

    return leftPriority - rightPriority;
  });

export const filterOrganizationAnimals = (
  animals: OgrainzationAnimalListItem[],
  filters: OrganizationAnimalFilters,
): OgrainzationAnimalListItem[] => {
  const {
    emergencyOnly = false,
    type,
    size,
    gender,
    status,
    keyword,
  } = filters;

  const normalizedKeyword = normalizeKeyword(keyword);

  return animals.filter((animal) => {
    if (emergencyOnly && !animal.isEmergency) {
      return false;
    }

    if (!matchesFilter(animal.type, type)) {
      return false;
    }

    if (!matchesFilter(animal.size, size)) {
      return false;
    }

    if (!matchesFilter(animal.gender, gender)) {
      return false;
    }

    if (!matchesFilter(animal.animalStatus, status)) {
      return false;
    }

    if (!matchesKeyword(animal, normalizedKeyword)) {
      return false;
    }

    return true;
  });
};

export const organizationAnimalStatusPriority = STATUS_PRIORITY;
