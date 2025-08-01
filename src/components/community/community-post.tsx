import { format } from 'date-fns';
import { Card } from '../ui/card';
import {
  Bookmark,
  EllipsisVertical,
  Eye,
  Pencil,
  ThumbsUp,
} from 'lucide-react';
import Image from 'next/image';
import { ko } from 'date-fns/locale';
import { Button } from '../ui/button';
import { PostItem } from '@/types/post/post-api';

export default function CommunityPost({
  post,
}: {
  post: PostItem | undefined;
}) {
  return (
    <Card className="relative cursor-default">
      <Bookmark
        className="absolute -top-3 right-3 h-9 w-9"
        fill="#fde047"
        stroke="#facc15"
        strokeWidth={0.7}
      />
      <div className="flex w-full flex-1 flex-col gap-3">
        <span className="text-xl font-semibold">{post?.title}</span>
        <div className="flex w-full justify-between gap-5">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/profile.svg"
              width={32}
              height={32}
              alt="profile"
            />
            <span className="font-semibold">By {post?.user?.nickname}</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex cursor-pointer items-center gap-1">
              <ThumbsUp className="h-4 w-4" stroke="#525252" />
              <span className="text-[#525252]">{post?.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" stroke="#525252" />
              <span className="text-[#525252]">{post?.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <EllipsisVertical className="h-4 w-4" stroke="#525252" />
            </div>
          </div>
        </div>

        <span className="py-10 text-neutral-500">
          {post?.content.split('<br/>').map((line: string, i: number) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[#525252]">
          {post?.created_at &&
            format(post?.created_at, 'yyyy.MM.dd a hh:mm', { locale: ko })}
        </span>
        <Button variant={'destructive'} className="w-32 self-end">
          <Pencil />
          댓글 작성
        </Button>
      </div>
    </Card>
  );
}
