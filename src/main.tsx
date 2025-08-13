import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { HashRouter } from "react-router-dom";
import mockData from "./a.json";
let reportData: any = {};

const dataTag = document.getElementById("__REPORT_DATA__");
if (dataTag) {
  const raw = (dataTag.textContent || "").trim();
  if (raw && raw !== "__ORTONI_TEST_REPORTDATA__") {
    try {
      reportData = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse report data:", err);
    }
  }
  if (!Object.keys(reportData).length) {
    reportData = mockData;
  }
}

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App reportData={reportData} />
  </HashRouter>
);
