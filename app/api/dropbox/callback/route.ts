import { createAdapter } from '@/lib/api/adapter/create-adapter';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/with-auth';
import {
  getDropbboxUserAccountInfoURL,
  getDropboxOAuthTokenURL,
} from '@/utils/functions/dropbox-connect';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest, session: any) {
  const { searchParamsObj } = parse(req);
  const { code, state } = searchParamsObj;
  if (!code || !state) {
    return new Response('Missing code or state', { status: 400 });
  }

  const tokenExchangeURL = getDropboxOAuthTokenURL();

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!,
      client_secret: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/dropbox/callback`,
      grant_type: 'authorization_code',
    }),
  };

  try {
    const tokenResponse = await fetch(tokenExchangeURL, options);
    if (!tokenResponse.ok) {
      return new Response('Failed to exchange code for token', { status: 500 });
    }
    const tokenData = await tokenResponse.json();

    const userInfoUrl = getDropbboxUserAccountInfoURL();
    const option = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    };
    const userInfoResponse = await fetch(userInfoUrl, option);
    if (!userInfoResponse.ok) {
      return new Response('Failed to fetch user info from Dropbox', { status: 500 });
    }
    const userInfo = await userInfoResponse.json();

    const adapterAccountExistingCheck = await prisma.adapter.findFirst({
      where: {
        adapter_type: 'DROPBOX',
        userId: session.user.id,
        adapterAccountInfo: {
          email: userInfo.email,
        },
      },
      include: {
        adapterAccountInfo: true,
      },
    });

    if (adapterAccountExistingCheck) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=Dropbox account already connected`,
      );
    }

    const adapter = await createAdapter({
      adapter_type: 'DROPBOX',
      userId: session.user.id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      name: `${userInfo.name.given_name || userInfo.name.display_name}'s Dropbox`,
    });

    await prisma.adapterAccountInfo.create({
      data: {
        adapterId: adapter.id,
        email: userInfo.email,
        name: userInfo.name.given_name || userInfo.name.display_name,
        avatar: userInfo.profile_photo_url || undefined,
      },
    });

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?sync=dropbox&status=connected&message=Dropbox account connected successfully`,
    );
  } catch (error) {
    console.error('Error during Dropbox OAuth callback:', error);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=${error instanceof Error ? error.message : 'Unexpected error during Dropbox OAuth callback'}`,
    );
  }
}

export const GET = withAuth(handler);

function parse(request: NextRequest) {
  const url = new URL(request.url);
  const searchParamsObj: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    searchParamsObj[key] = value;
  });
  return { searchParamsObj };
}
