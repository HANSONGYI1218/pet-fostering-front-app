import { format } from 'date-fns';
import Link from 'next/link';
import { Paperclip } from 'lucide-react';
import { NoticeListItem } from '@/types/notcie/notice-api';

export default function NoticeTile({
  notice,
  index,
}: {
  notice: NoticeListItem;
  index: number;
}) {
  return (
    <Link href={`/notice/${notice?.id}`}>
      <div
        className={`flex w-full cursor-pointer justify-between gap-6 border-b p-6 ${notice?.isFixed ? 'bg-[#E5F4EB]' : 'bg-white'}`}
      >
        <div className="flex flex-1 gap-6">
          {notice?.isFixed ? <span>📌</span> : <span>{index}</span>}

          <span className={` ${notice?.isFixed && 'font-semibold'}`}>
            {notice?.title}
          </span>
        </div>
        <div className="flex w-fit items-center justify-end gap-4">
          {notice?.isFixed && (
            <Paperclip width={15} height={15} stroke="#a3a3a3" />
          )}
          <span className="w-20 text-neutral-600">
            {format(notice?.createdAt, 'yyyy.MM.dd')}
          </span>
        </div>
      </div>
    </Link>
  );
}
