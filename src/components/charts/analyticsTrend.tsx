"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { memo } from "react";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { Trend } from "@/lib/types/OrtoniReportData";

export const description = "An interactive line chart";

const chartConfig = {
  passed: {
    label: "Passed",
    color: "var(--chart-2)",
  },
  failed: {
    label: "Failed",
    color: "var(--chart-5)",
  },
  avgDuration: {
    label: "Avg Duration",
    color: "var(--chart-8)",
  },
} satisfies ChartConfig;

export const TrendChart = memo((props: { trends: Trend[] }) => {
  const { trends } = props;

  const chartData = trends.map((t) => ({
    label: t.run_date,
    passed: t.passed,
    failed: t.failed,
    avgDuration: t.avg_duration,
  }));

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle className="pt-6">Test Trend</CardTitle>
          <CardDescription className="pb-6">
            Showing Passed, Failed & Avg Duration over time
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />

            {/* X Axis */}
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            {/* Left Y Axis for counts */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: "Tests", angle: -90, position: "insideLeft" }}
            />

            {/* Right Y Axis for duration */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Avg Duration (ms)",
                angle: 90,
                position: "insideRight",
              }}
            />

            {/* Tooltip */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
              }
            />

            {/* Lines */}
            <Line
              yAxisId="left"
              dataKey="passed"
              type="monotone"
              stroke={chartConfig.passed.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="left"
              dataKey="failed"
              type="monotone"
              stroke={chartConfig.failed.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              dataKey="avgDuration"
              type="monotone"
              stroke={chartConfig.avgDuration.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
