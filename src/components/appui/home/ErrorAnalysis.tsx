"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorAnalysisProps {
    testResult: TestResult;
}

export const ErrorAnalysis = memo(({ testResult }: ErrorAnalysisProps) => {
    const errorGroups = useMemo(() => groupErrors(testResult), [testResult]);
    const navigate = useNavigate();

    if (errorGroups.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
        >
            <Card className="border-border bg-card/40 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Top Error Patterns
                    </CardTitle>
                    <Badge variant="destructive" className="rounded-full px-3">
                        {errorGroups.length} Unique Patterns
                    </Badge>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {errorGroups.slice(0, 5).map((group, index) => (
                            <AccordionItem
                                key={`pattern-${index}`}
                                value={`error-${index}`}
                                className="border rounded-lg px-2 bg-background/50"
                            >
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <div className="flex items-center gap-4 text-left w-full mr-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-bold text-sm">
                                            {group.count}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate leading-none mb-1">
                                                {group.message.split("\n")[0]}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                Affecting {group.tests.length} tests
                                            </p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-0 pb-3">
                                    <div className="pl-12 space-y-3">
                                        <div
                                            className="bg-muted/50 rounded-md p-3 font-mono text-xs whitespace-pre-wrap break-all border overflow-x-auto max-h-48 overflow-y-auto"
                                            dangerouslySetInnerHTML={{ __html: group.displayMessage }}
                                        />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                                Impacted Tests
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {group.tests.map((test) => (
                                                    <div
                                                        key={test.key}
                                                        className="flex items-start gap-2 p-2 rounded border bg-card/80 text-xs hover:bg-accent transition-colors cursor-pointer group"
                                                        title={test.title}
                                                        onClick={() => navigate(`/tests?id=${test.key}`)}
                                                    >
                                                        <TestTube2 className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
                                                        <div className="min-w-0">
                                                            <p className="font-medium truncate leading-normal">
                                                                {test.title}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                                <span className="truncate">{test.filePath}</span>
                                                                <ChevronRight className="h-2 w-2" />
                                                                <span className="shrink-0">{test.projectName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    {errorGroups.length > 5 && (
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Showing top 5 error patterns out of {errorGroups.length}.
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
});

ErrorAnalysis.displayName = "ErrorAnalysis";
