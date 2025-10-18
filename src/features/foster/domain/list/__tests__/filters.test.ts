import { describe, expect, it } from 'vitest';

import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';
import type { FosterListAnimalItem } from '@/types/animal/animal-api';
import { filterFosterList } from '../filters';

const organization = {
  id: 'org-1',
  name: '퍼디 쉼터',
  address: '서울',
  address_detail: '강남구',
  phone_number: '010-0000-0000',
};

const createAnimal = (
  overrides: Partial<FosterListAnimalItem>,
): FosterListAnimalItem => ({
  id: 'default',
  name: '보리',
  type: AnimalType.DOG,
  size: AnimalSize.SMALL,
  breed: '믹스',
  birth_date: new Date('2020-01-01'),
  gender: AnimalGender.MALE,
  image: '/image.png',
  isBookmarked: false,
  animal_healths: [],
  animal_personalitys: [],
  foster_environments: [],
  isEmergency: false,
  organization,
  ...overrides,
});

describe('filterFosterList', () => {
  const animals: FosterListAnimalItem[] = [
    createAnimal({ id: '1' }),
    createAnimal({
      id: '2',
      name: '코코',
      type: AnimalType.CAT,
      size: AnimalSize.MEDIUM,
      gender: AnimalGender.FEMALE,
      breed: '코리안숏헤어',
      organization: { ...organization, name: 'Coco Shelter' },
    }),
    createAnimal({
      id: '3',
      name: '초코',
      breed: '믹스테리어',
      organization: { ...organization, name: '초코 하우스' },
    }),
  ];

  it('필터가 없으면 원본을 그대로 반환한다', () => {
    const result = filterFosterList(animals, {
      type: 'ALL',
      size: 'ALL',
      gender: 'ALL',
      keyword: '',
    });

    expect(result).toEqual(animals);
  });

  it('타입/크기/성별 조건과 키워드를 모두 만족하는 동물만 반환한다', () => {
    const result = filterFosterList(animals, {
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      gender: AnimalGender.MALE,
      keyword: '초코',
    });

    expect(result).toEqual([animals[2]]);
  });

  it('키워드는 품종, 이름, 보호소 이름을 대상으로 대소문자 구분 없이 검색한다', () => {
    const result = filterFosterList(animals, {
      type: 'ALL',
      size: 'ALL',
      gender: 'ALL',
      keyword: 'SHELTER',
    });

    expect(result).toEqual([animals[1]]);
  });
});
