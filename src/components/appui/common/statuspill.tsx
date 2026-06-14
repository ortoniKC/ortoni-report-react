import type { TestResultItem } from "@/lib/types/OrtoniReportData";

import { AlertCircle, Check, RefreshCw, Clock, XCircle, ChevronRightCircle } from "lucide-react";
import { motion } from "framer-motion";

export function StatusPill({
  status,
  size = "md",
  iconOnly = false,
}: {
  status: TestResultItem["status"];
  size?: "xs" | "sm" | "md";
  iconOnly?: boolean;
}) {
  const sizeMap = {
    xs: {
      pill: iconOnly ? "p-0.5 aspect-square justify-center" : "px-2 py-0.3 text-[8px] gap-0.5",
      icon: "h-2 w-2",
    },
    sm: {
      pill: iconOnly ? "p-1 aspect-square justify-center" : "px-2.5 py-0.5 text-[11px] gap-1",
      icon: "h-3.5 w-3.5",
    },
    md: {
      pill: iconOnly ? "p-1.5 aspect-square justify-center" : "px-3 py-1 text-xs gap-1.5",
      icon: "h-4 w-4",
    },
  };
  const sizes = sizeMap[size];

  const statusConfig = {
    passed: {
      class:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      icon: <Check className={sizes.icon} />,
    },
    failed: {
      class: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
      icon: <XCircle className={sizes.icon} />,
    },
    interrupted: {
      class: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
      icon: <XCircle className={sizes.icon} />,
    },
    timedOut: {
      class:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
      icon: <Clock className={sizes.icon} />,
    },
    flaky: {
      class:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
      icon: <AlertCircle className={sizes.icon} />,
    },
    skipped: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRightCircle className={sizes.icon} />,
    },
    expected: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRightCircle className={sizes.icon} />,
    },
    unexpected: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRightCircle className={sizes.icon} />,
    },
  };

  const config = statusConfig[status] || {
    class: "bg-muted text-foreground/80 border-muted-foreground/20",
    icon: <AlertCircle className={sizes.icon} />,
  };

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center rounded-full border font-medium ${sizes.pill} ${config.class}`}
      title={iconOnly ? status.charAt(0).toUpperCase() + status.slice(1) : undefined}
    >
      {config.icon}
      {!iconOnly && status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  );
}
// export function StatusPill({
//   status,
//   size = "md", // "xs" | "sm" | "md"
// }: {
//   status: TestResultItem["status"];
//   size?: "xs" | "sm" | "md";
// }) {
//   const sizeMap = {
//     xs: {
//       pill: "px-2 py-0.5 text-[10px] gap-0.5",
//       icon: "h-3 w-3",
//     },
//     sm: {
//       pill: "px-2.5 py-0.5 text-[11px] gap-1",
//       icon: "h-3.5 w-3.5",
//     },
//     md: {
//       pill: "px-3 py-1 text-xs gap-1.5",
//       icon: "h-4 w-4",
//     },
//   };

//   const sizes = sizeMap[size];

//   const statusConfig = {
//     passed: {
//       class:
//         "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
//       icon: <Check className={sizes.icon} />,
//     },
//     failed: {
//       class: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
//       icon: <XCircle className={sizes.icon} />,
//     },
//     timedOut: {
//       class:
//         "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
//       icon: <Clock className={sizes.icon} />,
//     },
//     skipped: {
//       class:
//         "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
//       icon: <ChevronRight className={sizes.icon} />,
//     },
//   };

//   const config = statusConfig[status] || {
//     class: "bg-muted text-foreground/80 border-muted-foreground/20",
//     icon: <AlertCircle className={sizes.icon} />,
//   };

//   return (
//     <motion.span
//       initial={{ scale: 0.95, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       transition={{ duration: 0.2 }}
//       className={`inline-flex items-center rounded-full border font-medium ${sizes.pill} ${config.class}`}
//     >
//       {config.icon}
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </motion.span>
//   );
// }
