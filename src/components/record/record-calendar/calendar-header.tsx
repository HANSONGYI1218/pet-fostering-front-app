'use client';

import React from 'react';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: Date;
  prevMonth?: () => void;
  nextMonth?: () => void;
}
const CalendarHeader = ({
  currentMonth,
  prevMonth,
  nextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex w-fit cursor-pointer items-center gap-2">
        <CalendarDays className="h-4 w-4" stroke="#000000" />
        <span className="text-xl font-semibold">
          {currentMonth && (
            <span>
              {format(currentMonth, 'yyyy')}년 {format(currentMonth, 'M')}월
            </span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-10">
        <button onClick={prevMonth}>
          <ChevronLeft
            width={32}
            height={32}
            className="cursor-pointer hover:text-neutral-600"
          />
        </button>
        <button onClick={nextMonth}>
          <ChevronRight
            width={32}
            height={32}
            className="cursor-pointer hover:text-neutral-600"
          />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
