import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePagination } from '@/shared/hooks/use-pagination';

describe('usePagination', () => {
  it('초기 페이지와 항목 정보를 반환한다', () => {
    const items = Array.from({ length: 25 }, (_, idx) => idx + 1);
    const { result } = renderHook(() =>
      usePagination(items, { itemsPerPage: 10 }),
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalItems).toBe(25);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageItems).toEqual(
      Array.from({ length: 10 }, (_, idx) => idx + 1),
    );
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(10);
  });

  it('페이지 이동 시 경계를 벗어나지 않도록 보정한다', () => {
    const items = Array.from({ length: 12 }, (_, idx) => idx + 1);
    const { result } = renderHook(() =>
      usePagination(items, { itemsPerPage: 5 }),
    );

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.pageItems).toEqual([11, 12]);

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.goToPrevious();
      result.current.goToPrevious();
      result.current.goToPrevious();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('목록 길이가 줄어들면 페이지 위치를 재조정한다', () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: number[] }) =>
        usePagination(items, { itemsPerPage: 4 }),
      {
        initialProps: {
          items: Array.from({ length: 12 }, (_, idx) => idx + 1),
        },
      },
    );

    act(() => {
      result.current.goToPage(3);
    });
    expect(result.current.currentPage).toBe(3);

    rerender({
      items: Array.from({ length: 6 }, (_, idx) => idx + 1),
    });

    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems).toEqual([5, 6]);
  });
});
