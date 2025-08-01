import {
  addDays,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { PropsWithChildren } from 'react';
import { CalendarProps } from './record-calendar';
import Td from './td';

export interface WholeDateArray {
  date: Date;
  formattedDate: string;
}

const Tr = ({ currentMonth }: PropsWithChildren<CalendarProps>) => {
  const monthStart = startOfMonth(currentMonth); //현재 보고 있는 달의 시작하는 날
  const monthEnd = endOfMonth(monthStart); //현재 보고 있는 달의 끝나는 날
  const startDate = startOfWeek(monthStart); //현재 보고 있는 달력에서 맨 앞칸
  const endDate = endOfWeek(monthEnd); //현재 보고 있는 달력에서 마지막 칸

  // 한달에 몇 주인지 체크
  const countOfWeek = Math.ceil(differenceInDays(endDate, startDate) / 7);

  let day = startDate;

  //이차원 배열
  let wholeDate: WholeDateArray[][] = [];
  for (let i = 0; i < countOfWeek; i++) {
    let arr: WholeDateArray[] = [];
    //7번 반복
    for (let j = 0; j < 7; j++) {
      //추후에 날짜를 선택해서 저장할 것을 고려하여 date정보와 format된 정보를 객체로 저장했다.
      arr.push({
        date: day,
        formattedDate: format(day, 'd'),
      });

      //날짜를 다음날로 옮긴다.
      day = addDays(day, 1);
    }

    //위에서 만든 길이 7짜리 배열을 이차원 배열에 넣음
    wholeDate.push(arr);
  }

  return wholeDate.map((p) => {
    return (
      <tr
        className="relative grid w-full grid-cols-7 gap-2"
        key={Math.random()}
      >
        <Td weekDate={p} currentMonth={currentMonth} />
      </tr>
    );
  });
};

export default Tr;
