import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TestResultData } from "@/lib/types/OrtoniReportData";

export function TestDetails({ test }: { test?: TestResultData | null }) {
  if (!test) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="py-6 text-sm text-muted-foreground text-center">
          Select a test from the list to see details.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Sticky Header on mobile */}
      <CardHeader className="space-y-2 sm:space-y-3 bg-background sticky top-0 z-10 pb-3 sm:pb-4">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
          <StatusPill status={test.status} />
          <span className="truncate max-w-full">{test.title}</span>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          {test.projectName && (
            <Badge variant="secondary">{String(test.projectName)}</Badge>
          )}
          {test.suite && <Badge variant="outline">{String(test.suite)}</Badge>}
          {test.filePath && (
            <span className="truncate max-w-full">{test.filePath}</span>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="py-4 space-y-5 text-sm flex-1 overflow-y-auto">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <Info label="Status" value={test.status} />
          <Info label="Duration" value={String(test.duration ?? "")} />
          <Info label="Retry" value={String(test.retry ?? "")} />
          <Info label="Flaky" value={String(test.flaky ?? "")} />
        </div>

        {/* Errors */}
        {Array.isArray(test.errors) && test.errors.length > 0 && (
          <section>
            <h4 className="font-medium mb-2 text-sm sm:text-base">
              Errors ({test.errors.length})
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm max-h-40 overflow-y-auto">
              {test.errors.map((e, i) => (
                <li key={i}>
                  <code className="rounded bg-muted px-1.5 py-0.5 break-all">
                    {String(e?.message || e)}
                  </code>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Actions */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {test.tracePath && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={toFileUrl(test.tracePath)}
                target="_blank"
                rel="noreferrer"
              >
                Open Trace
              </a>
            </Button>
          )}
          {test.videoPath && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={toFileUrl(test.videoPath)}
                target="_blank"
                rel="noreferrer"
              >
                Open Video
              </a>
            </Button>
          )}
          {test.screenshotPath && (
            <Button variant="secondary" size="sm" asChild>
              <a
                href={toFileUrl(test.screenshotPath)}
                target="_blank"
                rel="noreferrer"
              >
                Open Screenshot
              </a>
            </Button>
          )}
          {Array.isArray(test.screenshots) &&
            test.screenshots.map((p, i) => (
              <Button key={i} variant="outline" size="sm" asChild>
                <a href={toFileUrl(p)} target="_blank" rel="noreferrer">
                  Screenshot {i + 1}
                </a>
              </Button>
            ))}
        </section>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
      <div className="font-medium break-words">{value || "-"}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    passed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    failed: "bg-red-500/15 text-red-700 border-red-500/20",
    flaky: "bg-amber-500/15 text-amber-700 border-amber-500/20",
    skipped: "bg-slate-500/15 text-slate-700 border-slate-500/20",
  };
  const cls =
    map[status] || "bg-muted text-foreground/80 border-muted-foreground/20";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}
    >
      {status}
    </span>
  );
}

function toFileUrl(p: string) {
  return p.startsWith("http") ? p : p;
}
