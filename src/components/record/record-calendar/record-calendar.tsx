'use client';

import { useState } from 'react';
import CalendarHeader from './calendar-header';
import CalendarTable from './calendar-table';
import { Card } from '@/components/ui/card';

export interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date;
}

const RecordCalendar = () => {
  //현재 보고 있는 날짜
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Card className="cursor-default border-none p-8">
      <CalendarHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <CalendarTable currentMonth={selectedDate} selectedDate={selectedDate} />
    </Card>
  );
};

export default RecordCalendar;
