"use client";

import {
  TestTubes,
  ChevronRightCircle,
  RefreshCw,
  AlertTriangle,
  X,
  CheckCircle,
} from "lucide-react";
import { SummaryCard } from "../mvpblocks/ui/summaryCard";
import { OverallExecutionResult } from "../mvpblocks/charts/overallExecutionChart";
import { ProjectChart } from "../mvpblocks/charts/projectChart";
import { EachProjectChart } from "../mvpblocks/charts/projectBarChart";
import { Separator } from "./separator";
import AboutUs1 from "../mvpblocks/about-us-1";

// Dashboard stats data
const stats = [
  {
    title: "All tests",
    value: "100",
    icon: TestTubes,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Passed",
    value: "68",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Failed",
    value: "20",
    icon: X,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Skipped",
    value: "5",
    icon: ChevronRightCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Retry",
    value: "5",
    icon: RefreshCw,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Flaky",
    value: "10",
    icon: AlertTriangle,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];
// const result = [
//   {
//     successRate: "91.96 %",
//     lastRun: "18-Jul-2025 8:34:41 PM",
//     duration: "01m:02s:120ms",
//   },
//   {
//     successRate: "85.00 %",
//     lastRun: "18-Jul-2025 8:34:41 PM",
//     duration: "02m:15s:300ms",
//   },
//   {
//     successRate: "78.50 %",
//     lastRun: "18-Jul-2025 8:34:41 PM",
//     duration: "03m:10s:450ms",
//   },
// ];

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="px-2 sm:px-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome Koushik
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Here&apos;s what&apos;s happening with your test automation today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <SummaryCard
                key={stat.title}
                stat={stat}
                index={index}
                total={100}
              />
            ))}
          </div>
          {/* User meta */}
          {/* <Separator /> */}
          {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            <div></div>
            <div></div>
            <div></div>
          </div> */}
          <AboutUs1 />
          <Separator />

          {/* Charts */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {/* Left half */}
            <div>
              <OverallExecutionResult />
            </div>

            {/* Right half */}
            <div>
              <ProjectChart />
            </div>

            <div>
              <EachProjectChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
