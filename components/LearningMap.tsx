"use client";
import "@xyflow/react/dist/style.css";

import { ReactFlow, Controls, Handle, Position, type Node, type NodeProps, type Edge } from "@xyflow/react";
import { learningStages } from "@/lib/learning-roadmap";

type StageNode = Node<{ index: number; done: number; active: boolean; recommended: boolean; select: (index: number) => void }, "stage">;

function StageCard({ data }: NodeProps<StageNode>) {
  const stage = learningStages[data.index];
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <button className={`map-stage nodrag ${data.active ? "is-selected" : ""}`} aria-pressed={data.active} onClick={() => data.select(data.index)}>
        <span className="map-stage-meta"><span>{String(data.index + 1).padStart(2, "0")} / {stage.track}</span><span>{stage.duration}</span></span>
        <strong>{stage.title}</strong>
        <span className="map-stage-status">{data.done === stage.tasks.length ? "✓ 실습 완료" : data.recommended ? "다음 추천 단계" : "학습 단계"}<span>{data.done} / {stage.tasks.length}</span></span>
        <span className="map-stage-progress"><i style={{ width: `${data.done / stage.tasks.length * 100}%` }} /></span>
      </button>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
const nodeTypes = { stage: StageCard };
// A suggested sequence, not a claim that every adjacent topic is a prerequisite.
const edges: Edge[] = learningStages.slice(1).map((stage, index) => ({
  id: `${learningStages[index].id}-${stage.id}`, source: learningStages[index].id, target: stage.id, type: "smoothstep", selectable: false,
}));

export default function LearningMap({ selected, checked, nextIndex, onSelect }: { selected: number; checked: Set<string>; nextIndex: number; onSelect: (index: number) => void }) {
  const nodes: StageNode[] = learningStages.map((stage, index) => ({
    id: stage.id, type: "stage", position: { x: (index % 2) * 380, y: Math.floor(index / 2) * 235 + (index % 2) * 45 },
    data: { index, active: selected === index, recommended: nextIndex === index, done: stage.tasks.filter((_, i) => checked.has(`${stage.id}-${i}`)).length, select: onSelect },
  }));
  return <section className="learning-map" aria-label="인터랙티브 학습 지도">
    <div className="map-heading"><div><span className="eyebrow">Learning journey</span><h3>기초에서 첫 로봇까지.</h3></div><p>카드를 선택한 뒤 아래 실습을 확인하세요.<br />연결선은 추천 학습 순서입니다.</p></div>
    <div className="map-canvas">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodeClick={(_, node) => onSelect(node.data.index)} fitView fitViewOptions={{ padding: 0.08, maxZoom: 1.1 }} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false} zoomOnScroll={false} minZoom={0.35} maxZoom={1.8} aria-label="8단계 로보틱스 학습 지도">
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
    <p className="map-help">드래그로 이동 · + / − 확대·축소 · □ 전체 보기</p>
  </section>;
}

