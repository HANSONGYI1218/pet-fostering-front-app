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
} from '@/shared/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart';
import { format } from 'date-fns';

export const description = 'A bar chart with a label';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type ChartDataItem = {
  month: string; // ex: "January"
  record: number; // 해당 달의 기록 개수
};

export function ChartBarLabel({
  start_date,
  end_date,
  chartData,
}: {
  start_date: Date;
  end_date: Date;
  chartData: ChartDataItem[];
}) {
  const maxRecordMonth = chartData.reduce((prev, curr) => {
    return curr.record > prev.record ? curr : prev;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartData?.length}개월의 돌봄기록</CardTitle>
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
            <Bar dataKey="record" fill="var(--color-desktop)" radius={4}>
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
      <CardFooter className="mx-auto flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          <span>기록을 가장 많이 작성한 달은</span>
          <span className="text-base font-bold">{maxRecordMonth.month}</span>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          꾸준한 활동 기록을 독려할 필요가 있어요.
        </div>
      </CardFooter>
    </Card>
  );
}
