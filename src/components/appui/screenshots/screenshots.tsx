import MasonryGallery from "@/components/mvpblocks/masonry-grid-1";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";

interface ScreenshotsProps {
  tests: Record<string, Record<string, TestResultItem[]>>;
}

export default function Screenshots({ tests }: ScreenshotsProps) {
  // Flatten the nested test structure
  const flattenedTests: TestResultItem[] = [];
  if (tests && typeof tests === "object") {
    Object.values(tests).forEach((fileTests) => {
      if (typeof fileTests === "object") {
        Object.values(fileTests).forEach((suiteTests) => {
          if (Array.isArray(suiteTests)) {
            flattenedTests.push(...suiteTests);
          }
        });
      }
    });
  }

  return <MasonryGallery tests={flattenedTests} />;
}
Screenshots.displayName = "Screenshots";
