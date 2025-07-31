import { Card } from '../ui/card';
import { Eye, MessageSquareText, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CommunityTile({ post }: { post: any }) {
  return (
    <Link href={`/community/${post?.id}`} target="_blank">
      <Card className="transition-all duration-500 hover:shadow-lg">
        <div className="flex w-full flex-1 flex-col gap-3">
          <span className="line-clamp-1 text-lg font-semibold">
            {post?.title}
          </span>
          <span className="line-clamp-2 text-neutral-500">{post?.content}</span>
          <div className="flex w-full justify-between gap-5">
            <div className="flex items-center gap-3">
              <Image
                src="/icons/profile.svg"
                width={32}
                height={32}
                alt="profile"
              />
              <span className="text-[#525252]">By {post?.user?.nickanme}</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1">
                <MessageSquareText className="h-4 w-4" stroke="#525252" />
                <span className="text-[#525252]">{2}</span>
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
