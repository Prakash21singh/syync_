import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/with-auth';
import { Adapter } from '@/prisma/generated/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type ValidationStatus = 'valid' | 'rotated' | 'reauth';

interface ValidateRequestBody {
  adapterId: string;
}

interface ValidateResponse {
  status: ValidationStatus;
  message: string;
}

async function handler(req: NextRequest, session: any) {
  try {
    const body: ValidateRequestBody = await req.json();

    if (!body.adapterId) {
      return NextResponse.json({ error: 'adapterId is required' }, { status: 400 });
    }

    const adapter = await prisma.adapter.findUnique({
      where: {
        id: body.adapterId,
      },
      select: {
        id: true,
        access_token: true,
        refresh_token: true,
        expires_in: true,
        adapter_type: true,
      },
    });

    if (!adapter) NextResponse.json({ error: 'Adapter does not exist' }, { status: 400 });

    const now = new Date();

    const isExpired = adapter?.expires_in! < now;

    if (!isExpired) {
      return NextResponse.json<ValidateResponse>({
        status: 'valid',
        message: 'Token is valid',
      } );
    }

    if (adapter?.refresh_token) {
      const rotated = await rotateToken(adapter); // your token rotation logic

      if (!rotated) {
        // Rotation failed for some reason → force reauth
        return NextResponse.json<ValidateResponse>({
          status: 'reauth',
          message: 'Token rotation failed. Please re-authenticate.',
        });
      }

      // Save new tokens to DB
      await prisma.adapter.update({
        where: { id: adapter.id },
        data: rotated.refresh_token
          ? {
              access_token: rotated.access_token,
              expires_in: new Date(Date.now() + rotated.expires_in),
              refresh_token: rotated.refresh_token,
            }
          : {
              access_token: rotated.access_token,
              expires_in: new Date(Date.now() + rotated.expires_in),
            },
      });

      return NextResponse.json<ValidateResponse>({
        status: 'rotated',
        message: 'Token was silently refreshed',
      });
    }

    return NextResponse.json<ValidateResponse>({
      status: 'reauth',
      message: 'Session expired. Please re-authenticate.',
    });
  } catch (error: any) {
    console.error('[validate] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function rotateToken(adapter: Partial<Adapter>) {
  try {
    if (adapter.adapter_type === 'GOOGLE_DRIVE') {
      try {
        const res = await fetch(process.env.GOOGLE_REFRESH_TOKEN_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: adapter.refresh_token,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text(); // Dropbox usually sends useful error
          throw new Error(`Dropbox token refresh failed: ${res.status} ${errorText}`);
        }

        const data = await res.json();

        return {
          access_token: data.access_token,
          expires_in: data.expires_in,
        };
      } catch (error: any) {
        console.log('Google Token Refresh Error: ', error.message);
        return null;
      }
    }

    if (adapter.adapter_type === 'DROPBOX') {
      try {
        const res = await fetch(process.env.DROPBOX_REFRESH_TOKEN_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: adapter.refresh_token!,
            client_id: process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!,
            client_secret: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_SECRET!,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text(); // Dropbox usually sends useful error
          throw new Error(`Dropbox token refresh failed: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        console.log(data);

        return {
          access_token: data.access_token,
          expires_in: data.expires_in,
          refresh_token: data.refresh_token,
        };
      } catch (error: any) {
        console.error('❌ Token refresh error:', error.message);
        return null; // always return something predictable
      }
    }
    return null;
  } catch (error: any) {
    console.log('Error rotating token:', error);
    return null;
  }
}

export const POST = withAuth(handler);
