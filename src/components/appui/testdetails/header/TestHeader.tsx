"use client";

import { TestTitle } from "./TestTitle";
import { TestMeta } from "./TestMeta";

export function TestHeader({ test }: { test: any }) {
  return (
    <>
      <TestTitle title={test.title} />
      <TestMeta
        status={test.status}
        duration={test.duration}
        projectName={test.projectName}
        suite={test.suite}
        location={test.location}
      />
    </>
  );
}
