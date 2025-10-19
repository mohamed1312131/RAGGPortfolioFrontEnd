"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarUserNav() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Sidebar user section intentionally left empty */}
        <div className="h-10" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
