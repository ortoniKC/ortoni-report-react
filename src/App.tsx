import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./hooks/theme-provider";
import { AnalyticsPage } from "./components/appui/analytics";
import DashboardLayout from "./components/appui/layout";
import type { ReportData } from "./lib/types/reportData";
import { TestsPage } from "./components/appui/testPage";
import { Dashboard } from "./components/appui/dashboard";
import { Glance } from "./components/appui/glance";

export function App({ reportData }: { reportData: ReportData }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ortoni-theme">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            index
            path="dashboard"
            element={<Dashboard {...reportData} />}
          />
          <Route path="tests" element={<TestsPage {...reportData} />} />
          <Route path="analytics" element={<AnalyticsPage {...reportData} />} />
          <Route path="glance" element={<Glance {...reportData} />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
