"use client";

import { motion } from "framer-motion";
import { Clock, Folder, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { StatusPill } from "../../common/utils";
import type { TestStatus } from "@/lib/types/OrtoniReportData";

export function TestMeta({
  status,
  duration,
  projectName,
  suite,
  location,
}: {
  status: TestStatus;
  duration: string;
  projectName: string;
  suite: string;
  location: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(location);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Copy failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
    >
      <StatusPill status={status} />

      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{duration}</span>
      </div>

      <div className="flex items-center gap-1">
        <Folder className="h-4 w-4" />
        <span className="truncate max-w-[120px]">{projectName}</span>
      </div>

      <Badge variant="outline" className="text-xs">
        {suite}
      </Badge>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer flex items-center gap-1"
              onClick={handleCopy}
            >
              {location}
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
  );
}
