"use client";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { learningStages } from "@/lib/learning-roadmap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import RoadmapViews from "@/components/RoadmapViews";
const KEY = "physical-ai-learning-v1";
const validIds = new Set(
  learningStages.flatMap((stage) =>
    stage.tasks.map((_, index) => `${stage.id}-${index}`),
  ),
);
const subscribe = (listener: () => void) => {
  window.addEventListener("learningchange", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("learningchange", listener);
    window.removeEventListener("storage", listener);
  };
};
const snapshot = () => {
  try {
    return localStorage.getItem(KEY) || "[]";
  } catch {
    return "[]";
  }
};
const serverSnapshot = () => "[]";
function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter(
          (item): item is string =>
            typeof item === "string" && validIds.has(item),
        )
      : [];
  } catch {
    return [];
  }
}
export default function LearningRoadmap() {
  const [selected, setSelected] = useState(0);
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const checked = new Set(parse(raw));
  const [storageError, setStorageError] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const stage = learningStages[selected];
  const count = checked.size;
  const total = validIds.size;
  const completed = (id: string, tasks: string[]) =>
    tasks.every((_, index) => checked.has(`${id}-${index}`));
  const nextIndex = learningStages.findIndex(
    (stage) => !completed(stage.id, stage.tasks),
  );
  function select(index: number) {
    setSelected(index);
    if (window.innerWidth < 800)
      panel.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  }
  function toggle(id: string) {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]));
      setStorageError(false);
      window.dispatchEvent(new Event("learningchange"));
    } catch {
      setStorageError(true);
    }
  }
  return (
    <>
      <section className="learning-summary">
        <div>
          <span className="eyebrow orange">YOUR LEARNING PATH</span>
          <h2>
            {count === total
              ? "한 바퀴를 완주했습니다."
              : "다음 한 걸음이 보이는 공부."}
          </h2>
          <p>
            하루 1–2시간을 가정한 제안입니다. 주차보다 각 단계의 결과물을
            기준으로 나아가세요.
          </p>
        </div>
        <div className="learning-progress">
          <div>
            <strong>
              {count}
              <span> / {total}</span>
            </strong>
            <span>실습 체크</span>
          </div>
          <Progress
            aria-label="전체 학습 실습 완료율"
            value={(count / total) * 100}
          />
          <span>{Math.round((count / total) * 100)}% · 이 브라우저에 저장</span>
        </div>
      </section>
      <RoadmapViews selected={selected} checked={checked} nextIndex={nextIndex} onSelect={select}>
        <section
          ref={panel}
          className="learning-detail"
          aria-label="선택한 학습 단계"
        >
          <div className="learning-detail-top">
            <span className="eyebrow orange">
              STAGE {String(selected + 1).padStart(2, "0")} / {stage.english}
            </span>
            <Badge variant="secondary">권장 {stage.duration}</Badge>
          </div>
          <h2>{stage.title}</h2>
          <p className="learning-goal">{stage.goal}</p>
          <div className="prerequisite">
            <span>먼저 알아둘 것</span>
            <strong>{stage.prerequisite}</strong>
          </div>
          <div className="learning-concepts">
            {stage.concepts.map((concept) => (
              <Badge variant="outline" key={concept}>
                {concept}
              </Badge>
            ))}
          </div>
          <div className="learning-task-heading">
            <h3>직접 해볼 실습</h3>
            <span>
              {
                stage.tasks.filter((_, index) =>
                  checked.has(`${stage.id}-${index}`),
                ).length
              }{" "}
              / {stage.tasks.length}
            </span>
          </div>
          <div className="learning-tasks">
            {stage.tasks.map((task, index) => (
              <label key={`${stage.id}-${index}`}>
                <Checkbox
                  aria-label={task}
                  checked={checked.has(`${stage.id}-${index}`)}
                  onCheckedChange={() => toggle(`${stage.id}-${index}`)}
                />
                <span>{task}</span>
              </label>
            ))}
          </div>
          <div className="learning-output">
            <span className="eyebrow">TAKEAWAY / 남길 결과물</span>
            <strong>{stage.deliverable}</strong>
          </div>
          <div className="learning-checkpoint">
            <span className="orange">↳ 다음 단계로 넘어갈 기준</span>
            <p>{stage.checkpoint}</p>
          </div>
          {stage.note && <p className="learning-note">{stage.note}</p>}
          <div className="learning-detail-bottom">
            <Button asChild>
              <Link
                target={
                  stage.resource.url.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  stage.resource.url.startsWith("http")
                    ? "noreferrer"
                    : undefined
                }
                href={stage.resource.url}
              >
                {stage.resource.label} ↗
              </Link>
            </Button>
            <Button
              variant="ghost"
              disabled={selected === learningStages.length - 1}
              onClick={() => select(selected + 1)}
            >
              다음 단계 →
            </Button>
          </div>
          {storageError && (
            <p role="alert" className="orange">
              브라우저 저장소를 사용할 수 없어 체크를 저장하지 못했습니다.
            </p>
          )}
        </section>
      </RoadmapViews>
      <section className="learning-rhythm">
        <div>
          <span className="eyebrow orange">A WEEKLY RHYTHM</span>
          <h2>읽고 끝내지 않는 한 주.</h2>
        </div>
        <div>
          <span className="mono">01 / UNDERSTAND</span>
          <strong>개념 이해 · 30%</strong>
          <p>한 주제를 골라 문서와 예제로 이해합니다.</p>
        </div>
        <div>
          <span className="mono">02 / EXPERIMENT</span>
          <strong>직접 실험 · 50%</strong>
          <p>코드를 바꾸고 결과를 비교합니다.</p>
        </div>
        <div>
          <span className="mono">03 / EXPLAIN</span>
          <strong>기록과 발표 · 20%</strong>
          <p>배운 것·막힌 것·다음 질문을 정리합니다.</p>
        </div>
      </section>
    </>
  );
}

