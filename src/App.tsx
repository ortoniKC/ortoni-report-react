import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./hooks/theme-provider";
import { ReportProvider } from "./hooks/use-report-context";
import DashboardLayout from "./components/appui/common/layout";
import type { ReportResponse } from "./lib/types/OrtoniReportData";
import { TestsPage } from "./components/appui/testdetails/testPage";
import { Dashboard } from "./components/appui/home/dashboard";
import { AnalyticsPage } from "./components/appui/analytics/analytics";
import { GlancePage } from "./components/appui/glance/glance";
import Screenshots from "./components/appui/screenshots/screenshots";

export function App({ reportData }: { reportData: ReportResponse }) {
  return (
    <ReportProvider reportData={reportData}>
      <ThemeProvider defaultTheme="dark" storageKey="ortoni-theme">
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route
              index
              path="dashboard"
              element={
                <Dashboard
                  summary={reportData.data.summary}
                  userConfig={reportData.data.userConfig}
                  userMeta={reportData.data.userMeta}
                />
              }
            />
            <Route
              path="tests"
              element={
                <TestsPage
                  tests={reportData.data.testResult}
                />
              }
            />
            <Route
              path="glance"
              element={
                <GlancePage
                  tests={reportData.data.testResult.tests}
                  showProject={reportData.data.preferences}
                />
              }
            />
            <Route
              path="analytics"
              element={<AnalyticsPage analytics={reportData.data.analytics} />}
            />
            <Route
              path="screenshots"
              element={<Screenshots tests={reportData.data.testResult.tests} />}
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </ReportProvider>
  );
}
