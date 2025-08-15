"use client";

import type { TestResultData } from "@/lib/types/reportData";
import { TestAccordionItem } from "../ui/accordian";

/**
 * Discriminated props:
 * - showProject: true  -> tests[filePath][suite] is { [project]: TestResultData[] }
 * - showProject: false -> tests[filePath][suite] is TestResultData[]
 */
type TestListProps =
  | {
      showProject: true;
      tests: {
        [filePath: string]: {
          [suite: string]: { [projectName: string]: TestResultData[] };
        };
      };
    }
  | {
      showProject: false;
      tests: {
        [filePath: string]: {
          [suite: string]: TestResultData[];
        };
      };
    };

export function TestList(props: TestListProps) {
  const { tests, showProject } = props;

  return (
    <div className="space-y-3">
      {Object.entries(tests ?? {}).map(([filePath, suites], fileIndex) => (
        <div key={filePath} className="space-y-2">
          <h2 className="text-lg font-semibold">{filePath}</h2>

          {Object.entries(suites ?? {}).map(
            ([suiteName, suiteData], suiteIndex) => {
              if (showProject) {
                // suiteData is { [projectName]: TestResultData[] }
                const perProject = suiteData as {
                  [projectName: string]: TestResultData[];
                };
                return Object.entries(perProject).map(
                  ([projectName, testArray], projectIndex) => (
                    <TestAccordionItem
                      key={`${suiteName}-${projectName}`}
                      title={`${suiteName} (${projectName})`}
                      tests={ensureArray(testArray)}
                      index={fileIndex * 1000 + suiteIndex * 100 + projectIndex}
                    />
                  )
                );
              } else {
                // suiteData is TestResultData[]
                const testArray = suiteData as
                  | TestResultData[]
                  | Record<string, TestResultData[]>;
                // If backend accidentally sends project map when showProject=false, flatten it gracefully.
                const normalized = Array.isArray(testArray)
                  ? testArray
                  : Object.values(testArray ?? {}).flat();

                return (
                  <TestAccordionItem
                    key={suiteName}
                    title={suiteName}
                    tests={ensureArray(normalized)}
                    index={fileIndex * 1000 + suiteIndex}
                  />
                );
              }
            }
          )}
        </div>
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
