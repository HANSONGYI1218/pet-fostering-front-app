'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  CalendarDays,
  CircleChevronLeft,
  CircleChevronRight,
} from 'lucide-react';

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
    <div className="mx-auto flex items-center gap-3">
      <button onClick={prevMonth}>
        <CircleChevronLeft
          className="h-6 w-6 cursor-pointer rounded-full hover:bg-neutral-100"
          strokeWidth={1}
          stroke={'#737373'}
        />
      </button>
      <div className="flex w-36 cursor-pointer items-center justify-center gap-2">
        <CalendarDays className="h-4 w-4" stroke="#000000" />
        <span className="text-xl font-semibold">
          {currentMonth && (
            <span>
              {format(currentMonth, 'yyyy')}년 {format(currentMonth, 'M')}월
            </span>
          )}
        </span>
      </div>
      <button onClick={nextMonth}>
        <CircleChevronRight
          className="h-6 w-6 cursor-pointer rounded-full hover:bg-neutral-100"
          strokeWidth={1}
          stroke={'#737373'}
        />
      </button>
    </div>
  );
};

export default CalendarHeader;
