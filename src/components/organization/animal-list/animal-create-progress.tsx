'use client';

import { Dot } from 'lucide-react';

export default function AniamlCreateProgress({
  currentIndex,
}: {
  currentIndex: number;
}) {
  return (
    <div className="relative flex w-full flex-col gap-2">
      <div className="relative flex w-full pl-3">
        {/* 첫번째 dot */}
        <div className="flex flex-1 items-center">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <Dot
              className="relative flex h-full w-full rounded-full bg-[#00592d]/20"
              stroke="#00592d/20"
            />
            <Dot
              className={`absolute z-10 h-4 w-4 rounded-full bg-[#00592d] ${currentIndex === 0 && 'animate-pulse'}`}
              stroke="#00592d"
            />
          </div>
          <hr
            className={`h-2 flex-1 ${currentIndex >= 1 ? 'bg-[#00592d]/20' : 'bg-neutral-200'}`}
          />
        </div>
        {/* 두번째 dot */}
        <div className="flex flex-1 items-center">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <Dot
              className={`relative flex h-full w-full rounded-full ${currentIndex >= 1 ? 'bg-[#00592d]/20' : 'bg-neutral-200'}`}
              stroke="#00592d/20"
            />
            <Dot
              className={`absolute z-10 h-4 w-4 rounded-full ${currentIndex >= 1 ? 'animate-pulse bg-[#00592d]' : 'bg-neutral-500'}`}
              stroke={currentIndex >= 1 ? '#00592d' : 'neutral-500'}
            />
          </div>
          <hr
            className={`h-2 flex-1 rounded-r-full ${currentIndex >= 2 ? 'bg-[#00592d]/20' : 'bg-neutral-200'}`}
          />
        </div>
        {/* 세번째 dot */}
        {/* <div className="relative flex h-8 w-8 items-center justify-center">
          <Dot
            className="relative flex h-full w-full rounded-full bg-[#00592d]/20"
            stroke="#00592d/20"
          />
          <Dot
            className={`absolute z-10 h-4 w-4 rounded-full bg-[#00592d] ${currentIndex === 2 && 'animate-pulse'}`}
            stroke="#00592d"
          />
        </div> */}
        <img
          src="/images/goal.png"
          width={36}
          height={36}
          alt="achivement"
          className="ml-3"
        />
      </div>
      <div className="ml-1.5 flex w-full items-center justify-between">
        <span className="text-sm font-semibold">STEP01</span>
        <span className="text-sm font-semibold">STEP02</span>
        <span className="w-14 text-center text-sm font-semibold">완료</span>
      </div>
    </div>
  );
}
