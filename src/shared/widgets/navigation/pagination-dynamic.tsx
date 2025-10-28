'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import type { MouseEvent } from 'react';

interface PaginationDynamicProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationDynamic({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationDynamicProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleChange =
    (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (page !== currentPage) onPageChange(page);
    };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePrevious} />
        </PaginationItem>

        {[...Array(totalPages)].map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
              href="#"
              isActive={currentPage === idx + 1}
              onClick={handleChange(idx + 1)}
            >
              {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext href="#" onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
