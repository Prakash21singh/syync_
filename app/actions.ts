'use server';

import { createMigration } from '@/lib/queries';
import { revalidatePath } from 'next/cache';

export async function startMigration(formData: FormData) {
  try {
    const sourceAdapterId = formData.get('sourceAdapterId') as string;
    const destAdapterId = formData.get('destAdapterId') as string;
    const userId = formData.get('userId') as string;
    const selectedFiles = JSON.parse(formData.get('selectedFiles') as string);
    const bucket = formData.get('bucket') as string | null;

    const migration = await createMigration({
      sourceAdapterId,
      destinationAdapterId: destAdapterId,
      userId,
      selections: selectedFiles,
      totalFiles: selectedFiles.length,
      bucket: bucket || undefined,
    });

    revalidatePath('/app');
    return { success: true, migrationId: migration.id };
  } catch (error) {
    console.error('Migration start error:', error);
    return { success: false, error: 'Failed to start migration' };
  }
}

export async function fetchUserAdapters(userId: string) {
  // This could be used for client-side fetching if needed
  const { getUserAdapters } = await import('@/lib/queries');
  return await getUserAdapters(userId);
}
