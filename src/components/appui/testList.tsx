"use client";

import { memo, useState, useMemo } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ensureArray, formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";
import { TestDetails } from "./TestDetails";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import type {
  Preferences,
  TestResult,
  TestResultItem,
} from "@/lib/types/OrtoniReportData";
import { StatusDot, TestAccordionItem } from "./TestAccordion";
import { FilterBar } from "./FilterBar"; // ✅ reuse the one we built

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
      const results: TestResultItem[] = [];

      Object.entries(tests.tests ?? {}).forEach(([filePath, suites]) => {
        Object.entries(suites ?? {}).forEach(([suiteName, suiteData]) => {
          if (showProject) {
            const projects = suiteData as Record<string, TestResultItem[]>;
            Object.entries(projects).forEach(([projectName, testArray]) => {
              testArray.forEach((t) =>
                results.push({ ...t, filePath, suite: suiteName, projectName })
              );
            });
          } else {
            const testArray = ensureArray(suiteData) as TestResultItem[];
            testArray.forEach((t) =>
              results.push({ ...t, filePath, suite: suiteName })
            );
          }
        });
      });
      return results;
    }, [tests, showProject]);

    const [filtered, setFiltered] = useState(flattened);

    const handleTestClick = (test: TestResultItem) => {
      setSelectedTest(test);
      setOpen(true);
    };

    /** ─────────────────────────────
     * Render leaf node test
     */
    const renderTest = (test: TestResultItem) => (
      <motion.div
        key={test.testId ?? `${test.title}-${test.location}`}
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
     * Render suites (filtered-aware)
     */
    const renderSuiteWithoutProjects = (
      suiteName: string,
      suiteData: unknown
    ) => {
      const testArray = ensureArray(suiteData) as TestResultItem[];
      const visibleTests = testArray.filter((t) =>
        filtered.find((f) => f.testId === t.testId)
      );

      if (visibleTests.length === 0) return null;

      const shouldSkipSuite = visibleTests.every(
        (test) => test.title === suiteName
      );

      return shouldSkipSuite ? (
        visibleTests.map(renderTest)
      ) : (
        <TestAccordionItem
          key={suiteName}
          title={`${suiteName} (${visibleTests.length} tests)`}
          tests={visibleTests}
          isParent={false}
          onTestClick={handleTestClick}
        />
      );
    };

    const renderSuiteWithProjects = (suiteName: string, suiteData: unknown) => {
      const projects = suiteData as Record<string, TestResultItem[]>;

      return (
        <TestAccordionItem key={suiteName} title={suiteName} isParent={true}>
          {Object.entries(projects).map(([projectName, testArray]) => {
            const visibleTests = testArray.filter((t) =>
              filtered.find((f) => f.testId === t.testId)
            );
            if (visibleTests.length === 0) return null;

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
                />
              ))
            ) : (
              <TestAccordionItem
                key={`${suiteName}-${projectName}`}
                title={`${projectName} (${visibleTests.length} tests)`}
                tests={visibleTests}
                isParent={false}
                onTestClick={handleTestClick}
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
        {/* Test Details Drawer */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-[75vw] max-w-[1200px] p-6">
            <SheetTitle className="sr-only">Test Details</SheetTitle>
            <TestDetails test={selectedTest} />
            <SheetDescription className="sr-only">
              Test Details
            </SheetDescription>
          </SheetContent>
        </Sheet>

        {/* 🔍 Filter Bar */}
        <div className="mb-4">
          <FilterBar flattened={flattened} onFilter={setFiltered} />
        </div>

        {/* Test List */}
        <ScrollArea className="space-y-3">
          {Object.entries(tests.tests ?? {}).map(([filePath, suites]) => (
            <TestAccordionItem key={filePath} title={filePath} isParent>
              {Object.entries(suites ?? {}).map(([suiteName, suiteData]) =>
                showProject
                  ? renderSuiteWithProjects(suiteName, suiteData)
                  : renderSuiteWithoutProjects(suiteName, suiteData)
              )}
            </TestAccordionItem>
          ))}
        </ScrollArea>
      </>
    );
  }
);
