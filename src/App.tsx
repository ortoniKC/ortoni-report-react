import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./hooks/theme-provider";
import DashboardLayout from "./components/appui/layout";
import type { ReportResponse } from "./lib/types/OrtoniReportData";
import { TestsPage } from "./components/appui/testPage";
import { Dashboard } from "./components/appui/dashboard";
import { GlancePage } from "./components/appui/glance";

export function App({ reportData }: { reportData: ReportResponse }) {
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
                preferences={reportData.data.preferences}
              />
            }
          />
        </Route>
        <Route
          path="glance"
          element={
            <GlancePage
              tests={reportData.data.testResult}
              preferences={reportData.data.preferences}
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
