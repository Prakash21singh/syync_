import { adaperExistAlready } from '@/lib/api/adapter/adapter-exist-already';
import { withAuth } from '@/lib/with-auth';
import { NextRequest, NextResponse } from 'next/server';

interface QueryParams {
  adapterType: 'GOOGLE_DRIVE' | 'DROPBOX';
}

async function handler(req: NextRequest, session: any) {
  const { searchParams } = new URL(req.url);
  const adapterType = searchParams.get('adapterType') as QueryParams['adapterType'];

  console.log({adapterType})
  const userId = session.user.id;

  if (adapterType) {
    const adapterExists = await adaperExistAlready({
      adapterType: adapterType,
      userId: userId,
    });

    return NextResponse.json({ exists: adapterExists });
  }

  return NextResponse.json({ error: 'Adapter type is required' }, { status: 400 });
}

export const GET = withAuth(handler);
