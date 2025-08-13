import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./components/ui/dashboard";
import DashboardLayout from "./components/mvpblocks/ui/layout";
import { OverallExecutionResult } from "./components/mvpblocks/charts/overallExecutionChart";

type AppProps = {
  reportData: unknown; // Replace 'unknown' with the actual type if known
};

export function App({ reportData }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            index
            path="dashboard"
            element={<Dashboard reportData={reportData} />}
          />
          <Route path="tests" element={<TestsPage reportData={reportData} />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export function AnalyticsPage() {
  return <OverallExecutionResult />;
}

export function TestsPage({ reportData }: { reportData: unknown }) {
  return <h1>reportData={JSON.stringify(reportData)}</h1>;
}
