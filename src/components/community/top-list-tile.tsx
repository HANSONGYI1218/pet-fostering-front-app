import { Eye, MessageSquareText } from 'lucide-react';

export default function TopListTile({ index }: { index: number }) {
  return (
    <div className="group flex w-64 gap-3 rounded-2xl">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D0EFE0] group-hover:bg-[#00592D]">
        <span className="text-sm font-semibold text-[#00592D] group-hover:text-white">
          {index + 1}
        </span>
      </div>
      <div className="flex w-full flex-1 flex-col gap-2">
        <span className="line-clamp-1 font-semibold">
          임보할 때 중요 물품 list! list list
        </span>
        <div className="flex w-full gap-5">
          <span className="text-[#525252]">아이틍</span>
          <div className="flex items-center gap-1">
            <MessageSquareText className="h-4 w-4" stroke="#525252" />
            <span className="text-[#525252]">4</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" stroke="#525252" />
            <span className="text-[#525252]">20</span>
          </div>
        </div>{' '}
      </div>
    </div>
  );
}
