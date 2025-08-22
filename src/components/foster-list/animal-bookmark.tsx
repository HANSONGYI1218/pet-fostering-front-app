'use client';

import { Heart } from 'lucide-react';
import { Card } from '../ui/card';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export default function AnimalBookmark({
  isBookmarked,
}: {
  isBookmarked: boolean;
}) {
  const [isChecked, setIsChecked] = useState(isBookmarked);

  useEffect(() => {
    setIsChecked((prev) => !prev);
  }, [isBookmarked]);

  return (
    <Button
      className="absolute top-4 right-4 z-10 rounded-md bg-white p-3 hover:bg-white/80"
      onClick={(e) => {
        setIsChecked((prev) => !prev);
      }}
    >
      <Heart
        className={`h-5 w-5`}
        stroke={isChecked ? '#EA1B1B' : '#BFBFBF'}
        fill={isChecked ? '#EA1B1B' : '#BFBFBF'}
      />
    </Button>
  );
}
