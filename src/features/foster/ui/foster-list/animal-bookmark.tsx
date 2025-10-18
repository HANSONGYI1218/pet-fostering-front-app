'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { resolveStoredAccessToken } from '@/lib/auth/session';

export default function AnimalBookmark({
  isBookmarked,
}: {
  isBookmarked: boolean;
}) {
  const [isChecked, setIsChecked] = useState(isBookmarked);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsChecked(isBookmarked);
  }, [isBookmarked]);

  useEffect(() => {
    setIsVisible(Boolean(resolveStoredAccessToken()));
  }, []);

  if (!isVisible) {
    return null;
  }

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
