"use client";

import { TabsContent } from "@/components/ui/tabs";
import { ShowHistory } from "../common/utils";

export function HistoryTab({ history }: { history?: any }) {
  if (!history) return null;

  return (
    <TabsContent value="history">
      <ShowHistory history={history.history} />
    </TabsContent>
  );
}
