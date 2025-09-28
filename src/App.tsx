import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./hooks/theme-provider";
import DashboardLayout from "./components/appui/common/layout";
import type { ReportResponse } from "./lib/types/OrtoniReportData";
import { TestsPage } from "./components/appui/testdetails/testPage";
import { Dashboard } from "./components/appui/home/dashboard";
import { AnalyticsPage } from "./components/appui/analytics/analytics";
import { GlancePage } from "./components/appui/glance/glance";

export function App({ reportData }: { reportData: ReportResponse }) {
  const data = reportData.data;
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ortoni-theme">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            index
            path="dashboard"
            element={
              <Dashboard
                summary={data.summary}
                userConfig={data.userConfig}
                userMeta={data.userMeta}
              />
            }
          />
          <Route
            path="tests"
            element={
              <TestsPage
                tests={data.testResult}
                preferences={data.preferences}
              />
            }
          />
          <Route
            path="glance"
            element={
              <GlancePage
                tests={data.testResult.tests}
                showProject={data.preferences}
              />
            }
          />
          <Route
            path="analytics"
            element={<AnalyticsPage analytics={data.analytics} />}
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
