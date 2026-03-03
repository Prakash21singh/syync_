import { createAdapter } from '@/lib/api/adapter/create-adapter';
import { createAdapterAccountInfo } from '@/lib/api/adapter/create-adapter-account-info';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/with-auth';
import { getGoogleOAuthTokenURL } from '@/utils/functions/google-connect';
import { headers } from 'next/headers';
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

    const tokenData = await tokenResponse.json();

    const userInfoRsponse = await fetch(process.env.GOOGLE_USERINFO_URL!, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoRsponse.ok) {
      return NextResponse.redirect(
        new URL('/?sync=google-drive&status=failed&error=user_info_fetch_failed', request.url),
      );
    }

    const userInfo = await userInfoRsponse.json();

    const adapter = await createAdapter({
      adapter_type: 'GOOGLE_DRIVE',
      userId: session.user.id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      refresh_token_expires_in: tokenData.refresh_token_expires_in,
      name: `${userInfo.name}'s Google Drive`,
    });

    const adapterAccountInfo = await createAdapterAccountInfo({
      adapterId: adapter.id,
      avatar: userInfo.picture,
      email: userInfo.email,
      name: userInfo.name,
    });

    return NextResponse.redirect(new URL('/?sync=google-drive&status=connected', request.url));
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.redirect(
      new URL('/?sync=google-drive&status=failed&error=unexpected_error', request.url),
    );
  }
}

export const GET = withAuth(handler);
