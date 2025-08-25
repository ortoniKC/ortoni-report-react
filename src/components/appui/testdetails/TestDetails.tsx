"use client";

import { FileText } from "lucide-react";
import type { TestHistory, TestResultItem } from "@/lib/types/OrtoniReportData";
import { toFileUrl } from "../common/utils";
import { TestAttachments } from "./attachment/TestAttachments";
import { TestAnnotations } from "./TestAnnotations";
import { TestTabs } from "./TestTabs";
import { TestHeader } from "./header/TestHeader";

export function TestDetails({
  test,
  testHistories,
}: {
  test: TestResultItem | null;
  testHistories: TestHistory[];
}) {
  if (!test) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-muted/20 border">
        <div className="text-center p-8 max-w-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No test selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a test from the list to view detailed information.
          </p>
        </div>
      </div>
    );
  }

  const history = testHistories.find((h) => h.testId === test.testId);

  return (
    <div className="h-full flex flex-col border bg-background overflow-hidden">
      {/* Header Section */}
      <div className="p-5 border-b bg-muted/30">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <TestHeader test={test} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Media Section */}
        <TestAttachments test={test} toFileUrl={toFileUrl} />
        {/* Annotations Section */}
        <TestAnnotations annotations={test.annotations} />
        {/* Tabbed Section */}
        <TestTabs test={test} history={history} />
      </div>
    </div>
  );
}
