import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { HashRouter } from "react-router-dom";
import mockData from "../mockdata/noproject.json";
import type { ReportResponse } from "./lib/types/OrtoniReportData";
let reportData: any = {};

const debug = import.meta.env.VITE_DEBUG === "true";

if (debug) {
  console.log("Debug mode is enabled");
  if (!Object.keys(reportData as ReportResponse).length) {
    reportData = mockData;
  }
  createRoot(document.getElementById("root")!).render(
    <HashRouter>
      <App reportData={reportData} />
    </HashRouter>
  );
} else {
  const dataTag = document.getElementById("__ORTONI_REPORT_DATA__");
  const reportData: ReportResponse = dataTag
    ? JSON.parse(dataTag.textContent || "{}")
    : {};
  if (reportData.data.userConfig.title) {
    document.title = `${reportData.data.userConfig.title} | Ortoni Report`;
  }

  createRoot(document.getElementById("root")!).render(
    <HashRouter>
      <App reportData={reportData} />
    </HashRouter>
  );
}
