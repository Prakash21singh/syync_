import { createAndUpdateAdapter } from '@/lib/api/adapter/create-adapter';
import { createAndUpdateAdapterAccountInfo } from '@/lib/api/adapter/create-adapter-account-info';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/with-auth';
import {
  getDropbboxUserAccountInfoURL,
  getDropboxOAuthTokenURL,
} from '@/utils/functions/dropbox-connect';
import { NextRequest } from 'next/server';

interface DropboxTokenExchangeResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  uid: string;
  account_id: string;
}

interface DropboxAccountInfoResponse {
  account_id: string;
  name: {
    given_name: string;
    surname: string;
    familian_name: string;
    display_name: string;
  };
  email: string;
  profile_photo_url?: string;
}

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
    const tokenData = (await tokenResponse.json()) as DropboxTokenExchangeResponseData;

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

    const userInfo = (await userInfoResponse.json()) as DropboxAccountInfoResponse;

    const adapter = await createAndUpdateAdapter({
      adapter_type: 'DROPBOX',
      userId: session.user.id,
      access_token: tokenData.access_token,
      name: `${userInfo?.name.given_name}`,
      providerId: tokenData.account_id,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
      refresh_token_expires_in: undefined,
    });

    await createAndUpdateAdapterAccountInfo({
      adapterId: adapter.id,
      avatar: userInfo.profile_photo_url,
      email: userInfo.email,
      name: userInfo.name.given_name,
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
