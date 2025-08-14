"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  index?: number;
  defaultOpen?: boolean;
  open?: boolean; // controlled (optional)
  onOpenChange?: (open: boolean) => void;
  storageKey?: string; // persists open/close
  className?: string;
  rightAdornment?: React.ReactNode; // e.g., count badges
};

export function AccordianItem({
  title,
  children,
  index = 0,
  defaultOpen = false,
  open,
  onOpenChange,
  storageKey,
  className,
  rightAdornment,
}: Props) {
  // controlled vs uncontrolled
  const persistedDefault = useMemo(() => {
    if (!storageKey) return defaultOpen;
    try {
      const v = localStorage.getItem(storageKey);
      return v ? v === "1" : defaultOpen;
    } catch {
      return defaultOpen;
    }
  }, [storageKey, defaultOpen]);

  const [internalOpen, setInternalOpen] = useState(persistedDefault);
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open! : internalOpen;

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, isOpen ? "1" : "0");
    } catch {}
  }, [isOpen, storageKey]);

  const toggle = () => {
    if (isControlled) onOpenChange?.(!open);
    else setInternalOpen((v) => !v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
      className={cn(
        "group border-border/60 rounded-lg border",
        "transition-all duration-200 ease-in-out",
        isOpen ? "bg-card/30 shadow-sm" : "hover:bg-card/50",
        className
      )}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
        aria-expanded={isOpen}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            "text-left text-sm sm:text-base font-medium",
            "text-foreground/80",
            isOpen && "text-foreground"
          )}
        >
          {title}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {rightAdornment}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "shrink-0 rounded-full p-0.5",
              isOpen ? "text-primary" : "text-muted-foreground"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.35 },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
          >
            <div className="border-border/40 border-t px-4 pt-2 pb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
