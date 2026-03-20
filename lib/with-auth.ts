import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

type RouteContext = {
  params?: Promise<{}>;
};

export const withAuth = (
  handler: (req: NextRequest, session: any, context: RouteContext) => Promise<Response>,
) => {
  return async (req: NextRequest, context: RouteContext) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, session, context);
  };
};
