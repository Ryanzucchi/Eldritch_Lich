import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // `/api` permanece como alias estável da versão corrente. O namespace v1 é
  // reescrito internamente, portanto não duplica handlers nem altera clientes.
  if (pathname.startsWith('/api/v1/')) {
    const versionedUrl = request.nextUrl.clone();
    versionedUrl.pathname = pathname.replace('/api/v1/', '/api/');
    const response = NextResponse.rewrite(versionedUrl);
    response.headers.set('X-API-Version', '1');
    return response;
  }

  // Protect all paths except auth-related ones
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtected = !isAuthRoute;

  if (isProtected && !token) {
    // Redirect to login page
    const loginUrl = new URL('/auth', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/auth' && token) {
    // Redirect to home page
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
