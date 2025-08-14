import { memo } from "react";
import type { TestResultData } from "@/lib/types/reportData";

interface TestListProps {
  tests: TestResultData[];
}

const TestListComponent = ({ tests }: TestListProps) => {
  return (
    <div>
      {tests.length > 0 ? (
        tests.map((test, idx) => (
          <div key={idx}>
            {test.title} - {test.status}
          </div>
        ))
      ) : (
        <p>No tests found</p>
      )}
    </div>
  );
};

export const TestList = memo(TestListComponent);
