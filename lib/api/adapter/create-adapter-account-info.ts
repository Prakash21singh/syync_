import prisma from '@/lib/prisma';

interface CreateAndUpdateAdapterAccountInfoParams {
  adapterId: string;
  email?: string;
  name?: string;
  avatar?: string;
}


export const createAndUpdateAdapterAccountInfo = async ({
  adapterId,
  avatar,
  email,
  name
}:CreateAndUpdateAdapterAccountInfoParams) => {
  return await prisma.adapterAccountInfo.upsert({
    where:{
      adapterId,
    },
    update:{
      avatar,
      email,
      name,
    },
    create:{
      adapterId,
      avatar,
      email,
      name
    }
  })
}