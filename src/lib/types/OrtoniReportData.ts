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
export interface Annotations {
  type: string;
  location?: { file: string; line: number; column: number };
  description?: string;
}
export interface TestResultItem {
  key: string;
  annotations: Annotations[];
  description?: string;
  testTags: string[];
  location: string;
  retryAttemptCount: number;
  projectName: string;
  suite: string;
  suiteHierarchy: string;
  title: string;
  status: TestStatus;
  flaky: string;
  duration: number;
  errors: string[];
  steps: Steps[];
  logs: string;
  screenshotPath?: string | null | undefined;
  screenshots?: string[];
  filePath: string;
  filters: Set<string>;
  tracePath?: string;
  videoPath?: string[];
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
  meta: Record<string, unknown>;
}

export interface Preferences {
  theme?: "light" | "dark";
  logo?: string;
  showProject: boolean;
}

export interface Analytics {
  reportData: AnalyticsReportData;
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
  | "timedOut"
  | "skipped"
  | "interrupted"
  | "expected"
  | "unexpected"
  | "flaky";

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
  duration: number;
  error_message: string;
  run_date: string;
}

export interface AnalyticsReportData {
  summary: AnalyticsSummary;
  trends: Trend[];
  flakyTests: SlowTest[];
  slowTests: SlowTest[];
  note?: string;
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
