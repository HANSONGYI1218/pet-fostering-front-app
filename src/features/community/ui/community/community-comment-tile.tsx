'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { EllipsisVertical, Loader2, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
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
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import {
  resolveStoredAccessToken,
  resolveStoredAuthClaims,
} from '@/lib/auth/session';
import { CommentItem, ReplyCommentItem } from '@/entities/comment/comment-api';
import { toDate } from '@/shared/lib/utils';
import CommentsForm from './comments-form';
import { CommentSelection } from './types';
import {
  createCommentLike,
  deleteCommentLike,
  deleteComment,
} from '../../api/community';
import { logError } from '@/shared/lib/logging';

type CommentLike = CommentItem | ReplyCommentItem;

type CommunityCommentTileProps = {
  comment: CommentLike;
  selectedComment?: CommentSelection | null;
  onSelectComment?: (next: CommentSelection | null) => void;
  onUpdateComments?: (updater: (prev: CommentItem[]) => CommentItem[]) => void;
};

export default function CommunityCommentTile({
  comment,
  selectedComment,
  onSelectComment,
  onUpdateComments,
}: CommunityCommentTileProps) {
  const claims = resolveStoredAuthClaims();
  const userId = claims?.userId;
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentLike, setIsCommentLike] = useState(comment?.liked ?? false);
  const [commentLikeCnt, setCommentLikeCnt] = useState(comment?.likes ?? 0);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const isEditing =
    selectedComment?.type === 'edit' && selectedComment.id === comment.id;

  // 브라우저에서만 access token 읽기
  useEffect(() => {
    const stored = resolveStoredAccessToken();
    setToken(stored ?? null);
    const isOwnerResult = userId ? userId === comment?.user?.id : false;
    setIsOwner(isOwnerResult);
  }, [comment?.user?.id]);

  const handleToggleReply = () => {
    if (!comment?.id) return;

    if (selectedComment?.type === 'new' && selectedComment.id === comment.id) {
      onSelectComment?.(null);
      return;
    }

    onSelectComment?.({
      type: 'new',
      id: comment.id,
      parentId: comment.parent_id ?? comment.id,
      content: '',
    });
  };

  const handleToggleEdit = () => {
    if (!comment?.id) return;

    if (isEditing) {
      onSelectComment?.(null);
      return;
    }

    onSelectComment?.({
      type: 'edit',
      id: comment.id,
      parentId: comment.parent_id ?? '',
      content: comment.content ?? '',
    });
  };

  const handleDeleteComment = async () => {
    if (!comment?.id) return;

    setIsLoading(true);

    if (!token) {
      toast('로그인 후 이용해 주세요.');
      setIsLoading(false);
      return;
    }

    try {
      await deleteComment(token, comment.post_id, comment.id);

      onUpdateComments?.((prev) => {
        if (comment.parent_id) {
          return prev.map((item) => {
            if (item.id !== comment.parent_id) {
              return item;
            }
            const nextReplies = (item.reply_comments ?? []).filter(
              (reply) => reply.id !== comment.id,
            );
            return {
              ...item,
              reply_comments: nextReplies.length > 0 ? nextReplies : null,
            };
          });
        }
        return prev.filter((item) => item.id !== comment.id);
      });

      toast('댓글을 삭제했어요.');
      setOpen(false);
      onSelectComment?.(null);
    } catch {
      toast('댓글 삭제에 실패했어요. 잠시 뒤 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentLike = async () => {
    if (!comment?.id) {
      return toast('다시 한번 새로고침 해주세요.');
    }

    if (token) {
      try {
        if (isCommentLike) {
          await deleteCommentLike(token, comment.id);
          setIsCommentLike(false);
          setCommentLikeCnt((prev) => prev - 1);
        } else {
          await createCommentLike(token, comment.id);
          setIsCommentLike(true);
          setCommentLikeCnt((prev) => prev + 1);
        }
      } catch (error) {
        logError('댓글 업데이트 실패', error);
      }
    } else {
      toast('로그인 후 이용해주세요.');
    }
  };

  const contentLines = (comment.content ?? '').split('<br />');

  return (
    <div
      className={`flex w-full flex-col py-8 ${
        comment.parent_id ? 'bg-neutral-50 px-8' : ''
      }`}
    >
      <div className="flex w-full justify-between gap-5">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/profile.svg"
            width={32}
            height={32}
            alt="profile"
          />
          <span className="text-sm text-neutral-500">
            By {comment?.user?.nickname}
          </span>
          {isOwner ? (
            <Badge className="h-5 rounded-md px-1 text-xs" variant="red">
              me
            </Badge>
          ) : null}
        </div>
        {token ? (
          <div className="flex items-center gap-5">
            {!comment?.parent_id && (
              <button
                type="button"
                onClick={handleToggleReply}
                className="flex cursor-pointer items-center gap-1 text-sm text-neutral-600"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 19L13.6 17.575L17.175 14H7.5C6.25 14 5.1875 13.5625 4.3125 12.6875C3.4375 11.8125 3 10.75 3 9.5C3 8.25 3.4375 7.1875 4.3125 6.3125C5.1875 5.4375 6.25 5 7.5 5H8V7H7.5C6.8 7 6.20833 7.24167 5.725 7.725C5.24167 8.20833 5 8.8 5 9.5C5 10.2 5.24167 10.7917 5.725 11.275C6.20833 11.7583 6.8 12 7.5 12H17.175L13.6 8.4L15 7L21 13L15 19Z"
                    fill="#525252"
                  />
                </svg>
                답글
              </button>
            )}
            {isOwner && (
              <Menubar className="border-none bg-transparent p-0">
                <MenubarMenu>
                  <MenubarTrigger className="p-0" aria-label="댓글 옵션">
                    <EllipsisVertical
                      className="h-3.5 w-3.5 cursor-pointer"
                      stroke="#a1a1a1"
                    />
                  </MenubarTrigger>
                  <MenubarContent align="end" className="min-w-[8rem]">
                    {/* <MenubarItem>신고하기</MenubarItem> <MenubarSeparator />*/}

                    <MenubarItem onClick={handleToggleEdit}>
                      수정하기
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => setOpen(true)}>
                      삭제하기
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>정말 댓글을 지울까요?</DialogTitle>
                  <DialogDescription>
                    댓글을 지우면 다시 복구할 수 없습니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      취소
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={handleDeleteComment}>
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
        ) : null}
      </div>
      {isEditing ? (
                <div className="mt-4 flex w-full">
                  <CommentsForm
                    draft={{
                      id: comment.id,
                      parentId: comment.parent_id ?? '',
                      content: comment.content ?? '',
                      mode: 'edit',
                    }}
                    postId={comment?.post_id}
                    onClose={() => onSelectComment?.(null)}
                    handleComments={onUpdateComments}
                  />
                </div>
      ) : (
        <span className="py-4 text-neutral-600">
          {contentLines.map((line, index) => (
            <span key={`${comment.id}-${index}`}>
              {line}
              <br />
            </span>
          ))}
        </span>
      )}
      <div className="flex w-full justify-between gap-5">
        <span className="text-sm text-neutral-400">
          {format(toDate(comment.created_at), 'yyyy.MM.dd a hh:mm', {
            locale: ko,
          })}
        </span>
        <div
          className={`flex items-center gap-1 ${token ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <ThumbsUp
            onClick={handleCommentLike}
            className={`h-3.5 w-3.5 ${isCommentLike && 'scale-105 fill-[#00592d]'}`}
            stroke={`${isCommentLike ? '#00592d' : '#a1a1a1'}`}
          />
          <span className="text-sm text-neutral-400">
            {commentLikeCnt ?? '0'}
          </span>
        </div>
      </div>
    </div>
  );
}
