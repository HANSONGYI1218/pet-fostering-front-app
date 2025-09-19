'use client';

import { TrendingUp } from 'lucide-react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Value',
  },
  safari: {
    label: 'Safari',
    color: '#D0EFE0',
  },
} satisfies ChartConfig;

export default function CircleChart({
  totalDay,
  value,
}: {
  totalDay: number;
  value: number;
}) {
  const chartData = [
    { browser: 'safari', value: (value / totalDay) * 100, fill: '#298C5B' },
  ];

  return (
    <Card className="flex flex-col gap-2">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={180 - (value / totalDay) * 360}
            innerRadius={80}
            outerRadius={120}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="last:fill-background first:fill-[#D0EFE0]"
              polarRadius={[96, 64]}
            />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={4}
              width={124}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {Math.ceil(chartData[0].value)}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center leading-none font-medium">
          총 {totalDay}일 중{' '}
          <span className="ml-1 text-base font-bold">{value}</span>일 임보를
          했어요.
        </div>
      </CardFooter>
    </Card>
  );
}
