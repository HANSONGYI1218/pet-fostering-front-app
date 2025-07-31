import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
              href="#"
              isActive={currentPage === idx + 1}
              onClick={() => onPageChange(idx + 1)}
            >
              {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
