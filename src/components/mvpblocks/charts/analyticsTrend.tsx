"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import * as card from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ReportData } from "@/lib/types/reportData";
import { memo } from "react";

export const description = "An area chart with a legend";

const chartConfig = {
  pass: {
    label: "Pass",
    color: "var(--chart-2)",
  },
  fail: {
    label: "Fail",
    color: "var(--chart-5)",
  },
  avg: {
    label: "Avg Duration (ms)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const TrendChart = memo((props: ReportData) => {
  const chartTrend = props.result.analytics.chartTrendData;

  const chartData =
    chartTrend?.labels.map((label, index) => ({
      label,
      pass: chartTrend.passed[index],
      fail: chartTrend.failed[index],
      avg: chartTrend.avgDuration[index],
    })) ?? [];

  return (
    <card.Card>
      <card.CardHeader>
        <card.CardTitle>Test Result</card.CardTitle>
        <card.CardDescription>
          Showing trends for the last 30 days
        </card.CardDescription>
      </card.CardHeader>
      <card.CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              angle={-45}
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <YAxis
              label={"Avg Duration (ms)"}
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            {/* Pass & Fail use left Y axis */}
            <Area
              yAxisId="left"
              dataKey="pass"
              type="natural"
              fill="var(--color-pass)"
              fillOpacity={0.4}
              stroke="var(--color-pass)"
              stackId="a"
            />
            <Area
              yAxisId="left"
              dataKey="fail"
              type="natural"
              fill="var(--color-fail)"
              fillOpacity={0.4}
              stroke="var(--color-fail)"
              stackId="a"
            />

            {/* Avg uses right Y axis */}
            <Area
              yAxisId="right"
              dataKey="avg"
              type="natural"
              fill="var(--color-avg)"
              fillOpacity={0.4}
              stroke="var(--color-avg)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </card.CardContent>
    </card.Card>
  );
});
