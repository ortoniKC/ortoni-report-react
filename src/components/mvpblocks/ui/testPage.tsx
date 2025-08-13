import type { ReportData } from "@/lib/types/reportData";

export function TestsPage({ reportData }: { reportData: ReportData }) {
  return <h1>reportData={JSON.stringify(reportData)}</h1>;
}
