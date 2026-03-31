import { createMigration, findAdapter } from '@/lib/queries';
import { discoveryQueue } from '@/lib/queues/discovery-queue';
import { normalizeFileSelection } from '@/lib/utils';
import { withAuth } from '@/lib/with-auth';
import { SessionInterface } from '@/types';
import { PrismaClientValidationError } from '@prisma/client/runtime/client';
import { NextRequest, NextResponse } from 'next/server';

const DISCOVERY_JOB_NAME = 'start-discovery' as const;

const DISCOVERY_JOB_OPTIONS = {
  attempts: 3,
  removeOnComplete: true,
  backoff: { type: 'exponential', delay: 3_000 },
} as const;

type SelectedFile = {
  id: string;
  name: string;
  pathname: string | null;
  size: string | null;
  type: 'folder' | 'file';
  mimeType: string | null;
};

type RequestBody = {
  sourceAdapterId: string;
  destAdapterId: string;
  selectedFiles: SelectedFile[];
  bucket?: string;
};

function validateRequestBody(
  body: unknown,
): { valid: true; data: RequestBody } | { valid: false; error: string; message: string } {
  if (
    !body ||
    typeof body !== 'object' ||
    !('sourceAdapterId' in body) ||
    !('destAdapterId' in body) ||
    !('selectedFiles' in body) ||
    !Array.isArray((body as RequestBody).selectedFiles)
  ) {
    return {
      valid: false,
      error: 'invalid_request_body',
      message: 'sourceAdapterId, destAdapterId and selectedFiles[] are required.',
    };
  }

  if ((body as RequestBody).selectedFiles.length === 0) {
    return {
      valid: false,
      error: 'no_files_to_migrate',
      message: 'Please choose at least one file/folder to migrate.',
    };
  }

  return { valid: true, data: body as RequestBody };
}

async function handler(req: NextRequest, session: SessionInterface) {
  try {
    const rawBody: unknown = await req.json();
    const validation = validateRequestBody(rawBody);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, message: validation.message },
        { status: 400 },
      );
    }

    const { sourceAdapterId, destAdapterId, selectedFiles, bucket } = validation.data;
    const userId = session.user.id;

    const [sourceAdapter, destinationAdapter] = await Promise.all([
      findAdapter({ id: sourceAdapterId, userId }),
      findAdapter({ id: destAdapterId, userId }),
    ]);

    if (!sourceAdapter || !destinationAdapter) {
      const missing = !sourceAdapter ? 'source' : 'destination';
      const label = missing.charAt(0).toUpperCase() + missing.slice(1);

      return NextResponse.json(
        {
          error: `${missing}_adapter_not_found`,
          message: `${label} adapter not found.`,
        },
        { status: 404 },
      );
    }

    const selections = normalizeFileSelection(selectedFiles, {
      isS3File: sourceAdapter.adapter_type === 'AWS_S3',
    });

    const migration = await createMigration({
      sourceAdapterId,
      destinationAdapterId: destAdapterId,
      userId,
      selections,
      totalFiles: selections.length,
      bucket,
    });

    await discoveryQueue.add(
      DISCOVERY_JOB_NAME,
      { userId: migration.userId, migrationId: migration.id },
      DISCOVERY_JOB_OPTIONS,
    );

    return NextResponse.json(
      {
        message: 'Migration process initiated.',
        migration: {
          id: migration.id,
          status: migration.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /migrations] Unexpected error:', error);

    let errorMessage =
      error instanceof PrismaClientValidationError
        ? 'Database validation failed'
        : error instanceof Error
          ? error.message
          : 'An Unexpected error occured';

    return NextResponse.json(
      {
        error: 'migration_failed',
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}

export const POST = withAuth(handler);
