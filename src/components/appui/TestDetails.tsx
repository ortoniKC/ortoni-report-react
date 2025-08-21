import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import { ErrorBlock } from "./utils";
import { EllipsisBlock } from "../ui/ellipsis-block";

export function TestDetails({ test }: { test?: TestResultItem | null }) {
  if (!test) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="py-6 text-sm text-muted-foreground text-center">
          Select a test from the list to see details.
        </CardContent>
      </Card>
    );
  }
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(test.location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Sticky Header on mobile */}
      <CardHeader className="space-y-2 sm:space-y-3 sticky top-0 z-10 pb-3 sm:pb-4">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
          <span className="truncate max-w-full">{test.title}</span>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          {test.projectName && (
            <Badge variant="secondary">{String(test.projectName)}</Badge>
          )}
          {test.suite && <Badge variant="outline">{String(test.suite)}</Badge>}
          {test.filePath && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handleCopy}
                    >
                      {test.location}{" "}
                      {copied ? (
                        <Check className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="mr-1 h-3 w-3" />
                      )}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? "Copied!" : "Copy test location"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="py-4 space-y-5 text-sm flex-1 overflow-y-auto">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <Info label="Status" value={test.status} />
          <Info label="Duration" value={String(test.duration ?? "")} />
          <Info label="Retry" value={String(test.retry ?? "")} />
        </div>

        {/* Errors */}
        {Array.isArray(test.errors) && test.errors.length > 0 && (
          <section>
            <h4 className="font-medium mb-2 text-sm sm:text-base">
              Errors ({test.errors.length})
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm max-h-40 overflow-y-auto">
              {test.errors.map((e, i) => (
                <EllipsisBlock key={i} errors={[e]} />
              ))}
            </ul>
          </section>
        )}

        {/* Actions */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {test.tracePath && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={toFileUrl(test.tracePath)}
                target="_blank"
                rel="noreferrer"
              >
                Open Trace
              </a>
            </Button>
          )}
          {test.videoPath && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={toFileUrl(test.videoPath)}
                target="_blank"
                rel="noreferrer"
              >
                Open Video
              </a>
            </Button>
          )}
          {test.screenshotPath && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={toFileUrl(test.screenshotPath)}
                target="_blank"
                rel="noreferrer"
              >
                Open Screenshot
              </a>
            </Button>
          )}
          {Array.isArray(test.screenshots) &&
            test.screenshots.map((p, i) => (
              <Button key={i} variant="outline" size="sm" asChild>
                <a href={toFileUrl(p)} target="_blank" rel="noreferrer">
                  Screenshot {i + 1}
                </a>
              </Button>
            ))}
        </section>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (value) {
    return (
      <div>
        <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
        <div className="font-medium break-words">{value || "-"}</div>
      </div>
    );
  }
}

function StatusPill({ status }: { status: TestResultItem["status"] }) {
  const map: Record<string, string> = {
    passed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    failed: "bg-red-500/15 text-red-700 border-red-500/20",
    interrupted: "bg-red-500/15 text-red-700 border-red-500/20",
    timedOut: "bg-red-500/15 text-red-700 border-red-500/20",
    flaky: "bg-amber-500/15 text-amber-700 border-amber-500/20",
    skipped: "bg-slate-500/15 text-slate-700 border-slate-500/20",
  };
  const cls =
    map[status] || "bg-muted text-foreground/80 border-muted-foreground/20";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}
    >
      {status}
    </span>
  );
}

function toFileUrl(p: string) {
  return p.startsWith("http") ? p : p;
}
