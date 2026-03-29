import { createAndUpdateAdapter } from '@/lib/api/adapter/create-adapter';
import { createAndUpdateAdapterAccountInfo } from '@/lib/api/adapter/create-adapter-account-info';
import { withAuth } from '@/lib/with-auth';
import { Prisma } from '@/prisma/generated/prisma/client';
import { DecodedGoogleAuthIDToken, GoogleTokenExchangeResponse } from '@/types';
import { getGoogleOAuthTokenURL } from '@/utils/functions/google-connect';
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

async function handler(request: NextRequest, session: any) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Authorization code not found', { status: 400 });
  }

  const tokenExchangeURL = getGoogleOAuthTokenURL();

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/callback`,
      grant_type: 'authorization_code',
    }),
  };

  try {
    const tokenResponse = await fetch(tokenExchangeURL, options);

    if (!tokenResponse.ok) {
      return NextResponse.redirect(
        new URL('/?sync=google-drive&status=failed&error=token_exchange_failed', request.url),
      );
    }

    const tokenData = (await tokenResponse.json()) as GoogleTokenExchangeResponse;

    const decodedToken = jwtDecode(tokenData.id_token) as DecodedGoogleAuthIDToken | null;

    if (!decodedToken) throw new Error('Invalid token returned by Google Provider');

    const adapter = await createAndUpdateAdapter({
      adapter_type: 'GOOGLE_DRIVE',
      name: `${decodedToken.given_name}'s Google Drive`,
      providerId: decodedToken.sub,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      refresh_token_expires_in: tokenData.refresh_token_expires_in,
      scope: tokenData.scope,
      userId: session.user.id,
    });

    await createAndUpdateAdapterAccountInfo({
      adapterId: adapter.id,
      avatar: decodedToken.picture,
      email: decodedToken.email,
      name: decodedToken.name,
    });

    return NextResponse.redirect(new URL('/?sync=google-drive&status=connected', request.url));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma Known Error:', {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma Validation Error:', error.message);
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('Prisma Initialization Error:', error.message);
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      console.error('Prisma Engine Panic:', error.message);
    } else if (error instanceof Error) {
      console.error('Generic Error:', error.message);
    } else {
      console.error('Unknown Error:', error);
    }

    throw error;
    // return NextResponse.redirect(
    //   new URL('/?sync=google-drive&status=failed&error=unexpected_error', request.url),
    // );
  }
}

export const GET = withAuth(handler);
