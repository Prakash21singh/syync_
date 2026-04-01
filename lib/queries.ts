import prisma from './prisma';
import { MigrationSelection } from '@/prisma/generated/prisma/client';

interface FindAdapterConditionInterface {
  id: string;
  userId: string;
}

export async function findAdapter({ id, userId }: FindAdapterConditionInterface) {
  return await prisma.adapter.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      name: true,
      access_token: true,
      refresh_token: true,
      expires_in: true,
      refresh_token_expires_in: true,
      token_type: true,
      adapter_type: true,
      accessKeyId: true,
      accessKeySecret: true,
      region: true,
      adapterAccountInfo: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function getUserAdapters(userId: string) {
  return await prisma.adapter.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      adapter_type: true,
      adapterAccountInfo: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

interface File {
  sourceId: any;
  name: string;
  path: any;
  size: any;
  type: 'FILE' | 'FOLDER';
  mimeType: any;
}
interface CreateMigrationInterface {
  sourceAdapterId: string;
  destinationAdapterId: string;
  userId: string;
  selections: File[];
  totalFiles: number;
  bucket?: string;
}

export async function createMigration({
  userId,
  bucket,
  totalFiles,
  selections,
  sourceAdapterId,
  destinationAdapterId,
}: CreateMigrationInterface) {
  return await prisma.migration.create({
    data: {
      status: 'PENDING',
      sourceAdapterId,
      destinationAdapterId,
      userId,
      selections: {
        create: selections,
      },
      totalFiles,
      bucket,
    },
  });
}
