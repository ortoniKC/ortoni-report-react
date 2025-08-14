// components/testList.tsx
import React, { useMemo } from "react";
import type { GroupedTests } from "@/lib/types/reportData";
import { groupTests } from "@/lib/groupTest";
import { AccordianItem } from "../ui/accordian";

interface TestListProps {
  tests: GroupedTests;
  showProject: boolean;
}

export const TestList: React.FC<TestListProps> = ({ tests, showProject }) => {
  const grouped = useMemo(
    () => groupTests(tests, showProject),
    [tests, showProject]
  );

  return (
    <div className="space-y-3">
      {grouped.map(({ fileName, projects }, fileIdx) => (
        <AccordianItem
          key={fileName}
          title={<h2 className="text-lg font-semibold">{fileName}</h2>}
          index={fileIdx}
          defaultOpen={false}
        >
          <div className="mt-2 space-y-2">
            {showProject
              ? // File → Project → Suite
                projects.map(({ projectName, suites }, projIdx) => (
                  <AccordianItem
                    key={projectName}
                    title={
                      <h3 className="text-md font-semibold">{projectName}</h3>
                    }
                    index={projIdx}
                  >
                    <div className="mt-2 space-y-2">
                      {suites.map(({ suiteName, tests }, suiteIdx) => {
                        const hideSuiteName = tests.every(
                          (t) => t.suite?.trim() === t.title?.trim()
                        );

                        if (hideSuiteName) {
                          // No accordion for suites with redundant headings
                          return (
                            <ul
                              key={`${suiteName}-${suiteIdx}`}
                              className="list-disc pl-6 text-sm text-muted-foreground space-y-1"
                            >
                              {tests.map((t) => (
                                <li key={t.testId}>{t.title}</li>
                              ))}
                            </ul>
                          );
                        }

                        return (
                          <AccordianItem
                            key={suiteName}
                            title={
                              <h4 className="text-sm font-medium">
                                {suiteName}
                              </h4>
                            }
                            index={suiteIdx}
                          >
                            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                              {tests.map((t) => (
                                <li key={t.testId}>{t.title}</li>
                              ))}
                            </ul>
                          </AccordianItem>
                        );
                      })}
                    </div>
                  </AccordianItem>
                ))
              : // File → Suite (skip project level)
                projects[0]?.suites.map(({ suiteName, tests }, suiteIdx) => {
                  const hideSuiteName = tests.every(
                    (t) => t.suite?.trim() === t.title?.trim()
                  );

                  if (hideSuiteName) {
                    return (
                      <ul
                        key={`${suiteName}-${suiteIdx}`}
                        className="list-disc pl-6 text-sm text-muted-foreground space-y-1"
                      >
                        {tests.map((t) => (
                          <li key={t.testId}>{t.title}</li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <AccordianItem
                      key={suiteName}
                      title={
                        <h4 className="text-sm font-medium">{suiteName}</h4>
                      }
                      index={suiteIdx}
                    >
                      <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                        {tests.map((t) => (
                          <li key={t.testId}>{t.title}</li>
                        ))}
                      </ul>
                    </AccordianItem>
                  );
                })}
          </div>
        </AccordianItem>
      ))}
    </div>
  );
};
