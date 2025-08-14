import type { GroupedTests } from "@/lib/types/reportData";
import React from "react";

interface TestListProps {
  tests: GroupedTests;
}

export const TestList: React.FC<TestListProps> = ({ tests }) => {
  return (
    <div>
      {Object.entries(tests).map(([fileName, suites]) => (
        <div key={fileName} className="mb-6">
          {/* File name */}
          <h2 className="text-lg font-bold mb-2">{fileName}</h2>

          {/* Loop through suites */}
          {Object.entries(suites).map(([suiteName, suiteTests]) => {
            const hideSuiteName = suiteTests.every(
              (t) => t.suite?.trim() === t.title?.trim()
            );

            return (
              <div key={suiteName} className="ml-4">
                {/* Show suite name only if not identical to test title */}
                {!hideSuiteName && (
                  <h3 className="text-md font-semibold">{suiteName}</h3>
                )}

                <ul className="ml-4 list-disc">
                  {suiteTests.map((test) => (
                    <li key={test.title + test.projectName} className="text-sm">
                      {test.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
