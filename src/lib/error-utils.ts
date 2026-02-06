import type { TestResult } from "./types/OrtoniReportData";
import { ensureArray } from "./utils";

export interface ErrorGroup {
  message: string;
  displayMessage: string;
  count: number;
  tests: {
    testId: string;
    key: string;
    title: string;
    filePath: string;
    projectName: string;
  }[];
}

/**
 * Normalizes an error message to help grouping similar errors together.
 * Removes line numbers, timestamps, and other dynamic data.
 */
export function normalizeErrorMessage(error: string): string {
  if (!error) return "Unknown Error";

  // Remove HTML tags (Playwright reports often pre-format errors with spans for colors)
  let normalized = error.replace(/<[^>]*>?/gm, "");
  
  // Decode common HTML entities
  normalized = normalized
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Remove Playwright specific location noise (e.g., "demo.spec.ts:12:3")
  normalized = normalized.replace(/at .*\.spec\.ts:\d+:\d+/g, "at [location]");
  
  // Remove line number references in the snippet part
  normalized = normalized.replace(/^(\s*)\d+(\s*)\|/gm, "$1[line]$2|");

  // Keep only the first few lines for the summary grouping
  const lines = normalized.split("\n");
  if (lines.length > 5) {
      return lines.slice(0, 3).join("\n").trim();
  }

  return normalized.trim();
}

export function groupErrors(testResult: TestResult): ErrorGroup[] {
  const groups: Record<string, ErrorGroup> = {};

  Object.entries(testResult.tests ?? {}).forEach(([filePath, suites]) => {
    Object.entries(suites ?? {}).forEach(([, suiteData]) => {
      const testArray = ensureArray(suiteData);
      testArray.forEach((test) => {
        if (test.status === "failed" || test.status === "timedOut" || test.status === "unexpected") {
          const rawError = test.errors?.[0] || "Unknown Error";
          const normalized = normalizeErrorMessage(rawError);

          if (!groups[normalized]) {
            groups[normalized] = {
              message: normalized,
              displayMessage: rawError,
              count: 0,
              tests: [],
            };
          }

          groups[normalized].count++;
          groups[normalized].tests.push({
            testId: test.testId,
            key: test.key,
            title: test.title,
            filePath: filePath,
            projectName: test.projectName,
          });
        }
      });
    });
  });

  return Object.values(groups).sort((a, b) => b.count - a.count);
}
