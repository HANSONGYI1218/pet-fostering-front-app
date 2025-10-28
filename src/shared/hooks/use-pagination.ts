import { useCallback, useEffect, useMemo, useState } from 'react';

type UsePaginationOptions = {
  itemsPerPage?: number;
  initialPage?: number;
};

type UsePaginationResult<T> = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  pageItems: T[];
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
};

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min;
  }

  if (min > max) {
    return min;
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

export const usePagination = <T>(
  items: readonly T[],
  options: UsePaginationOptions = {},
): UsePaginationResult<T> => {
  const itemsPerPage = Math.max(1, options.itemsPerPage ?? 10);
  const totalItems = items.length;
  const totalPages = useMemo(
    () => (totalItems === 0 ? 0 : Math.ceil(totalItems / itemsPerPage)),
    [itemsPerPage, totalItems],
  );

  const normalizePage = useCallback(
    (page: number) => clamp(page, 1, Math.max(totalPages, 1)),
    [totalPages],
  );

  const [currentPage, setCurrentPage] = useState(() =>
    normalizePage(options.initialPage ?? 1),
  );

  useEffect(() => {
    setCurrentPage((prev) => normalizePage(prev));
  }, [normalizePage, totalItems]);

  const offset = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage],
  );

  const pageItems = useMemo(() => {
    if (totalItems === 0) {
      return [];
    }

    return items.slice(offset, offset + itemsPerPage);
  }, [items, offset, itemsPerPage, totalItems]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(normalizePage(page));
    },
    [normalizePage],
  );

  const goToNext = useCallback(() => {
    if (totalPages === 0) {
      return;
    }
    setCurrentPage((prev) => normalizePage(prev + 1));
  }, [normalizePage, totalPages]);

  const goToPrevious = useCallback(() => {
    if (totalPages === 0) {
      return;
    }
    setCurrentPage((prev) => normalizePage(prev - 1));
  }, [normalizePage, totalPages]);

  const startIndex = totalItems === 0 ? 0 : offset;
  const endIndex =
    totalItems === 0 ? 0 : Math.min(offset + itemsPerPage, totalItems);

  return {
    currentPage,
    totalItems,
    totalPages,
    itemsPerPage,
    pageItems,
    startIndex,
    endIndex,
    goToPage,
    goToNext,
    goToPrevious,
  };
};
