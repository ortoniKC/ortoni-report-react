"use client";

import { ScrollText } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

export function LogsTab({ logs }: { logs?: string[] }) {
  if (!logs) return null;

  return (
    <TabsContent value="logs" className="pt-4">
      <div className="rounded-md border bg-muted/20 p-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <ScrollText className="h-4 w-4" />
          Log Output
        </h4>
        <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap font-mono max-h-60">
          {logs.join("\n")}
        </pre>
      </div>
    </TabsContent>
  );
}
