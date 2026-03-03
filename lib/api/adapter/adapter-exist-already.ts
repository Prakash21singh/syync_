import prisma from '@/lib/prisma';

interface AdapterExistAlreadyParams {
  adapterType: 'GOOGLE_DRIVE' | 'DROPBOX';
  userId: string;
}

export const adaperExistAlready = async ({ adapterType, userId }: AdapterExistAlreadyParams) => {
  return await prisma.adapter.findMany({
    where: {
      adapter_type: adapterType,
      userId,
    },
    select: {
      id: true,
      name: true,
      adapter_type: true,
      adapterAccountInfo: true,
    },
  });
};
