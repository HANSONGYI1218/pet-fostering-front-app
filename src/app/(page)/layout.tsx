import type { ReactNode } from 'react';

import TopBar from '@/shared/widgets/navigation/top-bar';
import BottomBar from '@/shared/widgets/navigation/bottom-bar';
import { Toaster } from '@/shared/ui/sonner';

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
