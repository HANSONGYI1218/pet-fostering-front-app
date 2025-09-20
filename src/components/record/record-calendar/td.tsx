'use client';

import { format } from 'date-fns';
import { WholeDateArray } from './tr';
import CalendarDialogForm from './calendar-dialog-form';
import type { Dispatch, SetStateAction } from 'react';

interface TdProps {
  weekDate: WholeDateArray[];
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
}

const Td = ({ weekDate, currentMonth, setCurrentMonth }: TdProps) => {
  return (
    <>
      {weekDate.map((p) => {
        return (
          <td key={format(p.date, 'yyyy-M-d')}>
            <CalendarDialogForm
              p={p}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
          </td>
        );
      })}
    </>
  );
};

export default Td;
