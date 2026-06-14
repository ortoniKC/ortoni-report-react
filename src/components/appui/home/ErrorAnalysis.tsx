"use client";

import { memo, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, ChevronRight, TestTube2 } from "lucide-react";
import { groupErrors } from "@/lib/error-utils";
import type { TestResult } from "@/lib/types/OrtoniReportData";
import { useNavigate } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { TruncatedTooltip } from "@/components/ui/truncated-tooltip";

interface ErrorAnalysisProps {
    testResult: TestResult;
}

export const ErrorAnalysis = memo(({ testResult }: ErrorAnalysisProps) => {
    const errorGroups = useMemo(() => groupErrors(testResult), [testResult]);
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, amount: 0.1 });

    if (errorGroups.length === 0) return null;

    return (
        <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-4"
        >
            <motion.div
                whileHover={{ y: -3, boxShadow: "0 15px 30px rgba(0,0,0,0.03)" }}
                className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br from-card/80 to-card/40 dark:from-card/30 dark:to-card/10 p-5 sm:p-6"
            >
                <BorderBeam
                    duration={8}
                    size={350}
                    className="via-destructive/15 dark:via-destructive/5 from-transparent to-transparent"
                />

                <div className="flex flex-row items-center justify-between pb-4 border-b border-border/40 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/10 to-destructive/2 border border-destructive/20">
                            <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                        </div>
                        <div className="grid gap-0.5 text-left">
                            <h3 className="text-base font-semibold tracking-tight text-foreground">Top Error Patterns</h3>
                            <p className="text-[11px] text-muted-foreground">Automated grouping of test failures</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="rounded-lg px-2 py-0.5 bg-destructive/5 text-destructive border-destructive/20 text-[11px] font-medium shadow-sm">
                        {errorGroups.length} Unique {errorGroups.length === 1 ? "Pattern" : "Patterns"}
                    </Badge>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-2.5">
                    {errorGroups.slice(0, 5).map((group, index) => (
                        <AccordionItem
                            key={`pattern-${index}`}
                            value={`error-${index}`}
                            className="border border-border/30 rounded-xl px-3 sm:px-4 bg-background/40 dark:bg-background/20 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-background/60 shadow-sm"
                        >
                            <AccordionTrigger className="hover:no-underline py-3">
                                <div className="flex items-center gap-3 text-left w-full mr-4">
                                    <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold text-xs border border-border/40">
                                        {group.count}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <TruncatedTooltip
                                            as="p"
                                            text={group.message.split("\n")[0]}
                                            className="text-xs font-semibold leading-none mb-1 text-foreground group-hover:text-primary transition-colors"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            Affecting {group.tests.length} {group.tests.length === 1 ? "test" : "tests"}
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0 pb-3">
                                <div className="pl-10.5 space-y-3">
                                    <div
                                        className="bg-muted/40 dark:bg-muted/20 rounded-xl p-3 font-mono text-[11px] whitespace-pre-wrap break-all border border-border/40 overflow-x-auto max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent text-foreground/90 shadow-inner"
                                        dangerouslySetInnerHTML={{ __html: group.displayMessage }}
                                    />
                                    <div className="space-y-1.5">
                                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                            Impacted Tests
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                            {group.tests.map((test) => (
                                                <motion.div
                                                    whileHover={{ y: -1.5 }}
                                                    key={test.key}
                                                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/40 bg-card/50 dark:bg-card/20 text-[11px] hover:border-border hover:bg-muted/50 transition-all duration-300 cursor-pointer group flex-1 min-w-0"
                                                    onClick={() => navigate(`/tests?id=${test.key}`)}
                                                >
                                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted border border-border/40 group-hover:bg-background group-hover:border-border transition-all duration-300">
                                                        <TestTube2 className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <TruncatedTooltip
                                                            as="p"
                                                            text={test.title}
                                                            className="font-medium leading-normal text-xs text-foreground group-hover:text-primary transition-colors"
                                                        />
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                                            <span className="truncate">{test.filePath}</span>
                                                            <ChevronRight className="h-2 w-2 text-muted-foreground/50" />
                                                            <span className="shrink-0 font-medium">{test.projectName}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                {errorGroups.length > 5 && (
                    <p className="text-center text-[11px] text-muted-foreground mt-5">
                        Showing top 5 error patterns out of {errorGroups.length}.
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
});

ErrorAnalysis.displayName = "ErrorAnalysis";
