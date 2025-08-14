import { groupTests } from "@/lib/groupTest";
import type { GroupedTests } from "@/lib/types/reportData";
import React from "react";

interface TestListProps {
  tests: GroupedTests;
  showProject: boolean;
}

export const TestList: React.FC<TestListProps> = ({ tests, showProject }) => {
  const groupedData = groupTests(tests, showProject);

  return (
    <div>
      {groupedData.map(({ fileName, projects }) => (
        <div key={fileName} className="mb-6">
          <h2 className="text-lg font-bold mb-2">{fileName}</h2>

          {projects.map(({ projectName, suites }) => (
            <div key={projectName} className="ml-4">
              {showProject && (
                <h3 className="text-md font-semibold">{projectName}</h3>
              )}

              {suites.map(({ suiteName, tests }) => {
                const hideSuiteName = tests.every(
                  (t) => t.suite?.trim() === t.title?.trim()
                );

                return (
                  <div key={suiteName} className="ml-4">
                    {!hideSuiteName && (
                      <h4 className="text-sm font-medium">{suiteName}</h4>
                    )}
                    <ul className="ml-4 list-disc">
                      {tests.map((test) => (
                        <li key={test.testId} className="text-sm">
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
      ))}
    </div>
  );
};
