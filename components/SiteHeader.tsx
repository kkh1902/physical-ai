"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ArrowUpRight, CodeXml, Moon, Sun } from "lucide-react";
import { navigation } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const subscribe = (callback: () => void) => {
  window.addEventListener("themechange", callback);
  return () => window.removeEventListener("themechange", callback);
};

export default function SiteHeader() {
  const pathname = usePathname();
  const { open, openMobile, isMobile } = useSidebar();
  const currentPage = navigation.find(item => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
  const showHeaderBrand = isMobile ? !openMobile : !open;
  const theme = useSyncExternalStore(subscribe,
    () => document.documentElement.dataset.theme || "light", () => "light");
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("physical-ai-theme", next); } catch {}
    window.dispatchEvent(new Event("themechange"));
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="vercel-header-location">
          <SidebarTrigger aria-label={isMobile ? "메뉴 열기" : open ? "사이드바 접기" : "사이드바 펼치기"}
            aria-expanded={isMobile ? openMobile : open} />
          {showHeaderBrand ? (
            <Link href="/" className="brand" aria-label="Physical AI 홈">
              <span className="vercel-brand-mark" aria-hidden="true" />physical ai.
            </Link>
          ) : (
            <span className="vercel-current-page">{currentPage?.label || "학습 노트"}</span>
          )}
        </div>
        <div className="header-tools">
          <span className="vercel-header-caption">개인 로보틱스 학습 프로젝트</span>
          <Button variant="ghost" size="icon" onClick={toggleTheme}
            aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button variant="outline" asChild className="github-link">
            <a href="https://github.com/kkh1902/physical-ai" target="_blank" rel="noreferrer">
              <CodeXml /> GitHub <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
      <nav className="vercel-navigation" aria-label="주 메뉴"><div>
        {navigation.map(item => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>;
        })}
      </div></nav>
    </header>
  );
}
