"use client";
import type { CSSProperties, ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
export default function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider className="vercel-workspace" defaultOpen
        style={{ "--sidebar-width": "15.5rem" } as CSSProperties}>
        <AppSidebar />
        <div className="workspace-content">{children}</div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
