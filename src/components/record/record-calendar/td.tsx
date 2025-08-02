'use client';

import { format } from 'date-fns';
import { WholeDateArray } from './tr';
import CalendarDialogForm from './calendar-dialog-form';

interface TdProps {
  weekDate: WholeDateArray[];
  currentMonth: Date;
  setCurrentMonth: any;
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
