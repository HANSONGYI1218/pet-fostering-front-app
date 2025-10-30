import type { Metadata } from 'next';
import { cache } from 'react';
import CommentsContainer from '@/features/community/ui/community/comments-container';
import CommunityPost from '@/features/community/ui/community/community-post';
import {
  fetchCommunityComments,
  fetchCommunityPost,
  updatePostView,
} from '@/features/community/api/community';
import { logError } from '@/shared/lib/logging';
import type { CommentItem } from '@/entities/comment/comment-api';
import type { PostItem } from '@/entities/post/post-api';
import type { AsyncParams } from '@/shared/types/next';
import { createAppMetadata } from '@/shared/config/seo';

const getCommunityPost = cache((id: string) => fetchCommunityPost(id));

const toExcerpt = (content: string) => {
  const text = content.replace(/\s+/g, ' ').trim();
  if (text.length === 0) {
    return '퍼디즈 커뮤니티의 임시보호 이야기와 정보를 확인하세요.';
  }
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
};

export async function generateMetadata({
  params,
}: AsyncParams<{ id: string }>): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getCommunityPost(id);
    const primaryImage = post.images?.[0];

    return createAppMetadata({
      title: `${post.title} | 커뮤니티 - 퍼디즈`,
      description: toExcerpt(post.content),
      path: `/community/${id}`,
      image: primaryImage
        ? {
            url: primaryImage,
            alt: `${post.title} 이미지`,
          }
        : undefined,
    });
  } catch {
    return createAppMetadata({
      title: '커뮤니티 글 상세 | 퍼디즈',
      description: '퍼디즈 커뮤니티의 상세 게시글을 확인하세요.',
      path: `/community/${id}`,
    });
  }
}

export default async function CommunityPostPage({
  params,
}: AsyncParams<{ id: string }>) {
  const { id } = await params;

  let post: PostItem | null = null;
  let comments: CommentItem[] = [];

  try {
    post = await getCommunityPost(id);
    try {
      await updatePostView(id);
    } catch (error) {
      logError('커뮤니티 게시글 조회수 증가 실패', error);
    }
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
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16">
        <CommunityPost post={post ?? undefined} />
        <CommentsContainer initialComments={comments} isError={commentsError} />
      </div>
    </main>
  );
}
