'use client';

import { useMemo, useState } from 'react';
import { userComments } from '@/lib/dummydata';
import { Card, CardAction, CardHeader } from '../ui/card';
import { MessageSquareText, ThumbsUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import SearchBox from '../common/search-box';
import { filterCommentList } from '@/domain/community/comment';
import { toDate } from '@/lib/utils';
import Link from 'next/link';
import { ko } from 'date-fns/locale/ko';
import { toast } from 'sonner';
import { CommentItemByUserId } from '@/types/comment/comment-api';

export default function CommentRecord() {
  const [sorted, setSorted] = useState<string>('desc');
  const [search, setSearch] = useState('');

  const comments = userComments.sort((a, b) => {
    const aDate = new Date(a.created_at).getTime();
    const bDate = new Date(b.created_at).getTime();
    return bDate - aDate; // ✅ 최신순 (desc)
  });

  const filteredComments = useMemo(() => {
    const result = filterCommentList(comments ?? [], {
      sort: sorted,
      keyword: search,
    });

    return result;
  }, [comments, sorted, search]);

  return (
    <div className="flex w-full flex-col gap-10">
      <Card className="cursor-auto border-none p-0 shadow-none">
        <CardHeader className="gap-4 p-0">
          <div className="flex flex-wrap items-center gap-2">
            <Select onValueChange={setSorted} defaultValue={'desc'}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="최신순" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="desc">최신순</SelectItem>
                  <SelectItem value="asc">오래된순</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <CardAction className="w-full">
            <SearchBox
              placeholder="댓글 내용 또는 게시물 제목을 검색해보세요."
              onChangeValue={setSearch}
              className="w-full md:w-72"
            />
          </CardAction>
        </CardHeader>
      </Card>
      <div className="flex w-full flex-col gap-6">
        {filteredComments?.map(
          (comment: CommentItemByUserId, index: number) => {
            return (
              <Link
                key={index}
                onClick={(e) => {
                  if (!comment?.post?.id) {
                    e.preventDefault(); // 링크 이동 막기
                    toast('해당 댓글의 게시글이 작성자에 의해 지워졌어요.', {});
                  }
                }}
                href={`/community/${comment?.post?.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="gap-5 transition-all duration-500 hover:shadow-lg">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <MessageSquareText className="h-4 w-4" />
                    <span>
                      &quot;
                      {comment?.post?.id
                        ? comment?.post?.title
                        : '지워진 게시글의'}
                      &quot; 의 댓글
                    </span>
                  </div>
                  <span className="line-clamp-3 font-semibold whitespace-pre-line">
                    {comment?.content}
                  </span>
                  <div className="flex w-full justify-between gap-5">
                    <span className="text-[#525252]">
                      {format(
                        toDate(comment.created_at),
                        'yyyy.MM.dd a hh:mm',
                        {
                          locale: ko,
                        },
                      )}
                    </span>
                    <div className="flex cursor-pointer items-center gap-1">
                      <ThumbsUp className="h-4 w-4" stroke="#525252" />
                      <span className="text-[#525252]">{comment?.likes}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          },
        )}
      </div>
    </div>
  );
}
