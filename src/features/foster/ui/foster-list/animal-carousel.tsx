'use client';

import { cn } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function AnimalCarousel({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    updateCurrent();
    api.on('select', updateCurrent);

    return () => {
      api.off('select', updateCurrent);
    };
  }, [api]);

  return (
    <div className="flex w-full flex-col">
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
                <div className="relative h-full w-full">
                  <Image
                    src={image}
                    alt={`animal-${index + 1}`}
                    fill
                    className="rounded-xl object-cover"
                    sizes="(min-width: 768px) 40vw, 100vw"
                  />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images?.length > 1 && (
          <>
            <CarouselPrevious className="left-8" />
            <CarouselNext className="right-8" />
          </>
        )}
      </Carousel>
      {images?.length > 1 && (
        <div className="mx-auto flex gap-4 py-3">
          {Array.from({ length: images?.length ?? 0 }).map((_, index) => {
            const isActive = current - 1 === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-3 w-3 rounded-full transition-colors',
                  isActive ? 'bg-[#7c7c7c]' : 'bg-[#d4d4d4]',
                )}
                aria-label={`이미지 ${index + 1} 보기`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
