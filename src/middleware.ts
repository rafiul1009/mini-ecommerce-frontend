import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/register' || path === '/';

  const token = request.cookies.get('token')?.value || '';

  console.log(`Path: ${path}, IsPublicPath: ${isPublicPath}, HasToken: ${Boolean(token)}`);
  console.log("Request Cookie Header:", request.headers.get('cookie'));

  if (!isPublicPath && !token) {
    console.log('Redirecting to login: No token found')
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicPath && path !== '/' && token) {
    console.log('Redirecting to Home: Token exists')
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
