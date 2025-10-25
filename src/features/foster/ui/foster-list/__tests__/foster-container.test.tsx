import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnimalGender, AnimalSize, AnimalType } from '@/entities/animal/animal';
import type { FosterListAnimalItem } from '@/entities/animal/animal-api';

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
  euthanasia_date: new Date('2025-11-01'),
  isEmergency: false,
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
    euthanasia_date: new Date('2025-11-01'),
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

    // 초기 요소는 비동기 렌더링 가능성 있으니 findBy로 안전하게 확인
    expect(await screen.findByText('루나')).toBeInTheDocument();
    expect(await screen.findByText('루비')).toBeInTheDocument();

    const user = userEvent.setup();
    const emergencyToggle = await screen.findByRole('button', { name: '긴급' });

    // 클릭하고, 변경이 적용될 때까지 기다림
    await user.click(emergencyToggle);

    // aria-pressed가 변경되는 걸 기다리기
    await waitFor(() => {
      expect(emergencyToggle).toHaveAttribute('aria-pressed', 'true');
    });

    // 긴급 필터 후 렌더링이 끝날 때까지 기다려서 검증
    await waitFor(() => {
      expect(screen.getByText('루나')).toBeInTheDocument(); // 남아있음
      expect(screen.queryByText('루비')).not.toBeInTheDocument(); // 없어짐
    });
  }, 30000);
});
