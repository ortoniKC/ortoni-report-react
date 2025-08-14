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
import type { ReportData } from "@/lib/types/reportData";

export const description = "Each Project Summary";

export function EachProjectChart({ result }: ReportData) {
  const stats = result.summary.stats;
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
          className="mx-auto aspect-square w-full max-h-[250px] max-w-[300px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
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
              tickFormatter={(value) =>
                value.length > 7 ? `${value.slice(0, 4)}...` : value
              }
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
}
