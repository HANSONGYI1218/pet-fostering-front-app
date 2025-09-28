'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import {
  clearStoredAuthTokens,
  resolveStoredAuthClaims,
  type AuthClaims,
} from '@/lib/auth/session';
import { redirectToKakaoLogout } from '@/lib/auth/kakao';

export default function TopBar() {
  const path = usePathname();
  const router = useRouter();
  const [page, setPage] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthClaims | null>(null);

  const menuValues = [
    {
      href: '/foster-list',
      name: '임보를 기다려요',
      page: 'foster-list',
    },
    {
      href: '/record',
      name: '돌봄 기록',
      page: 'record',
    },
    {
      href: '/community',
      name: '놀이터',
      page: 'community',
    },

    {
      href: `/mypage`,
      name: '내 정보',
      page: 'mypage',
    },
    {
      href: `/notice`,
      name: '공지사항',
      page: 'notice',
    },
  ];

  useEffect(() => {
    if (!path) return; // path가 없으면 실행 안 함

    const routerPath = path.split('/')[1];
    setPage(routerPath);
    setAuthUser(resolveStoredAuthClaims());
  }, [path]); // path가 변경될 때 실행

  useEffect(() => {
    const syncAuth = () => {
      setAuthUser(resolveStoredAuthClaims());
    };

    syncAuth();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', syncAuth);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', syncAuth);
      }
    };
  }, []);

  const handleLogout = useCallback(() => {
    clearStoredAuthTokens();
    setAuthUser(null);

    try {
      redirectToKakaoLogout();
    } catch {
      router.push('/login');
    }
  }, [router]);

  const userLabel = useMemo(() => {
    if (!authUser) {
      return '';
    }

    if (authUser.displayName) {
      return authUser.displayName;
    }

    const rawId = authUser.userId;
    const normalized = rawId.includes(':')
      ? rawId.split(':').pop() ?? rawId
      : rawId;

    return normalized;
  }, [authUser]);

  const avatarUrl = authUser?.avatarUrl ?? null;

  return (
    <header
      className={`sticky top-0 z-30 flex w-full items-center justify-between border-b bg-white px-10 py-4 transition duration-700`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <div className="flex w-2/3 items-center justify-between">
          <Link href="/main">
            <Image
              src="/main-logo.png"
              width={150}
              height={70}
              alt="main-logo"
            />
          </Link>

          {menuValues?.map((menuValue) => (
            <Link
              key={menuValue?.name}
              href={menuValue?.href}
              className="group flex"
            >
              <Button
                onClick={() => {
                  setPage(menuValue?.page);
                }}
                variant="ghost"
                className={`flex gap-2 ${
                  page === menuValue?.page && 'font-bold text-black'
                }`}
              >
                {menuValue?.name}{' '}
                <Image
                  src="/icons/paw.svg"
                  width={24}
                  height={24}
                  alt="paw"
                  className={`rotate-12 ${
                    page === menuValue?.page ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Button>
            </Link>
          ))}
        </div>
        {authUser ? (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="사용자 프로필 사진"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
                unoptimized
              />
            ) : null}
            <span className="text-sm font-medium text-neutral-600">
              {userLabel}
            </span>
            <Button
              variant="outline_black"
              className="px-2 py-1"
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline_black" className="px-2 py-1">
              로그인
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
