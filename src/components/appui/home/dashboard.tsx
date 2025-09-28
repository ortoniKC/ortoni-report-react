"use client";
import {
  TestTubes,
  ChevronRightCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { SummaryCard } from "./summaryCard";
import type {
  Preferences,
  Summary,
  UserConfig,
  UserMeta,
} from "@/lib/types/OrtoniReportData";
import { OverallExecutionResult } from "../../charts/overallExecutionChart";
import { EachProjectChart } from "../../charts/projectBarChart";
import { ProjectChart } from "../../charts/projectChart";
import TextGenerateEffect from "../../ui/typewriter";
import { MetaCard } from "./metaCard";
import { memo } from "react";

export const Dashboard = memo(
  (props: {
    summary: Summary;
    userConfig: UserConfig;
    userMeta: UserMeta;
    preferences: Preferences;
  }) => {
    const { summary, userConfig, userMeta, preferences } = props;
    const stats = [
      {
        title: "All tests - (Pass + Fail)",
        value: String(summary.overAllResult.total),
        icon: TestTubes,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        title: "Passed",
        value: String(summary.overAllResult.pass),
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        title: "Failed",
        value: String(summary.overAllResult.fail),
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        title: "Skipped",
        value: String(summary.overAllResult.skip),
        icon: ChevronRightCircle,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        title: "Retry",
        value: String(summary.overAllResult.retry),
        icon: RefreshCw,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      {
        title: "Flaky",
        value: String(summary.overAllResult.flaky),
        icon: AlertTriangle,
        color: "text-teal-500",
        bgColor: "bg-teal-500/10",
      },
    ];
    console.log(preferences.logo);
    return (
      <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
        <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            {/* Header with logo on right */}
            <div className="flex items-center justify-between px-2 sm:px-0">
              <div>
                <TextGenerateEffect
                  words={`Hello ${userConfig.authorName || "Tester"}!`}
                  className="text-3xl font-bold tracking-tight sm:text-3xl"
                />
                <p className="text-muted-foreground text-sm sm:text-base">
                  Here&apos;s what&apos;s happening with your{" "}
                  <strong className="text-primary">
                    {userConfig.type || "test"}
                  </strong>{" "}
                  today.
                </p>
              </div>
              {preferences.logo && (
                <div className="flex-shrink-0 ml-4 max-w-[80px] max-h-[48px] w-auto h-auto">
                  <img
                    src={preferences.logo}
                    alt="Logo"
                    className="object-contain w-full h-full"
                    style={{ display: "block" }}
                  />
                </div>
              )}
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
                    total={summary.overAllResult.total}
                  />
                ))}
            </div>
            {/* Meta information */}
            <MetaCard
              UserMeta={userMeta}
              summary={summary}
              userConfig={userConfig}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {/* Left half */}
              <div>
                <OverallExecutionResult summary={summary} />
              </div>
              {/* Right half */}
              <div>
                <ProjectChart summary={summary} />
              </div>
              <div>
                <EachProjectChart summary={summary} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
