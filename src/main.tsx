import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { HashRouter } from "react-router-dom";
import mockData from "./a.json";
let reportData: any = {};

const debug = false;

if (debug) {
  console.log("Debug mode is enabled");
  if (!Object.keys(reportData).length) {
    reportData = mockData;
  }
  createRoot(document.getElementById("root")!).render(
    <HashRouter>
      <App reportData={reportData} />
    </HashRouter>
  );
} else {
  const dataTag = document.getElementById("__ORTONI_REPORT_DATA__");
  const reportData = dataTag ? JSON.parse(dataTag.textContent || "{}") : {};
  createRoot(document.getElementById("root")!).render(
    <HashRouter>
      <App reportData={reportData} />
    </HashRouter>
  );
}
