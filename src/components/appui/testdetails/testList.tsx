"use client";

import { memo, useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn, ensureArray, formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronsUpDown, ChevronsDownUp, ChevronDown } from "lucide-react";

import { useSearchParams } from "react-router-dom";
import type {
  TestResult,
  TestResultItem,
} from "@/lib/types/OrtoniReportData";
import { StatusDot } from "./TestAccordion";
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
    const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
    const [searchParams, setSearchParams] = useSearchParams();
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const parentRef = useRef<HTMLDivElement>(null);

    const toggleFile = (filePath: string) => {
      setExpandedFiles((prev) => {
        const next = new Set(prev);
        if (next.has(filePath)) next.delete(filePath);
        else next.add(filePath);
        return next;
      });
    };

    // Auto-expand all or collapse all
    useEffect(() => {
      if (isAllExpanded) {
        setExpandedFiles(new Set(Object.keys(tests.tests ?? {})));
      } else {
        setExpandedFiles(new Set());
      }
    }, [isAllExpanded, tests.tests]);

    const handleTestClick = useCallback((test: TestResultItem) => {
      setSearchParams({ id: test.key }, { replace: true });
      setSelectedTest(test);
      setOpen(true);
    }, [setSearchParams]);

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
    const filteredKeys = useMemo(() => new Set(filtered.map((t) => t.key)), [filtered]);

    // Deep linking: Handle id from URL
    useEffect(() => {
      const id = searchParams.get("id");
      if (id && flattened.length > 0) {
        const targetTest = flattened.find((t) => t.key === id);
        if (targetTest && (!selectedTest || selectedTest.key !== id)) {
          setSelectedTest(targetTest);
          setOpen(true);
          // Sync focused index for keyboard navigation
          const idx = flattened.findIndex((t) => t.key === id);
          if (idx !== -1) setFocusedIndex(idx);
        }
      }
    }, [searchParams, flattened, selectedTest]);

    // Clear search params when sheet is closed manually
    const handleClose = useCallback(() => {
      setOpen(false);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (next.has("id")) {
          next.delete("id");
        }
        return next;
      }, { replace: true });
    }, [setSearchParams]);

    // Reset focus and auto-expand files when filtered changes
    useEffect(() => {
      setFocusedIndex(-1);

      // If filtering is active, auto-expand files that have matches
      if (filtered.length !== flattened.length) {
        const matchingFiles = new Set(filtered.map(t => t.filePath));
        setExpandedFiles(prev => {
          const next = new Set(prev);
          matchingFiles.forEach(f => next.add(f));
          return next;
        });
      }
    }, [filtered, flattened.length]);

    // Keyboard navigation J/K
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        const key = e.key.toLowerCase();
        if (["j", "k", "enter"].includes(key)) {
          e.preventDefault();
        }

        if (key === "j") {
          const nextIdx = focusedIndex < filtered.length - 1 ? focusedIndex + 1 : Math.max(0, focusedIndex);
          if (nextIdx !== -1 && nextIdx !== focusedIndex) {
            setFocusedIndex(nextIdx);
            const nextTest = filtered[nextIdx];
            setExpandedFiles((prev) => {
              if (!prev.has(nextTest.filePath)) {
                const next = new Set(prev);
                next.add(nextTest.filePath);
                return next;
              }
              return prev;
            });
            if (open) handleTestClick(nextTest);
          }
        } else if (key === "k") {
          const prevIdx = focusedIndex > 0 ? focusedIndex - 1 : 0;
          if (prevIdx !== -1 && prevIdx !== focusedIndex) {
            setFocusedIndex(prevIdx);
            const prevTest = filtered[prevIdx];
            setExpandedFiles((prev) => {
              if (!prev.has(prevTest.filePath)) {
                const next = new Set(prev);
                next.add(prevTest.filePath);
                return next;
              }
              return prev;
            });
            if (open) handleTestClick(prevTest);
          }
        } else if (key === "enter" && focusedIndex >= 0) {
          handleTestClick(filtered[focusedIndex]);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [filtered, focusedIndex, open, handleTestClick]);

    /** ─────────────────────────────
     * Virtualization Logic
     */
    const virtualData = useMemo(() => {
      const data: any[] = [];
      Object.entries(tests.tests ?? {}).forEach(([filePath, suites]) => {
        const hasVisible = Object.values(suites ?? {}).some(suiteData =>
          ensureArray(suiteData).some(t => filteredKeys.has(t.key))
        );

        if (!hasVisible) return;

        data.push({ type: 'header', filePath, suites, key: `header:${filePath}` });

        if (expandedFiles.has(filePath)) {
          Object.entries(suites ?? {}).forEach(([suiteName, suiteData]) => {
            ensureArray(suiteData).forEach(t => {
              if (filteredKeys.has(t.key)) {
                data.push({ type: 'test', test: { ...t, suite: suiteName }, key: t.key });
              }
            });
          });
        }
      });
      return data;
    }, [tests.tests, expandedFiles, filteredKeys]);

    const rowVirtualizer = useVirtualizer({
      count: virtualData.length,
      getScrollElement: () => parentRef.current,
      estimateSize: (index) => (virtualData[index]?.type === 'header' ? 52 : 72),
      overscan: 10,
    });

    // Scroll to focused index when navigating with keys
    useEffect(() => {
      if (focusedIndex >= 0 && filtered[focusedIndex]) {
        const testKey = filtered[focusedIndex].key;
        const virtualIdx = virtualData.findIndex(item => item.key === testKey);
        if (virtualIdx !== -1) {
          rowVirtualizer.scrollToIndex(virtualIdx, { align: 'center', behavior: 'smooth' });
        }
      }
    }, [focusedIndex, filtered, virtualData, rowVirtualizer]);

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
        <div className="flex gap-1.5 text-[10px] font-semibold">
          {counts.passed > 0 && (
            <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 px-2 py-0.5 rounded-lg shadow-sm">
              <span>{counts.passed}</span>
              <span className="text-[8px] font-bold opacity-80">PASSED</span>
            </span>
          )}
          {counts.failed > 0 && (
            <span className="inline-flex items-center gap-1 text-destructive bg-destructive/5 dark:bg-destructive/10 border border-destructive/10 dark:border-destructive/20 px-2 py-0.5 rounded-lg shadow-sm">
              <span>{counts.failed}</span>
              <span className="text-[8px] font-bold opacity-80">FAILED</span>
            </span>
          )}
          {counts.flaky > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 px-2 py-0.5 rounded-lg shadow-sm">
              <span>{counts.flaky}</span>
              <span className="text-[8px] font-bold opacity-80">FLAKY</span>
            </span>
          )}
          {counts.skipped > 0 && (
            <span className="inline-flex items-center gap-1 text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded-lg shadow-sm">
              <span>{counts.skipped}</span>
              <span className="text-[8px] font-bold opacity-80">SKIPPED</span>
            </span>
          )}
        </div>
      );
    };

    /** ─────────────────────────────
     * Render leaf node test
     */
    const renderTest = (test: TestResultItem, idx: number) => {
      const isFocused = idx === focusedIndex;
      return (
        <motion.div
          key={test.key}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "text-xs cursor-pointer transition-all duration-300 group rounded-xl border border-transparent p-3 my-1 hover:border-border/60 hover:bg-muted/40",
            isFocused
              ? "bg-primary/[0.06] dark:bg-primary/[0.1] border-primary/20 dark:border-primary/30 shadow-inner"
              : "bg-card/30 dark:bg-card/10"
          )}
          onClick={() => {
            setFocusedIndex(idx);
            handleTestClick(test);
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <StatusDot status={test.status} />
              <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">{test.title}</span>
            </span>
          </div>
          <div className="mt-1.5 text-muted-foreground text-[10.5px] flex flex-wrap gap-x-4 gap-y-1.5">
            {test.suite && (
              <span className="font-medium text-foreground/70">
                Suite: <span className="font-semibold text-foreground/80">{test.suite}</span>
              </span>
            )}
            <span>Duration: <span className="font-semibold text-foreground/80">{formatDuration(test.duration)}</span></span>
            {test.retryAttemptCount > 0 && (
              <span className="text-amber-500 dark:text-amber-400 font-semibold bg-amber-500/[0.08] px-1.5 py-0.2 rounded-md">Retry: {test.retryAttemptCount}</span>
            )}
            {test.projectName && <span>Project: <span className="font-semibold text-foreground/80">{String(test.projectName)}</span></span>}
            {test.testTags?.length ? (
              <span className="truncate">Tags: <span className="font-semibold text-foreground/80">{test.testTags.join(", ")}</span></span>
            ) : null}
          </div>
        </motion.div>
      );
    };

    /** ─────────────────────────────
     * Main Render
     */
    return (
      <>
        {/* Test Details Sheet */}
        <Sheet open={open} onOpenChange={(val) => {
          if (!val) handleClose();
          else setOpen(true);
        }}>
          <SheetContent
            side="right"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
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
          <div
            ref={parentRef}
            className="h-[calc(100vh-14rem)] overflow-auto rounded-2xl border border-border/40 bg-gradient-to-br from-card/30 to-card/10 dark:from-card/20 dark:to-card/5 p-2 custom-scrollbar shadow-sm"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const item = virtualData[virtualItem.index];
                if (!item) return null;

                const isHeader = item.type === 'header';

                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="px-2 py-0.5"
                  >
                    {isHeader ? (
                      <div
                        className={cn(
                          "border border-border/40 rounded-xl bg-gradient-to-r from-card/80 to-card/40 dark:from-card/30 dark:to-card/10 transition-all duration-300 cursor-pointer flex items-center justify-between py-2.5 px-4 h-full shadow-sm hover:border-border hover:from-card hover:to-card",
                          expandedFiles.has(item.filePath) && "border-primary/20 dark:border-primary/10 bg-primary/[0.01] dark:bg-primary/[0.03] shadow-inner"
                        )}
                        onClick={() => toggleFile(item.filePath)}
                      >
                        <div className="flex flex-1 items-center justify-between min-w-0 mr-2">
                          <h3 className="text-left font-semibold text-[13.5px] truncate text-foreground/90 mr-4">
                            {item.filePath}
                          </h3>
                          <div className="shrink-0">
                            {getStatusSummary(
                              Object.values(item.suites ?? {}).flatMap((s) => ensureArray(s))
                            )}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedFiles.has(item.filePath) ? 180 : 0 }}
                          className={cn(
                            "shrink-0 rounded-full p-0.5 transition-colors",
                            expandedFiles.has(item.filePath) ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </div>
                    ) : (
                      <div className="pl-6 h-full">
                        {renderTest(item.test, filtered.findIndex(t => t.key === item.key))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  }
);

TestList.displayName = "TestList";
