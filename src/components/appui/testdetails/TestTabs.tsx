"use client";

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
  const defaultTab =
    test.steps?.length > 0
      ? "steps"
      : test.errors?.length > 0
        ? "errors"
        : "logs";

  return (
    <motion.section
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="flex w-full bg-muted p-1 h-auto rounded-md overflow-x-auto">
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
