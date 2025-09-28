'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import {
  clearStoredAuthTokens,
  resolveStoredAuthClaims,
  type AuthClaims,
} from '@/lib/auth/session';
import { redirectToKakaoLogout } from '@/lib/auth/kakao';

const NAV_ITEMS = [
  {
    href: '/foster-list',
    name: '임보를 기다려요',
    segment: 'foster-list',
  },
  {
    href: '/record',
    name: '돌봄 기록',
    segment: 'record',
  },
  {
    href: '/community',
    name: '놀이터',
    segment: 'community',
  },
  {
    href: '/mypage',
    name: '내 정보',
    segment: 'mypage',
  },
  {
    href: '/notice',
    name: '공지사항',
    segment: 'notice',
  },
] as const;

export default function TopBar() {
  const path = usePathname();
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthClaims | null>(null);

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
  const currentSegment = useMemo(() => {
    if (!path) {
      return null;
    }

    return path.split('/')[1] ?? null;
  }, [path]);

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Link href="/main" className="flex shrink-0 items-center" aria-label="홈">
          <Image
            src="/main-logo.png"
            width={150}
            height={70}
            alt="main-logo"
            priority
          />
        </Link>
        <div className="flex flex-1 justify-center">
          <NavigationMenu aria-label="주요 메뉴">
            <NavigationMenuList>
              {NAV_ITEMS.map((item) => {
                const isActive = item.segment === currentSegment;

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        data-active={isActive ? 'true' : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={`${navigationMenuTriggerStyle()} gap-2`}
                      >
                        <span>{item.name}</span>
                        {isActive ? (
                          <Image
                            src="/icons/paw.svg"
                            width={24}
                            height={24}
                            alt="paw"
                            className="rotate-12"
                          />
                        ) : null}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
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
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline" size="sm">
              로그인
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
