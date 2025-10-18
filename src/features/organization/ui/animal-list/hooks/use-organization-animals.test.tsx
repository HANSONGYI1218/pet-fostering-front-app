import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useOrganizationAnimals } from './use-organization-animals';
import type { OrganizationAnimalListItem } from '@/entities/animal/animal-api';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  FosterState,
} from '@/entities/animal/animal';

vi.mock('@/lib/socket', () => ({
  getSocket: () => null,
}));

const fetchOrganizationAnimals = vi.hoisted(() => vi.fn());

vi.mock('@/features/organization/api/organization', () => ({
  fetchOrganizationAnimals,
}));

const createAnimal = (overrides: Partial<OrganizationAnimalListItem>) =>
  ({
    id: 'default',
    name: '보리',
    type: AnimalType.DOG,
    size: AnimalSize.SMALL,
    breed: '믹스',
    birth_date: new Date('2020-01-01'),
    gender: AnimalGender.MALE,
    animalStatus: FosterState.IN_PROGRESS,
    image: '/image.png',
    applicants: [],
    animal_healths: [],
    animal_personalitys: [],
    foster_environments: [],
    isEmergency: false,
    foster_apply_number: 0,
    ...overrides,
  }) as OrganizationAnimalListItem;

describe('useOrganizationAnimals', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    fetchOrganizationAnimals.mockResolvedValue([
      createAnimal({ id: 'beta', name: 'Beta' }),
      createAnimal({ id: 'alpha', name: 'Alpha' }),
    ]);
  });

  it('API에서 받아온 동물 목록을 정렬해 제공한다', async () => {
    const { result } = renderHook(() => useOrganizationAnimals(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchOrganizationAnimals).toHaveBeenCalledTimes(1);
    expect(result.current.data?.map((animal) => animal.name)).toEqual([
      'Alpha',
      'Beta',
    ]);
  });
});
