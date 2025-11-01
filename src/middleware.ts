import { NextRequest, NextResponse } from 'next/server';
import { parseAuthClaims } from './lib/auth/session';
import { ACCESS_TOKEN_STORAGE_KEY } from './lib/auth/kakao';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_STORAGE_KEY)?.value;

  // 토큰 없으면 claims를 undefined 처리
  const claims = token ? parseAuthClaims(token) : undefined;
  const role = claims?.role ?? undefined;

  const pathname = req.nextUrl.pathname;

  // ORG_ADMIN은 모든 페이지 접근 가능
  if (role === 'ORG_ADMIN') {
    return NextResponse.next();
  }

  // USER 접근 제어
  if (role === 'USER' && pathname.startsWith('/organization')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ADMIN 접근 제어
  if (
    role === 'ADMIN' &&
    ['/foster_list', '/record'].some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
