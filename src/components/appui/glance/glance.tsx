"use client";

import type { Preferences, TestResultItem } from "@/lib/types/OrtoniReportData";
import {
  formatDuration,
  renderSuiteWithoutProjects,
  renderSuiteWithProjects,
} from "@/lib/utils";
import { memo, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import TextGenerateEffect from "@/components/ui/typewriter";
import { StatusPill } from "../common/utils";
import { FilterBar } from "../common/filterBar";

interface SuiteData {
  name: string;
  tests: TestResultItem[];
}

export const GlancePage = memo(
  (props: { tests: TestResultItem[]; showProject: Preferences }) => {
    const { tests, showProject } = props;

    // Flatten suites → tests
    const flattened = useMemo(() => {
      const suites: SuiteData[] = Object.entries(tests).flatMap(
        ([suiteName, suiteData]) =>
          showProject
            ? renderSuiteWithProjects(suiteName, suiteData)
            : renderSuiteWithoutProjects(suiteName, suiteData)
      );

      return suites.flatMap((suite) =>
        suite.tests.map((t) => ({
          testId: t.testId,
          title: t.title,
          suite: suite.name,
          filePath: t.filePath,
          projectName: t.projectName,
          status: t.status,
          duration: t.duration,
          testTags: t.testTags ?? [],
          key: t.testId,
        }))
      );
    }, [tests, showProject]);
    const [filtered, setFiltered] = useState(flattened);

    return (
      <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
        <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            <div className="px-2 sm:px-0">
              <TextGenerateEffect
                words={"Test Glance"}
                className="text-3xl font-bold tracking-tight sm:text-3xl"
              />
            </div>
            <FilterBar flattened={flattened} onFilter={setFiltered} />

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
            >
              {filtered.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No tests match the current filters
                </p>
              ) : (
                <ScrollArea className="h-[75vh] w-full hide-scrollbar">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="text-left">File</TableHead>
                        <TableHead className="text-left">Suite</TableHead>
                        <TableHead className="text-left">Test</TableHead>
                        <TableHead className="text-left">Project</TableHead>
                        <TableHead className="text-left">Status</TableHead>
                        <TableHead className="text-left">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filtered.map((r) => (
                          <motion.tr
                            key={r.testId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="group cursor-pointer transition-colors"
                          >
                            <TableCell className="max-w-[240px] truncate group-hover:bg-muted/20 group-hover:shadow-inner transition-all duration-200">
                              {r.filePath}
                            </TableCell>
                            <TableCell className="max-w-[280px] truncate group-hover:bg-muted/20 transition-colors duration-200">
                              {r.suite}
                            </TableCell>
                            <TableCell className="max-w-[320px] truncate font-medium group-hover:bg-muted/30 transition-colors duration-200">
                              {r.title}
                            </TableCell>
                            <TableCell className="capitalize group-hover:bg-muted/20 transition-colors duration-200">
                              {r.projectName}
                            </TableCell>
                            <TableCell>
                              <StatusPill status={r.status} />
                            </TableCell>
                            <TableCell className="group-hover:bg-muted/20 transition-colors duration-200">
                              {formatDuration(r.duration)}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
);
