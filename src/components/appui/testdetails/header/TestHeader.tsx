"use client";

import { TestTitle } from "./TestTitle";
import { TestMeta } from "./TestMeta";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";

export function TestHeader({ test }: { test: TestResultItem }) {
  return (
    <>
      <TestTitle title={test.title} />
      <TestMeta
        status={test.status}
        duration={test.duration}
        projectName={test.projectName}
        suite={test.suiteHierarchy}
        location={test.location}
      />
    </>
  );
}
