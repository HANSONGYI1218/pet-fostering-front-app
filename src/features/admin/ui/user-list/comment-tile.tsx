import { Card } from '@/shared/ui/card';
import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';

type CommentProps = {
  id: string;
  content?: string | null;
  likeCount?: number | null;
  post: {
    id: string;
    title?: string | null;
    content?: string | null;
  };
};

export default function CommentTile({ comment }: { comment: CommentProps }) {
  return (
    <Link
      href={`/community/${comment?.post?.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="flex flex-col border-neutral-50 bg-neutral-50">
        <span className="line-clamp-2 text-sm text-neutral-700">
          {comment?.content}
        </span>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex flex-row items-center gap-2">
            <ThumbsUp className="h-3.5 w-3.5" stroke="#a1a1a1" />
            <span
              className="text-sm text-neutral-400"
              data-testid="comment-like-count"
            >
              {comment?.likeCount}
            </span>
          </div>
        </div>
        <h1 className="line-clamp-2 text-xs text-neutral-400">
          {comment?.post?.title}에 대한 댓글
        </h1>
      </Card>
    </Link>
  );
}
