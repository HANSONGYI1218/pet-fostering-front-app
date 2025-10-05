'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    clearStoredAuthTokens();
    setAuthUser(null);

    try {
      redirectToKakaoLogout();
    } catch {
      router.push('/login');
    }
    closeMobileMenu();
  }, [closeMobileMenu, router]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const userLabel = useMemo(() => {
    if (!authUser) {
      return '';
    }

    if (authUser.displayName) {
      return authUser.displayName;
    }

    const rawId = authUser.userId;
    const normalized = rawId.includes(':')
      ? (rawId.split(':').pop() ?? rawId)
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

  useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu, path]);

  const renderNavItems = (itemClassName?: string, onSelect?: () => void) =>
    NAV_ITEMS.map((item) => {
      const isActive = item.segment === currentSegment;

      const linkProps = {
        href: item.href,
        'data-active': isActive ? 'true' : undefined,
        'aria-current': isActive ? 'page' : undefined,
        onClick: onSelect,
      } as const;

      const pawIconMobile = (
        <span className="flex w-6 justify-center">
          {isActive ? (
            <Image
              src="/icons/paw.svg"
              width={20}
              height={20}
              alt="paw"
              aria-hidden="true"
              className="rotate-12"
            />
          ) : (
            <span aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
      );

      return itemClassName ? (
        <li key={item.href}>
          <Link
            {...linkProps}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 ${itemClassName}`}
          >
            <span>{item.name}</span>
            {pawIconMobile}
          </Link>
        </li>
      ) : (
        <NavigationMenuItem key={item.href}>
          <NavigationMenuLink asChild>
            <Link
              key={item.href}
              {...linkProps}
              className={`${navigationMenuTriggerStyle()} gap-2`}
            >
              <span>{item.name}</span>
              <span className="flex w-6 justify-center">
                {isActive ? (
                  <Image
                    src="/icons/paw.svg"
                    width={24}
                    height={24}
                    alt="paw"
                    aria-hidden="true"
                    className="rotate-12"
                  />
                ) : (
                  <span aria-hidden="true" className="h-6 w-6" />
                )}
              </span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      );
    });

  return (
    <header className="bg-background sticky top-0 z-30 border-b">
      <div className="container_12 mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/main"
          className="flex shrink-0 items-center"
          aria-label="홈"
        >
          <Image
            src="/main-logo.png"
            width={140}
            height={60}
            alt="main-logo"
            priority
          />
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <NavigationMenu aria-label="주요 메뉴">
            <NavigationMenuList>{renderNavItems()}</NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-3">
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
              <span className="hidden text-sm font-medium text-neutral-600 sm:block">
                {userLabel}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex"
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen ? (
        <div className="md:hidden">
          <div
            role="presentation"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={closeMobileMenu}
          />
          <nav
            className="bg-background fixed inset-y-0 right-0 z-50 flex w-72 max-w-[calc(100%-3rem)] flex-col border-l shadow-lg"
            aria-label="모바일 메뉴"
          >
            <div className="flex h-16 items-center justify-between border-b px-4">
              <span className="text-base font-semibold">메뉴</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="모바일 메뉴 닫기"
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex flex-1 flex-col justify-between overflow-y-auto">
              <ul className="flex flex-col gap-1 p-4">
                {renderNavItems('text-neutral-700', closeMobileMenu)}
              </ul>
              <div className="border-t p-4">
                {authUser ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="사용자 프로필 사진"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                          unoptimized
                        />
                      ) : null}
                      <span className="text-sm font-medium text-neutral-600">
                        {userLabel}
                      </span>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Button asChild>
                    <Link href="/login" onClick={closeMobileMenu}>
                      로그인
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
