'use client';

import type { Dispatch, SetStateAction } from 'react';
import CalendarHeader from './calendar-header';
import CalendarTable from './calendar-table';
import { Card } from '@/components/ui/card';
import { addMonths, subMonths } from 'date-fns';
import { useRecord } from '@/providers/record-provider';

export type CalendarProps = {
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
};

const RecordCalendar = () => {
  const { currentMonth, setCurrentMonth } = useRecord();

  const prevMonth = () => {
    setCurrentMonth((month) => subMonths(month, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((month) => addMonths(month, 1));
  };

  return (
    <Card className="cursor-default border-none px-2 py-8 md:p-8">
      <CalendarHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <CalendarTable
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
    </Card>
  );
};

export default RecordCalendar;
