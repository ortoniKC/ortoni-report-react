"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { memo } from "react";
import type { Summary } from "@/lib/types/OrtoniReportData";

export const description = "A radial chart with a label";

export const ProjectChart = memo((props: { summary: Summary }) => {
  const { summary } = props;
  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

  const stats = summary.stats;
  const chartData =
    stats?.projectNames?.map((name: string, idx: number) => ({
      browser: name,
      projects: stats.totalTests?.[idx] ?? 0,
      fill: getRandomColor(),
    })) ?? [];
  const dynamicChartConfig = Object.fromEntries(
    (stats?.projectNames ?? []).map((name: string) => [name, { label: name }])
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Projects</CardTitle>
        <CardDescription>Project tests count</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-square max-h-[250px] max-w-[300px]"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="browser"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="projects"
              axisLine={false}
              tickLine={false}
              width={10} // 👈 reduce space reserved for labels
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent hideLabel={true} nameKey="browser" />
              }
            />
            <Bar dataKey="projects" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
