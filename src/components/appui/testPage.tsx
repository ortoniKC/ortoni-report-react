import { memo, useMemo, useState } from "react";
import type { ReportData, TestResultData } from "@/lib/types/reportData";
import { TestList } from "./testList";
import { TestDetails } from "./TestDetails";

export const TestsPage = memo(
  ({ result, showProject = true }: ReportData & { showProject?: boolean }) => {
    const data = result.results.grouped; // your existing grouped-by-file data
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

    // index for O(1) lookup on right panel
    const testsIndex = useMemo(() => {
      const m = new Map<string, TestResultData>();
      for (const suites of Object.values(data)) {
        for (const arr of Object.values(suites)) {
          for (const t of arr) m.set(t.testId, t);
        }
      }
      return m;
    }, [data]);

    const selectedTest = selectedTestId ? testsIndex.get(selectedTestId) : null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 h-full">
        <div className="min-h-[60vh] lg:min-h-[calc(100vh-8rem)]">
          <TestList
            data={data}
            showProject={showProject}
            onSelect={(id) => setSelectedTestId(id)}
            selectedTestId={selectedTestId}
          />
        </div>

        <div className="min-h-[60vh] lg:min-h-[calc(100vh-8rem)]">
          <TestDetails test={selectedTest || null} />
        </div>
      </div>
    );
  }
);
