import prisma from '@/lib/prisma';

interface CreateAdapterAccountInfoParams {
  adapterId: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export const createAdapterAccountInfo = async ({
  adapterId,
  email,
  name,
  avatar,
}: CreateAdapterAccountInfoParams) => {
  return await prisma.adapterAccountInfo.create({
    data: {
      adapterId,
      email,
      name,
      avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
