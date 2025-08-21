"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Summary } from "@/lib/types/OrtoniReportData";
import { memo } from "react";

export const description = "An interactive pie chart";

const chartConfig = {
  tests: {
    label: "Tests",
  },
  pass: {
    label: "Passed",
    color: "var(--chart-2)",
  },
  failed: {
    label: "Failed",
    color: "var(--chart-5)",
  },
  skip: {
    label: "Skipped",
    color: "var(--chart-1)",
  },
  retry: {
    label: "Retry",
    color: "var(--chart-4)",
  },
  flaky: {
    label: "Flaky",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const OverallExecutionResult = memo((props: { summary: Summary }) => {
  const { summary } = props;
  const summaryChartData = [
    {
      status: "pass",
      tests: summary.overAllResult.pass,
      fill: "var(--color-pass)",
    },
    {
      status: "failed",
      tests: summary.overAllResult.fail,
      fill: "var(--color-failed)",
    },
    {
      status: "skip",
      tests: summary.overAllResult.skip,
      fill: "var(--color-skip)",
    },
    {
      status: "retry",
      tests: summary.overAllResult.retry,
      fill: "var(--color-retry)",
    },
    {
      status: "flaky",
      tests: summary.overAllResult.flaky,
      fill: "var(--color-flaky)",
    },
  ];
  const id = "overallExecutionChart";
  const [activestatus, setActivestatus] = React.useState(
    summaryChartData[0].status
  );

  const activeIndex = React.useMemo(
    () => summaryChartData.findIndex((item) => item.status === activestatus),
    [activestatus]
  );
  const statuss = React.useMemo(
    () => summaryChartData.map((item) => item.status),
    []
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Summary</CardTitle>
          <CardDescription>Overall execution results</CardDescription>
        </div>
        <Select value={activestatus} onValueChange={setActivestatus}>
          <SelectTrigger
            className="h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {statuss.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];
              if (!config) {
                return null;
              }
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px] h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={summaryChartData}
              dataKey="tests"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {summaryChartData[activeIndex].tests.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tests
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
