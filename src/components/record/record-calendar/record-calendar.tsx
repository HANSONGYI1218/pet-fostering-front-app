'use client';

import { useState } from 'react';
import CalendarHeader from './calendar-header';
import CalendarTable from './calendar-table';
import { Card } from '@/components/ui/card';
import { addMonths, subMonths } from 'date-fns';

export interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  setCurrentMonth: any;
}

const RecordCalendar = () => {
  //현재 보고 있는 달
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  //이전 달로 이동(currentMonth가 이전 달로 바뀜)
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  //다음 달로 이동(currentMonth가 다음 달로 바뀜)
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <Card className="cursor-default border-none p-8">
      <CalendarHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <CalendarTable
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        selectedDate={selectedDate}
      />
    </Card>
  );
};

export default RecordCalendar;
