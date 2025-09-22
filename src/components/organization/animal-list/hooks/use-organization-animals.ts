'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getSocket } from '@/lib/socket';
import { dummyOgrainzationAnimals } from '@/lib/dummydata';
import type { OgrainzationAnimalListItem } from '@/types/animal/animal-api';
import { sortOrganizationAnimals } from '@/domain/organization/animals';

const fetchOrganizationAnimals = async (): Promise<
  OgrainzationAnimalListItem[]
> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(dummyOgrainzationAnimals), 300);
  });

export const ORGANIZATION_ANIMALS_QUERY_KEY = ['animals'] as const;

export function useOrganizationAnimals() {
  const queryClient = useQueryClient();

  const queryResult = useQuery<OgrainzationAnimalListItem[]>({
    queryKey: ORGANIZATION_ANIMALS_QUERY_KEY,
    queryFn: fetchOrganizationAnimals,
    select: sortOrganizationAnimals,
  });

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return;
    }

    const handleUpdatedAnimal = (updated: OgrainzationAnimalListItem) => {
      queryClient.setQueryData<OgrainzationAnimalListItem[]>(
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
