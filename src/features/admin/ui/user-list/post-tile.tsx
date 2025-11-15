import { Card } from '@/shared/ui/card';
import { Eye, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

type PostProps = {
  id: string;
  title?: string | null;
  content?: string | null;
  viewCount?: number | null;
  likeCount?: number | null;
};

export default function PostTile({ post }: { post: PostProps }) {
  return (
    <Link
      href={`/community/${post?.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="flex flex-col border-neutral-50 bg-neutral-50">
        <h1 className="line-clamp-2 font-semibold">{post?.title}</h1>
        <span className="line-clamp-3 text-sm text-neutral-700">
          {post?.content}
        </span>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex flex-row items-center gap-2">
            <ThumbsUp className="h-3.5 w-3.5" stroke="#a1a1a1" />
            <span
              className="text-sm text-neutral-400"
              data-testid="post-like-count"
            >
              {post?.likeCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" stroke="#a1a1a1" />
            <span className="text-sm text-neutral-400">{post?.viewCount}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
