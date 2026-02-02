import { createContext, useContext, type ReactNode } from "react";
import type { ReportResponse } from "@/lib/types/OrtoniReportData";

interface ReportContextType {
  reportData: ReportResponse | null;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({
  children,
  reportData,
}: {
  children: ReactNode;
  reportData: ReportResponse;
}) {
  return (
    <ReportContext.Provider value={{ reportData }}>
      {children}
    </ReportContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReport() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
}
