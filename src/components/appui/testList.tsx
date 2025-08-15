"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestResultData } from "@/lib/types/reportData";

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

/** UI pieces */

interface TestAccordionItemProps {
  title: string;
  tests: TestResultData[];
  index: number;
}

function TestAccordionItem({ title, tests, index }: TestAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.02, 0.6),
        ease: "easeOut",
      }}
      className={cn(
        "group border-border/60 rounded-lg border",
        "transition-all duration-200 ease-in-out",
        isOpen ? "bg-card/30 shadow-sm" : "hover:bg-card/50"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4"
      >
        <h3
          className={cn(
            "text-left text-base font-medium transition-colors duration-200",
            "text-foreground/80",
            isOpen && "text-foreground"
          )}
        >
          {title}{" "}
          <span className="text-xs text-muted-foreground ml-2">
            ({tests.length} tests)
          </span>
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "shrink-0 rounded-full p-0.5",
            "transition-colors duration-200",
            isOpen ? "text-primary" : "text-muted-foreground"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.25, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.25 },
              },
            }}
          >
            <div className="border-border/40 border-t px-6 pt-2 pb-4 space-y-2">
              {tests.map((t) => (
                <motion.div
                  key={t.testId ?? `${t.title}-${t.location}`}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-sm leading-relaxed"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate">{t.title}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        statusClass(t.status)
                      )}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="mt-0.5 text-muted-foreground text-xs flex flex-wrap gap-3">
                    <span>Duration: {formatDuration(t.duration)}</span>
                    {t.retry && Number(t.retry) > 0 && (
                      <span>Retry: {t.retry}</span>
                    )}
                    {t.projectName && (
                      <span>Project: {String(t.projectName)}</span>
                    )}
                    {t.testTags?.length ? (
                      <span className="truncate">
                        Tags: {t.testTags.join(", ")}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              ))}

              {!tests.length && (
                <div className="text-xs text-muted-foreground">
                  No tests to display.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** small helpers */
function statusClass(status: TestResultData["status"]) {
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

function formatDuration(d: unknown) {
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
