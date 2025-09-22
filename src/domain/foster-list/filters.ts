import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';
import type { FosterListAnimalItem } from '@/types/animal/animal-api';

export type FosterFilterValue<T> = T | 'ALL';

export type FosterFilterOptions = {
  type?: FosterFilterValue<AnimalType>;
  size?: FosterFilterValue<AnimalSize>;
  gender?: FosterFilterValue<AnimalGender>;
  keyword?: string;
};

const normalizeKeyword = (keyword?: string): string =>
  keyword?.trim().toLowerCase() ?? '';

const matchesFilter = <T>(
  value: T,
  filter: FosterFilterValue<T> | undefined,
): boolean => {
  if (!filter || filter === 'ALL') return true;
  return value === filter;
};

const matchesKeyword = (
  animal: FosterListAnimalItem,
  keyword: string,
): boolean => {
  if (!keyword) return true;

  const fields = [animal.breed, animal.name, animal.organization?.name];

  return fields.some((field) => field?.toLowerCase().includes(keyword));
};

export const filterFosterList = (
  animals: FosterListAnimalItem[],
  options: FosterFilterOptions,
): FosterListAnimalItem[] => {
  const { type, size, gender, keyword } = options;
  const normalizedKeyword = normalizeKeyword(keyword);

  return animals.filter(
    (animal) =>
      matchesFilter(animal.type, type) &&
      matchesFilter(animal.size, size) &&
      matchesFilter(animal.gender, gender) &&
      matchesKeyword(animal, normalizedKeyword),
  );
};
