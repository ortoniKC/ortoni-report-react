"use client";

import { LabelList, RadialBar, RadialBarChart } from "recharts";

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

  // Build chartConfig dynamically for legend/labels if needed
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
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="projects" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
