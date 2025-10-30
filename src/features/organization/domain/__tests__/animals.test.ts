import { describe, expect, it } from 'vitest';

import { filterOrganizationAnimals, sortOrganizationAnimals } from '../animals';
import type { OrganizationAnimalListItem } from '@/entities/animal/animal-api';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  AnimalStatus,
} from '@/entities/animal/animal';

const createAnimal = (
  overrides: Partial<OrganizationAnimalListItem>,
): OrganizationAnimalListItem => ({
  id: 'default',
  name: '보리',
  type: AnimalType.DOG,
  size: AnimalSize.SMALL,
  breed: '믹스',
  birth_date: new Date('2020-01-01'),
  gender: AnimalGender.MALE,
  animalStatus: AnimalStatus.WAITING,
  image: '/image.png',
  applicants: [],
  animal_healths: [],
  animal_personalitys: [],
  foster_environments: [],
  isEmergency: false,
  foster_apply_number: 0,
  ...overrides,
});

describe('sortOrganizationAnimals', () => {
  it('임시보호 상태 우선순위에 맞게 정렬한다', () => {
    const animals = [
      createAnimal({ id: 'fostered', animalStatus: AnimalStatus.IN_PROGRESS }),
      createAnimal({
        id: 'in-progress',
        animalStatus: AnimalStatus.WAITING,
      }),
    ];

    const result = sortOrganizationAnimals(animals);

    expect(result.map((animal) => animal.id)).toEqual([
      'in-progress',
      'fostered',
    ]);
  });

  it('정렬 시 원본 배열을 변경하지 않는다', () => {
    const animals = [
      createAnimal({ id: 'first', animalStatus: AnimalStatus.IN_PROGRESS }),
      createAnimal({ id: 'second', animalStatus: AnimalStatus.WAITING }),
    ];

    sortOrganizationAnimals(animals);

    expect(animals[0].id).toBe('first');
  });
});

describe('filterOrganizationAnimals', () => {
  const animals: OrganizationAnimalListItem[] = [
    createAnimal({
      id: 'dog-small-male',
      name: '보리',
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      gender: AnimalGender.MALE,
      animalStatus: AnimalStatus.WAITING,
    }),
    createAnimal({
      id: 'cat-medium-female',
      name: '나비',
      type: AnimalType.CAT,
      size: AnimalSize.MEDIUM,
      gender: AnimalGender.FEMALE,
      animalStatus: AnimalStatus.IN_PROGRESS,
      isEmergency: true,
      breed: '코리안숏헤어',
    }),
    createAnimal({
      id: 'dog-large-female',
      name: '코코',
      type: AnimalType.DOG,
      size: AnimalSize.LARGE,
      gender: AnimalGender.FEMALE,
      animalStatus: AnimalStatus.IN_PROGRESS,
      breed: 'Poodle Mix',
    }),
  ];

  const allFilters = {
    emergencyOnly: false,
    type: 'ALL' as const,
    size: 'ALL' as const,
    gender: 'ALL' as const,
    status: 'ALL' as const,
    keyword: '',
  };

  it('필터를 적용하지 않으면 전체 목록을 반환한다', () => {
    const result = filterOrganizationAnimals(animals, allFilters);

    expect(result).toHaveLength(3);
  });

  it('긴급 동물만 필터링할 수 있다', () => {
    const result = filterOrganizationAnimals(animals, {
      ...allFilters,
      emergencyOnly: true,
    });

    expect(result.map((animal) => animal.id)).toEqual(['cat-medium-female']);
  });

  it('종류/사이즈/성별/상태 필터를 동시에 적용한다', () => {
    const result = filterOrganizationAnimals(animals, {
      ...allFilters,
      type: AnimalType.DOG,
      size: AnimalSize.LARGE,
      gender: AnimalGender.FEMALE,
      status: AnimalStatus.IN_PROGRESS,
    });

    expect(result.map((animal) => animal.id)).toEqual(['dog-large-female']);
  });

  it('검색어는 이름과 품종을 대상으로 대소문자 구분 없이 적용된다', () => {
    const result = filterOrganizationAnimals(animals, {
      ...allFilters,
      keyword: 'Poodle',
    });

    expect(result.map((animal) => animal.id)).toEqual(['dog-large-female']);
  });
});
