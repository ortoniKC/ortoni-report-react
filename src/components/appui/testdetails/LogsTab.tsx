"use client";

import { EllipsisBlock } from "@/components/ui/ellipsis-block";
import { TabsContent } from "@/components/ui/tabs";

export function LogsTab({ logs }: { logs?: string }) {
  if (!logs) return null;

  return (
    <TabsContent value="logs" className="pt-4">
      <EllipsisBlock title="Log Output" errors={logs} key="logs" />
    </TabsContent>
  );
}
