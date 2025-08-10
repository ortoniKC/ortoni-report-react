import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./components/ui/dashboard";
import DashboardLayout from "./components/mvpblocks/ui/layout";
import { ChartPieInteractive } from "./components/mvpblocks/ui/piechart";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="tests" element={<TestsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export function AnalyticsPage() {
  return <ChartPieInteractive />;
}

export function TestsPage() {
  return <h1>Tests</h1>;
}
