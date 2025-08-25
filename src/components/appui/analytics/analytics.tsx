import { TrendChart } from "@/components/charts/analyticsTrend";
import TextGenerateEffect from "@/components/ui/typewriter";
import type { Analytics } from "@/lib/types/OrtoniReportData";
import { memo } from "react";
import { SlowTests } from "./slowTest";

export const AnalyticsPage = memo((props: { analytics: Analytics }) => {
  const { analytics } = props;
  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          <div className="px-2 sm:px-0">
            <TextGenerateEffect
              words={"Test Analytics"}
              className="text-3xl font-bold tracking-tight sm:text-3xl"
            />
          </div>
          <TrendChart trends={analytics.reportData.trends} />
          <SlowTests
            slowTest={analytics.reportData.slowTests}
            title="Slow Tests"
          />
          <SlowTests
            slowTest={analytics.reportData.flakyTests}
            title="Flaky Tests"
          />
        </div>
      </div>
    </div>
  );
});
