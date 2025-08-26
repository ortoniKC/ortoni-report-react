"use client";

import { memo } from "react";
import type { Preferences, TestResult } from "@/lib/types/OrtoniReportData";
import TextGenerateEffect from "../../ui/typewriter";
import { TestList } from "./testList";

export const TestsPage = memo(
  (props: { tests: TestResult; preferences: Preferences }) => {
    const { tests, preferences } = props;

    return (
      <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
        <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            <div className="px-2 sm:px-0">
              <TextGenerateEffect
                words={"Tests"}
                className="text-3xl font-bold tracking-tight sm:text-3xl"
              />
            </div>
            <TestList tests={tests} preferences={preferences} />
          </div>
        </div>
      </div>
    );
  }
);
