import prisma from '@/lib/prisma';

interface CreateAdapterParams {
  name: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: string;
  adapter_type: 'GOOGLE_DRIVE' | 'DROPBOX';
  userId: string;
}

export const createAdapter = async ({
  name,
  access_token,
  refresh_token,
  expires_in,
  refresh_token_expires_in,
  scope,
  token_type,
  adapter_type,
  userId,
}: CreateAdapterParams) => {
  return await prisma.adapter.create({
    data: {
      name,
      access_token,
      refresh_token,
      expires_in: expires_in ? new Date(Date.now() + expires_in * 1000) : undefined,
      refresh_token_expires_in: refresh_token_expires_in
        ? new Date(Date.now() + refresh_token_expires_in * 1000)
        : undefined,
      scope,
      token_type,
      adapter_type,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
