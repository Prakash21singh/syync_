import prisma from '@/lib/prisma';
import { Adapter } from '@/types';
import { withAuth } from '@/lib/with-auth';
import { findAdapter } from '@/lib/queries';
import { TokenRotationError } from '@/lib/error';
import { rotateGoogleDriveToken } from '@/lib/token';
import { doesRequireTokenRotation } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { getFilesFromAdapter } from '@/lib/adapters/get-files';

interface RequestBody {
  sourceAdapterId: string;
  destinationAdapterId: string;
  bucket?: string;
}

async function handler(req: NextRequest, session: any) {
  try {
    const body: RequestBody = await req.json();

    if (!body.sourceAdapterId || !body.destinationAdapterId) {
      return new Response('Please choose Source Adapter and Destination Adapter', { status: 400 });
    }

    const [sourceAdapter, destinationAdapter] = await Promise.all([
      findAdapter({
        id: body.sourceAdapterId,
        userId: session.user.id,
      }),
      findAdapter({
        id: body.destinationAdapterId,
        userId: session.user.id,
      }),
    ]);

    if (!sourceAdapter) {
      return new Response('Source Adapter not found', { status: 404 });
    }

    if (!destinationAdapter) {
      return new Response('Destination Adapter not found', { status: 404 });
    }

    try {
      await Promise.all([
        validateAndRotateToken(sourceAdapter),
        validateAndRotateToken(destinationAdapter),
      ]);
    } catch (error) {
      if (error instanceof TokenRotationError) {
        return new Response(error.message, { status: 401 });
      }
      throw error;
    }

    const files = await getFilesFromAdapter(sourceAdapter as any, {}, { bucket: body.bucket! });

    return NextResponse.json({ files, adapter_type: sourceAdapter.adapter_type }, { status: 200 });
  } catch (error) {
    console.log('Migrate Error', error);
    return new Response(
      error instanceof Error ? error.message : 'Unexpected error during migration',
      { status: 500 },
    );
  }
}

async function validateAndRotateToken(adapter: Adapter): Promise<boolean> {
  const requiresRotation = await doesRequireTokenRotation(adapter);
  if (!requiresRotation) return true;

  if (adapter.adapter_type === 'GOOGLE_DRIVE') {
    return rotateAndPersistGoogleDriveToken(adapter);
  }

  if (adapter.adapter_type === 'DROPBOX') {
    return true;
  }

  return true;
}

async function rotateAndPersistGoogleDriveToken(adapter: Adapter): Promise<boolean> {
  const rotated = await rotateGoogleDriveToken(adapter.refresh_token!);

  if (!rotated) {
    throw new TokenRotationError(adapter.adapter_type, adapter.id);
  }

  await prisma.adapter.update({
    where: { id: adapter.id },
    data: {
      access_token: rotated.access_token,
      expires_in: new Date(Date.now() + rotated.expires_in * 1000),
      token_type: rotated.token_type,
      scope: rotated.scope,
    },
  });

  return true;
}

export const POST = withAuth(handler);
