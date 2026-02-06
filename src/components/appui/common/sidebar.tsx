"use client";

import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useReport } from "@/hooks/use-report-context";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart3,
  TestTube2,
  TableOfContents,
  Image,
} from "lucide-react";
import { ModeToggle } from "@/hooks/toggle-theme";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "dashboard" },
  { title: "Tests", icon: TestTube2, href: "tests" },
  { title: "Glance", icon: TableOfContents, href: "glance" },
  { title: "Analytics", icon: BarChart3, href: "analytics", key: "analytics" },
  { title: "Screenshots", icon: Image, href: "screenshots" },
];

export const DashboardSidebar = memo(() => {
  const version = "4.0.6";
  const location = useLocation();
  const { reportData } = useReport();

  // Check if there's history data by looking at the note field
  const hasHistoryNote = reportData?.data?.analytics?.reportData?.note;
  const hasHistory = !hasHistoryNote?.includes("unavailable");
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src="https://raw.githubusercontent.com/ortoniKC/ortoni-report/refs/heads/main/ortoni.png"
                    alt="ortoni-report"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ortoni Report</span>
                  <span className="truncate text-xs">{version}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === "/" + item.href;
                const Icon = item.icon;
                const isDisabled = item.key === "analytics" && !hasHistory;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      disabled={isDisabled}
                      className={
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }
                      title={isDisabled ? "No history data available" : ""}
                    >
                      <Link
                        to={item.href}
                        onClick={(e) => {
                          if (isDisabled) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

DashboardSidebar.displayName = "dashboardSidebar";
