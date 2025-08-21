"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Check, Copy, ImageIcon, PlayCircle } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import { EllipsisBlock } from "../ui/ellipsis-block";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";

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
      {/* Top Section */}
      <CardHeader className="space-y-3 sticky top-0 z-10 pb-3 border-b">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
          <span className="truncate max-w-full">{test.title}</span>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <StatusPill status={test.status} />
          <Badge variant="secondary">{String(test.duration)}</Badge>
          {test.projectName && (
            <Badge variant="secondary">{String(test.projectName)}</Badge>
          )}
          {test.suite && <Badge variant="outline">{String(test.suite)}</Badge>}
          {test.filePath && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleCopy}
                  >
                    {test.location}
                    {copied ? (
                      <Check className="ml-1 h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy test location"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6 p-4">
        {/* Media Section */}
        {(test.screenshotPath ||
          (Array.isArray(test.screenshots) && test.screenshots.length > 0) ||
          test.videoPath) && (
          <section className="space-y-3">
            <h4 className="font-medium text-sm sm:text-base">Attachments</h4>
            <div className="flex flex-wrap gap-3">
              {/* Screenshot(s) */}
              {test.screenshotPath && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ImageIcon className="mr-1 h-4 w-4" /> Screenshot
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl">
                    <DialogHeader>
                      <DialogTitle>Screenshot</DialogTitle>
                      <DialogDescription>
                        Full-size screenshot from the test run.
                      </DialogDescription>
                    </DialogHeader>
                    <img
                      src={toFileUrl(test.screenshotPath)}
                      alt="screenshot"
                      className="rounded-lg max-h-[70vh] mx-auto"
                    />
                  </DialogContent>
                </Dialog>
              )}
              {Array.isArray(test.screenshots) &&
                test.screenshots.map((p, i) => (
                  <Dialog key={i}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ImageIcon className="mr-1 h-4 w-4" /> Screenshot{" "}
                        {i + 1}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>Screenshot {i + 1}</DialogTitle>
                        <DialogDescription className="sr-only">
                          Full-size screenshot from the test run.
                        </DialogDescription>
                      </DialogHeader>
                      <img
                        src={toFileUrl(p)}
                        alt={`screenshot-${i + 1}`}
                        className="rounded-lg max-h-[70vh] mx-auto"
                      />
                    </DialogContent>
                  </Dialog>
                ))}

              {/* Video */}
              {test.videoPath && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlayCircle className="mr-1 h-4 w-4" /> Play Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl">
                    <DialogHeader>
                      <DialogTitle>Video</DialogTitle>
                      <DialogDescription className="sr-only">
                        Full-size video from the test run.
                      </DialogDescription>
                    </DialogHeader>
                    <video
                      src={toFileUrl(test.videoPath)}
                      controls
                      className="rounded-lg w-full max-h-[70vh]"
                    />
                  </DialogContent>
                </Dialog>
              )}
              {Array.isArray(test.videoPath) &&
                test.videoPath.map((p, i) => (
                  <Dialog key={i}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ImageIcon className="mr-1 h-4 w-4" /> Video {i + 1}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>Video {i + 1}</DialogTitle>
                        <DialogDescription className="sr-only">
                          Full-size video from the test run.
                        </DialogDescription>
                      </DialogHeader>
                      <video
                        src={toFileUrl(p)}
                        controls
                        className="rounded-lg w-full max-h-[70vh]"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
          </section>
        )}

        {/* Tabbed Section */}
        <section>
          <Tabs defaultValue="steps" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {test.steps?.length > 0 && (
                <TabsTrigger value="steps">Steps</TabsTrigger>
              )}
              {test.errors?.length > 0 && (
                <TabsTrigger value="errors">Errors</TabsTrigger>
              )}
              {test.logs && <TabsTrigger value="logs">Logs</TabsTrigger>}
            </TabsList>

            {test.steps?.length > 0 && (
              <TabsContent value="steps" className="pt-3">
                <EllipsisBlock
                  title="Test Steps"
                  key="steps"
                  errors={[
                    test.steps
                      .map((s) => {
                        if (s.snippet) {
                          // Title red + snippet below
                          return `<span style="color:red;">${s.title}</span>\n${s.snippet}`;
                        }
                        return s.title;
                      })
                      .join("\n"),
                  ]}
                />
              </TabsContent>
            )}

            {test.errors?.length > 0 && (
              <TabsContent value="errors" className="pt-3">
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  {test.errors.map((e, i) => (
                    <EllipsisBlock key={i} errors={[e]} title="Error Logs" />
                  ))}
                </ul>
              </TabsContent>
            )}

            {test.logs && (
              <TabsContent value="logs" className="pt-3">
                <pre className="bg-muted p-2 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
                  {test.logs}
                </pre>
              </TabsContent>
            )}
          </Tabs>
        </section>
      </CardContent>
    </Card>
  );
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
