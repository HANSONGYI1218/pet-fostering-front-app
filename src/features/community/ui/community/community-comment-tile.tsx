import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { CommentItem, ReplyCommentItem } from '@/entities/comment/comment-api';
import { toDate } from '@/shared/lib/utils';

type CommentLike = CommentItem | ReplyCommentItem;

export default function CommunityCommentTile({
  comment,
  isLast,
}: {
  comment: CommentLike;
  isLast: boolean;
}) {
  return (
    <div className={`flex w-full flex-col py-8 ${!isLast && 'border-b'}`}>
      <div className="flex w-full justify-between gap-5">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/profile.svg"
            width={32}
            height={32}
            alt="profile"
          />
          <span className="font-semibold">By {comment?.user?.nickname}</span>
        </div>
        <div className="flex items-center gap-5">
          {!comment?.parent_id && (
            <div className="flex cursor-pointer items-center gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19L13.6 17.575L17.175 14H7.5C6.25 14 5.1875 13.5625 4.3125 12.6875C3.4375 11.8125 3 10.75 3 9.5C3 8.25 3.4375 7.1875 4.3125 6.3125C5.1875 5.4375 6.25 5 7.5 5H8V7H7.5C6.8 7 6.20833 7.24167 5.725 7.725C5.24167 8.20833 5 8.8 5 9.5C5 10.2 5.24167 10.7917 5.725 11.275C6.20833 11.7583 6.8 12 7.5 12H17.175L13.6 8.4L15 7L21 13L15 19Z"
                  fill="#1B1B1B"
                />
              </svg>
              <span className="text-[#525252]">답글</span>
            </div>
          )}
          <div className="flex cursor-pointer items-center gap-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_2024_10052"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_2024_10052)">
                <path
                  d="M5 21V4H14L14.4 6H20V16H13L12.6 14H7V21H5ZM14.65 14H18V8H12.75L12.35 6H7V12H14.25L14.65 14Z"
                  fill="#1B1B1B"
                />
              </g>
            </svg>

            <span className="text-[#525252]">신고</span>
          </div>
        </div>
      </div>
      <span className="py-4 text-neutral-500">
        {(comment.content ?? '').split('<br />').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </span>
      <div className="flex w-full justify-between gap-5">
        <span className="text-[#525252]">
          {format(toDate(comment.created_at), 'yyyy.MM.dd a hh:mm', {
            locale: ko,
          })}
        </span>
        <div className="flex cursor-pointer items-center gap-1">
          <ThumbsUp className="h-4 w-4" stroke="#525252" />
          <span className="text-[#525252]">{comment?.likes}</span>
        </div>
      </div>
    </div>
  );
}
