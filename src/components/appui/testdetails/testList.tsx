"use client";

import { memo, useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { cn, ensureArray, formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";

import { useSearchParams } from "react-router-dom";
import type {
  TestResult,
  TestResultItem,
} from "@/lib/types/OrtoniReportData";
import { StatusDot, TestAccordionItem } from "./TestAccordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilterBar } from "../common/filterBar";
import { TestDetails } from "./TestDetails";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TestList = memo(
  (props: { tests: TestResult }) => {
    const { tests } = props;
    const [selectedTest, setSelectedTest] = useState<TestResultItem | null>(
      null
    );
    const [open, setOpen] = useState(false);
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleTestClick = (test: TestResultItem) => {
      setSearchParams({ id: test.key }, { replace: true });
      setSelectedTest(test);
      setOpen(true);
    };

    /** ─────────────────────────────
     * Flatten all tests (for filters)
     */
    const flattened = useMemo(() => {
      const results: (TestResultItem & { filePath: string; suite: string })[] = [];

      Object.entries(tests.tests ?? {}).forEach(([filePath, suites]) => {
        Object.entries(suites ?? {}).forEach(([suiteName, suiteData]) => {
          const testArray = ensureArray(suiteData) as TestResultItem[];
          testArray.forEach((t: TestResultItem) =>
            results.push({
              ...t,
              filePath,
              suite: suiteName,
              projectName: t.projectName || "",
              testId: t.testId,
              status: t.status,
              duration: t.duration,
              testTags: t.testTags || [],
              location: t.location,
              key: t.key,
            })
          );
        });
      });
      return results;
    }, [tests]);

    const [filtered, setFiltered] = useState(flattened);
    const [filteredKeys, setFilteredKeys] = useState<Set<string>>(new Set());

    // Deep linking: Handle id from URL
    useEffect(() => {
      const id = searchParams.get("id");
      if (id && flattened.length > 0) {
        const targetTest = flattened.find((t) => t.key === id);
        if (targetTest && (!selectedTest || selectedTest.key !== id)) {
          setSelectedTest(targetTest);
          setOpen(true);
        }
      }
    }, [searchParams, flattened, selectedTest]);

    // Clear URL when sheet is closed manually
    useEffect(() => {
      if (!open && searchParams.has("id")) {
        setSearchParams({}, { replace: true });
      }
    }, [open, searchParams, setSearchParams]);

    // Update filtered keys whenever filtered changes
    useEffect(() => {
      setFilteredKeys(new Set(filtered.map((t) => t.key)));
    }, [filtered]);

    /** ─────────────────────────────
     * Calculate summary for a file/suite
     */
    const getStatusSummary = (testArray: TestResultItem[]) => {
      const visible = testArray.filter((t) => filteredKeys.has(t.key));
      const counts = visible.reduce(
        (acc, t) => {
          let status: string = t.status;
          if (
            ["failed", "timedOut", "interrupted", "expected", "unexpected"].includes(
              status
            )
          ) {
            status = "failed";
          }
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return (
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
          {counts.passed > 0 && (
            <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {counts.passed} P
            </span>
          )}
          {counts.failed > 0 && (
            <span className="text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
              {counts.failed} F
            </span>
          )}
          {counts.flaky > 0 && (
            <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
              {counts.flaky} FL
            </span>
          )}
          {counts.skipped > 0 && (
            <span className="text-slate-500 bg-slate-500/10 px-1.5 py-0.5 rounded">
              {counts.skipped} S
            </span>
          )}
        </div>
      );
    };

    /** ─────────────────────────────
     * Check if a test suite has visible tests after filtering
     */
    const hasVisibleTests = (testArray: TestResultItem[]) => {
      return testArray.some((test) => filteredKeys.has(test.key));
    };

    /** ─────────────────────────────
     * Render leaf node test
     */
    const renderTest = (test: TestResultItem) => (
      <motion.div
        key={test.key}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "text-sm leading-relaxed cursor-pointer hover:bg-muted/50 p-2 rounded-r transition-all group"
        )}
        onClick={() => handleTestClick(test)}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <StatusDot status={test.status} />
            <span className="truncate">{test.title}</span>
          </span>
        </div>
        <div className="mt-0.5 text-muted-foreground text-xs flex flex-wrap gap-3 pb-3">
          {test.suite && (
            <span className="font-medium text-foreground/70">
              Suite: {test.suite}
            </span>
          )}
          <span>Duration: {formatDuration(test.duration)}</span>
          {test.retryAttemptCount > 0 && (
            <span>Retry: {test.retryAttemptCount}</span>
          )}
          {test.projectName && <span>Project: {String(test.projectName)}</span>}
          {test.testTags?.length ? (
            <span className="truncate">Tags: {test.testTags.join(", ")}</span>
          ) : null}
        </div>
      </motion.div>
    );

    /** ─────────────────────────────
     * Render File tests
     */
    const renderFileTests = (suites: Record<string, unknown>) => {
      const allTestsInFile: TestResultItem[] = [];

      Object.entries(suites ?? {}).forEach(([suiteName, suiteData]) => {
        const testArray = ensureArray(suiteData) as TestResultItem[];
        testArray.forEach((t) => {
          if (filteredKeys.has(t.key)) {
            allTestsInFile.push({ ...t, suite: suiteName });
          }
        });
      });

      return allTestsInFile.map(renderTest);
    };


    /** ─────────────────────────────
     * Main Render
     */
    return (
      <>
        {/* Test Details Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            className="
              inset-y-0 right-0 left-auto
              sm:!max-w-none
              w-[75vw] sm:w-[70vw] md:w-[65vw] lg:w-[60vw] xl:w-[75vw] 2xl:w-[50vw]
              max-w-[min(100vw-16px,1200px)]
              h-dvh sm:h-auto sm:max-h-[calc(100dvh)]
              overflow-y-auto overflow-x-hidden
            "
          >
            <SheetTitle className="sr-only">Test Details</SheetTitle>
            <TestDetails
              test={selectedTest}
              testHistories={tests.testHistories}
              allTests={flattened}
            />
            <SheetDescription className="sr-only">
              Test Details
            </SheetDescription>
          </SheetContent>
        </Sheet>

        {/* 🔍 Filter Bar & Actions */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <FilterBar flattened={flattened} onFilter={setFiltered} />
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsAllExpanded(!isAllExpanded)}
                  className={cn(
                    "p-2 rounded-lg transition-all border shadow-sm",
                    isAllExpanded
                      ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                  )}
                  aria-label={isAllExpanded ? "Collapse All" : "Expand All"}
                >
                  {isAllExpanded ? (
                    <ChevronsDownUp className="h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isAllExpanded ? "Collapse All" : "Expand All"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No tests match the current filters
          </p>
        ) : (
          <ScrollArea className="space-y-3">
            {Object.entries(tests.tests ?? {}).map(([filePath, suites]) => {
              const hasTestsInFile = Object.values(suites ?? {}).some(
                (suiteData) => {
                  const testArray = ensureArray(suiteData) as TestResultItem[];
                  return hasVisibleTests(testArray);
                }
              );

              if (!hasTestsInFile) return null;

              return (
                <TestAccordionItem
                  key={`file:${filePath}`}
                  title={filePath}
                  isParent
                  defaultOpen={
                    isAllExpanded || filtered.length !== flattened.length
                  }
                  headerRight={getStatusSummary(
                    Object.values(suites ?? {}).flatMap((s) => ensureArray(s))
                  )}
                >
                  {renderFileTests(suites ?? {})}
                </TestAccordionItem>
              );
            })}
          </ScrollArea>
        )}
      </>
    );
  }
);
