import CommentsContainer from '@/components/community/comments-container';
import CommunityPost from '@/components/community/community-post';
import { dummyComments, dummyPosts } from '@/lib/dummydata';

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = dummyPosts.find((p) => p.id === id);
  const comments = dummyComments
    .filter((c) => c.post_id === id && c.parent_id === null)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-6 pt-20 pb-40">
        <CommunityPost post={post} />
        <CommentsContainer comments={comments} />
      </div>
    </main>
  );
}
