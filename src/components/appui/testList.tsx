"use client";

import { memo, useState } from "react";
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

export const TestList = memo(
  (props: { tests: TestResult; preferences: Preferences }) => {
    const { tests, preferences } = props;
    const [selectedTest, setSelectedTest] = useState<TestResultItem | null>(
      null
    );
    const [open, setOpen] = useState(false);
    const showProject = preferences?.showProject;

    const handleTestClick = (test: TestResultItem) => {
      setSelectedTest(test);
      setOpen(true);
    };

    /** ───────────────────────────────────────────────
     * Render individual test (leaf node)
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

    /** ───────────────────────────────────────────────
     * Render suite → test array (non-project mode)
     */
    const renderSuiteWithoutProjects = (
      suiteName: string,
      suiteData: unknown
    ) => {
      const testArray = ensureArray(suiteData) as TestResultItem[];
      const shouldSkipSuite = testArray.every(
        (test) => test.title === suiteName
      );

      return shouldSkipSuite ? (
        testArray.map(renderTest)
      ) : (
        <TestAccordionItem
          key={suiteName}
          title={`${suiteName} (${testArray.length} tests)`}
          tests={testArray}
          isParent={false}
          onTestClick={handleTestClick}
        />
      );
    };

    /** ───────────────────────────────────────────────
     * Render suite → project grouping (project mode)
     */
    const renderSuiteWithProjects = (suiteName: string, suiteData: unknown) => {
      const projects = suiteData as Record<string, TestResultItem[]>;

      return (
        <TestAccordionItem key={suiteName} title={suiteName} isParent={true}>
          {Object.entries(projects).map(([projectName, testArray]) => {
            const shouldSkipSuite = testArray.every(
              (test) => test.title === suiteName
            );

            return shouldSkipSuite ? (
              testArray.map((test) => (
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
                title={`${projectName} (${testArray.length} tests)`}
                tests={testArray}
                isParent={false}
                onTestClick={handleTestClick}
              />
            );
          })}
        </TestAccordionItem>
      );
    };

    /** ───────────────────────────────────────────────
     * Main Render
     */
    return (
      <>
        {/* Sheet Drawer for Test Details */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            className="
              inset-y-0 right-0 left-auto
              sm:!max-w-none
              w-[75vw] sm:w-[70vw] md:w-[65vw] lg:w-[60vw] xl:w-[55vw] 2xl:w-[50vw]
              max-w-[min(100vw-16px,1200px)]
              h-dvh sm:h-auto sm:max-h-[calc(100dvh-32px)]
              overflow-y-auto overflow-x-hidden
              p-6
            "
          >
            <SheetTitle>Test Details</SheetTitle>
            <div className="min-h-0">
              <TestDetails test={selectedTest} />
            </div>
            <SheetDescription>Test Details</SheetDescription>
          </SheetContent>
        </Sheet>

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
