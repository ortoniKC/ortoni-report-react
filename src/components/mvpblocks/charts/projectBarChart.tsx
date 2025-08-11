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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart with a custom label";

const chartData = [
  { project: "Chrome", pass: 10, failed: 2, skipped: 1 },
  { project: "Firefox", pass: 8, failed: 3, skipped: 2 },
  { project: "Safari", pass: 7, failed: 1, skipped: 0 },
  { project: "Edge", pass: 9, failed: 2, skipped: 1 },
];

const chartConfig = {
  project: {
    label: "project",
    color: "var(--chart-2)",
  },
  chrome: {
    label: "Chrome",
  },
  firefox: {
    label: "Firefox",
  },
  safari: {
    label: "Safari",
  },
  edge: {
    label: "Edge",
  },
} satisfies ChartConfig;

export function EachProjectChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Summary</CardTitle>
        <CardDescription>Results per projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
              dataKey="project"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="pass"
              layout="vertical"
              fill="#22c55e" // green for pass
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
              fill="#ef4444" // red for failed
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
              fill="#3b82f6" // blue for skipped
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
