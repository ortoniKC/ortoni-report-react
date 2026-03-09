"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Activity } from "lucide-react";
import type { TestHistory } from "@/lib/types/OrtoniReportData";
import { cn } from "@/lib/utils";

interface HeatmapProps {
    testHistories: TestHistory[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function ReliabilityHeatmap({ testHistories }: HeatmapProps) {
    const heatmapData = useMemo(() => {
        // 7 days x 24 hours grid
        const grid = Array.from({ length: 7 }, () =>
            Array.from({ length: 24 }, () => ({ total: 0, failed: 0 }))
        );

        testHistories.forEach((th) => {
            th.history.forEach((run) => {
                const date = new Date(run.run_date);
                if (isNaN(date.getTime())) return;

                const day = date.getDay();
                const hour = date.getHours();

                grid[day][hour].total++;
                if (run.status === "failed" || run.status === "timedOut" || run.status === "unexpected") {
                    grid[day][hour].failed++;
                }
            });
        });

        // Find max failures for scaling color
        let maxFailures = 0;
        grid.forEach(row => row.forEach(cell => {
            if (cell.failed > maxFailures) maxFailures = cell.failed;
        }));

        return { grid, maxFailures };
    }, [testHistories]);

    const getColor = (failed: number, total: number) => {
        if (total === 0) return "bg-muted/10 dark:bg-muted/5";
        if (failed === 0) return "bg-emerald-500/10 dark:bg-emerald-500/20";

        const intensity = Math.min(Math.ceil((failed / heatmapData.maxFailures) * 5), 5);
        const colors = [
            "bg-emerald-500/10 dark:bg-emerald-500/20",
            "bg-orange-100 dark:bg-orange-900/20",
            "bg-orange-300 dark:bg-orange-700/30",
            "bg-red-300 dark:bg-red-800/40",
            "bg-red-500/60 dark:bg-red-600/60",
            "bg-red-600 dark:bg-red-500",
        ];
        return colors[intensity];
    };

    return (
        <Card className="overflow-hidden border-none bg-card/40 dark:bg-card/20 backdrop-blur-md">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <Activity className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reliability Heatmap</CardTitle>
                            <CardDescription>Failure hotspots by day and hour</CardDescription>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[250px]">
                                <p>Shows where test failures are most frequent. Darker red indicates higher concentration of failures.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="relative overflow-x-auto pb-4 custom-scrollbar">
                    <div className="min-w-[700px]">
                        {/* Header / Hours */}
                        <div className="flex mb-2 ml-10">
                            {HOURS.map((h) => (
                                <div key={h} className="flex-1 text-[10px] text-muted-foreground/80 dark:text-muted-foreground/60 text-center font-bold">
                                    {h === 0 ? "12a" : h === 12 ? "12p" : h > 12 ? `${h - 12}p` : `${h}a`}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="space-y-1.5">
                            {DAYS.map((dayName, dayIdx) => (
                                <div key={dayName} className="flex items-center">
                                    <div className="w-10 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {dayName}
                                    </div>
                                    <div className="flex flex-1 gap-1">
                                        {HOURS.map((hour) => {
                                            const cell = heatmapData.grid[dayIdx][hour];
                                            const failureRate = cell.total > 0 ? (cell.failed / cell.total * 100).toFixed(1) : 0;

                                            return (
                                                <TooltipProvider key={hour}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: (dayIdx * 24 + hour) * 0.001 }}
                                                                className={cn(
                                                                    "h-6 flex-1 rounded-sm transition-all hover:ring-2 hover:ring-primary/50 cursor-crosshair",
                                                                    getColor(cell.failed, cell.total)
                                                                )}
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-popover border-border shadow-md">
                                                            <div className="text-xs space-y-1.5 p-1">
                                                                <p className="font-bold text-foreground">{DAYS[dayIdx]}, {hour}:00</p>
                                                                <div className="flex justify-between gap-4">
                                                                    <span className="text-muted-foreground">Total Runs</span>
                                                                    <span className="font-mono font-bold text-foreground">{cell.total}</span>
                                                                </div>
                                                                <div className="flex justify-between gap-4">
                                                                    <span className="text-red-500/80 dark:text-red-400 font-medium">Failures</span>
                                                                    <span className="font-mono font-bold text-red-500 dark:text-red-400">{cell.failed}</span>
                                                                </div>
                                                                {cell.total > 0 && (
                                                                    <div className="border-t border-border pt-1.5 mt-1.5 flex justify-between gap-4 items-center">
                                                                        <span className="text-muted-foreground font-medium">Failure Rate</span>
                                                                        <span className={cn(
                                                                            "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                                                            cell.failed > 0 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                                                                        )}>
                                                                            {failureRate}%
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex gap-4 items-center justify-end text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Stable</span>
                                <div className="flex gap-0.5">
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500/10 dark:bg-emerald-500/20" />
                                    <div className="w-3.5 h-3.5 rounded-sm bg-orange-100 dark:bg-orange-900/20" />
                                    <div className="w-3.5 h-3.5 rounded-sm bg-orange-300 dark:bg-orange-700/30" />
                                    <div className="w-3.5 h-3.5 rounded-sm bg-red-300 dark:bg-red-800/40" />
                                    <div className="w-3.5 h-3.5 rounded-sm bg-red-500/60 dark:bg-red-600/60" />
                                    <div className="w-3.5 h-3.5 rounded-sm bg-red-600 dark:bg-red-500" />
                                </div>
                                <span className="text-red-500 dark:text-red-400">Critical</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
