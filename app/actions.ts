'use server';

import { createMigration } from '@/lib/queries';
import { revalidatePath } from 'next/cache';

export async function fetchUserAdapters(userId: string) {
  // This could be used for client-side fetching if needed
  const { getUserAdapters } = await import('@/lib/queries');
  return await getUserAdapters(userId);
}
