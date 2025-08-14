import { useDeferredValue, useMemo, useRef, useState } from "react";
import type { GroupedTests } from "@/lib/types/reportData";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVirtualizer } from "@tanstack/react-virtual";
import { type GroupedView, groupTests } from "@/lib/groupTest";
import { AccordianItem } from "../ui/accordian";
import { cn } from "@/lib/utils";

type Props = {
  data: GroupedTests; // original grouped-by-file data
  showProject: boolean;
  onSelect: (testId: string) => void; // click handler
  selectedTestId?: string | null;
};

export function TestList({
  data,
  showProject,
  onSelect,
  selectedTestId,
}: Props) {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const grouped = useMemo<GroupedView[]>(
    () => groupTests(data, showProject),
    [data, showProject]
  );

  // Basic filter across file/project/suite/test title
  const filtered = useMemo(() => {
    const term = dq.trim().toLowerCase();
    if (!term) return grouped;

    return grouped
      .map((f) => ({
        ...f,
        projects: f.projects
          .map((p) => ({
            ...p,
            suites: p.suites
              .map((s) => ({
                ...s,
                tests: s.tests.filter(
                  (t) =>
                    (t.title || "").toLowerCase().includes(term) ||
                    (t.suite || "").toLowerCase().includes(term) ||
                    (t.projectName || "").toLowerCase().includes(term) ||
                    f.fileName.toLowerCase().includes(term)
                ),
              }))
              .filter((s) => s.tests.length > 0),
          }))
          .filter((p) => p.suites.length > 0),
      }))
      .filter((f) => f.projects.length > 0);
  }, [grouped, dq]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        <Input
          placeholder="Search tests, suites, projects, files…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-2">
        <div className="space-y-2">
          {filtered.map(({ fileName, projects }, fileIdx) => (
            <AccordianItem
              key={fileName}
              title={<span className="truncate">{fileName}</span>}
              index={fileIdx}
              storageKey={`ortoni:acc:file:${fileName}`}
              rightAdornment={
                <Badge variant="secondary">{countTests(projects)}</Badge>
              }
            >
              <div className="space-y-2">
                {showProject
                  ? // File → Project → Suite
                    projects.map(({ projectName, suites }, projIdx) => (
                      <AccordianItem
                        key={projectName}
                        title={<span className="truncate">{projectName}</span>}
                        index={projIdx}
                        storageKey={`ortoni:acc:file:${fileName}:proj:${projectName}`}
                        rightAdornment={
                          <Badge variant="outline">
                            {countTests([{ projectName, suites }])}
                          </Badge>
                        }
                      >
                        <div className="space-y-2">
                          {suites.map(({ suiteName, tests }, suiteIdx) => {
                            const hideSuiteName = tests.every(
                              (t) => t.suite?.trim() === t.title?.trim()
                            );
                            return (
                              <SuiteBlock
                                key={suiteName || suiteIdx}
                                fileName={fileName}
                                projectName={projectName}
                                suiteName={suiteName}
                                tests={tests}
                                hideSuiteName={hideSuiteName}
                                onSelect={onSelect}
                                selectedTestId={selectedTestId}
                              />
                            );
                          })}
                        </div>
                      </AccordianItem>
                    ))
                  : // File → Suite only
                    projects[0]?.suites.map(
                      ({ suiteName, tests }, suiteIdx) => {
                        const hideSuiteName = tests.every(
                          (t) => t.suite?.trim() === t.title?.trim()
                        );
                        return (
                          <SuiteBlock
                            key={suiteName || suiteIdx}
                            fileName={fileName}
                            projectName={undefined}
                            suiteName={suiteName}
                            tests={tests}
                            hideSuiteName={hideSuiteName}
                            onSelect={onSelect}
                            selectedTestId={selectedTestId}
                          />
                        );
                      }
                    )}
              </div>
            </AccordianItem>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function countTests(
  projects: GroupedView["projects"] // ✅ Access the "projects" property type
) {
  return projects.reduce(
    (acc, p) => acc + p.suites.reduce((a, s) => a + s.tests.length, 0),
    0
  );
}

type SuiteBlockProps = {
  fileName: string;
  projectName?: string | undefined;
  suiteName: string;
  tests: any[];
  hideSuiteName: boolean;
  onSelect: (testId: string) => void;
  selectedTestId?: string | null;
};

// Virtualized list of tests per suite (fallbacks to non-virtual if tiny)
function SuiteBlock({
  fileName,
  projectName,
  suiteName,
  tests,
  hideSuiteName,
  onSelect,
  selectedTestId,
}: SuiteBlockProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const useVirtual = tests.length > 80; // threshold — tweak as you like

  const rowVirtualizer = useVirtual
    ? useVirtualizer({
        count: tests.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32, // px
        overscan: 12,
      })
    : null;

  const header = hideSuiteName ? null : (
    <div className="text-xs font-medium text-foreground/80 mb-1">
      {suiteName}
    </div>
  );

  if (!useVirtual) {
    return (
      <div className="space-y-1">
        {header}
        <div className="space-y-1">
          {tests.map((t) => (
            <TestRow
              key={t.testId}
              test={t}
              onClick={() => onSelect(t.testId)}
              active={selectedTestId === t.testId}
            />
          ))}
        </div>
      </div>
    );
  }

  // Virtualized
  return (
    <div className="space-y-1">
      {header}
      <div ref={parentRef} className="relative max-h-80 overflow-auto">
        <div
          style={{
            height: rowVirtualizer!.getTotalSize(),
            position: "relative",
          }}
        >
          {rowVirtualizer!.getVirtualItems().map((vr) => {
            const t = tests[vr.index];
            return (
              <div
                key={t.testId}
                className="absolute left-0 right-0"
                style={{ transform: `translateY(${vr.start}px)` }}
              >
                <TestRow
                  test={t}
                  onClick={() => onSelect(t.testId)}
                  active={selectedTestId === t.testId}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TestRow({
  test,
  onClick,
  active,
}: {
  test: any;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left text-xs sm:text-sm px-2 py-1.5 rounded-md transition",
        active ? "bg-primary/10 text-foreground" : "hover:bg-muted"
      )}
      title={test.title}
    >
      <span className="inline-flex items-center gap-2">
        <StatusDot status={test.status} />
        <span className="truncate">{test.title}</span>
      </span>
    </button>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "passed"
      ? "bg-emerald-500"
      : status === "failed"
      ? "bg-red-500"
      : status === "flaky"
      ? "bg-amber-500"
      : status === "skipped"
      ? "bg-slate-400"
      : "bg-muted-foreground";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}
