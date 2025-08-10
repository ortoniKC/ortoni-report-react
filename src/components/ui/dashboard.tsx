"use client";

import {
  CheckCircle,
  TestTubes,
  X,
  ChevronRightCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { SummaryChart } from "../mvpblocks/ui/summy-chart";
import { DashboardCard } from "../mvpblocks/ui/summaryCard";

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
    value: "70",
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
    value: "0",
    icon: AlertTriangle,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
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
              <DashboardCard
                key={stat.title}
                stat={stat}
                index={index}
                total={100}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
            {/* Charts Section */}
            <div className="space-y-4 sm:space-y-6 xl:col-span-2">
              <SummaryChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
