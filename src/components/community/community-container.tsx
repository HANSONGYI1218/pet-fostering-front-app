'use client';

import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import CommunityTile from './community-tile';
import CommunityTopList from './community-top-list';
import { PaginationDynamic } from '../common/papagination-dynamic';
import { useState } from 'react';

export default function CommunityContainer({ posts }: { posts: any }) {
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수
  const [currentPage, setCurrentPage] = useState(1);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const recentPopularPosts = posts
    .filter((post: { created_at: string | number | Date }) => {
      const createdAt = new Date(post.created_at);
      return createdAt >= oneMonthAgo && createdAt <= now;
    })
    .sort((a: { views: number }, b: { views: number }) => b.views - a.views)
    .slice(0, 10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 py-32">
      <h1 className="text-3xl font-bold">놀이터</h1>
      <Button variant={'destructive'} className="w-32 self-end">
        <Pencil />글 작성
      </Button>
      <div className="flex w-full items-start justify-center gap-6">
        <div className="flex w-full flex-1 flex-col justify-center gap-6">
          {posts.slice(startIdx, endIdx).map((post: any, idx: number) => (
            <CommunityTile key={startIdx + idx} post={post} />
          ))}
          <PaginationDynamic
            totalItems={posts.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <CommunityTopList recentPopularPosts={recentPopularPosts} />
      </div>
    </div>
  );
}
