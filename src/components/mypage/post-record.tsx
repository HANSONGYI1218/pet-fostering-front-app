'use client';

import { useMemo, useState } from 'react';
import { userPosts } from '@/lib/dummydata';
import { Card, CardAction, CardHeader } from '../ui/card';
import { MessageSquareText, ThumbsUp, Eye } from 'lucide-react';
import Link from 'next/link';
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
import { filterPostList } from '@/domain/community/posts';
import { PostItemByUserId } from '@/types/post/post-api';
import Image from 'next/image';

export default function PostRecord() {
  const [sorted, setSorted] = useState<string>('desc');
  const [search, setSearch] = useState('');

  const posts = userPosts.sort((a, b) => {
    const aDate = new Date(a.created_at).getTime();
    const bDate = new Date(b.created_at).getTime();
    return bDate - aDate; // ✅ 최신순 (desc)
  });

  const filteredPosts = useMemo(() => {
    const result = filterPostList(posts ?? [], {
      sort: sorted,
      keyword: search,
    });

    return result;
  }, [posts, sorted, search]);

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
              placeholder="제목 또는 내용을 검색해보세요."
              onChangeValue={setSearch}
              className="w-full md:w-72"
            />
          </CardAction>
        </CardHeader>
      </Card>
      <div className="flex w-full flex-col gap-6">
        {filteredPosts?.map((post: PostItemByUserId, index: number) => {
          const commentCount = post?.commentCount ?? 0;

          return (
            <Link
              key={index}
              href={`/community/${post?.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="transition-all duration-500 hover:shadow-lg">
                <div className="flex w-full flex-col gap-5">
                  <span className="line-clamp-1 text-lg font-semibold">
                    {post?.title}
                  </span>
                  <div className="flex w-full gap-10">
                    <span className="line-clamp-3 flex-1 whitespace-pre-line text-neutral-700">
                      {post?.content}
                    </span>
                    {post?.images && post?.images?.length > 0 && (
                      <div className="relative flex h-16 w-16">
                        <Image
                          src={post?.images[0]}
                          width={64}
                          height={64}
                          alt="images"
                          className="relative z-20 rounded-lg object-cover"
                        />
                        {post?.images?.length > 1 && (
                          <>
                            <div className="absolute right-0 bottom-0 z-10 flex h-full w-full translate-x-1.5 rotate-12 rounded-lg bg-neutral-300" />
                            <div className="absolute right-0 bottom-0 z-0 flex h-full w-full translate-x-2.5 rotate-[20deg] rounded-lg bg-neutral-300/50" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex w-full justify-between gap-5">
                    <span className="text-muted-foreground">
                      {post?.created_at &&
                        format(post.created_at, 'yyyy.MM.dd')}
                    </span>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1">
                        <MessageSquareText
                          className="h-4 w-4"
                          stroke="#525252"
                        />
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
        })}
      </div>
    </div>
  );
}
