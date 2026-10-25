"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Route, Bot, NotebookPen, Presentation, Ruler, Wrench, FolderGit2, ArrowUpRight, PanelLeftClose } from "lucide-react";
import { navigation } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar } from "@/components/ui/sidebar";

const icons = [House, Route, Bot, NotebookPen, Presentation, Ruler, Wrench, FolderGit2];
const groups = [
  { label: "학습 공간", start: 0, end: 4 },
  { label: "프로젝트 기록", start: 4, end: 7 },
  { label: "리소스", start: 7, end: navigation.length },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  return <Sidebar collapsible="offcanvas" className="vercel-sidebar">
    <SidebarHeader className="vercel-sidebar-header">
      <Link href="/" className="vercel-sidebar-brand" aria-label="Physical AI 홈" onClick={() => setOpenMobile(false)}>
        <span className="vercel-brand-mark" aria-hidden="true" /><span>physical ai.<small>PERSONAL ROBOTICS LAB</small></span>
      </Link>
      {isMobile && <Button variant="ghost" size="icon" aria-label="메뉴 닫기" onClick={() => setOpenMobile(false)}><PanelLeftClose /></Button>}
    </SidebarHeader>
    <SidebarContent className="vercel-sidebar-content">
      <div className="vercel-sidebar-project"><span className="vercel-project-avatar"><Bot size={18} /></span><div><strong>Humanoid Project</strong><span>나의 첫 휴머노이드</span></div><span className="vercel-sidebar-status" /></div>
      <nav aria-label="사이드바 메뉴">{groups.map(group => <SidebarGroup key={group.label}>
        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
        <SidebarGroupContent><SidebarMenu>{navigation.slice(group.start, group.end).map((item,index) => {
          const Icon = icons[group.start + index];
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return <SidebarMenuItem key={item.href}><SidebarMenuButton asChild isActive={active}>
            <Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpenMobile(false)}><Icon /><span>{item.label}</span>{active && <span className="vercel-sidebar-current" />}</Link>
          </SidebarMenuButton></SidebarMenuItem>;
        })}</SidebarMenu></SidebarGroupContent>
      </SidebarGroup>)}</nav>
      <div className="vercel-sidebar-note"><span>LEARN. DESIGN. BUILD.</span><p>작은 배움이<br />첫 움직임이 될 때까지.</p><Link href="/roadmap" onClick={() => setOpenMobile(false)}>학습 경로 살펴보기 <ArrowUpRight size={14} /></Link></div>
    </SidebarContent>
    <SidebarFooter className="vercel-sidebar-footer"><span className="vercel-profile">GK</span><div><strong>Gihun&apos;s Robotics Lab</strong><span>배우고, 만들고, 기록해요.</span></div></SidebarFooter>
  </Sidebar>;
}
