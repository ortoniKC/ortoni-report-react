export interface ReportData {
  result: {
    summary: Summary;
    results: Result;
    meta: Meta;
    preferences: Preferences;
    analytics: Analytics;
  };
}

export interface Result {
  list: TestResultData[];
  grouped: Results;
  testHistories: TestHistory[];
  allTags: string[];
  set: Record<string, unknown>;
}

export interface Summary {
  successRate: string;
  lastRunDate: string;
  retry: number;
  pass: number;
  fail: number;
  skip: number;
  flaky: number;
  total: number;
  totalDuration: string;
  stats: Stats;
}

export interface Stats {
  projectNames: string[];
  totalTests: number[];
  passedTests: number[];
  failedTests: number[];
  skippedTests: number[];
  retryTests: number[];
  flakyTests: number[];
}

export interface Results {
  list: TestResultData[];
}

export type TestStatus =
  | "passed"
  | "failed"
  | "skipped"
  | "timedOut"
  | "interrupted";
export type FlakyStatus = "expected" | "unexpected" | "";
export type ReportType = "e2e" | "unit" | "integration";

export interface Steps {
  snippet: string | undefined;
  title: string;
  location: string;
}
export interface TestResultData {
  annotations: any;
  testTags: string[];
  location: string;
  retry: string;
  isRetry: number;
  projectName: any;
  suite: any;
  title: string;
  status:
    | "passed"
    | "failed"
    | "timedOut"
    | "skipped"
    | "interrupted"
    | "expected"
    | "unexpected"
    | "flaky";
  flaky: string;
  duration: string;
  errors: any[];
  steps: Steps[];
  logs: string;
  screenshotPath?: string | null | undefined;
  screenshots?: string[];
  filePath: string;
  filters: Set<string>;
  tracePath?: string;
  videoPath?: string;
  markdownPath?: string;
  base64Image: boolean | undefined;
}

export interface TestHistory {
  testId: string;
  history: TestHistoryItem[];
}

export interface TestHistoryItem {
  status: TestStatus;
  duration: string;
  error_message: string;
  run_date: string;
}

export interface Meta {
  projectName: string;
  authorName: string;
  meta: ProjectMeta;
  type: ReportType;
  title: string;
}

export interface ProjectMeta {
  project: string;
  version: string;
  description: string;
  environment: string;
  testCycle: string;
  release: string;
  platform: string;
}

export interface Preferences {
  logo: string;
  show: boolean;
}

export interface Analytics {
  reportData: AnalyticsReportData;
  chartTrendData: ChartTrendData;
}

export interface AnalyticsReportData {
  summary: AnalyticsSummary;
  trends: Trend[];
  flakyTests: unknown[];
  slowTests: SlowTest[];
}

export interface AnalyticsSummary {
  totalRuns: number;
  totalTests: number;
  passed: number;
  failed: number;
  passRate: number;
  avgDuration: number;
}

export interface Trend {
  run_date: string;
  passed: number;
  failed: number;
  avg_duration: number;
}

export interface SlowTest {
  test_id: string;
  avg_duration: number;
}

export interface ChartTrendData {
  labels: string[];
  passed: number[];
  failed: number[];
  avgDuration: number[];
}
