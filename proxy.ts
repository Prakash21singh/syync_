import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { PROTECTED_ROUTES } from './utils/constants/protected-route';
import { PUBLIC_ROUTES } from './utils/constants/public-route';
import { parse } from './utils/functions/parse';

export async function proxy(req: NextRequest) {
  try {
    const { path: pathname, fullPath } = parse(req);
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // Unauthenticated user, protected route
    if (!session && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(
        new URL(
          `/login${pathname === '/' ? '' : `?next=${encodeURIComponent(fullPath)}`}`,
          req.url,
        ),
      );
    }

    // Authenticated user, public route
    if (session && PUBLIC_ROUTES.includes(pathname as any)) {
      if (pathname !== '/') {
        return NextResponse.redirect(new URL('/sync', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
