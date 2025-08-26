"use client";

import { TestTitle } from "./TestTitle";
import { TestMeta } from "./TestMeta";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";
import { formatDuration } from "@/lib/utils";

export function TestHeader({ test }: { test: TestResultItem }) {
  return (
    <>
      <TestTitle title={test.title} />
      <TestMeta
        status={test.status}
        duration={formatDuration(test.duration)}
        projectName={test.projectName}
        suite={test.suiteHierarchy}
        location={test.location}
      />
    </>
  );
}
