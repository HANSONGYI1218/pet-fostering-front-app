'use client';

import React from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface CalendarHeaderProps {
  selectedDate?: Date;
  setSelectedDate?: any;
}
const CalendarHeader = ({
  selectedDate,
  setSelectedDate,
}: CalendarHeaderProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex w-full items-center gap-2">
          <CalendarDays className="h-4 w-4" stroke="#000000" />
          <span className="text-xl font-semibold">
            {selectedDate && (
              <span>
                {format(selectedDate, 'yyyy')}년 {format(selectedDate, 'M')}월
              </span>
            )}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarHeader;
