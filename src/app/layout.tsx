/* eslint-disable @next/next/no-css-tags */
import './globals.css';
import localFont from 'next/font/local';
import TopBar from '@/shared/widgets/navigation/top-bar';
import { Toaster } from '@/shared/ui/sonner';
import BottomBar from '@/shared/widgets/navigation/bottom-bar';
import { createAppMetadata } from '@/shared/config/seo';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata = createAppMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="//fonts.googleapis.com/earlyaccess/nanumpenscript.css"
        />
      </head>
      <body className={pretendard.className}>
        <div className="flex min-h-screen flex-col">
          <TopBar />
          <div className="flex-1">{children}</div>
          <Toaster />
          <BottomBar />
        </div>
      </body>
    </html>
  );
}
