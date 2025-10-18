import { PostItem } from '@/types/post/post-api';
import { Card } from '@/shared/ui/card';
import { Eye, MessageSquareText, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { stripHtml } from '@/shared/lib/utils';

export default function CommunityTile({ post }: { post: PostItem }) {
  const preview = stripHtml(post?.content ?? '').trim();
  const nickname = post?.user?.nickname ?? '익명';
  const commentCount = post?.commentCount ?? 0;

  return (
    <Link
      href={`/community/${post?.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="transition-all duration-500 hover:shadow-lg">
        <div className="flex w-full flex-1 flex-col gap-3">
          <span className="line-clamp-1 text-lg font-semibold">
            {post?.title}
          </span>
          <span className="line-clamp-2 text-neutral-500">{preview}</span>
          <div className="flex w-full justify-between gap-5">
            <div className="flex items-center gap-3">
              <Image
                src="/icons/profile.svg"
                width={32}
                height={32}
                alt="profile"
              />
              <span className="text-[#525252]">By {nickname}</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1">
                <MessageSquareText className="h-4 w-4" stroke="#525252" />
                <span className="text-[#525252]">{commentCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" stroke="#525252" />
                <span className="text-[#525252]">{post?.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" stroke="#525252" />
                <span className="text-[#525252]">{post?.views}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
