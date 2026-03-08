import prisma from '@/lib/prisma';
import { discoveryQueue } from '@/lib/queues/discovery-queue';
import { migrationQueue } from '@/lib/queues/migration-queue';
import { withAuth } from '@/lib/with-auth';
import { NextRequest, NextResponse } from 'next/server';
import { findResouceType } from '@/utils/functions/find-resourcetype';
type InputFile = {
  id: string;
  mimeType: string;
  size: string;
  name: string;
};

async function handler(req: NextRequest, session: any) {
  try {
    const body = await req.json();

    // ✅ Strong validation
    if (
      !body ||
      !body.sourceAdapterId ||
      !body.destAdapterId ||
      !Array.isArray(body.selectedFiles)
    ) {
      return NextResponse.json(
        {
          error: 'invalid_request_body',
          message: 'sourceAdapterId, destAdapterId and selectedFiles[] are required.',
        },
        { status: 400 },
      );
    }

    // ✅ Empty files check (safe)
    if (body.selectedFiles.length === 0) {
      return NextResponse.json(
        {
          error: 'no_files_to_migrate',
          message: 'Please choose at least one file/folder to migrate.',
        },
        { status: 400 },
      );
    }

    // ✅ Fetch adapters in parallel
    const [sourceAdapter, destinationAdapter] = await Promise.all([
      prisma.adapter.findUnique({
        where: { id: body.sourceAdapterId },
      }),
      prisma.adapter.findUnique({
        where: { id: body.destAdapterId },
      }),
    ]);

    // ✅ Proper error handling
    if (!sourceAdapter || !destinationAdapter) {
      const missing = !sourceAdapter ? 'source' : 'destination';

      return NextResponse.json(
        {
          error: `${missing}_adapter_not_found`,
          message: `${missing === 'source' ? 'Source' : 'Destination'} adapter not found!`,
        },
        { status: 404 },
      );
    }

    // ✅ Create migration
    const migration = await prisma.migration.create({
      data: {
        status: 'PENDING',
        sourceAdapterId: body.sourceAdapterId,
        destinationAdapterId: body.destAdapterId,
        userId: session.user.id,
        selections: {
          create: body.selectedFiles.map((file: InputFile) => ({
            sourceId: file.id,
            name: file.name || 'Unknown', // Fallback name
            type: findResouceType(sourceAdapter.adapter_type, file),
            mimeType: file.mimeType,
            size: file.size,
          })),
        },
        totalFiles: body.selectedFiles.length,
      },
    });

    await discoveryQueue.add(
      'start-discovery',
      {
        userId: migration.userId,
        migrationId: migration.id,
      },
      {
        attempts: 3,
        removeOnComplete: true,
      },
    );

    return NextResponse.json(
      {
        message: 'Migration process initiated',
        migration: {
          id: migration.id,
          status: migration.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log('Error', error);
    return NextResponse.json(
      {
        error: 'migration_failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export const POST = withAuth(handler);
