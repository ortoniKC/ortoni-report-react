"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TestHistoryTrendChart } from "@/components/charts/testHistoryTrend";
import type { TestHistory } from "@/lib/types/OrtoniReportData";

export function HistoryTab({ history }: { history?: TestHistory }) {
  return (
    <TabsContent value="history" className="pt-1.5 space-y-6">
      {history ? (
        <TestHistoryTrendChart history={history.history ?? []} />
      ) : (
        <p className="text-center">No history found for this test</p>
      )}
    </TabsContent>
  );
}
