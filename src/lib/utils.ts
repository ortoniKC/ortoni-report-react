import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TestResultItem } from "./types/OrtoniReportData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number): string {
  // round to nearest ms
  const totalMs = Math.round(duration);

  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const parts: string[] = [];

  if (hours) parts.push(`${hours}h`);
  if (minutes || hours) parts.push(`${minutes.toString().padStart(2, "0")}m`);
  if (seconds || minutes || hours)
    parts.push(`${seconds.toString().padStart(2, "0")}s`);
  if (ms && !(hours || minutes || seconds)) {
    parts.push(`${ms}ms`);
  } else if (ms) {
    parts.push(`${ms.toString().padStart(3, "0")}ms`);
  }

  return parts.join(":");
}

export function ensureArray(value: unknown): TestResultItem[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const arrays = Object.values(value as Record<string, unknown>).filter(
      Array.isArray
    ) as TestResultItem[][];
    return arrays.flat();
  }
  return [];
}

interface SuiteData {
  name: string;
  tests: TestResultItem[];
}

export const renderSuiteWithoutProjects = (
  suiteName: string,
  suiteData: unknown
): SuiteData[] => {
  const testArray = ensureArray(suiteData) as TestResultItem[];
  return [
    {
      name: suiteName,
      tests: testArray ?? [],
    },
  ];
};

export const renderSuiteWithProjects = (
  _suiteName: string,
  suiteData: unknown
): SuiteData[] => {
  const projects = suiteData as Record<string, unknown>;

  return Object.entries(projects).map(([projectName, testArray]) => ({
    name: `${projectName}`,
    tests: ensureArray(testArray) as TestResultItem[],
  }));
};

export function copyToClipboard(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
}
