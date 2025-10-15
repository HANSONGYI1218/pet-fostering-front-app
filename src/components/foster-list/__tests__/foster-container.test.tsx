import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';
import type { FosterListAnimalItem } from '@/types/animal/animal-api';

const createAnimal = (
  overrides: Partial<FosterListAnimalItem>,
): FosterListAnimalItem => ({
  id: 'default',
  name: '보리',
  type: AnimalType.DOG,
  size: AnimalSize.MEDIUM,
  breed: '믹스',
  birth_date: new Date('2020-01-01'),
  gender: AnimalGender.MALE,
  image: '/image.png',
  isBookmarked: false,
  animal_healths: [],
  animal_personalitys: [],
  animal_environments: [],
  isEmergency: false,
  isFosterCondition: false,
  organization: {
    id: 'org-default',
    name: '퍼디 보호소',
    address: '서울',
    address_detail: '중구',
    phone_number: '010-0000-0000',
  },
  ...overrides,
});

const sampleAnimals: FosterListAnimalItem[] = [
  createAnimal({
    id: '1',
    name: '루나',
    isEmergency: true,
  }),
  createAnimal({
    id: '2',
    name: '루비',
    type: AnimalType.CAT,
    gender: AnimalGender.FEMALE,
    isEmergency: false,
    organization: {
      id: 'org-2',
      name: '냥이 쉼터',
      address: '부산',
      address_detail: '해운대구',
      phone_number: '010-9999-9999',
    },
  }),
];

describe('FosterContainer', () => {
  it('긴급 토글을 누르면 긴급 동물만 표시한다', async () => {
    const { default: FosterContainer } = await import('../foster-container');

    render(
      <FosterContainer
        animals={sampleAnimals.map((animal) => ({ ...animal }))}
      />,
    );

    expect(screen.getByText('루나')).toBeInTheDocument();
    expect(screen.getByText('루비')).toBeInTheDocument();

    const emergencyToggle = screen.getByRole('button', { name: '긴급' });
    await userEvent.click(emergencyToggle);

    expect(emergencyToggle).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('루나')).toBeInTheDocument();
    expect(screen.queryByText('루비')).not.toBeInTheDocument();
  });
});
