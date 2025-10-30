'use server';

import { revalidatePath } from 'next/cache';

export async function fosterAnimalListRevalid() {
  revalidatePath('/record');
}
