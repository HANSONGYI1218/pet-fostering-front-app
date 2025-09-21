'use client';

import { ChartBarLabel } from '@/components/record/record-chart/bar-chart';
import { ChartRadialStacked } from '@/components/record/record-chart/radial-chart';
import { fosterDuration, fosterTotalDuration, toDate } from '@/lib/utils';
import { FosterRecord } from '@/types/foster-record/foster-record';
import CircleChart from './circle-chart';

const monthNames = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

// foster 기간 동안의 month 리스트 생성
function getMonthsBetween(start: Date, end: Date) {
  const result: string[] = [];
  const cur = new Date(start);

  while (cur <= end) {
    result.push(monthNames[cur.getMonth()]);
    cur.setMonth(cur.getMonth() + 1);
  }
  return result;
}

export default function ChartContainer({
  start_date,
  end_date,
  foster_records,
}: {
  start_date: Date | string | number;
  end_date: Date | string | number;
  foster_records: FosterRecord[];
}) {
  const startDateObj = toDate(start_date);
  const endDateObj = toDate(end_date);

  const months = getMonthsBetween(startDateObj, endDateObj);
  const totalDay = fosterTotalDuration(startDateObj, endDateObj);
  const preceedingDay = fosterDuration(startDateObj);

  const chartData = months.map((month) => {
    const count = foster_records.filter((record) => {
      const recMonth = toDate(record.created_at).getMonth();
      const monthIndex = monthNames.indexOf(month); // months 배열에 해당하는 인덱스
      return recMonth === monthIndex;
    }).length;

    return {
      month,
      record: count,
    };
  });

  return (
    <div className="flex w-full justify-between gap-6">
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-lg font-semibold">돌봄기록</h1>
        <ChartBarLabel
          start_date={startDateObj}
          end_date={endDateObj}
          chartData={chartData}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-lg font-semibold">기록 작성률</h1>
        <ChartRadialStacked
          start_date={startDateObj}
          end_date={endDateObj}
          totalDay={totalDay}
          value={foster_records.length}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-lg font-semibold">임보 진행률</h1>
        <CircleChart totalDay={totalDay} value={preceedingDay} />
      </div>
    </div>
  );
}
