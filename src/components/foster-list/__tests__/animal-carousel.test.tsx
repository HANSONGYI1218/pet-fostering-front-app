import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';

import { AnimalCarousel } from '../animal-carousel';

const mockApiRef: { current: MockCarouselApi | null } = { current: null };

type MockCarouselApi = {
  selectedScrollSnap: () => number;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
  scrollTo: (index: number) => void;
};

vi.mock('@/components/ui/carousel', () => {
  const Carousel = ({ setApi, children }: { setApi?: (api: MockCarouselApi) => void; children: React.ReactNode }) => {
    React.useEffect(() => {
      if (setApi && mockApiRef.current) {
        setApi(mockApiRef.current);
      }
    }, [setApi]);

    return <div data-testid="carousel">{children}</div>;
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  const Control = (props: React.ComponentProps<'button'>) => <button type="button" {...props} />;

  return {
    Carousel,
    CarouselContent: Wrapper,
    CarouselItem: Wrapper,
    CarouselNext: Control,
    CarouselPrevious: Control,
  };
});

describe('AnimalCarousel', () => {
  it('언마운트 시 select 이벤트 리스너를 해제한다', () => {
    const selectHandlers: Array<() => void> = [];
    const removedHandlers: Array<() => void> = [];

    const api: MockCarouselApi = {
      selectedScrollSnap: vi.fn(() => 0),
      on: vi.fn((event, handler) => {
        if (event === 'select') {
          selectHandlers.push(handler);
        }
      }),
      off: vi.fn((event, handler) => {
        if (event === 'select') {
          removedHandlers.push(handler);
        }
      }),
      scrollTo: vi.fn(),
    };

    mockApiRef.current = api;

    const { unmount } = render(<AnimalCarousel images={["/a.jpg"]} />);

    expect(api.on).toHaveBeenCalledWith('select', expect.any(Function));
    expect(selectHandlers).toHaveLength(1);

    unmount();

    expect(api.off).toHaveBeenCalledWith('select', selectHandlers[0]);
    expect(removedHandlers).toContain(selectHandlers[0]);
  });
});
