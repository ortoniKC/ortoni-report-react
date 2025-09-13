"use client";

import type { Preferences, TestResultItem } from "@/lib/types/OrtoniReportData";
import {
  formatDuration,
  renderSuiteWithoutProjects,
  renderSuiteWithProjects,
} from "@/lib/utils";
import { memo, useEffect, useMemo, useState } from "react";
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
          key: t.key,
          location: t.location,
        }))
      );
    }, [tests, showProject]);

    const [filtered, setFiltered] = useState(flattened);
    const [page, setPage] = useState(1);
    const pageSize = 15;

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    const currentPageData = useMemo(() => {
      const start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    // Reset page when filters change or when page is out of bounds
    useEffect(() => {
      if (page > totalPages) setPage(1);
    }, [filtered, totalPages, page]);

    const goToPage = (p: number) => {
      if (p < 1 || p > totalPages) return;
      setPage(p);
    };

    return (
      <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4 overflow-hidden">
        <div className="flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6 overflow-hidden">
          <div className="h-full flex flex-col space-y-4 sm:space-y-6 overflow-hidden">
            <div className="px-2 sm:px-0">
              <TextGenerateEffect
                words={"Test Glance"}
                className="text-3xl font-bold tracking-tight sm:text-3xl"
              />
            </div>
            <div className="mb-2">
              <FilterBar flattened={flattened} onFilter={setFiltered} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
            >
              {filtered.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No tests match the current filters
                </p>
              ) : (
                <>
                  {/* Scrollable Table */}
                  <div className="flex-1 overflow-auto">
                    <table className="table-auto whitespace-nowrap min-w-[900px] w-full text-sm">
                      <thead className="bg-muted sticky top-0 z-10">
                        <tr>
                          <th className="text-left px-3 py-2">File</th>
                          <th className="text-left px-3 py-2">Suite</th>
                          <th className="text-left px-3 py-2">Test</th>
                          <th className="text-left px-3 py-2">Project</th>
                          <th className="text-left px-3 py-2">Status</th>
                          <th className="text-left px-3 py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {currentPageData.map((r) => (
                            <motion.tr
                              key={r.key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.25 }}
                              className="group transition-colors border-b"
                            >
                              <td className="px-3 py-2 truncate max-w-[240px] group-hover:bg-muted/20">
                                {r.location}
                              </td>
                              <td className="px-3 py-2 truncate max-w-[280px] group-hover:bg-muted/20">
                                {r.suite}
                              </td>
                              <td className="px-3 py-2 truncate max-w-[320px] font-medium group-hover:bg-muted/30">
                                {r.title}
                              </td>
                              <td className="px-3 py-2 capitalize group-hover:bg-muted/20">
                                {r.projectName}
                              </td>
                              <td className="px-3 py-2">
                                <StatusPill status={r.status} />
                              </td>
                              <td className="px-3 py-2 group-hover:bg-muted/20">
                                {formatDuration(r.duration) || "-"}
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between p-3 border-t bg-muted/30 text-sm">
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 rounded bg-muted hover:bg-muted/70 disabled:opacity-50"
                        onClick={() => goToPage(page - 1)}
                        disabled={page <= 1}
                      >
                        Prev
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-muted hover:bg-muted/70 disabled:opacity-50"
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
);
