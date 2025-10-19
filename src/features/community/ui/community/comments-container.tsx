'use client';

import { useEffect, useMemo, useState } from 'react';
import { PaginationDynamic } from '@/shared/widgets/navigation/papagination-dynamic';
import RetryButton from '@/shared/widgets/feedback/retry-button';
import CommunityCommentTile from './community-comment-tile';
import { Card } from '@/shared/ui/card';
import { CommentItem, ReplyCommentItem } from '@/entities/comment/comment-api';
import CommentsForm from './comments-form';
import { CommentSelection } from './types';

type CommentsContainerProps = {
  comments: CommentItem[];
  isError?: boolean;
};

const EMPTY_MESSAGE = '아직 댓글이 없습니다.';
const ERROR_MESSAGE = '댓글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';

const sortByCreatedAtDesc = <T extends { created_at: Date }>(items: T[]) =>
  [...items].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

export default function CommentsContainer({
  comments,
  isError = false,
}: CommentsContainerProps) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComment, setSelectedComment] =
    useState<CommentSelection | null>(null);

  useEffect(() => {
    setSelectedComment(null);
  }, [currentPage]);

  const sortedComments = useMemo(
    () => sortByCreatedAtDesc(comments),
    [comments],
  );
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pagedComments = useMemo(
    () => sortedComments.slice(startIdx, endIdx),
    [sortedComments, startIdx, endIdx],
  );
  const hasComments = comments.length > 0;

  if (isError) {
    return (
      <Card className="flex w-full flex-col items-center justify-center gap-4 py-16 text-sm text-neutral-500">
        <span>{ERROR_MESSAGE}</span>
        <RetryButton />
      </Card>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <Card className="flex w-full cursor-default flex-col gap-6 px-3 py-4 md:p-10">
        <div className="flex w-full items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2024_10032)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.28573 0C3.60375 0 2.94969 0.270917 2.46746 0.753154C1.98523 1.23539 1.7143 1.88945 1.7143 2.57143V17.861L0.0440034 22.8718C-0.0549256 23.1686 0.0156961 23.4957 0.228256 23.7252C0.440815 23.9547 0.761548 24.0502 1.06505 23.9745L7.81982 22.2857H21.4286C22.1105 22.2857 22.7647 22.0149 23.2469 21.5326C23.7292 21.0504 24 20.3962 24 19.7143V2.57143C24 1.88943 23.7292 1.23539 23.2469 0.753154C22.7647 0.270917 22.1105 0 21.4286 0H4.28573Z"
                fill="#9AD9BA"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.71401 7.23438C7.12227 7.23438 6.64258 7.71407 6.64258 8.3058C6.64258 8.89754 7.12227 9.37723 7.71401 9.37723H17.9997C18.5915 9.37723 19.0711 8.89754 19.0711 8.3058C19.0711 7.71407 18.5915 7.23438 17.9997 7.23438H7.71401ZM7.71401 12.9067C7.12227 12.9067 6.64258 13.3864 6.64258 13.9781C6.64258 14.5698 7.12227 15.0495 7.71401 15.0495H14.5711C15.1629 15.0495 15.6426 14.5698 15.6426 13.9781C15.6426 13.3864 15.1629 12.9067 14.5711 12.9067H7.71401Z"
                fill="#00592D"
              />
            </g>
            <defs>
              <clipPath id="clip0_2024_10032">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="font-semibold">
            {hasComments ? `${comments.length}개의 답변이 있어요` : '댓글'}
          </span>
        </div>
        <CommentsForm
          draft={{ mode: 'create' }}
          heightClassName="min-h-40"
          onClose={() => setSelectedComment(null)}
        />
        {hasComments ? (
          <div className="flex w-full flex-col">
            {pagedComments.map((comment) => {
              const replies = sortByCreatedAtDesc(comment.reply_comments ?? []);

              return (
                <div key={comment.id} className="flex w-full flex-col">
                  <CommunityCommentTile
                    comment={comment}
                    selectedComment={selectedComment}
                    onSelectComment={setSelectedComment}
                  />
                  {selectedComment?.type === 'new' &&
                    selectedComment.id === comment.id && (
                      <CommentsForm
                        draft={{ mode: 'reply', parentId: comment.id }}
                        onClose={() => setSelectedComment(null)}
                      />
                    )}
                  <hr className="w-full" />
                  {replies.length > 0 && (
                    <div className="flex w-full flex-col">
                      {replies.map((reply: ReplyCommentItem) => (
                        <div key={reply.id} className="flex w-full flex-col">
                          <CommunityCommentTile
                            comment={reply}
                            selectedComment={selectedComment}
                            onSelectComment={setSelectedComment}
                          />
                          <hr className="w-full" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-3 py-14 text-neutral-500">
            <span>{EMPTY_MESSAGE}</span>
          </div>
        )}
      </Card>
      {hasComments ? (
        <PaginationDynamic
          totalItems={comments.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      ) : null}
    </div>
  );
}
