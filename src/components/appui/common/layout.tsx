import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./sidebar";
import { CommandPalette } from "./CommandPalette";
import { GlobalShortcuts } from "./GlobalShortcuts";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <GlobalShortcuts />
      <CommandPalette />
      <DashboardSidebar />
      <SidebarInset>
        <SidebarTrigger className="ml-1" />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
