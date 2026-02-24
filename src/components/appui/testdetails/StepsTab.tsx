"use client";

import { EllipsisBlock } from "@/components/ui/ellipsis-block";
import { TabsContent } from "@/components/ui/tabs";
import type { Steps, TestStatus } from "@/lib/types/OrtoniReportData";
import { StatusPill } from "../common/statuspill";
import { decodeHtmlEntities } from "@/lib/utils";

function renderStepsRecursive(steps: Steps[], level = 0) {
  return steps.map((s, index) => {
    const indent = Array(level).fill("  ").join("");
    const numbering = `${index + 1}.`;

    return (
      <div key={index} className="mb-1">
        <div className="flex items-start gap-2 justify-between">
          <div className="flex items-start gap-2 flex-1">
            <span className="whitespace-pre">
              {indent}
              {numbering}
            </span>

            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={
                    s.snippet ? "text-destructive font-medium" : undefined
                  }
                >
                  {s.title}
                </span>
              </div>

              {s.snippet && (
                <span
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtmlEntities(s.snippet),
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {s.duration && (
              <span className="text-muted-foreground text-xs">
                {s.duration} ms
              </span>
            )}

            {s.status && (
              <StatusPill status={s.status as TestStatus} size="xs" />
            )}
          </div>
        </div>

        {s.steps && s.category === "test.step" && s.steps.length > 0 && (
          <div>{renderStepsRecursive(s.steps, level + 1)}</div>
        )}
      </div>
    );
  });
}

export function StepsTab({ steps }: { steps: Steps[] }) {
  if (!steps?.length) return null;

  return (
    <TabsContent value="steps">
      <EllipsisBlock title="Test Steps" key="steps">
        {renderStepsRecursive(steps)}
      </EllipsisBlock>
    </TabsContent>
  );
}
