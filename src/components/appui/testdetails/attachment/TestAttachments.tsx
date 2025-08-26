"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { ScreenshotDialog } from "./ScreenshotDialog";
import { VideoDialog } from "./VideoDialog";
import { HtmlViewerDrawer } from "../openMarkdown";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";
import { getAdjustedBaseUrl, isLocalFile } from "../../common/utils";
import { Button } from "@/components/ui/button";
export function TestAttachments({
  test,
  toFileUrl,
}: {
  test: any;
  toFileUrl: (p: string) => string;
}) {
  const hasAttachments =
    !!test.screenshotPath ||
    (Array.isArray(test.screenshots) && test.screenshots.length > 0) ||
    (Array.isArray(test.videoPath) && test.videoPath.length > 0) ||
    !!test.tracePath ||
    !!test.markdownPath;

  if (!hasAttachments) return null;

  return (
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
        {/* Single screenshot */}
        {test.screenshotPath && (
          <ScreenshotDialog
            src={toFileUrl(test.screenshotPath)}
            label="Screenshot"
          />
        )}

        {/* Multiple screenshots */}
        {Array.isArray(test.screenshots) &&
          test.screenshots.map((p: string, i: number) => (
            <ScreenshotDialog
              key={i}
              src={toFileUrl(p)}
              label={`Screenshot ${i + 1}`}
            />
          ))}

        {/* Videos */}
        {Array.isArray(test.videoPath) &&
          test.videoPath.map((video: string, i: number) => (
            <VideoDialog
              key={i}
              src={toFileUrl(video)}
              label={`Video ${i + 1}`}
            />
          ))}

        {/* Trace file */}
        {test.tracePath && <TraceButton tracePath={test.tracePath} />}

        {/* Markdown */}
        {test.markdownPath && (
          <HtmlViewerDrawer
            fileUrl={test.markdownPath}
            steps={test.steps}
            errors={test.errors}
          />
        )}
      </div>
    </motion.section>
  );
}

interface TraceButtonProps {
  tracePath: string;
}

export const TraceButton: React.FC<TraceButtonProps> = ({ tracePath }) => {
  const disabled = isLocalFile();

  const handleOpenTrace = () => {
    if (!tracePath || disabled) return;

    const normalizedTracePath = tracePath.replace(/\\/g, "/");
    const baseUrl = getAdjustedBaseUrl();
    const url = `${baseUrl}/trace/index.html?trace=${baseUrl}/${normalizedTracePath}`;
    window.open(url, "_blank");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              onClick={handleOpenTrace}
              variant="outline"
              size="sm"
              className={disabled ? "pointer-events-none opacity-50" : ""}
            >
              Open Trace
            </Button>
          </span>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent>
            Can’t be used in local file. Run{" "}
            <code>npx ortoni-report show-report</code>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
