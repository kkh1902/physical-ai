import Link from "next/link";
import { Box, NotebookPen, Route, ArrowRight } from "lucide-react";
import DeferredRobotViewer from "@/components/DeferredRobotViewer";
import { getEntries } from "@/lib/content";
import { roadmap } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const features = [
  { href: "/roadmap", icon: Route, title: "학습 로드맵", description: "기초부터 실제 제작까지, 단계별 실습과 결과물로 연결하는 학습 경로예요." },
  { href: "/study", icon: Box, title: "3D 시스템 탐구", description: "센서, 제어기, 구동기를 연결해 하나의 로봇을 이해하는 시간이에요." },
  { href: "/notes", icon: NotebookPen, title: "학습 노트", description: "배운 개념과 발견을 내 언어로 정리하고, 다시 꺼내 읽는 공간이에요." },
];
export default function Home() {
  const notes = getEntries("notes");
  return <>
    <section className="vercel-hero">
      <div className="vercel-hero-copy">
        <span className="eyebrow">PERSONAL ROBOTICS / LEARN. DESIGN. BUILD.</span>
        <h1>배움에서 설계로.<br />코드에서 움직임으로.</h1>
        <p>로봇을 이해하고, 직접 만드는 여정.<br />나의 첫 휴머노이드를 향한 학습과 실험의 기록.</p>
        <div className="vercel-actions">
          <Link href="/roadmap" className="vercel-button">학습 경로 탐색 <ArrowRight size={16} /></Link>
          <Link href="/study" className="vercel-button secondary">3D 탐구 <ArrowRight size={16} /></Link>
        </div>
      </div>
      <div className="vercel-model">
        <span className="vercel-model-label mono">UNITREE G1 / SYSTEM EXPLORER</span>
        <DeferredRobotViewer compact />
        <Link href="/study" className="vercel-model-footer">실제 3D 모델로 구조 살펴보기 <ArrowRight size={14} /></Link>
      </div>
    </section>
    <section className="vercel-section">
      <div className="vercel-section-heading"><h2>Build your understanding.</h2><span className="mono muted">학습 · 탐구 · 기록</span></div>
      <div className="vercel-feature-grid">{features.map(({ href, icon: Icon, title, description }) =>
        <Link key={href} href={href} className="vercel-feature">
          <span className="vercel-feature-icon"><Icon size={20} /></span>
          <h3>{title}</h3><p>{description}</p>
          <span className="vercel-feature-link">살펴보기 <ArrowRight size={15} /></span>
        </Link>)}
      </div>
      <div className="vercel-mission"><span className="eyebrow">THE MISSION</span><p>작은 단계를 쌓아, 내 손으로 만드는 첫 휴머노이드.</p></div>
    </section>
    <section className="vercel-section">
      <div className="vercel-section-heading"><div><span className="eyebrow">THE ROADMAP</span><h2>작은 단계가, 큰 움직임으로.</h2></div><Link href="/roadmap" className="text-link">전체 학습 경로 <ArrowRight size={15} /></Link></div>
      <div className="vercel-roadmap">{roadmap.map((step, index) =>
        <Link href={step.href} key={step.title} className="vercel-roadmap-row"><span className="mono muted">{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div><span className="vercel-roadmap-date mono">{step.date}</span><ArrowRight size={16} /></Link>)}
      </div>
    </section>
    <section className="vercel-section">
      <div className="vercel-section-heading"><div><span className="eyebrow">KNOWLEDGE BASE</span><h2>배운 것을, 내 언어로.</h2></div><Link href="/notes" className="text-link">전체 노트 <ArrowRight size={15} /></Link></div>
      <div className="notes-grid">{notes.slice(0, 3).map(note =>
        <Link href={`/notes/${note.slug}`} key={note.slug} className="vercel-note"><div className="note-card-top"><Badge variant="secondary">{note.tags[0] || "로보틱스"}</Badge><span className="mono muted">{note.kind === "guide" ? "GUIDE" : "NOTE"}</span></div><h3>{note.title}</h3><p>{note.description}</p><div className="note-card-bottom"><span>{note.kind === "guide" ? "사이트 학습 가이드" : note.date}</span><ArrowRight size={15} /></div></Link>)}
      </div>
    </section>
    <section className="vercel-closing"><span className="eyebrow">LEARNING IN PUBLIC</span><h2>만들어가는 과정을 기록해요.</h2><p>완성된 결과뿐 아니라, 배움과 실험의 작은 발견까지.</p><Link href="/weekly" className="vercel-button secondary">주간 기록 살펴보기 <ArrowRight size={15} /></Link></section>
  </>;
}
