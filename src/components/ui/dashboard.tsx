"use client";
import {
  TestTubes,
  ChevronRightCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { SummaryCard } from "../mvpblocks/ui/summaryCard";
import { OverallExecutionResult } from "../mvpblocks/charts/overallExecutionChart";
import { ProjectChart } from "../mvpblocks/charts/projectChart";
import { EachProjectChart } from "../mvpblocks/charts/projectBarChart";
import { MetaCard } from "../mvpblocks/ui/metaCard";
import type { ReportData } from "@/lib/types/reportData";

export default function Dashboard({ reportData }: { reportData: ReportData }) {
  console.log("reportData", reportData);
  const data = {
    result: {
      summary: {
        retry: reportData.result.summary.retry,
        pass: reportData.result.summary.pass,
        fail: reportData.result.summary.fail,
        skip: reportData.result.summary.skip,
        flaky: reportData.result.summary.flaky,
        total: reportData.result.summary.total,
      },
    },
  };
  const stats = [
    {
      title: "All tests",
      value: String(data.result.summary.total),
      icon: TestTubes,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Passed",
      value: String(data.result.summary.pass),
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Failed",
      value: String(data.result.summary.fail),
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Skipped",
      value: String(data.result.summary.skip),
      icon: ChevronRightCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Retry",
      value: String(data.result.summary.retry),
      icon: RefreshCw,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Flaky",
      value: String(data.result.summary.flaky),
      icon: AlertTriangle,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
  ];
  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="px-2 sm:px-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome {reportData.result.meta.authorName || ""}!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Here&apos;s what&apos;s happening with your{" "}
              <strong className="text-primary">
                {reportData.result.meta.type || ""}
              </strong>{" "}
              today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {stats
              .filter((result) => Number(result.value) > 0)
              .map((result, index) => (
                <SummaryCard
                  key={result.title}
                  stat={result}
                  index={index}
                  total={data.result.summary.total}
                />
              ))}
          </div>
          <MetaCard {...reportData} />

          {/* Charts */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {/* Left half */}
            <div>
              <OverallExecutionResult {...reportData} />
            </div>
            {/* Right half */}
            <div>
              <ProjectChart {...reportData} />
            </div>
            <div>
              <EachProjectChart {...reportData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
