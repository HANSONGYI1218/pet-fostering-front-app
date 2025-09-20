import Tr from './tr';
import { CalendarProps } from './record-calendar';

const DayoftheWeek = () => {
  const date = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <thead className="flex w-full justify-center">
      <tr className="grid w-full grid-cols-7">
        {date.map((p) => {
          return (
            <th className="w-full text-center font-medium" key={p}>
              {p}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const CalendarTable = ({ currentMonth, setCurrentMonth }: CalendarProps) => {
  return (
    <table className="flex flex-col gap-6 rounded-xl bg-white py-4 text-[16px]">
      <DayoftheWeek />
      <tbody className="flex w-full flex-col gap-2">
        <Tr currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
      </tbody>
    </table>
  );
};

export default CalendarTable;
