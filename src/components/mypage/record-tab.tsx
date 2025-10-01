'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import PostRecord from './post-record';
import CommentRecord from './comment-record';

export default function RecordTab() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="flex w-full flex-col gap-10">
      <h1 className="text-xl font-semibold">활동 기록</h1>
      <div className="flex h-14 w-full items-center border-b">
        <Button
          variant={'ghost'}
          onClick={() => {
            if (currentPage !== 0) {
              setCurrentPage(0);
            }
          }}
          className={`h-full rounded-none font-semibold ${currentPage === 0 ? 'border-b-2 border-[#00592d] text-[#00592d] hover:text-[#00592d]' : 'border-b-2 border-neutral-100 text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-600'}`}
        >
          작성 글
        </Button>
        <Button
          variant={'ghost'}
          onClick={() => {
            if (currentPage !== 1) {
              setCurrentPage(1);
            }
          }}
          className={`h-full rounded-none font-semibold ${currentPage === 1 ? 'border-b-2 border-[#00592d] text-[#00592d] hover:text-[#00592d]' : 'border-b-2 border-neutral-100 text-neutral-600 hover:border-b-2 hover:border-neutral-300 hover:text-neutral-600'}`}
        >
          작성 댓글
        </Button>
      </div>
      {currentPage === 0 ? <PostRecord /> : <CommentRecord />}
    </div>
  );
}
