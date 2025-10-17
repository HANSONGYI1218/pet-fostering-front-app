import type { ReactNode } from 'react';

import TopBar from '@/components/common/top-bar';
import BottomBar from '@/components/common/bottom-bar';
import { Toaster } from '@/components/ui/sonner';

export default function PageGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="flex-1">{children}</div>
      <Toaster />
      <BottomBar />
    </div>
  );
}
