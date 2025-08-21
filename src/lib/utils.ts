import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TestResultItem } from "./types/OrtoniReportData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function statusClass(status: TestResultItem["status"]) {
  switch (status) {
    case "passed":
      return "bg-green-500/20 text-green-700";
    case "failed":
      return "bg-red-500/20 text-red-700";
    case "skipped":
      return "bg-gray-500/20 text-gray-700";
    case "flaky":
      return "bg-yellow-500/20 text-yellow-700";
    case "timedOut":
      return "bg-orange-500/20 text-orange-800";
    case "interrupted":
      return "bg-purple-500/20 text-purple-800";
    default:
      return "bg-muted text-foreground/70";
  }
}

export function formatDuration(d: unknown) {
  const n =
    typeof d === "number" ? d : Number(String(d).replace(/[^\d.]/g, ""));
  if (!isFinite(n)) return String(d ?? "");
  if (n < 1000) return `${n} ms`;
  const s = n / 1000;
  if (s < 60) return `${s.toFixed(2)} s`;
  const m = Math.floor(s / 60);
  const rs = Math.round(s % 60);
  return `${m}m ${rs.toFixed(2)}s`;
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

export function statusVariant(status: string) {
  switch (status) {
    case "passed":
      return {
        label: "Passed",
        className: "bg-emerald-500/15 text-emerald-600",
      };
    case "failed":
      return { label: "Failed", className: "bg-red-500/15 text-red-600" };
    case "timedOut":
      return {
        label: "Timed out",
        className: "bg-orange-500/15 text-orange-600",
      };
    case "skipped":
      return { label: "Skipped", className: "bg-slate-500/15 text-slate-600" };
    default:
      return { label: status, className: "bg-zinc-500/15 text-zinc-600" };
  }
}
