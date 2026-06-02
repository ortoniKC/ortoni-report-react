"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Copy, Check } from "lucide-react";
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

function ErrorSnippetBlock({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const decoded = decodeHtmlEntities(snippet);
  const formatted = formatIfJson(decoded);

  const lineCount = decoded.split("\n").length;
  const isLong = lineCount > 6 || decoded.length > 350;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(decoded);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative group/snippet mt-1.5 w-full select-text">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/snippet:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-1 rounded bg-stone-900 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-stone-800 transition-all shadow-md"
          title="Copy trace to clipboard"
          aria-label="Copy traceback"
        >
          {copied ? (
            <span className="text-[10px] text-green-500 font-medium px-1.5 py-0.5 flex items-center gap-1">
              <Check className="size-3" /> Copied!
            </span>
          ) : (
            <Copy className="size-3 m-0.5" />
          )}
        </button>
      </div>

      <div className="relative">
        <pre
          className={`text-[11px] text-muted-foreground whitespace-pre-wrap font-mono p-3 bg-muted/10 rounded border border-border/10 transition-all overflow-hidden ${
            isLong && !isExpanded ? "max-h-[160px] pb-8" : ""
          }`}
          dangerouslySetInnerHTML={{
            __html: formatted,
          }}
        />
        {isLong && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-stone-900/90 to-transparent pointer-events-none rounded-b" />
        )}
      </div>

      {isLong && (
        <div className="flex justify-center mt-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] px-2 py-0.5 rounded border border-border bg-stone-900 hover:bg-stone-800 text-muted-foreground hover:text-foreground transition-all font-medium select-none shadow-sm"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

function StepItem({
  s,
  index,
  level,
  testStatus,
  expandTrigger,
  collapseTrigger,
}: {
  s: Steps;
  index: number;
  level: number;
  testStatus: TestStatus;
  expandTrigger: number;
  collapseTrigger: number;
}) {
  const hasSubSteps =
    s.category === "test.step" && s.steps && s.steps.length > 0;

  const initialExpanded =
    testStatus === "passed" ? false : hasErrorInTree(s);

  const [expanded, setExpanded] = useState(initialExpanded);

  useEffect(() => {
    if (expandTrigger > 0) {
      setExpanded(true);
    }
  }, [expandTrigger]);

  useEffect(() => {
    if (collapseTrigger > 0) {
      setExpanded(false);
    }
  }, [collapseTrigger]);

  const numbering = `${index + 1}.`;

  return (
    <div className="mb-1">
      <div className="flex items-start gap-2 justify-between py-1 group rounded-lg hover:bg-muted/10 px-1.5 -mx-1.5 transition-colors">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <span className="text-muted-foreground/60 font-mono text-[11px] w-6 text-right select-none pt-0.5 flex-shrink-0">
            {numbering}
          </span>

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5 min-h-[1.5rem]">
              {hasSubSteps ? (
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-0.5 rounded hover:bg-muted/30"
                  aria-label={expanded ? "Collapse" : "Expand"}
                  aria-expanded={expanded}
                >
                  <ChevronRight
                    className={`size-3 transition-transform duration-200 ${
                      expanded ? "rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                <div className="w-4 flex-shrink-0" />
              )}
              <span
                className={`text-xs font-semibold break-words leading-tight ${
                  s.snippet ? "text-destructive" : "text-foreground/90"
                }`}
              >
                {s.title}
              </span>
            </div>

            {s.snippet && <ErrorSnippetBlock snippet={s.snippet} />}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start pt-0.5">
          {s.duration && (
            <span className="text-muted-foreground/60 font-mono text-[10px]">
              {s.duration} ms
            </span>
          )}
          {s.status && (
            <StatusPill status={s.status as TestStatus} size="xs" />
          )}
        </div>
      </div>

      {hasSubSteps && expanded && (
        <div className="border-l border-border/30 ml-4 pl-4 mt-1 space-y-1" role="group">
          {renderStepsRecursive(
            s.steps!,
            level + 1,
            testStatus,
            expandTrigger,
            collapseTrigger
          )}
        </div>
      )}
    </div>
  );
}

function renderStepsRecursive(
  steps: Steps[],
  level = 0,
  testStatus: TestStatus = "passed",
  expandTrigger = 0,
  collapseTrigger = 0
) {
  return steps.map((s, index) => (
    <StepItem
      key={index}
      s={s}
      index={index}
      level={level}
      testStatus={testStatus}
      expandTrigger={expandTrigger}
      collapseTrigger={collapseTrigger}
    />
  ));
}

/**
 * Recursively checks if any step in the list has nested child steps.
 */
function hasAnySubSteps(steps: Steps[]): boolean {
  return steps.some(
    (s) =>
      (s.category === "test.step" && s.steps && s.steps.length > 0) ||
      (s.steps && hasAnySubSteps(s.steps))
  );
}

export function StepsTab({
  steps,
  testStatus,
}: {
  steps: Steps[];
  testStatus: TestStatus;
}) {
  const [expandTrigger, setExpandTrigger] = useState(0);
  const [collapseTrigger, setCollapseTrigger] = useState(0);

  if (!steps?.length) return null;

  const showHeader = hasAnySubSteps(steps);

  return (
    <TabsContent value="steps" className="pt-1.5 space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground">Test Execution Steps</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandTrigger((c) => c + 1)}
              className="text-[10px] px-2 py-0.5 rounded-md border border-border bg-background hover:bg-muted text-foreground font-medium transition-all shadow-sm active:scale-95"
            >
              Expand All
            </button>
            <button
              onClick={() => setCollapseTrigger((c) => c + 1)}
              className="text-[10px] px-2 py-0.5 rounded-md border border-border bg-background hover:bg-muted text-foreground font-medium transition-all shadow-sm active:scale-95"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}
      <EllipsisBlock title="Test Steps" key="steps">
        <div className="font-sans space-y-1 text-left">
          {renderStepsRecursive(
            steps,
            0,
            testStatus,
            expandTrigger,
            collapseTrigger
          )}
        </div>
      </EllipsisBlock>
    </TabsContent>
  );
}
