'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

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

const chartConfig = {
  value: {
    label: 'Value',
    color: '#007AFF',
  },
  remaining: {
    label: 'Remaining',
    color: '#C2DFFF',
  },
} satisfies ChartConfig;

export function ChartRadialStacked({
  start_date,
  end_date,
  totalDay,
  value,
}: {
  start_date: Date;
  end_date: Date;
  totalDay: number;
  value: number;
}) {
  const chartData = [
    { month: 'total', value: value, remaining: totalDay - value }, // 실제 기록
  ];

  return (
    <Card className="relative flex w-full flex-1 flex-col gap-0">
      <CardHeader>
        <CardTitle>전체 돌봄기록</CardTitle>
        <CardDescription>
          {format(start_date, 'yyyy.MM.dd')} - {format(end_date, 'yyyy.MM.dd')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto mt-6 h-48 w-full max-w-[230px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180} // 왼쪽 끝
            endAngle={0} // 오른쪽 끝
            innerRadius={76}
            outerRadius={120}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className={`fill-foreground text-2xl font-bold text-[#007AFF]`}
                        >
                          {value}개
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="value"
              stackId="a"
              cornerRadius={1}
              fill="#007AFF"
            />
            <RadialBar
              dataKey="remaining"
              stackId="a"
              cornerRadius={1}
              fill="#C2DFFF"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="absolute inset-x-0 bottom-6 flex w-full flex-col gap-2 text-sm">
        <div className="flex items-center leading-none font-medium">
          총 {totalDay}개 중{' '}
          <span className="ml-1 text-base font-bold">{value}</span>
          개를 작성했어요.
        </div>
        <div className="text-muted-foreground leading-none">
          조금 더 열심히 임보 기록을 해야해요.
        </div>
      </CardFooter>
    </Card>
  );
}
