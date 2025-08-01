'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '../ui/badge';

export default function TopBar() {
  const path = usePathname();
  const [page, setPage] = useState<string | null>(null);

  const menuValues = [
    {
      href: '/foster-list',
      name: '임보를 기다려요',
      page: 'foster-list',
      accessUserTypes: ['USER', 'ORGANIZATION', 'OWNER'],
    },
    {
      href: '/record',
      name: '돌봄 기록',
      page: 'record',
      accessUserTypes: ['USER', 'OWNER'],
    },
    {
      href: '/community',
      name: '놀이터',
      page: 'community',
      accessUserTypes: ['USER', 'ORGANIZATION', 'OWNER'],
    },

    {
      href: `/mypage`,
      name: '내 정보',
      page: 'mypage',
      accessUserTypes: ['USER', 'ORGANIZATION', 'OWNER'],
    },
    {
      href: `/notice`,
      name: '공지사항',
      page: 'notice',
      accessUserTypes: ['USER', 'ORGANIZATION', 'OWNER'],
    },
  ];

  useEffect(() => {
    if (!path) return; // path가 없으면 실행 안 함

    const router = path.split('/')[1];
    setPage(router);
  }, [path]); // path가 변경될 때 실행

  return (
    <header
      className={`sticky top-0 z-30 flex w-full flex-col bg-white transition duration-700`}
    >
      <div className="flex border-b py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-16">
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
          <Link href="/login">
            <Button variant="outline_black" className="px-2 py-1">
              로그인
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
