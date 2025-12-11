/* eslint-disable @next/next/no-css-tags */
import './globals.css';
import localFont from 'next/font/local';
import { Toaster } from '@/shared/ui/sonner';
import BottomBar from '@/shared/widgets/navigation/bottom-bar';
import { createAppMetadata } from '@/shared/config/seo';
import { headers } from 'next/headers';
import OrganizationTopBar from '@/shared/widgets/navigation/org-top-bar';
import UserTopbar from '@/shared/widgets/navigation/user-top-bar';
import MockTokenProvider from './mock-user';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata = createAppMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') ?? '';
  const isOrg = pathname.startsWith('/organization');

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="//fonts.googleapis.com/earlyaccess/nanumpenscript.css"
        />
      </head>
      <body className={pretendard.className}>
        <MockTokenProvider />
        <div className="flex min-h-screen flex-col">
          {isOrg ? <OrganizationTopBar /> : <UserTopbar />}
          <div className="flex-1">{children}</div>
          <Toaster />
          <BottomBar />
        </div>
      </body>
    </html>
  );
}
