import { format } from 'date-fns';
import Link from 'next/link';
import { Paperclip } from 'lucide-react';
import { NoticeListItem } from '@/types/notcie/notice-api';
import { Badge } from '../ui/badge';
import { NOTICE_TYPE_LABEL_KO } from '@/constants/enum';
import { getDDay } from '@/lib/utils';

export default function NoticeTile({ notice }: { notice: NoticeListItem }) {
  const isNew =
    notice?.createdAt && parseInt(getDDay(notice.createdAt)) < 10
      ? true
      : false;

  return (
    <Link href={`/notice/${notice?.id}`}>
      <div
        className={`flex w-full cursor-pointer flex-col justify-between gap-2 border-b p-4 md:flex-row md:gap-6 md:px-10 md:py-6 ${notice?.isFixed ? 'border-white bg-[#00592d]/5' : 'bg-white'}`}
      >
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:gap-14">
          <Badge
            variant={notice?.isFixed ? 'green' : 'outline'}
            className="h-6 w-12 rounded-full text-xs md:h-7 md:w-15 md:text-sm"
          >
            {notice?.isFixed
              ? '중요'
              : notice?.type && NOTICE_TYPE_LABEL_KO[notice.type]}
          </Badge>
          <span className={`flex gap-3 ${notice?.isFixed && 'font-semibold'}`}>
            {notice?.title}
            {isNew && (
              <span className="-translate-y-1 text-sm font-bold text-[#00592d]">
                N
              </span>
            )}
          </span>
        </div>
        <div className="flex w-fit items-center justify-end gap-2 md:gap-4">
          {notice?.isFiled && (
            <Paperclip
              width={15}
              height={15}
              stroke="#a3a3a3"
              className="max-md:h-3 max-md:w-3"
            />
          )}
          <span className="w-20 text-xs text-neutral-600 md:text-base">
            {format(notice?.createdAt, 'yyyy.MM.dd')}
          </span>
        </div>
      </div>
    </Link>
  );
}
