import { normalizeKeyword } from '@/shared/lib/utils';
import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';
import type { FosterListAnimalItem } from '@/types/animal/animal-api';
import type {
  FosterFilterOptions,
  FosterFilterValue,
} from '@/shared/types/foster';

type FosterListFilterOptions = FosterFilterOptions<
  AnimalType,
  AnimalSize,
  AnimalGender
>;

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
  options: FosterListFilterOptions,
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
