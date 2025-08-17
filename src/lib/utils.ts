import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TestListProps, TestResultData } from "./types/reportData";
import { useMemo } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function statusClass(status: TestResultData["status"]) {
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
  // Your `duration` is typed as string; handle both string/number
  const n =
    typeof d === "number" ? d : Number(String(d).replace(/[^\d.]/g, ""));
  if (!isFinite(n)) return String(d ?? "");
  if (n < 1000) return `${n} ms`;
  const s = n / 1000;
  if (s < 60) return `${s.toFixed(2)} s`;
  const m = Math.floor(s / 60);
  const rs = Math.round(s % 60);
  return `${m}m ${rs}s`;
}

export function ensureArray(value: unknown): TestResultData[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const arrays = Object.values(value as Record<string, unknown>).filter(
      Array.isArray
    ) as TestResultData[][];
    return arrays.flat();
  }
  return [];
}
