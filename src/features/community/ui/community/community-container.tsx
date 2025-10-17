'use client';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommunityTile from './community-tile';
import CommunityTopList from './community-top-list';
import { PaginationDynamic } from '@/components/common/papagination-dynamic';
import { useMemo, useState } from 'react';
import { PostItem } from '@/types/post/post-api';
import { selectRecentPopularPosts } from '@/features/community/domain/posts';

export default function CommunityContainer({ posts }: { posts: PostItem[] }) {
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수
  const [currentPage, setCurrentPage] = useState(1);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const hasPosts = posts.length > 0;
  const paginatedPosts = useMemo(
    () => (hasPosts ? posts.slice(startIdx, endIdx) : []),
    [endIdx, hasPosts, posts, startIdx],
  );

  const recentPopularPosts = useMemo(
    () => selectRecentPopularPosts(posts),
    [posts],
  );

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 py-32">
      <h1 className="text-3xl font-bold">놀이터</h1>
      <Button variant={'destructive'} className="w-32 self-end">
        <Pencil />글 작성
      </Button>
      <div className="flex w-full items-start justify-center gap-6">
        <div className="flex w-full flex-1 flex-col justify-center gap-6">
          {hasPosts ? (
            <>
              {paginatedPosts.map((post: PostItem) => (
                <CommunityTile key={post.id} post={post} />
              ))}
              <PaginationDynamic
                totalItems={posts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white/60 p-12 text-center text-neutral-500">
              <p>게시글이 아직 없습니다. 첫 글을 남겨보세요!</p>
            </div>
          )}
        </div>

        <CommunityTopList recentPopularPosts={recentPopularPosts} />
      </div>
    </div>
  );
}
