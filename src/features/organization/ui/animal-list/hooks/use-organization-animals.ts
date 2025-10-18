'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getSocket } from '@/lib/socket';
import { fetchOrganizationAnimals } from '@/features/organization/api/organization';
import type { OrganizationAnimalListItem } from '@/entities/animal/animal-api';
import { sortOrganizationAnimals } from '@/features/organization/domain/animals';

export const ORGANIZATION_ANIMALS_QUERY_KEY = ['animals'] as const;

export function useOrganizationAnimals() {
  const queryClient = useQueryClient();

  const queryResult = useQuery<OrganizationAnimalListItem[]>({
    queryKey: ORGANIZATION_ANIMALS_QUERY_KEY,
    queryFn: fetchOrganizationAnimals,
    select: sortOrganizationAnimals,
  });

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return;
    }

    const handleUpdatedAnimal = (updated: OrganizationAnimalListItem) => {
      queryClient.setQueryData<OrganizationAnimalListItem[]>(
        ORGANIZATION_ANIMALS_QUERY_KEY,
        (previous = []) =>
          sortOrganizationAnimals(
            previous.map((animal) =>
              animal.id === updated.id ? updated : animal,
            ),
          ),
      );
    };

    socket.on('animalUpdated', handleUpdatedAnimal);

    return () => {
      socket.off('animalUpdated', handleUpdatedAnimal);
    };
  }, [queryClient]);

  return queryResult;
}
