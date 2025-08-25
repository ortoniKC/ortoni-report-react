"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, Clock, Folder, FileText } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import type { TestHistory, TestResultItem } from "@/lib/types/OrtoniReportData";
import { motion } from "framer-motion";
import { StatusPill, toFileUrl } from "../common/utils";
import { TestAttachments } from "./TestAttachments";
import { TestAnnotations } from "./TestAnnotations";
import { TestTabs } from "./TestTabs";

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
        <TestAttachments test={test} toFileUrl={toFileUrl} />
        {/* Annotations Section */}
        <TestAnnotations annotations={test.annotations} />
        {/* Tabbed Section */}
        <TestTabs test={test} history={history} />
      </div>
    </div>
  );
}
