'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button } from '@/shared/ui/button';

type RetryButtonProps = {
  label?: string;
  className?: string;
};

export default function RetryButton({
  label = '다시 시도',
  className,
}: RetryButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {label}
    </Button>
  );
}
