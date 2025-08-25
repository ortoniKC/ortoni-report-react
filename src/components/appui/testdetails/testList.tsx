"use client";

import { memo, useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ensureArray, formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";

import type {
  Preferences,
  TestResult,
  TestResultItem,
  TestStatus,
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

export const TestList = memo(
  (props: { tests: TestResult; preferences: Preferences }) => {
    const { tests, preferences } = props;
    const [selectedTest, setSelectedTest] = useState<TestResultItem | null>(
      null
    );
    const [open, setOpen] = useState(false);
    const showProject = preferences?.showProject;

    /** ─────────────────────────────
     * Flatten all tests (for filters)
     */
    const flattened = useMemo(() => {
      const results: {
        testId: string;
        title: string;
        suite: string;
        filePath: string;
        projectName: string;
        status: TestStatus;
        duration: string;
        testTags: string[];
      }[] = [];

      Object.entries(tests.tests ?? {}).forEach(([filePath, suites]) => {
        Object.entries(suites ?? {}).forEach(([suiteName, suiteData]) => {
          if (showProject) {
            const projects = suiteData as Record<string, TestResultItem[]>;
            Object.entries(projects).forEach(([projectName, testArray]) => {
              testArray.forEach((t) =>
                results.push({
                  ...t,
                  filePath,
                  suite: suiteName,
                  projectName,
                  testId: t.testId || `${t.title}-${t.location}`,
                  status: t.status,
                  duration: t.duration,
                  testTags: t.testTags || [],
                })
              );
            });
          } else {
            const testArray = ensureArray(suiteData) as TestResultItem[];
            testArray.forEach((t) =>
              results.push({
                ...t,
                filePath,
                suite: suiteName,
                projectName: t.projectName || "", // Keep original projectName if exists
                testId: t.testId || `${t.title}-${t.location}`,
                status: t.status,
                duration: t.duration,
                testTags: t.testTags || [],
              })
            );
          }
        });
      });
      return results;
    }, [tests, showProject]);

    const [filtered, setFiltered] = useState(flattened);
    const [filteredTestIds, setFilteredTestIds] = useState<Set<string>>(
      new Set()
    );

    // Update filtered test IDs whenever filtered changes
    useEffect(() => {
      setFilteredTestIds(new Set(filtered.map((test) => test.testId)));
    }, [filtered]);

    const handleTestClick = (test: TestResultItem) => {
      setSelectedTest(test);
      setOpen(true);
    };

    /** ─────────────────────────────
     * Check if a test suite has visible tests after filtering
     */
    const hasVisibleTests = (testArray: TestResultItem[]) => {
      return testArray.some((test) =>
        filteredTestIds.has(test.testId || `${test.title}-${test.location}`)
      );
    };

    /** ─────────────────────────────
     * Render leaf node test
     */
    const renderTest = (test: TestResultItem) => (
      <motion.div
        key={test.testId}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-sm leading-relaxed cursor-pointer hover:bg-muted/50 p-2 rounded"
        onClick={() => handleTestClick(test)}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <StatusDot status={test.status} />
            <span className="truncate">{test.title}</span>
          </span>
        </div>
        <div className="mt-0.5 text-muted-foreground text-xs flex flex-wrap gap-3 pb-3">
          <span>Duration: {formatDuration(test.duration)}</span>
          {test.retry && Number(test.retry) > 0 && (
            <span>Retry: {test.retry}</span>
          )}
          {test.projectName && <span>Project: {String(test.projectName)}</span>}
          {test.testTags?.length ? (
            <span className="truncate">Tags: {test.testTags.join(", ")}</span>
          ) : null}
        </div>
      </motion.div>
    );

    /** ─────────────────────────────
     * Render suites (filtered-aware) - KEEPING ORIGINAL shouldSkipSuite LOGIC
     */
    const renderSuiteWithoutProjects = (
      suiteName: string,
      suiteData: unknown,
      filePath: string
    ) => {
      const testArray = ensureArray(suiteData) as TestResultItem[];

      // Don't render if no tests are visible after filtering
      if (!hasVisibleTests(testArray)) return null;

      const visibleTests = testArray.filter((t) =>
        filteredTestIds.has(t.testId || `${t.title}-${t.location}`)
      );

      // KEEPING ORIGINAL shouldSkipSuite LOGIC
      const shouldSkipSuite = visibleTests.every(
        (test) => test.title === suiteName
      );

      return shouldSkipSuite ? (
        visibleTests.map(renderTest)
      ) : (
        <TestAccordionItem
          key={`${filePath}-${suiteData}-${suiteName}`}
          title={`${suiteName} (${visibleTests.length} tests)`}
          tests={visibleTests}
          isParent={false}
          onTestClick={handleTestClick}
          defaultOpen={filtered.length !== flattened.length}
        />
      );
    };

    const renderSuiteWithProjects = (
      suiteName: string,
      suiteData: unknown,
      filePath: string
    ) => {
      const projects = suiteData as Record<string, TestResultItem[]>;

      // Check if any project in this suite has visible tests
      const hasVisibleProjects = Object.values(projects).some(hasVisibleTests);
      if (!hasVisibleProjects) return null;

      return (
        <TestAccordionItem
          key={`${filePath}-${suiteData}-${suiteName}`}
          title={suiteName}
          isParent={true}
          defaultOpen={filtered.length !== flattened.length}
        >
          {Object.entries(projects).map(([projectName, testArray]) => {
            if (!hasVisibleTests(testArray)) return null;

            const visibleTests = testArray.filter((t) =>
              filteredTestIds.has(t.testId || `${t.title}-${t.location}`)
            );

            // KEEPING ORIGINAL shouldSkipSuite LOGIC
            const shouldSkipSuite = visibleTests.every(
              (test) => test.title === suiteName
            );

            return shouldSkipSuite ? (
              visibleTests.map((test) => (
                <TestAccordionItem
                  key={test.testId}
                  title={projectName}
                  tests={[test]}
                  isParent={false}
                  onTestClick={() => handleTestClick(test)}
                  defaultOpen={filtered.length !== flattened.length}
                />
              ))
            ) : (
              <TestAccordionItem
                key={`${filePath}-${suiteName}-${projectName}`}
                title={`${projectName} (${visibleTests.length} tests)`}
                tests={visibleTests}
                isParent={false}
                onTestClick={handleTestClick}
                defaultOpen={filtered.length !== flattened.length}
              />
            );
          })}
        </TestAccordionItem>
      );
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
            />
            <SheetDescription className="sr-only">
              Test Details
            </SheetDescription>
          </SheetContent>
        </Sheet>

        {/* 🔍 Filter Bar */}
        <div className="mb-4">
          <FilterBar flattened={flattened} onFilter={setFiltered} />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No tests match the current filters
          </p>
        ) : (
          <ScrollArea className="space-y-3">
            {Object.entries(tests.tests ?? {}).map(([filePath, suites]) => {
              // Check if this file has any visible tests after filtering
              const hasTestsInFile = Object.values(suites ?? {}).some(
                (suiteData) => {
                  if (showProject) {
                    const projects = suiteData as Record<
                      string,
                      TestResultItem[]
                    >;
                    return Object.values(projects).some(hasVisibleTests);
                  } else {
                    const testArray = ensureArray(
                      suiteData
                    ) as TestResultItem[];
                    return hasVisibleTests(testArray);
                  }
                }
              );

              if (!hasTestsInFile) return null;

              return (
                <TestAccordionItem
                  key={filePath}
                  title={filePath}
                  isParent
                  defaultOpen={filtered.length !== flattened.length}
                >
                  {Object.entries(suites ?? {}).map(([suiteName, suiteData]) =>
                    showProject
                      ? renderSuiteWithProjects(suiteName, suiteData, filePath)
                      : renderSuiteWithoutProjects(
                          suiteName,
                          suiteData,
                          filePath
                        )
                  )}
                </TestAccordionItem>
              );
            })}
          </ScrollArea>
        )}
      </>
    );
  }
);
