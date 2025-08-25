"use client";

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
import {
  Check,
  Copy,
  ImageIcon,
  PlayCircle,
  Clock,
  Folder,
  FileText,
  AlertCircle,
  ListChecks,
  ScrollText,
  History,
  LucideInfo,
} from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import { EllipsisBlock } from "../ui/ellipsis-block";
import type { TestHistory, TestResultItem } from "@/lib/types/OrtoniReportData";
import { motion } from "framer-motion";
import { ShowHistory, StatusPill, toFileUrl, TraceButton } from "./utils";
import { HtmlViewerDrawer } from "./openMarkdown";

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

  const [copied, setCopied] = useState(false);
  const history = testHistories.find((h) => h.testId === test.testId);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(test.location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col border bg-background overflow-hidden">
      {/* Header Section */}
      <div className="p-5 border-b bg-muted/30">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-xl font-semibold truncate mb-2"
            >
              {test.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
              <StatusPill status={test.status} />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{test.duration}</span>
              </div>

              <div className="flex items-center gap-1">
                <Folder className="h-4 w-4" />
                <span className="truncate max-w-[120px]">
                  {test.projectName}
                </span>
              </div>

              <Badge variant="outline" className="text-xs">
                {test.suite}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer flex items-center gap-1"
                      onClick={handleCopy}
                    >
                      {test.location}
                      {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? "Copied!" : "Copy test location"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Media Section */}
        {(test.screenshotPath ||
          (Array.isArray(test.screenshots) && test.screenshots.length > 0) ||
          test.videoPath) && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Test Attachments
            </h4>
            <div className="flex flex-wrap gap-2">
              {/* Screenshot(s) */}
              {test.screenshotPath && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-md"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Screenshot
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="
                              w-[95vw]
                              max-w-[95vw]
                              sm:max-w-[95vw]
                              md:max-w-[90vw]
                              lg:max-w-[80vw]
                              xl:max-w-[1280px]
                              h-[80vh]
                              p-0
                              z-[100]
                            "
                  >
                    <DialogHeader>
                      <DialogTitle>Screenshot</DialogTitle>
                      <DialogDescription className="sr-only">
                        Full-size screenshot from the test run.
                      </DialogDescription>
                    </DialogHeader>
                    <motion.img
                      src={toFileUrl(test.screenshotPath)}
                      alt="screenshot"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-md max-h-[70vh] mx-auto object-contain"
                    />
                  </DialogContent>
                </Dialog>
              )}
              {Array.isArray(test.screenshots) &&
                test.screenshots.map((p, i) => (
                  <Dialog key={i}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-md"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Screenshot {i + 1}
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="
                              w-[95vw]
                              max-w-[95vw]
                              sm:max-w-[95vw]
                              md:max-w-[90vw]
                              lg:max-w-[80vw]
                              xl:max-w-[1280px]
                              h-[80vh]
                              p-0
                              z-[100]
                            "
                    >
                      <DialogHeader className="sr-only">
                        <DialogTitle>Screenshot {i + 1}</DialogTitle>
                        <DialogDescription>
                          Full-size screenshot from the test run.
                        </DialogDescription>
                      </DialogHeader>
                      <motion.img
                        src={toFileUrl(p)}
                        alt={`screenshot-${i + 1}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-md max-h-[80vh] mx-auto object-contain p-8"
                      />
                    </DialogContent>
                  </Dialog>
                ))}

              {/* Video */}
              {Array.isArray(test.videoPath) &&
                test.videoPath.map((video, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-md"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Play Video {index + 1}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Test Recording {index + 1}</DialogTitle>
                        <DialogDescription className="sr-only">
                          Video recording from the test run.
                        </DialogDescription>
                      </DialogHeader>
                      <motion.video
                        src={toFileUrl(video)}
                        controls
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-md w-full max-h-[70vh]"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              {test.tracePath && <TraceButton tracePath={test.tracePath} />}
              {test.markdownPath && (
                <HtmlViewerDrawer
                  fileUrl={test.markdownPath}
                  steps={test.steps}
                  errors={test.errors}
                />
              )}
            </div>
          </motion.section>
        )}
        {Array.isArray(test.annotations) && test.annotations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <LucideInfo className="h-4 w-4" />
              Annotations
            </h4>
            <div className="flex-1 space-y-3">
              {test.annotations.map((annotation, index) => (
                <div key={index} className="flex flex-col text-sm">
                  <span>
                    Type:{" "}
                    <span className="text-muted-foreground">
                      {annotation.type}
                    </span>
                  </span>

                  {annotation.description && (
                    <span>
                      Description:{" "}
                      <span className="text-muted-foreground">
                        {annotation.description}
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Tabbed Section */}
        <motion.section
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Tabs
            defaultValue={
              test.steps?.length > 0
                ? "steps"
                : test.errors?.length > 0
                ? "errors"
                : "logs"
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted p-1 h-auto rounded-md">
              {test.steps?.length > 0 && (
                <TabsTrigger
                  value="steps"
                  className="py-2 text-xs gap-1 rounded-md"
                >
                  <ListChecks className="h-4 w-4" />
                  Steps
                </TabsTrigger>
              )}
              {test.errors?.length > 0 && (
                <TabsTrigger
                  value="errors"
                  className="py-2 text-xs gap-1 rounded-md"
                >
                  <AlertCircle className="h-4 w-4" />
                  Errors
                </TabsTrigger>
              )}
              {test.logs && (
                <TabsTrigger
                  value="logs"
                  className="py-2 text-xs gap-1 rounded-md"
                >
                  <ScrollText className="h-4 w-4" />
                  Logs
                </TabsTrigger>
              )}
              <TabsTrigger
                value="history"
                className="py-2 text-xs gap-1 rounded-md"
              >
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            {test.steps?.length > 0 && (
              <TabsContent value="steps">
                <EllipsisBlock
                  title="Test Steps"
                  key="steps"
                  errors={[
                    test.steps
                      .map((s, index) =>
                        s.snippet
                          ? `${
                              index + 1
                            }. <span class="text-destructive font-medium">${
                              s.title
                            }</span>\n${s.snippet}`
                          : `${index + 1}. ${s.title}`
                      )
                      .join("\n"),
                  ]}
                />
              </TabsContent>
            )}

            {test.errors?.length > 0 && (
              <TabsContent value="errors" className="pt-4">
                {test.errors.map((e) => (
                  <div className="flex gap-2">
                    <EllipsisBlock errors={[e]} title={`Error`} />
                  </div>
                ))}
              </TabsContent>
            )}

            {test.logs && (
              <TabsContent value="logs" className="pt-4">
                <div className="rounded-md border bg-muted/20 p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    Log Output
                  </h4>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap font-mono max-h-60">
                    {test.logs}
                  </pre>
                </div>
              </TabsContent>
            )}
            <TabsContent value="history">
              {history ? <ShowHistory history={history.history} /> : null}
            </TabsContent>
          </Tabs>
        </motion.section>
      </div>
    </div>
  );
}
