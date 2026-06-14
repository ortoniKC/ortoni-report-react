"use client";

import {
  memo,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
import { TruncatedTooltip } from "@/components/ui/truncated-tooltip";


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
    // #9: edge-shake animation trigger
    const [shakeEdge, setShakeEdge] = useState<"top" | "bottom" | null>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    // #12: ref to the currently focused test row DOM element
    const focusedRowRef = useRef<HTMLDivElement | null>(null);
    // Scroll should only trigger from keyboard navigation, not from virtualData
    // recomputes caused by header expand/collapse clicks.
    const shouldScrollRef = useRef(false);

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
    const [filteredKeys, setFilteredKeys] = useState<Set<string>>(new Set());

    // #10: O(1) key → filtered-index lookup (avoids findIndex per virtualizer row)
    const filteredIndexMap = useMemo<Map<string, number>>(() => {
      const map = new Map<string, number>();
      filtered.forEach((t, i) => map.set(t.key, i));
      return map;
    }, [filtered]);

    // Deep linking: Handle id from URL
    // Bug fix: use filteredIndexMap (not flattened) so focusedIndex matches the
    // position in the filtered array that keyboard navigation operates on.
    useEffect(() => {
      const id = searchParams.get("id");
      if (id && flattened.length > 0) {
        const targetTest = flattened.find((t) => t.key === id);
        if (targetTest && (!selectedTest || selectedTest.key !== id)) {
          setSelectedTest(targetTest);
          setOpen(true);
          // Use filtered index so J/K navigation stays in sync
          const idx = filteredIndexMap.get(id) ?? -1;
          if (idx !== -1) setFocusedIndex(idx);
        }
      }
    }, [searchParams, flattened, selectedTest, filteredIndexMap]);

    // #6: Clear search params when sheet is closed manually
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

    // Update filtered keys whenever filtered changes
    useEffect(() => {
      const keys = new Set(filtered.map((t) => t.key));
      setFilteredKeys(keys);

      // Bug fix: if the sheet is open with a selectedTest, resync focusedIndex
      // to that test's new position in the filtered array instead of blindly
      // resetting to -1 (which would desync the sheet from keyboard navigation).
      setFocusedIndex((_prev) => {
        if (selectedTest) {
          const newIdx = filtered.findIndex((t) => t.key === selectedTest.key);
          // If the selected test is still in the filtered set, keep it focused;
          // otherwise fall back to -1 (it was filtered out).
          return newIdx !== -1 ? newIdx : -1;
        }
        return -1;
      });

      // If filtering is active, auto-expand files that have matches
      if (filtered.length !== flattened.length) {
        const matchingFiles = new Set(filtered.map(t => t.filePath));
        setExpandedFiles(prev => {
          const next = new Set(prev);
          matchingFiles.forEach(f => next.add(f));
          return next;
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtered, flattened.length]);

    // ─── #9: Edge shake helper ───────────────────────────────────────────────
    const triggerEdgeShake = useCallback((edge: "top" | "bottom") => {
      setShakeEdge(edge);
      setTimeout(() => setShakeEdge(null), 500);
    }, []);

    // ─── #3: Ensure the file for a given test is expanded ───────────────────
    const ensureFileExpanded = useCallback((filePath: string) => {
      setExpandedFiles(prev => {
        if (prev.has(filePath)) return prev;
        const next = new Set(prev);
        next.add(filePath);
        return next;
      });
    }, []);

    /** ─────────────────────────────
     * Keyboard navigation J/K (and aliases ArrowDown/ArrowUp, Enter, Escape)
     * Fixes: #1 cross-file nav, #3 auto-expand, #4 K at -1, #5 spurious click,
     *        #6 Escape, #7 arrow aliases
     */
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        const key = e.key.toLowerCase();
        const isNext = key === "j" || key === "arrowdown";
        const isPrev = key === "k" || key === "arrowup";
        const isEnter = key === "enter";
        const isEscape = key === "escape";

        if (isNext || isPrev || isEnter || isEscape) {
          // Prevent default scroll for arrow keys, vim keys, enter
          if (isNext || isPrev || isEnter) e.preventDefault();
        } else {
          return;
        }

        // #6: Escape closes the sheet
        if (isEscape) {
          if (open) handleClose();
          return;
        }

        if (isNext) {
          // #4/#11: Unified cross-file navigation, no per-file constraint
          if (focusedIndex < filtered.length - 1) {
            const nextIdx = focusedIndex + 1;
            const nextTest = filtered[nextIdx];
            // #3: Auto-expand if collapsed
            ensureFileExpanded(nextTest.filePath);
            shouldScrollRef.current = true;
            setFocusedIndex(nextIdx);
            // #5: Only call handleTestClick if sheet is open AND test actually changed
            if (open && nextTest.key !== selectedTest?.key) {
              handleTestClick(nextTest);
            }
          } else {
            // #9: At end of list — shake
            triggerEdgeShake("bottom");
          }
        } else if (isPrev) {
          // #4: Fix K when focusedIndex is -1 or 0
          if (focusedIndex > 0) {
            const prevIdx = focusedIndex - 1;
            const prevTest = filtered[prevIdx];
            // #3: Auto-expand if collapsed
            ensureFileExpanded(prevTest.filePath);
            shouldScrollRef.current = true;
            setFocusedIndex(prevIdx);
            // #5: Only call handleTestClick if sheet is open AND test actually changed
            if (open && prevTest.key !== selectedTest?.key) {
              handleTestClick(prevTest);
            }
          } else if (focusedIndex === -1 && filtered.length > 0) {
            // #4: K when nothing selected → jump to first item
            const firstTest = filtered[0];
            ensureFileExpanded(firstTest.filePath);
            shouldScrollRef.current = true;
            setFocusedIndex(0);
            if (open) handleTestClick(firstTest);
          } else {
            // #9: At start of list — shake
            triggerEdgeShake("top");
          }
        } else if (isEnter && focusedIndex >= 0) {
          handleTestClick(filtered[focusedIndex]);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
      filtered,
      focusedIndex,
      open,
      handleTestClick,
      selectedTest,
      handleClose,
      ensureFileExpanded,
      triggerEdgeShake,
    ]);

    /** ─────────────────────────────
     * Virtualization Logic
     */
    const virtualData = useMemo(() => {
      const data: any[] = [];
      Object.entries(tests.tests ?? {}).map(([filePath, suites]) => {
        const hasVisible = Object.values(suites ?? {}).some(suiteData =>
          ensureArray(suiteData).some(t => filteredKeys.has(t.key))
        );

        if (!hasVisible) return;

        data.push({ type: 'header', filePath, suites, key: `header:${filePath}` });

        if (expandedFiles.has(filePath)) {
          Object.entries(suites ?? {}).map(([suiteName, suiteData]) => {
            ensureArray(suiteData).map(t => {
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

    // Scroll to focused index — only when triggered by keyboard navigation.
    // Using shouldScrollRef prevents header expand/collapse clicks from
    // scrolling to the last-focused test whenever virtualData recomputes.
    useEffect(() => {
      if (!shouldScrollRef.current) return;
      shouldScrollRef.current = false;
      if (focusedIndex >= 0 && filtered[focusedIndex]) {
        const testKey = filtered[focusedIndex].key;
        const virtualIdx = virtualData.findIndex(item => item.key === testKey);
        if (virtualIdx !== -1) {
          rowVirtualizer.scrollToIndex(virtualIdx, { align: 'center', behavior: 'smooth' });
        }
      }
    }, [focusedIndex, filtered, virtualData, rowVirtualizer]);

    // #12: Move native browser focus to the focused row element
    useEffect(() => {
      if (focusedIndex >= 0 && focusedRowRef.current) {
        focusedRowRef.current.focus({ preventScroll: true });
      }
    }, [focusedIndex]);

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
     * #10: Uses filteredIndexMap for O(1) lookup instead of findIndex
     * #12: Sets tabIndex and focusedRowRef for native focus
     */
    const renderTest = (test: TestResultItem) => {
      // #10: O(1) lookup
      const idx = filteredIndexMap.get(test.key) ?? -1;
      const isFocused = idx === focusedIndex;
      return (
        <motion.div
          key={test.key}
          ref={isFocused ? focusedRowRef : null}
          // #12: Accessibility — native focus for keyboard users
          tabIndex={isFocused ? 0 : -1}
          role="option"
          aria-selected={isFocused}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "text-xs cursor-pointer transition-all duration-300 group rounded-xl border border-transparent p-3 my-1 hover:border-border/60 hover:bg-muted/40 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            isFocused
              ? "bg-primary/[0.06] dark:bg-primary/[0.1] border-primary/20 dark:border-primary/30 shadow-inner"
              : "bg-card/30 dark:bg-card/10"
          )}
          onClick={() => {
            setFocusedIndex(idx);
            handleTestClick(test);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTestClick(test);
            }
          }}
        >
          <div className="flex items-center justify-between gap-3 min-w-0">
            <span className="inline-flex items-center gap-2 min-w-0 flex-1">
              <StatusDot status={test.status} />
              <TruncatedTooltip
                text={test.title}
                className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors flex-1"
              />
            </span>
          </div>
          <div className="mt-1.5 text-muted-foreground text-[10.5px] flex flex-wrap gap-x-4 gap-y-1.5 min-w-0">
            {test.suite && (
              <span className="font-medium text-foreground/70 inline-flex items-center gap-1 min-w-0">
                Suite:&nbsp;
                <TruncatedTooltip
                  text={test.suite}
                  className="font-semibold text-foreground/80 max-w-[160px]"
                />
              </span>
            )}
            <span>Duration: <span className="font-semibold text-foreground/80">{formatDuration(test.duration)}</span></span>
            {test.retryAttemptCount > 0 && (
              <span className="text-amber-500 dark:text-amber-400 font-semibold bg-amber-500/[0.08] px-1.5 py-0.2 rounded-md">Retry: {test.retryAttemptCount}</span>
            )}
            {test.projectName && (
              <span className="inline-flex items-center gap-1 min-w-0">
                Project:&nbsp;
                <TruncatedTooltip
                  text={String(test.projectName)}
                  className="font-semibold text-foreground/80 max-w-[120px]"
                />
              </span>
            )}
            {test.testTags?.length ? (
              <span className="inline-flex items-center gap-1 min-w-0">
                Tags:&nbsp;
                <TruncatedTooltip
                  text={test.testTags.join(", ")}
                  className="font-semibold text-foreground/80 max-w-[160px]"
                />
              </span>
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
          // #9: Edge-shake animation wrapper
          <motion.div
            animate={
              shakeEdge === "bottom"
                ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                : shakeEdge === "top"
                  ? { x: [0, 6, -6, 4, -4, 2, -2, 0] }
                  : { x: 0 }
            }
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <div
              ref={parentRef}
              role="listbox"
              aria-label="Test list"
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
                        // #10: Pass test directly, no findIndex inside render
                        <div className="pl-6 h-full">
                          {renderTest(item.test)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </>
    );
  }
);

TestList.displayName = "TestList";
