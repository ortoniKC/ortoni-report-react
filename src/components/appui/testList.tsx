"use client";

import { useState } from "react";
import type { TestListProps, TestResultData } from "@/lib/types/reportData";
import { StatusDot, TestAccordionItem } from "../ui/accordian";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";
import { TestDetails } from "./TestDetails";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export function TestList(props: TestListProps) {
  const { tests, showProject } = props;
  const [selectedTest, setSelectedTest] = useState<TestResultData | null>(null);
  const [open, setOpen] = useState(false);

  const handleTestClick = (test: TestResultData) => {
    setSelectedTest(test);
    setOpen(true); // open the draw
  };

  return (
    <>
      {/* Sheet Drawer for Test Details */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[500px] sm:max-w-xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Test Details</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <TestDetails test={selectedTest} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="space-y-3">
        {Object.entries(tests ?? {}).map(([filePath, suites]) => (
          <ScrollArea key={filePath}>
            <TestAccordionItem
              key={filePath}
              title={filePath}
              tests={[]}
              isParent={true}
            >
              {Object.entries(suites ?? {}).map(([suiteName, suiteData]) => {
                if (showProject) {
                  const projects = suiteData as Record<
                    string,
                    TestResultData[]
                  >;
                  return (
                    <TestAccordionItem
                      key={suiteName}
                      title={suiteName}
                      tests={[]}
                      isParent={true}
                    >
                      {Object.entries(projects).map(
                        ([projectName, testArray]) => {
                          const shouldSkipSuite = testArray.every(
                            (test) => test.title === suiteName
                          );

                          return shouldSkipSuite ? (
                            testArray.map((test) => (
                              <TestAccordionItem
                                key={`${test.testId}`}
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
                        }
                      )}
                    </TestAccordionItem>
                  );
                } else {
                  const testArray = ensureArray(suiteData);
                  const shouldSkipSuite = testArray.every(
                    (test) => test.title === suiteName
                  );
                  return shouldSkipSuite ? (
                    testArray.map((t) => (
                      <motion.div
                        key={t.testId ?? `${t.title}-${t.location}`}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-sm leading-relaxed cursor-pointer hover:bg-muted/50 p-2 rounded"
                        onClick={() => handleTestClick(t)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2">
                            <StatusDot status={t.status} />
                            <span className="truncate">{t.title}</span>
                          </span>
                        </div>
                        <div className="mt-0.5 text-muted-foreground text-xs flex flex-wrap gap-3 pb-3">
                          <span>Duration: {formatDuration(t.duration)}</span>
                          {t.retry && Number(t.retry) > 0 && (
                            <span>Retry: {t.retry}</span>
                          )}
                          {t.projectName ?? (
                            <span>Project: {String(t.projectName)}</span>
                          )}
                          {t.testTags?.length ? (
                            <span className="truncate">
                              Tags: {t.testTags.join(", ")}
                            </span>
                          ) : null}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <TestAccordionItem
                      key={suiteName}
                      title={`${suiteName} (${testArray.length} tests)`}
                      tests={testArray}
                      isParent={false}
                      onTestClick={handleTestClick}
                    />
                  );
                }
              })}
            </TestAccordionItem>
          </ScrollArea>
        ))}
      </div>
    </>
  );
}

function ensureArray(value: unknown): TestResultData[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const arrays = Object.values(value as Record<string, unknown>).filter(
      Array.isArray
    ) as TestResultData[][];
    return arrays.flat();
  }
  return [];
}
