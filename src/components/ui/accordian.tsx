"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestResultData } from "@/lib/types/reportData";
interface TestAccordionItemProps {
  title: string;
  tests: TestResultData[];
  index: number;
}

export function TestAccordionItem({
  title,
  tests,
  index,
}: TestAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
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
        onClick={() => setIsOpen(!isOpen)}
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
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
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
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <div className="border-border/40 border-t px-6 pt-2 pb-4 space-y-2">
              {tests.map((t) => (
                <motion.div
                  key={t.testId}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="text-sm leading-relaxed"
                >
                  <div className="flex justify-between items-center">
                    <span>{t.title}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        t.status === "passed" &&
                          "bg-green-500/20 text-green-700",
                        t.status === "failed" && "bg-red-500/20 text-red-700",
                        t.status === "skipped" && "bg-gray-500/20 text-gray-700"
                      )}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Duration: {t.duration}ms
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
