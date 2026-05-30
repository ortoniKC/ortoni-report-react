"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  stat: {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
  };
  index: number;
  total: number;
}

export const SummaryCard = memo(
  ({ stat, index, total }: DashboardCardProps) => {
    const Icon = stat.icon;
    const percent = total > 0 ? (Number(stat.value) / total) * 100 : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="group relative"
      >
        <div className="border-border bg-card/40 rounded-xl border p-3 transition-all duration-300 hover:shadow-lg">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className={`rounded-lg p-1.5 ${stat.bgColor} shrink-0`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs font-medium truncate" title={stat.title}>
                  {stat.title}
                </p>
              </div>
              <h3 className="text-foreground text-lg font-bold shrink-0">
                {stat.value}
              </h3>
            </div>
            <div className="pt-1"></div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full rounded-full ${stat.color.replace(
                  "text-",
                  "bg-"
                )}`}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

SummaryCard.displayName = "SummaryCard";
