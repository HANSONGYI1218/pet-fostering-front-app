'use client';

import { useMemo } from 'react';
import NoticeTile from './notice-tile';
import type { NoticeListItem } from '@/entities/notice/notice-api';
import { PaginationDynamic } from '@/shared/widgets/navigation/pagination-dynamic';
import { usePagination } from '@/shared/hooks/use-pagination';

export function NoticeContainer({ notices }: { notices: NoticeListItem[] }) {
  const sortedNotices = useMemo(
    () =>
      [...notices].sort((a, b) => {
        if (a.isFixed === b.isFixed) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return a.isFixed ? -1 : 1;
      }),
    [notices],
  );
  const {
    pageItems: pagedNotices,
    currentPage,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedNotices, { itemsPerPage: 10 });

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full flex-col">
        {pagedNotices.map((notice) => (
          <NoticeTile notice={notice} key={notice.id} />
        ))}
      </div>
      <PaginationDynamic
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={goToPage}
      />
    </div>
  );
}
