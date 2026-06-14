"use client";

import { EllipsisBlock } from "@/components/ui/ellipsis-block";
import { TabsContent } from "@/components/ui/tabs";
import { SuggestFix } from "./SuggestFix";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";

export function ErrorsTab({ test }: { test: TestResultItem }) {
  const errors = test.errors;
  if (!errors?.length) return null;

  return (
    <TabsContent value="errors">
      {errors.map((e, i) => (
        <div key={i} className="flex flex-col gap-2">
          <EllipsisBlock errors={[e]} title="Error" />
          <SuggestFix test={test} error={e} />
        </div>
      ))}
    </TabsContent>
  );
}
