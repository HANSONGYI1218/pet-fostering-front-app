'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Bookmark,
  EllipsisVertical,
  Eye,
  Loader2,
  ThumbsUp,
} from 'lucide-react';
import Image from 'next/image';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/shared/ui/menubar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import RetryButton from '@/shared/widgets/feedback/retry-button';
import type { PostItem } from '@/entities/post/post-api';
import { toDate, handleCopyLink } from '@/shared/lib/utils';
import {
  resolveStoredAccessToken,
  resolveStoredAuthClaims,
} from '@/lib/auth/session';
import PostFormDialog from './post-form-dialog';
import { toast } from 'sonner';
import {
  deleteBookmark,
  createBookmark,
  deletePost,
} from '../../api/community';
import { logError } from '@/shared/lib/logging';

type PostWithBookmark = PostItem & { isBookmarked?: boolean };

export default function CommunityPost({
  post,
}: {
  post: PostItem | undefined;
}) {
  const claims = resolveStoredAuthClaims();
  const userId = claims?.userId;
  const [token, setToken] = useState<string | null>(null);

  const resolvedPost = post ?? null;
  const initialBookmark = useMemo(
    () => (resolvedPost as PostWithBookmark | null)?.isBookmarked ?? false,
    [resolvedPost],
  );
  const [isBookmarked, setIsBookmarked] = useState(initialBookmark);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postLikeCnt, setPostLikeCnt] = useState(post?.likes ?? 0);

  // 브라우저에서만 access token 읽기
  useEffect(() => {
    const stored = resolveStoredAccessToken();
    setToken(stored);
  }, []);

  if (!resolvedPost || token === null) {
    return (
      <Card className="flex min-h-[220px] w-full flex-col items-center justify-center gap-4 text-center text-neutral-500">
        <span>게시글을 찾을 수 없습니다.</span>
        <RetryButton />
      </Card>
    );
  }

  const nickname = resolvedPost.user?.nickname ?? '익명';
  const createdAt = resolvedPost.created_at
    ? toDate(resolvedPost.created_at)
    : undefined;
  const contentLines = resolvedPost.content?.split('<br/>') ?? [];
  const isOwner = token && userId === resolvedPost.authorId;

  const handleBookmarkToggle = async () => {
    if (!resolvedPost?.id) {
      return toast('다시 한번 새로고침 해주세요.');
    }
    if (token) {
      try {
        if (isBookmarked) {
          await deleteBookmark(token, resolvedPost.id);
          setIsBookmarked(false);
          setPostLikeCnt((prev) => prev - 1);
        } else {
          await createBookmark(token, resolvedPost.id);
          setIsBookmarked(true);
          setPostLikeCnt((prev) => prev + 1);
        }
      } catch (error) {
        logError('댓글 업데이트 실패', error);
      }
    } else {
      toast('로그인 후 이용해주세요.');
    }
  };

  const handleDeletePost = async () => {
    if (!token) {
      toast('로그인 후 이용해 주세요.');
      return;
    }

    if (!post?.id) {
      return toast('다시 한번 새로고침 해주세요.');
    }
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await deletePost(token, post.id);
      toast('게시글을 삭제했어요.');
      setOpen(false);
    } catch {
      toast('게시글 삭제에 실패했어요. 잠시 뒤 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    handleCopyLink(url);
  };

  const editTrigger = (
    <Button
      type="button"
      variant={'ghost'}
      className="w-full cursor-default justify-start px-[6px] text-left text-sm font-normal hover:bg-neutral-100 hover:font-normal"
    >
      수정하기
    </Button>
  );

  return (
    <Card className="relative cursor-default px-3 py-4 md:p-10">
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full items-center justify-between">
          <span className="text-xl font-semibold">{resolvedPost.title}</span>
          <Bookmark
            className={`h-9 w-9 cursor-pointer`}
            onClick={handleBookmarkToggle}
            fill={isBookmarked ? '#00592d' : '#ffffff'}
            stroke="#00592d"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-3 py-3">
            <Image
              src="/icons/profile.svg"
              width={32}
              height={32}
              alt="profile"
            />
            <span className="text-sm text-neutral-500">By {nickname}</span>
          </div>
          <div className="flex w-full items-center justify-between gap-5">
            <span className="text-sm text-neutral-400">
              {createdAt &&
                format(createdAt, 'yyyy.MM.dd a hh:mm', { locale: ko })}
            </span>
            <div className="flex items-center gap-2 md:gap-5">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" stroke="#a1a1a1" />
                <span className="text-sm text-neutral-400">{postLikeCnt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" stroke="#a1a1a1" />
                <span className="text-sm text-neutral-400">
                  {resolvedPost.views}
                </span>
              </div>
              <Menubar className="border-none p-0">
                <MenubarMenu>
                  <MenubarTrigger className="p-0">
                    <EllipsisVertical
                      className="h-3.5 w-3.5 cursor-pointer"
                      stroke="#a1a1a1"
                    />
                  </MenubarTrigger>
                  <MenubarContent align="end" className="min-w-[8rem]">
                    <MenubarSub>
                      <MenubarSubTrigger>공유하기</MenubarSubTrigger>
                      <MenubarSubContent className="min-w-[4rem]">
                        <MenubarItem onClick={handleShareLink}>
                          링크복사
                        </MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    {isOwner ? (
                      <>
                        <MenubarSeparator />
                        <PostFormDialog
                          post={resolvedPost}
                          trigger={editTrigger}
                        />
                        <MenubarSeparator />
                        <MenubarItem
                          onClick={() => setOpen(true)}
                          className="hover:bg-neutral-100"
                        >
                          삭제하기
                        </MenubarItem>
                      </>
                    ) : null}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>정말 게시글을 지울까요?</DialogTitle>
                    <DialogDescription>
                      게시글을 지우면 다시 복구할 수 없습니다.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        취소
                      </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleDeletePost}>
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        '지우기'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {contentLines.length > 0 ? (
          <span className="py-10">
            {contentLines.map((line, i) => (
              <span key={`${resolvedPost.id}-line-${i}`}>
                {line}
                {i < contentLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
