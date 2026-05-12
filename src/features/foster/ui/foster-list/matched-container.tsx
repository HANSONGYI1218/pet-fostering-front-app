'use client';

import type { MatchedFosterAnimalListItem } from '@/entities/animal/animal-api';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import clsx from 'clsx';
import Autoplay from 'embla-carousel-autoplay';
import { Minus } from 'lucide-react';
import React from 'react';
import MatchedAnimalTile from './matched-tile';

export default function MatchedAnimalContainer({
  animals,
}: {
  animals: MatchedFosterAnimalListItem[];
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 100000, stopOnInteraction: true }),
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    handleSelect();

    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  const handleMove = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="flex w-full flex-col">
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
          slidesToScroll: 3,
        }}
        className="py-10"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {animals.map((animal, index) => (
            <CarouselItem
              key={index}
              className="mx-3 w-[28rem] basis-1/4 rounded-xl pl-1 2xl:basis-1/6"
            >
              <MatchedAnimalTile
                key={animal.id}
                animal={animal}
                index={index}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex w-full items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleMove(index)}
            className="cursor-pointer"
          >
            <Minus
              className={clsx(
                'h-24 w-12 cursor-pointer transition-all duration-200',
                current === index ? 'text-black' : 'text-gray-300',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
