"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TestHistoryTrendChart } from "@/components/charts/testHistoryTrend";

export function HistoryTab({ history }: { history?: any }) {
  if (!history) {
    return <p className="text-center">No history found for this test</p>;
  }

  return (
    <TabsContent value="history" className="space-y-6">
      <TestHistoryTrendChart history={history.history ?? []} />
    </TabsContent>
  );
}