import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { HashRouter } from "react-router-dom";

const dataTag = document.getElementById("__REPORT_DATA__");
export const reportData = dataTag
  ? JSON.parse(dataTag.textContent || "{}")
  : {};

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App reportData={reportData} />
  </HashRouter>
);
