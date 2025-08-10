import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <SidebarTrigger className="ml-1" />
        <Outlet /> {/* Page content here */}
      </SidebarInset>
    </SidebarProvider>
  );
}
