import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./components/ui/dashboard";
import DashboardLayout from "./components/mvpblocks/ui/layout";
import type { ReportData } from "./lib/types/reportData";
// import { TestsPage } from "./components/mvpblocks/ui/testPage";
import { AnalyticsPage } from "./components/mvpblocks/ui/analytics";

export function App({ reportData }: { reportData: ReportData }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ortoni-theme">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            index
            path="dashboard"
            element={<Dashboard reportData={reportData} />}
          />
          {/* <Route path="tests" element={<TestsPage reportData={reportData} />} /> */}
          <Route path="analytics" element={<AnalyticsPage {...reportData} />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
