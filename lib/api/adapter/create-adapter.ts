import prisma from '@/lib/prisma';

interface CreateAndAdapterParams {
  name: string;
  providerId: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: string;
  adapter_type: 'GOOGLE_DRIVE' | 'DROPBOX';
  userId: string;
}

export const createAndUpdateAdapter = async ({
  name,
  access_token,
  adapter_type,
  providerId,
  userId,
  expires_in,
  refresh_token,
  refresh_token_expires_in,
  scope,
  token_type,
}: CreateAndAdapterParams) => {
  return await prisma.adapter.upsert({
    where: {
      userId,
      providerId: providerId,
    },
    update: {
      access_token,
      refresh_token,
      expires_in: new Date(Date.now() + expires_in! * 1000),
      refresh_token_expires_in: refresh_token_expires_in
        ? new Date(Date.now() + refresh_token_expires_in! * 1000)
        : undefined,
      scope,
    },
    create: {
      name,
      access_token,
      adapter_type,
      providerId,
      userId,
      expires_in: new Date(Date.now() + expires_in! * 1000),
      refresh_token,
      refresh_token_expires_in: refresh_token_expires_in
        ? new Date(Date.now() + refresh_token_expires_in! * 1000)
        : undefined,
      scope,
      token_type,
    },
  });
};
