import CommentsContainer from '@/features/community/ui/community/comments-container';
import CommunityPost from '@/features/community/ui/community/community-post';
import {
  fetchCommunityComments,
  fetchCommunityPost,
  // updatePostView,
} from '@/features/community/api/community';
import { logError } from '@/shared/lib/logging';
import type { CommentItem } from '@/entities/comment/comment-api';
import type { PostItem } from '@/entities/post/post-api';
import type { AsyncParams } from '@/shared/types/next';

export default async function CommunityPostPage({
  params,
}: AsyncParams<{ id: string }>) {
  const { id } = await params;

  let post: PostItem | null = null;
  let comments: CommentItem[] = [];

  try {
    post = await fetchCommunityPost(id);
    // await updatePostView(id);
  } catch (error) {
    logError('커뮤니티 게시글 상세 불러오기 실패', error);
  }

  let commentsError = false;
  try {
    comments = await fetchCommunityComments(id);
  } catch (error) {
    logError('커뮤니티 댓글 불러오기 실패', error);
    commentsError = true;
  }

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-6 pt-20 pb-40">
        <CommunityPost post={post ?? undefined} />
        <CommentsContainer initialComments={comments} isError={commentsError} />
      </div>
    </main>
  );
}
