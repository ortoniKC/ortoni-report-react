"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface TestResultData {
  title: string;
  status: "pass" | "fail" | "skip";
  filePath: string;
  suite: string;
  projectName?: string;
}

type TestListProps =
  | {
      showProject?: true;
      tests: {
        [filePath: string]: {
          [suite: string]: {
            [projectName: string]: TestResultData[];
          };
        };
      };
    }
  | {
      showProject?: false;
      tests: {
        [filePath: string]: {
          [suite: string]: TestResultData[];
        };
      };
    };

export function Glance({ tests, showProject }: TestListProps) {
  // Flatten grouped test data into an array
  const flatTests = useMemo(() => {
    const arr: TestResultData[] = [];

    if (showProject) {
      // Case 1: Grouped by project
      const groupedWithProjects = tests as {
        [filePath: string]: {
          [suite: string]: { [projectName: string]: TestResultData[] };
        };
      };

      for (const filePath in groupedWithProjects) {
        for (const suite in groupedWithProjects[filePath]) {
          for (const projectName in groupedWithProjects[filePath][suite]) {
            const testArr = groupedWithProjects[filePath][suite][projectName];
            if (Array.isArray(testArr)) {
              arr.push(
                ...testArr.map((t) => ({
                  ...t,
                  filePath,
                  suite,
                  projectName,
                }))
              );
            }
          }
        }
      }
    } else {
      // Case 2: No project grouping
      const groupedWithoutProjects = tests as {
        [filePath: string]: { [suite: string]: TestResultData[] };
      };

      for (const filePath in groupedWithoutProjects) {
        for (const suite in groupedWithoutProjects[filePath]) {
          const testArr = groupedWithoutProjects[filePath][suite];
          if (Array.isArray(testArr)) {
            arr.push(
              ...testArr.map((t) => ({
                ...t,
                filePath,
                suite,
              }))
            );
          }
        }
      }
    }

    return arr;
  }, [tests, showProject]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Glance</h2>
      <ul className="space-y-2">
        {flatTests.map((test, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              <span className="font-medium">{test.title}</span>{" "}
              <span className="text-sm text-muted-foreground">
                ({test.suite})
              </span>
              {showProject && test.projectName && (
                <span className="ml-2 text-xs text-blue-500">
                  [{test.projectName}]
                </span>
              )}
            </span>
            <Badge
              variant={
                test.status === "pass"
                  ? "default"
                  : test.status === "fail"
                  ? "destructive"
                  : "secondary"
              }
            >
              {test.status}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
