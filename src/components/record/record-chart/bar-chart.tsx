'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { format } from 'date-fns';

export const description = 'A bar chart with a label';

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

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function ChartBarLabel({
  start_date,
  end_date,
}: {
  start_date: Date;
  end_date: Date;
}) {
  const months = getMonthsBetween(start_date, end_date);

  // chartData 생성
  const chartData = months.map((m) => ({
    month: m,
    desktop: Math.floor(Math.random() * 300), // 임시 데이터 (예: 입양/임보 수치)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{months?.length}개의 돌봄기록</CardTitle>
        <CardDescription>
          {format(start_date, 'yyyy.MM.dd')} - {format(end_date, 'yyyy.MM.dd')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          기록을 가장 많이 작성한 달은 <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
