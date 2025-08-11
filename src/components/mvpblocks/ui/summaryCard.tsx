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
        <div className="border-border bg-card/40 rounded-xl border p-6 transition-all duration-300 hover:shadow-lg">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <h3 className="text-foreground mb-1 text-3xl font-bold">
                {stat.value}
              </h3>
            </div>
            <div className="mb-3">
              <p className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </p>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
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
