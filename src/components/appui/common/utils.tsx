import type { TestResultItem } from "@/lib/types/OrtoniReportData";

import { AlertCircle, Check, ChevronRight, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export function StatusPill({ status }: { status: TestResultItem["status"] }) {
  const statusConfig = {
    passed: {
      class:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      icon: <Check className="h-4 w-4" />,
    },
    failed: {
      class: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
      icon: <XCircle className="h-4 w-4" />,
    },
    interrupted: {
      class: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
      icon: <XCircle className="h-4 w-4" />,
    },
    timedOut: {
      class:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
      icon: <Clock className="h-4 w-4" />,
    },
    flaky: {
      class:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    skipped: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRight className="h-4 w-4" />,
    },
    expected: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRight className="h-4 w-4" />,
    },
    unexpected: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRight className="h-4 w-4" />,
    },
  };

  const config = statusConfig[status] || {
    class: "bg-muted text-foreground/80 border-muted-foreground/20",
    icon: <AlertCircle className="h-4 w-4" />,
  };

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${config.class}`}
    >
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  );
}

export function toFileUrl(p: string) {
  return p.startsWith("http") ? p : p;
}

export function isLocalFile() {
  return window.location.protocol === "file:";
}

export function getAdjustedBaseUrl(): string {
  const { origin, pathname } = window.location;

  // Case: serving an HTML file directly (e.g., /report/index.html)
  if (pathname.endsWith(".html")) {
    const directoryPath = pathname.substring(0, pathname.lastIndexOf("/"));
    return `${origin}${directoryPath}`;
  }

  // Case: already a directory path (e.g., /report/ or /)
  if (pathname.endsWith("/")) {
    return `${origin}${pathname.slice(0, -1)}`; // strip trailing slash
  }

  // Fallback: just return origin + pathname
  return `${origin}${pathname}`;
}
