'use client';

import { useMemo } from 'react';

import { PostItem } from '@/entities/post/post-api';
import { selectRecentPopularPosts } from '@/features/community/domain/posts';
import { usePagination } from '@/shared/hooks/use-pagination';
import { PaginationDynamic } from '@/shared/widgets/navigation/pagination-dynamic';
import EmptyBox from '@/shared/widgets/feedback/empty-box';
import CommunityTile from './community-tile';
import CommunityTopList from './community-top-list';
import PostFormDialog from './post-form-dialog';

export default function CommunityContainer({ posts }: { posts: PostItem[] }) {
  const { pageItems, currentPage, goToPage, totalItems, itemsPerPage } =
    usePagination(posts, { itemsPerPage: 10 });
  const hasPosts = totalItems > 0;

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
              {pageItems.map((post: PostItem) => (
                <CommunityTile key={post.id} post={post} />
              ))}
              <PaginationDynamic
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={goToPage}
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
