'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dot } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AnimalCarousel({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col">
      <Carousel
        setApi={setApi}
        opts={{
          containScroll: 'trimSnaps',
          slidesToScroll: 1,
          loop: true,
          align: 'start',
        }}
        className="overflow-hidden rounded-xl"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="aspect-[4/3] w-full cursor-default gap-0 overflow-hidden p-0">
                <img
                  src={image}
                  className="h-full w-full rounded-xl object-cover"
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-8" />
        <CarouselNext className="right-8" />
      </Carousel>
      <div className="mx-auto flex gap-4 py-3">
        {Array.from({ length: images?.length ?? 0 }).map((_, index) => (
          <Dot
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-3 w-3 cursor-pointer rounded-full ${
              current - 1 === index ? 'bg-[#7c7c7c]' : 'bg-[#d4d4d4]'
            }`}
            stroke={current - 1 === index ? '#7c7c7c' : '#d4d4d4'}
            fill={current - 1 === index ? '#7c7c7c' : '#d4d4d4'}
          />
        ))}
      </div>

      {/* <div className="grid grid-cols-4 gap-2">
        {others.map(({ src, i }) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i)}
            className="cursor-pointer overflow-hidden rounded-md border"
            aria-label={`Go to image ${i + 1}`}
          >
            <div className="aspect-[4/3] w-full">
              <img
                src={src}
                alt={`thumbnail-${i}`}
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </button>
        ))}
      </div> */}
    </div>
  );
}
