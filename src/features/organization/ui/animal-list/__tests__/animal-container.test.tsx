import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { OrganizationAnimalListItem } from '@/types/animal/animal-api';
import {
  AnimalType,
  AnimalGender,
  AnimalSize,
  FosterState,
} from '@/types/animal/animal';
import { useQuery } from '@tanstack/react-query';

vi.mock('@/lib/socket', () => ({
  getSocket: () => null,
}));

vi.mock('@tanstack/react-query', () => ({
  __esModule: true,
  useQuery: vi.fn(),
  useQueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
  })),
}));

vi.mock('@/components/foster-list/foster-condition-card', () => ({
  __esModule: true,
  default: () => <div data-testid="foster-condition-card" />,
}));

vi.mock('@/components/common/search-box', () => ({
  __esModule: true,
  default: () => <div data-testid="search-box" />,
}));

vi.mock('../animal-create-dialog', () => ({
  __esModule: true,
  AnimalCreateDialog: () => <div data-testid="animal-create-dialog" />,
}));

vi.mock('../animal-tile', () => ({
  __esModule: true,
  default: ({ animal }: { animal: OrganizationAnimalListItem }) => (
    <div data-testid="animal-tile">{animal.name}</div>
  ),
}));

describe('AnimalContainer', () => {
  const unsortedAnimals: OrganizationAnimalListItem[] = [
    {
      id: 'beta',
      name: 'Beta',
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      breed: '믹스',
      birth_date: new Date('2020-01-01'),
      gender: AnimalGender.FEMALE,
      animalStatus: FosterState.IN_PROGRESS,
      image: '/image.png',
      applicants: [],
      animal_healths: [],
      animal_personalitys: [],
      foster_environments: [],
      isEmergency: false,
      foster_apply_number: 0,
    },
    {
      id: 'alpha',
      name: 'Alpha',
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      breed: '믹스',
      birth_date: new Date('2020-01-01'),
      gender: AnimalGender.FEMALE,
      animalStatus: FosterState.IN_PROGRESS,
      image: '/image.png',
      applicants: [],
      animal_healths: [],
      animal_personalitys: [],
      foster_environments: [],
      isEmergency: false,
      foster_apply_number: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as unknown as vi.Mock).mockReturnValue({
      data: unsortedAnimals,
      isLoading: false,
      isError: false,
    });
  });

  it('동일한 상태의 동물을 이름 사전순으로 정렬해 보여준다', async () => {
    const { default: AnimalContainer } = await import('../animal-container');

    render(<AnimalContainer />);

    const tiles = screen.getAllByTestId('animal-tile');
    const names = tiles.map((tile) => tile.textContent);

    expect(names).toEqual(['Alpha', 'Beta']);
  });
});
