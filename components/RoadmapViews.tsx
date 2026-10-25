"use client";
import { useState, type ReactNode } from "react";
import { ListOrdered, Route, Focus, ArrowDown, ArrowRight, Check } from "lucide-react";
import { learningStages } from "@/lib/learning-roadmap";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type View = "path" | "transit" | "focus";
const views = [
  { id:"path", label:"01 세로 경로", icon:ListOrdered, description:"위에서 아래로 공부 순서를 따라가세요. 선택한 단계의 실습이 옆에 표시됩니다." },
  { id:"transit", label:"02 노선도", icon:Route, description:"왼쪽에서 오른쪽으로 읽고, 다음 구간으로 내려가세요. 연결은 추천 학습 순서입니다." },
  { id:"focus", label:"03 단계 집중", icon:Focus, description:"지금 선택한 한 단계에 집중하세요. 이전·다음 버튼으로 순서대로 이동할 수 있습니다." },
] as const;

export default function RoadmapViews({ selected, checked, nextIndex, onSelect, children }: { selected:number; checked:Set<string>; nextIndex:number; onSelect:(index:number)=>void; children:ReactNode }) {
  const [view, setView] = useState<View>("path");
  const progress = (index:number) => learningStages[index].tasks.filter((_,i)=>checked.has(`${learningStages[index].id}-${i}`)).length;
  function stageButton(index:number, transit=false) {
    const stage=learningStages[index];
    const done=progress(index)===stage.tasks.length;
    return <button key={stage.id} className={`route-step ${selected===index ? "active" : ""} ${done ? "complete" : ""}`} aria-pressed={selected===index} aria-label={`${index+1}단계 ${stage.title} 선택`} onClick={()=>onSelect(index)}>
      <span className="route-number">{done ? <Check size={18}/> : String(index+1).padStart(2,"0")}</span>
      <span className="route-step-copy"><span className="route-meta">{stage.track} · {stage.duration}</span><strong>{stage.title}</strong><span className="route-step-note">{done ? "실습 완료" : index===nextIndex ? "다음 추천 단계" : `${progress(index)} / ${stage.tasks.length} 실습`}</span></span>
      {!transit && <ArrowRight size={16} className="route-select-arrow"/>}
    </button>;
  }
  return <section className={`roadmap-versions version-${view}`} aria-label="로드맵 보기 비교">
    <Tabs value={view} onValueChange={value=>setView(value as View)} className="roadmap-view-tabs">
      <div className="roadmap-view-heading"><div><span className="eyebrow">Choose your view</span><h2>나에게 편한 학습 지도.</h2></div><span className="view-share-note">모든 보기에서 실습 체크가 공유됩니다</span></div>
      <TabsList aria-label="로드맵 보기 방식" className="roadmap-view-switch">
        {views.map(item=><TabsTrigger key={item.id} value={item.id}><item.icon size={18}/>{item.label}</TabsTrigger>)}
      </TabsList>
      <p className="view-description" aria-live="polite">{views.find(item=>item.id===view)?.description}</p>
    <TabsContent value={view}>
    <div className="roadmap-version-body">
      {view==="path" && <nav className="route-path" aria-label="세로 학습 순서"><div className="route-start">START · 개발 기초</div><ol>{learningStages.map((stage,index)=><li key={stage.id}>{stageButton(index)}</li>)}</ol><div className="route-finish">FINISH · 직접 만들고 검증하기</div></nav>}
      {view==="transit" && <div className="transit-map" aria-label="순서대로 이어지는 학습 노선">
        {[{title:"기초와 제어",description:"환경을 만들고, 연결하고, 움직임을 이해합니다.",offset:0},{title:"통합과 제작",description:"가상 환경에서 확인하고, 작은 실물로 옮깁니다.",offset:4}].map((row,index)=><section className="transit-section" key={row.title}>
          <div className="transit-heading"><span>구간 0{index+1}</span><h3>{row.title}</h3><p>{row.description}</p></div>
          <ol className="transit-line">{learningStages.slice(row.offset,row.offset+4).map((stage,i)=><li key={stage.id}>{stageButton(row.offset+i,true)}{i<3&&<ArrowRight className="transit-arrow" size={18} aria-hidden="true"/>}</li>)}</ol>
          {index===0&&<div className="transit-transfer"><ArrowDown size={18}/>05단계부터 아래 구간으로 이어집니다</div>}
        </section>)}
      </div>}
      {view==="focus" && <div className="focus-navigation"><div className="focus-position"><span>현재 선택한 단계</span><strong>{String(selected+1).padStart(2,"0")} <small>/ 08</small></strong></div><nav className="focus-dots" aria-label="집중할 단계 선택">{learningStages.map((stage,i)=><button key={stage.id} aria-label={`${i+1}단계 ${stage.title} 선택`} aria-pressed={selected===i} className={selected===i?"active":""} onClick={()=>onSelect(i)}>{i+1}</button>)}</nav><div className="focus-buttons"><button disabled={selected===0} onClick={()=>onSelect(selected-1)}>← 이전 단계</button><button disabled={selected===learningStages.length-1} onClick={()=>onSelect(selected+1)}>다음 단계 →</button></div></div>}
      <div className="version-detail">{children}</div>
    </div>
    </TabsContent>
    </Tabs>
  </section>;
}
