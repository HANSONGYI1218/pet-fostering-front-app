import { NextRequest, NextResponse } from 'next/server';
import { parseAuthClaims } from './lib/auth/session';
import { ACCESS_TOKEN_STORAGE_KEY } from './lib/auth/kakao';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_STORAGE_KEY)?.value;

  const claims = token ? parseAuthClaims(token) : undefined;
  const role = claims?.role ?? undefined;

  const pathname = req.nextUrl.pathname;

  // 🔥 여기서 딱 한 번만 Response 생성
  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);

  // USER 접근 제어
  if (role === 'USER' && pathname.startsWith('/organization')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ORG 접근 제어
  if (
    role === 'ORG' &&
    ['/foster_list', '/record'].some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 기본
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
