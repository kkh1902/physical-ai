import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import "./workspace.css";
import "./vercel.css";
import SiteHeader from "@/components/SiteHeader";
import WorkspaceShell from "@/components/WorkspaceShell";
import Link from "next/link";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Physical AI — 움직이는 지능을 만드는 기록",
    template: "%s | Physical AI",
  },
  description:
    "휴머노이드 로봇을 이해하고 설계하고 직접 만드는 과정. 로보틱스 학습 노트, 3D 시스템 탐구와 제작 로드맵.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem('physical-ai-theme')==='dark'?'dark':'light'}catch{}`,
          }}
        />
        <a className="skip-link" href="#main">
          본문으로 건너뛰기
        </a>
        <WorkspaceShell>
          <SiteHeader />
          <main id="main" className="site-main">
            {children}
          </main>
          <footer className="site-footer">
            <Link href="/" className="brand">
              <span className="vercel-brand-mark" aria-hidden="true" />
              physical ai.
            </Link>
            <p>배우고, 만들고, 기록합니다.</p>
            <span className="mono">EST. 2026 · LEARNING IN PUBLIC</span>
          </footer>
        </WorkspaceShell>
      </body>
    </html>
  );
}
