'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export default function AnimalBookmark({
  isBookmarked,
}: {
  isBookmarked: boolean;
}) {
  const [isChecked, setIsChecked] = useState(isBookmarked);

  useEffect(() => {
    setIsChecked(isBookmarked);
  }, [isBookmarked]);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className="absolute right-4 top-4 z-10 bg-white/90 text-destructive shadow-sm hover:bg-white"
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
