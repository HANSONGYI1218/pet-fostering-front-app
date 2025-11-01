'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { useAuthClaims } from '@/lib/auth/use-auth-claims';

export default function AnimalBookmark({
  isBookmarked,
}: {
  isBookmarked: boolean;
}) {
  const { isAuthenticated } = useAuthClaims();
  const [isChecked, setIsChecked] = useState(isBookmarked);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsChecked(isBookmarked);
  }, [isBookmarked]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label="즐겨찾기 토글"
      className="text-destructive absolute top-4 right-4 z-10 bg-white/90 shadow-sm hover:bg-white"
      onClick={() => {
        setIsChecked((prev) => !prev);
      }}
      aria-pressed={isChecked}
    >
      <Heart
        className="size-5"
        stroke={isChecked ? '#EA1B1B' : '#BFBFBF'}
        fill={isChecked ? '#EA1B1B' : '#BFBFBF'}
      />
    </Button>
  );
}
