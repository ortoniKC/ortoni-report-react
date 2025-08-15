import type { GroupedTests, TestResultData } from "@/lib/types/reportData";

export interface GroupedView {
  fileName: string;
  projects: {
    projectName: string;
    suites: {
      suiteName: string;
      tests: TestResultData[];
    }[];
  }[];
}

export function groupTests(
  tests: GroupedTests,
  showProject: boolean
): GroupedView[] {
  const result: GroupedView[] = [];

  Object.entries(tests).forEach(([fileName, suites]) => {
    if (showProject) {
      // Group all tests in file by project
      const testsByProject = Object.values(suites)
        .flat()
        .reduce((acc: Record<string, TestResultData[]>, test) => {
          const proj = test.projectName || "Unknown Project";
          if (!acc[proj]) acc[proj] = [];
          acc[proj].push(test);
          return acc;
        }, {});

      const projects = Object.entries(testsByProject).map(
        ([projectName, projectTests]) => {
          const suitesInProject = projectTests.reduce(
            (acc: Record<string, TestResultData[]>, test) => {
              const suite = test.suite || "No Suite";
              if (!acc[suite]) acc[suite] = [];
              acc[suite].push(test);
              return acc;
            },
            {}
          );

          return {
            projectName,
            suites: Object.entries(suitesInProject).map(
              ([suiteName, suiteTests]) => ({
                suiteName,
                tests: suiteTests,
              })
            ),
          };
        }
      );

      result.push({ fileName, projects });
    } else {
      // No project grouping → single "Default Project" bucket
      const suitesArr = Object.entries(suites).map(
        ([suiteName, suiteTests]) => ({
          suiteName,
          tests: suiteTests,
        })
      );

      result.push({
        fileName,
        projects: [
          {
            projectName: "Default Project",
            suites: suitesArr,
          },
        ],
      });
    }
  });

  return result;
}
