// TestList.tsx
import { memo } from "react";
import type { TestResultData } from "@/lib/types/reportData";

interface GroupedTests {
  [fileName: string]: { [suiteName: string]: TestResultData[] };
}
interface TestListProps {
  tests: GroupedTests;
}

export const TestList = memo(({ tests }: TestListProps) => {
  return (
    <div>
      {Object.entries(tests).map(([fileName, suites]) => (
        <div key={fileName} className="mb-6">
          <h2 className="text-lg font-bold">{fileName}</h2>
          {Object.entries(suites).map(([suiteName, suiteTests]) => (
            <div key={suiteName} className="ml-4 mb-4">
              <h3 className="text-md font-semibold">{suiteName}</h3>
              <ul className="ml-4 list-disc">
                {suiteTests.map((test, idx) => (
                  <li key={idx}>{test.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});
