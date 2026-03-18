"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
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
import type { TestHistoryItem } from "@/lib/types/OrtoniReportData";
import { motion } from "framer-motion";
import { formatDuration } from "@/lib/utils";

const chartConfig = {
  duration: {
    label: "Duration (seconds)",
    color: "var(--chart-1)",
  },
  status: {
    label: "Status",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const TestHistoryTrendChart = memo(
  (props: { history: TestHistoryItem[] }) => {
    const { history } = props;

    if (!history || history.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-6">
          No history available for this test.
        </p>
      );
    }

    const chartData = history.slice().sort((a, b) => new Date(a.run_date).getTime() - new Date(b.run_date).getTime()).map((item) => ({
      label: new Date(item.run_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: Math.round(item.duration / 1000),
      statusValue: item.status === "passed" ? 1 : 0,
      status: item.status,
      run_date: item.run_date,
      statusColor: item.status === "passed" ? "#22c55e" : "#ef4444",
    }));

    const avgDuration =
      history.reduce((sum, item) => sum + item.duration, 0) / history.length;
    const passedCount = history.filter(
      (item) => item.status === "passed",
    ).length;
    const failedCount = history.filter(
      (item) =>
        item.status === "failed" ||
        item.status === "timedOut" ||
        item.status === "unexpected",
    ).length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group relative w-full"
      >
        <Card className="py-4 sm:py-0">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Test Execution History</CardTitle>
              <CardDescription>
                Track test duration and status trends over time
              </CardDescription>
            </div>
            <div className="flex flex-row items-center justify-end gap-8 px-6 py-5 sm:py-6">
              <div className="flex flex-col items-center justify-end gap-2">
                <div className="text-sm text-muted-foreground">
                  Avg Duration
                </div>
                <div className="text-lg font-bold">
                  {formatDuration(Math.round(avgDuration))}
                </div>
              </div>
              <div className="flex flex-col items-center justify-end gap-2">
                <div className="text-sm text-muted-foreground">Passed</div>
                <div className="text-lg font-bold text-green-600">
                  {passedCount}
                </div>
              </div>
              <div className="flex flex-col items-center justify-end gap-2">
                <div className="text-sm text-muted-foreground">Failed</div>
                <div className="text-lg font-bold text-red-600">
                  {failedCount}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  height={80}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Duration (seconds)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      formatter={(value, name, props) => {
                        if (name === "duration") {
                          return [
                            `${(value as number).toFixed(2)}s`,
                            "Duration",
                          ];
                        }
                        if (name === "status") {
                          return [props.payload.status as string, "Status"];
                        }
                        return [value, name];
                      }}
                    />
                  }
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  verticalAlign="top"
                  height={36}
                />
                <Line
                  yAxisId="left"
                  dataKey="duration"
                  type="monotone"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={(props: any) => {
                    const { cx, cy, payload, index } = props;
                    const color = payload.statusColor;
                    return (
                      <circle
                        key={`${payload.run_date}-${index}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={color}
                        stroke={color}
                        strokeWidth={2}
                      />
                    );
                  }}
                  isAnimationActive={true}
                  name=" seconds"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    );
  },
);

TestHistoryTrendChart.displayName = "TestHistoryTrendChart";
