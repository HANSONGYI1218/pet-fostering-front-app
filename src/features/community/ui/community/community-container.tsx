'use client';

import CommunityTile from './community-tile';
import CommunityTopList from './community-top-list';
import { PaginationDynamic } from '@/shared/widgets/navigation/papagination-dynamic';
import { useMemo, useState } from 'react';
import { PostItem } from '@/entities/post/post-api';
import { selectRecentPopularPosts } from '@/features/community/domain/posts';
import EmptyBox from '@/shared/widgets/feedback/empty-box';
import PostFormDialog from './post-form-dialog';

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
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-12 md:py-16">
      <h1 className="text-xl font-bold md:text-3xl">놀이터</h1>
      <div className="flex items-center justify-end">
        <PostFormDialog />
      </div>
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
            <EmptyBox text="게시글이 아직 없습니다. 첫 글을 남겨보세요!" />
          )}
        </div>

        <CommunityTopList recentPopularPosts={recentPopularPosts} />
      </div>
    </div>
  );
}
