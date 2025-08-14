import type { ReportData } from "@/lib/types/reportData";
import { TrendChart } from "../charts/analyticsTrend";
import { memo } from "react";

export const AnalyticsPage = memo((props: ReportData) => {
  const { result } = props;
  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          <h1>Analytics Page</h1>
          <TrendChart result={result} />
        </div>
      </div>
    </div>
  );
});
