import type {
  GroupedTests as InputGrouped,
  TestResultData,
} from "@/lib/types/reportData";

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
// type ProjectGroup = {
//   projectName: string;
//   suites: {
//     suiteName: string;
//     tests: { testId: string; title: string }[];
//   }[];
// };

// type GroupedView = ProjectGroup[];

export function groupTests(
  data: InputGrouped,
  showProject: boolean
): GroupedView[] {
  const out: GroupedView[] = [];

  for (const [fileName, suites] of Object.entries(data)) {
    if (showProject) {
      const byProject: Record<string, TestResultData[]> = {};
      for (const arr of Object.values(suites)) {
        for (const t of arr) {
          const proj = (t.projectName as string) || "Unknown Project";
          (byProject[proj] ||= []).push(t);
        }
      }
      const projects = Object.entries(byProject).map(([projectName, arr]) => {
        const bySuite: Record<string, TestResultData[]> = {};
        for (const t of arr) {
          const s = (t.suite as string) || "No Suite";
          (bySuite[s] ||= []).push(t);
        }
        return {
          projectName,
          suites: Object.entries(bySuite).map(([suiteName, tests]) => ({
            suiteName,
            tests,
          })),
        };
      });
      out.push({ fileName, projects });
    } else {
      const suitesArr = Object.entries(suites).map(([suiteName, tests]) => ({
        suiteName,
        tests,
      }));
      out.push({
        fileName,
        projects: [{ projectName: "Default Project", suites: suitesArr }],
      });
    }
  }

  return out;
}
