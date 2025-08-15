"use client";

import type { TestListProps, TestResultData } from "@/lib/types/reportData";
import { TestAccordionItem } from "../ui/accordian";
import { ScrollArea } from "@radix-ui/react-scroll-area";

/**
 * Discriminated props:
 * - showProject: true  -> tests[filePath][suite] is { [project]: TestResultData[] }
 * - showProject: false -> tests[filePath][suite] is TestResultData[]
 */
export function TestList(props: TestListProps) {
  const { tests, showProject } = props;

  return (
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
                const projects = suiteData as Record<string, TestResultData[]>;
                return (
                  <TestAccordionItem
                    key={suiteName}
                    title={suiteName}
                    tests={[]}
                    isParent={true}
                  >
                    {Object.entries(projects).map(
                      ([projectName, testArray]) => {
                        // Check if all tests in this project have the same name as the suite
                        const shouldSkipSuite = testArray.every(
                          (test) => test.title === suiteName
                        );

                        return shouldSkipSuite ? (
                          // Render tests directly without suite level
                          testArray.map((test) => (
                            <TestAccordionItem
                              key={`${test.testId}`}
                              title={projectName}
                              tests={[test]}
                              isParent={false}
                            />
                          ))
                        ) : (
                          // Normal rendering with suite level
                          <TestAccordionItem
                            key={`${suiteName}-${projectName}`}
                            title={`${projectName} (${testArray.length} tests)`}
                            tests={testArray}
                            isParent={false}
                          />
                        );
                      }
                    )}
                  </TestAccordionItem>
                );
              } else {
                const testArray = ensureArray(suiteData);
                // Check if all tests have the same name as the suite
                const shouldSkipSuite = testArray.every(
                  (test) => test.title === suiteName
                );

                return shouldSkipSuite ? (
                  // Render tests directly without suite level
                  testArray.map((test) => (
                    <TestAccordionItem
                      key={test.testId}
                      title={test.title}
                      tests={[test]}
                      isParent={false}
                    />
                  ))
                ) : (
                  // Normal rendering with suite level
                  <TestAccordionItem
                    key={suiteName}
                    title={`${suiteName} (${testArray.length} tests)`}
                    tests={testArray}
                    isParent={false}
                  />
                );
              }
            })}
          </TestAccordionItem>
        </ScrollArea>
      ))}
    </div>
  );
}
/** Guards */

function ensureArray(value: unknown): TestResultData[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    // e.g. { projA: TestResultData[], projB: TestResultData[] }
    const arrays = Object.values(value as Record<string, unknown>).filter(
      Array.isArray
    ) as TestResultData[][];
    return arrays.flat();
  }
  return [];
}
