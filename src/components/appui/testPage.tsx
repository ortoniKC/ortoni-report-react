"use client";

import { memo, useMemo } from "react";
import type { ReportData, TestListProps } from "@/lib/types/reportData";
import { TestList } from "./testList";

export const TestsPage = memo((props: { result: ReportData["result"] }) => {
  const { result } = props;

  const grouped = result?.results?.grouped;
  const showProject = Boolean(result?.preferences?.showProject);

  const testsForList: TestListProps = useMemo(() => {
    if (showProject) {
      return grouped as Extract<
        Parameters<typeof TestList>[0],
        { showProject: true }
      >["tests"];
    }
    return grouped as Extract<
      Parameters<typeof TestList>[0],
      { showProject: false }
    >["tests"];
  }, [grouped, showProject]);

  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          <h1 className="text-xl font-semibold">Test Page</h1>
          <TestList tests={testsForList} showProject={showProject} />
          {/* <PlaywrightTestViewer data={testsForList}></PlaywrightTestViewer> */}
        </div>
      </div>
    </div>
  );
});
