import type { TestResultData } from "@/lib/types/OrtoniReportData";
import { cn, formatDuration } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface TestAccordionItemProps {
  title: string;
  tests: TestResultData[];
  isParent: boolean;
  children?: React.ReactNode;
  onTestClick?: (test: TestResultData) => void; // NEW
}

export function TestAccordionItem({
  title,
  tests,
  isParent,
  children,
  onTestClick,
}: TestAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border-border/60 rounded-lg border",
        "transition-all duration-200 ease-in-out",
        isParent ? "bg-card/10" : "bg-card/5",
        isOpen ? "shadow-sm" : "hover:bg-card/20"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-4 p-4",
          isParent ? "px-6" : "px-4"
        )}
      >
        <h3
          className={cn(
            "text-left font-medium transition-colors duration-200",
            isParent
              ? "text-base text-foreground"
              : "text-sm text-foreground/90",
            isOpen && "text-foreground"
          )}
        >
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
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
            className={cn(
              "border-border/40 overflow-hidden",
              isParent
                ? "border-t px-6 pt-2 pb-4 space-y-3"
                : "pl-6 pr-4 space-y-2"
            )}
          >
            {children || (
              <>
                {tests.map((t) => (
                  <motion.div
                    key={t.testId ?? `${t.title}-${t.location}`}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-sm leading-relaxed cursor-pointer hover:bg-muted/50 p-2 rounded"
                    onClick={() => onTestClick?.(t)} // NEW
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
                      {t.projectName && !isParent && (
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
                {!tests.length && !children && (
                  <div className="text-xs text-muted-foreground">
                    No tests to display.
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
export function StatusDot({ status }: { status: string }) {
  const color =
    status === "passed"
      ? "bg-emerald-500"
      : status === "failed" || status === "timedOut"
      ? "bg-red-500"
      : status === "flaky"
      ? "bg-amber-500"
      : status === "skipped"
      ? "bg-slate-400"
      : "bg-muted-foreground";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}
