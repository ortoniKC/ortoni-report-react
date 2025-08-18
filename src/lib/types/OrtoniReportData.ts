export interface ReportResponse {
  data: OrtoniReportData;
}

export interface OrtoniReportData {
  summary: Summary;
  testResult: TestResult;
  userConfig: UserConfig;
  userMeta: UserMeta;
  preferences: Preferences;
  analytics: Analytics;
}

export interface Result {
  testHistories: TestHistory[];
  allTags: string[];
  set: Record<string, unknown>;
}
export interface TestResultItem {
  annotations: {
    type: string;
    location: { file: string; line: number; column: number };
  };
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
  testId: string;
}

export interface Summary {
  overAllResult: {
    pass: number;
    fail: number;
    skip: number;
    retry: number;
    flaky: number;
    total: number;
  };
  successRate: number;
  lastRunDate: string;
  totalDuration: number;
  stats: Stats;
}

export interface TestResult {
  tests: TestResultItem[];
  testHistories: TestHistory[];
  allTags: string[];
  set: string | string[];
}

export interface UserConfig {
  projectName: string;
  authorName: string;
  type: string;
  title: string;
}

export interface UserMeta {
  meta: Record<string, any>;
}

export interface Preferences {
  theme: string;
  logo?: string;
  showProject: boolean;
}

interface Analytics {
  reportData: AnalyticsReportData;
  chartTrendData: ChartTrendData;
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

export type TestStatus =
  | "passed"
  | "failed"
  | "skipped"
  | "timedOut"
  | "interrupted";

export interface Steps {
  snippet: string | undefined;
  title: string;
  location: string;
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

export interface AnalyticsReportData {
  summary: AnalyticsSummary;
  trends: Trend[];
  flakyTests: SlowTest[];
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
