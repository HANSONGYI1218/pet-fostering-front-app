'use client';

import { useState } from 'react';
import NoticeTile from './notice-tile';
import { NoticeListItem } from '@/types/notcie/notice-api';
import { PaginationDynamic } from '../common/papagination-dynamic';

export function NoticeContainer({ notices }: { notices: NoticeListItem[] }) {
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수
  const [currentPage, setCurrentPage] = useState(1);

  // 1️⃣ 공지 리스트 정렬 (isFixed true → 위로, 같은 그룹은 최신순)
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isFixed === b.isFixed)
      return b.createdAt.getTime() - a.createdAt.getTime();
    return a.isFixed ? -1 : 1;
  });

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const pagedNotices = sortedNotices.slice(startIdx, endIdx);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full flex-col">
        {pagedNotices.map((item, index) => (
          <NoticeTile notice={item} key={index} index={index + 1} />
        ))}
      </div>
      <PaginationDynamic
        totalItems={notices.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
