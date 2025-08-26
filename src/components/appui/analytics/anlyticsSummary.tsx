"use client";

import type { AnalyticsSummary } from "@/lib/types/OrtoniReportData";
import {
  CheckCircle,
  PercentCircleIcon,
  TestTubes,
  XCircle,
} from "lucide-react";
import { memo } from "react";
import { SummaryCard } from "../home/summaryCard";

export const AnalyticsSummaryPage = memo(
  (props: { analyticsSummary: AnalyticsSummary }) => {
    const { totalRuns, passed, passRate, failed, totalTests } =
      props.analyticsSummary;
    const stats = [
      {
        title: "Total Runs",
        value: String(totalRuns),
        icon: TestTubes,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        title: "Passed",
        value: String(passed),
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        title: "Failed",
        value: String(failed),
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        title: "Pass Rate",
        value: String(passRate),
        icon: PercentCircleIcon,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats
          .filter((result) => Number(result.value) > 0)
          .map((result, index) => (
            <SummaryCard
              key={result.title}
              stat={result}
              index={index}
              total={index === 3 ? 100 : totalTests}
            />
          ))}
      </div>
    );
  }
);
