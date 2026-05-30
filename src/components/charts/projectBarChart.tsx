"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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

export const description = "Each Project Summary";

export const EachProjectChart = memo((props: { summary: Summary }) => {
  const { summary } = props;
  const stats = summary.stats;
  if (!stats?.projectNames || stats.projectNames.length <= 1) {
    return null;
  }
  const chartData =
    stats?.projectNames?.map((name: string, idx: number) => ({
      browser: name,
      pass: stats.passedTests?.[idx] ?? 0,
      failed: stats.failedTests?.[idx] ?? 0,
      skipped: stats.skippedTests?.[idx] ?? 0,
    })) ?? [];

  const dynamicChartConfig = Object.fromEntries(
    (stats?.projectNames ?? []).map((name: string) => [name, { label: name }])
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Summary</CardTitle>
        <CardDescription>Results per projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={80}
              tickFormatter={(value) => {
                const formatted = value.replace(/\s+/g, "\u00A0");
                return formatted.length > 12 ? `${formatted.slice(0, 10)}...` : formatted;
              }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="pass"
              layout="vertical"
              fill="var(--chart-2)" // green for pass
              radius={4}
            >
              <LabelList
                dataKey="pass"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="failed"
              layout="vertical"
              fill="var(--chart-5)" // red for failed
              radius={4}
            >
              <LabelList
                dataKey="failed"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="skipped"
              layout="vertical"
              fill="var(--chart-1)" // blue for skipped
              radius={4}
            >
              <LabelList
                dataKey="skipped"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
