import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/gmn', '/kanban', '/editor'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path) || pathname === '/');

  if (isProtected && !token) {
    // Redirect to login page
    const loginUrl = new URL('/auth', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/auth' && token) {
    // Redirect to dashboard page
    const dashboardUrl = new URL('/gmn', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
