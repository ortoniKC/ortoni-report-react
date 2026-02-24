"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "./TestAccordion";
import { formatDuration, decodeHtmlEntities } from "@/lib/utils";
import { Camera, ScrollText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toFileUrl } from "../common/utils";

export function RetryTab({
  attempts,
  currentKey,
}: {
  attempts: TestResultItem[];
  currentKey: string;
}) {
  // Sort attempts by key (assuming order of execution)
  const sortedAttempts = [...attempts].sort((a, b) =>
    a.key.localeCompare(b.key),
  );

  const [compareIndices, setCompareIndices] = useState<[number, number]>(() => {
    // Default to comparing the last two attempts
    const last = sortedAttempts.length - 1;
    const prev = Math.max(0, last - 1);
    return [prev, last];
  });

  const renderAttemptSummary = (test: TestResultItem, index: number) => (
    <div
      key={test.key}
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer relative",
        test.key === currentKey
          ? "border-primary bg-primary/5"
          : "border-border bg-card/50",
        compareIndices.includes(index) &&
          "ring-2 ring-primary/40 ring-offset-1",
      )}
      onClick={() => {
        // Toggle selection for comparison
        if (compareIndices.includes(index)) {
          if (compareIndices[0] === index)
            setCompareIndices([compareIndices[1], index]);
          // Don't allow deselecting both
        } else {
          setCompareIndices([compareIndices[1], index]);
        }
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-bold uppercase text-muted-foreground">
          Attempt {index + 1}
        </span>
        <StatusDot status={test.status} />
      </div>
      <div className="text-xs font-medium truncate mb-1">
        {test.status.toUpperCase()}
      </div>
      <div className="text-[10px] text-muted-foreground">
        {formatDuration(test.duration)}
      </div>
      {test.key === currentKey && (
        <Badge
          variant="outline"
          className="mt-2 text-[8px] h-4 py-0 leading-none"
        >
          Viewing
        </Badge>
      )}
    </div>
  );

  const leftAttempt = sortedAttempts[compareIndices[0]];
  const rightAttempt = sortedAttempts[compareIndices[1]];

  const ComparisonColumn = ({
    test,
    title,
  }: {
    test: TestResultItem;
    title: string;
  }) => (
    <div className="flex-1 min-w-0 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            test.status === "passed" ? "bg-emerald-500" : "bg-red-500",
          )}
        />
        <h4 className="font-bold text-sm">{title}</h4>
        <Badge variant="secondary" className="text-[10px]">
          {test.status}
        </Badge>
      </div>

      {/* Errors */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          Errors
        </div>
        {test.errors.length > 0 ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded p-2 text-[10px] font-mono whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
            {test.errors.map((e, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: e }} />
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground italic p-2 border rounded border-dashed opacity-60">
            No errors
          </div>
        )}
      </div>

      {/* Screenshots */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Camera className="h-3 w-3" />
          Screenshots
        </div>
        {test.screenshots && test.screenshots.length > 0 ? (
          <div className="space-y-2">
            {test.screenshots.map((s, i) => (
              <img
                key={i}
                src={toFileUrl(s)}
                alt={`Attempt screenshot ${i}`}
                className="rounded border w-full object-contain bg-black/20"
              />
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground italic p-2 border rounded border-dashed opacity-60">
            No screenshots
          </div>
        )}
      </div>

      {/* Logs Preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <ScrollText className="h-3 w-3" />
          Logs
        </div>
        <div className="bg-muted/30 rounded p-2 text-[10px] font-mono h-32 overflow-y-auto whitespace-pre-wrap">
          {test.logs
            ? decodeHtmlEntities(test.logs)
            : "No logs available for this attempt."}
        </div>
      </div>
    </div>
  );

  return (
    <TabsContent value="retries" className="space-y-6 pt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sortedAttempts.map((test, i) => renderAttemptSummary(test, i))}
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row gap-6">
        <ComparisonColumn
          test={leftAttempt}
          title={`Attempt ${compareIndices[0] + 1}`}
        />
        <div className="hidden md:block w-px bg-border shrink-0" />
        <ComparisonColumn
          test={rightAttempt}
          title={`Attempt ${compareIndices[1] + 1}`}
        />
      </div>
    </TabsContent>
  );
}
