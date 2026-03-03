import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/with-auth';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest, session: any) {
  try {
    const body = await req.json();

    if (!body.adapterId) {
      return NextResponse.json(
        {
          error: 'adapter_identification_required',
          message: 'Adapter Id Required',
        },
        {
          status: 400,
        },
      );
    }

    await prisma.adapterAccountInfo.delete({
      where: {
        adapterId: body.adapterId,
      },
    });

    await prisma.adapter.delete({
      where: {
        id: body.adapterId,
      },
    });

    return NextResponse.json(
      {
        message: 'Adapter Removed Successfully, Authenticate again.',
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log('Error on server', error);
    return new Response(
      error instanceof Error ? error.message : 'Unexpected error during migration',
      { status: 500 },
    );
  }
}

export const DELETE = withAuth(handler);
