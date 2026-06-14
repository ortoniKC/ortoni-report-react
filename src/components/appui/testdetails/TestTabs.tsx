"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, AlertCircle, ScrollText, History, RefreshCcw } from "lucide-react";

import { StepsTab } from "./StepsTab";
import { ErrorsTab } from "./ErrorsTab";
import { LogsTab } from "./LogsTab";
import { HistoryTab } from "./HistoryTab";
import type { TestHistory, TestResultItem } from "@/lib/types/OrtoniReportData";
import { RetryTab } from "./RetryTab";

export function TestTabs({
  test,
  history,
  allAttempts = [],
}: {
  test: TestResultItem;
  history?: TestHistory;
  allAttempts?: TestResultItem[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const defaultTab =
    test.steps?.length > 0
      ? "steps"
      : test.errors?.length > 0
        ? "errors"
        : test.logs
          ? "logs"
          : "history";

  const handleTabChange = () => {
    if (sectionRef.current) {
      const scrollParent = sectionRef.current.closest(".overflow-y-auto");
      if (scrollParent) {
        scrollParent.scrollTo({ top: 0 });
      }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="sticky top-0 z-40 flex w-full bg-background/95 dark:bg-background/95 backdrop-blur-md p-1 h-auto rounded-md overflow-x-auto border border-border/40 shadow-sm mb-4">
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
            <TabsTrigger value="logs" className="py-2 text-xs gap-1 rounded-md">
              <ScrollText className="h-4 w-4" />
              Logs
            </TabsTrigger>
          )}
          {allAttempts.length > 1 && (
            <TabsTrigger
              value="retries"
              className="py-2 text-xs gap-1 rounded-md"
            >
              <RefreshCcw className="h-4 w-4" />
              Retries ({allAttempts.length})
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

        <StepsTab steps={test.steps} testStatus={test.status} />
        <ErrorsTab test={test} />
        <LogsTab logs={test.logs} />
        <RetryTab attempts={allAttempts} currentKey={test.key} />
        <HistoryTab history={history} />
      </Tabs>
    </motion.section>
  );
}
