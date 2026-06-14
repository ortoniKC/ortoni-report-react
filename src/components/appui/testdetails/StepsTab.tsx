"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { EllipsisBlock } from "@/components/ui/ellipsis-block";
import { TabsContent } from "@/components/ui/tabs";
import type { Steps, TestStatus } from "@/lib/types/OrtoniReportData";
import { StatusPill } from "../common/statuspill";
import { decodeHtmlEntities, formatIfJson } from "@/lib/utils";

/**
 * Recursively checks whether a step or any of its descendants
 * contains an error snippet. Used to auto-expand only the steps
 * relevant to a failure.
 */
function hasErrorInTree(step: Steps): boolean {
  if (step.snippet) return true;
  return step.steps?.some(hasErrorInTree) ?? false;
}

function StepItem({
  s,
  index,
  level,
  testStatus,
}: {
  s: Steps;
  index: number;
  level: number;
  /** The overall test status — drives the initial expand/collapse state. */
  testStatus: TestStatus;
}) {
  // Only test.step categories with children get the expand/collapse toggle.
  const hasSubSteps =
    s.category === "test.step" && s.steps && s.steps.length > 0;

  /**
   * Smart initial expansion:
   * - Passed test  → all groups start collapsed (no noise).
   * - Failed test  → only groups that contain an error in their subtree
   *   start expanded, so the failure path is immediately visible.
   */
  const initialExpanded =
    testStatus === "passed" ? false : hasErrorInTree(s);

  const [expanded, setExpanded] = useState(initialExpanded);

  const indent = Array(level).fill("  ").join("");
  const numbering = `${index + 1}.`;

  return (
    <div className="mb-1">
      <div className="flex items-start gap-2 justify-between">
        <div className="flex items-start gap-2 flex-1">
          <span className="whitespace-pre">
            {indent}
            {numbering}
          </span>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              {/* Chevron toggle — only rendered for steps that have sub-steps */}
              {hasSubSteps && (
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  aria-label={expanded ? "Collapse" : "Expand"}
                >
                  <ChevronRight
                    className={`size-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
                  />
                </button>
              )}
              <span
                className={
                  s.snippet ? "text-destructive font-medium" : undefined
                }
              >
                {s.title}
              </span>
            </div>

            {/* Error snippet — shown inline below the step title when present */}
            {s.snippet && (
              <pre
                className="text-sm text-foreground/80 dark:text-muted-foreground whitespace-pre-wrap font-mono p-2 bg-muted/30 dark:bg-muted/10 rounded mt-1 border border-border/40"
                dangerouslySetInnerHTML={{
                  __html: formatIfJson(decodeHtmlEntities(s.snippet)),
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
            <StatusPill status={s.status as TestStatus} size="xs" iconOnly />
          )}
        </div>
      </div>

      {/* Recursively render nested steps when expanded */}
      {hasSubSteps && expanded && (
        <div>{renderStepsRecursive(s.steps!, level + 1, testStatus)}</div>
      )}
    </div>
  );
}

function renderStepsRecursive(steps: Steps[], level = 0, testStatus: TestStatus = "passed") {
  return steps.map((s, index) => (
    <StepItem key={index} s={s} index={index} level={level} testStatus={testStatus} />
  ));
}

export function StepsTab({ steps, testStatus }: { steps: Steps[]; testStatus: TestStatus }) {
  if (!steps?.length) return null;

  return (
    <TabsContent value="steps">
      <EllipsisBlock title="Test Steps" key="steps">
        {renderStepsRecursive(steps, 0, testStatus)}
      </EllipsisBlock>
    </TabsContent>
  );
}
