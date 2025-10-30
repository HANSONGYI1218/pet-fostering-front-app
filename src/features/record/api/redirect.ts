'use server';

import { revalidatePath } from 'next/cache';

export async function fosterAnimalDetailPageRevalid({
  animalId,
}: {
  animalId: string;
}) {
  revalidatePath(`/record/${animalId}`);
}
