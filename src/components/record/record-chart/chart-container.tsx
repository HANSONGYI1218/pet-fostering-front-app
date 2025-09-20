'use client';

import { ChartBarLabel } from '@/components/record/record-chart/bar-chart';
import { ChartRadialStacked } from '@/components/record/record-chart/radial-chart';
import { fosterDuration, fosterTotalDuration } from '@/lib/utils';
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
  start_date: Date;
  end_date: Date;
  foster_records: FosterRecord[];
}) {
  const months = getMonthsBetween(start_date, end_date);
  const totalDay = fosterTotalDuration(start_date, end_date);
  const preceedingDay = fosterDuration(start_date);

  const chartData = months.map((month) => {
    const count = foster_records.filter((record) => {
      const recMonth = record.created_at.getMonth(); // 0~11
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
          start_date={start_date}
          end_date={end_date}
          chartData={chartData}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-lg font-semibold">기록 작성률</h1>
        <ChartRadialStacked
          start_date={start_date}
          end_date={end_date}
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
