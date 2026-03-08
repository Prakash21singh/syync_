import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/with-auth';
import { GOOGLE_DRIVE_APIS } from '@/utils/config/google-drive-endpoints';
import { GOOGLE_API_ENDPOINTS } from '@/utils/config/google-endpoint';
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  sourceAdapterId: string;
  destinationAdapterId: string;
}

interface Adapter {
  id: string;
  name: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_in: Date | null;
  refresh_token_expires_in: Date | null;
  token_type: string | null;
  adapter_type: 'GOOGLE_DRIVE' | 'DROPBOX';
  adapterAccountInfo: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

async function handler(req: NextRequest, session: any) {
  try {
    const body: RequestBody = await req.json();

    if (!body.sourceAdapterId || !body.destinationAdapterId) {
      return new Response('Please choose Source Adapter and Destination Adapter', { status: 400 });
    }

    const sourceAdapterExist = await prisma.adapter.findFirst({
      where: {
        id: body.sourceAdapterId,
        userId: session.user.id,
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
        adapterAccountInfo: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!sourceAdapterExist) {
      return new Response('Source Adapter not found', { status: 404 });
    }

    const destinationAdapterExist = await prisma.adapter.findFirst({
      where: {
        id: body.destinationAdapterId,
        userId: session.user.id,
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
        adapterAccountInfo: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!destinationAdapterExist) {
      return new Response('Destination Adapter not found', { status: 404 });
    }

    const checkSourceAdapterTokenStatus = await validateAndRotateToken(sourceAdapterExist);

    if (!checkSourceAdapterTokenStatus) {
      return new Response("Try to re-authenticate the source adapter, For now we're removing it.", {
        status: 401,
      });
    }

    const checkDestinationAdapterTokenStatus =
      await validateAndRotateToken(destinationAdapterExist);

    if (!checkDestinationAdapterTokenStatus) {
      return new Response(
        "Try to re-authenticate the destination adapter, For now we're removing it.",
        { status: 401 },
      );
    }

    const files = await getFilesFromAdapter(sourceAdapterExist);

    return NextResponse.json(
      { ...files, adapter_type: sourceAdapterExist.adapter_type },
      { status: 200 },
    );
  } catch (error) {
    console.log('Migrate Error', error);
    return new Response(
      error instanceof Error ? error.message : 'Unexpected error during migration',
      { status: 500 },
    );
  }
}

async function getFilesFromAdapter(
  adapter: Adapter,
  queryParams: Record<string, string | number> = {},
) {
  if (adapter.adapter_type === 'GOOGLE_DRIVE') {
    const params = new URLSearchParams({
      corpora: (queryParams.corpora as string) || 'user',
      driveId: (queryParams.driveId as string) || '',
      includeItemsFromAllDrives: false.toString(),
      supportsAllDrives: 'false',
      q: "'root' in parents and trashed=false",
      orderBy: (queryParams.orderBy as string) || 'createdTime desc',
      fields:
        'nextPageToken, files(id,name,mimeType,size,createdTime,modifiedTime,parents,webViewLink,iconLink,hasThumbnail,thumbnailLink)',
    }).toString();

    // Implement logic to get files from Google Drive using adapter.access_token
    const response = await fetch(GOOGLE_DRIVE_APIS['google_drive_list_files'].url + `?${params}`, {
      method: GOOGLE_DRIVE_APIS['google_drive_list_files'].method,
      headers: {
        Authorization: `Bearer ${adapter.access_token}`,
      },
    });
    const data = await response.json();
    return data;
  } else if (adapter.adapter_type === 'DROPBOX') {
    // Implement logic to get files from Dropbox using adapter.access_token
  }
}

async function removeAdapterAndAdapterInfo(adapterId: string, email: string | null) {
  await prisma.adapterAccountInfo.deleteMany({
    where: {
      adapterId: adapterId,
      email: email || undefined,
    },
  });

  await prisma.adapter.delete({
    where: {
      id: adapterId,
    },
  });
}

async function validateAndRotateToken(adapter: Adapter): Promise<boolean> {
  let isValidTokens = true;
  let shouldRemoveAdapterAndAdapterInfo = false; // (if no tokens are valid let user re-authenticate.)

  if (adapter.adapter_type === 'GOOGLE_DRIVE') {
    const tokenValid = await validateGoogleDriveToken(adapter.access_token!);

    if (!tokenValid) {
      const tokenRotated = await rotateGoogleDriveToken(adapter.refresh_token!);

      if (tokenRotated) {
        await prisma.adapter.update({
          where: { id: adapter.id },
          data: {
            access_token: tokenRotated.access_token,
            expires_in: new Date(Date.now() + tokenRotated.expires_in * 1000),
            token_type: tokenRotated.token_type,
            scope: tokenRotated.scope,
          },
        });
        isValidTokens = true;
      } else {
        isValidTokens = false;
        shouldRemoveAdapterAndAdapterInfo = true;
      }
    }
  } else if (adapter.adapter_type === 'DROPBOX') {
    // Implement Dropbox token validation and rotation logic here
    // For now, we'll assume the tokens are valid. You can replace this with actual validation and rotation logic.
    isValidTokens = true;
  }

  // if(shouldRemoveAdapterAndAdapterInfo) {
  //     await removeAdapterAndAdapterInfo(adapter.id, adapter.adapterAccountInfo?.email || null);
  // }

  return isValidTokens;
}

async function validateGoogleDriveToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${GOOGLE_API_ENDPOINTS['validate_token']}${accessToken}`);
    const data = await response.json();
    return !data.error;
  } catch (error) {
    console.error('Error validating Google Drive token:', error);
    return false;
  }
}

async function rotateGoogleDriveToken(refreshToken: string): Promise<{
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
} | null> {
  try {
    const response = await fetch(GOOGLE_API_ENDPOINTS.refresh_token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.log(response);
      console.error('Failed to rotate Google Drive token:', await response.text());
      return null;
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      scope: data.scope,
    };
  } catch (error) {
    console.error('Error rotating Google Drive token:', error);
    return null;
  }
}

export const POST = withAuth(handler);
