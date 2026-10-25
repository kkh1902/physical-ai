import MarkdownContent from "./MarkdownContent";
import { getEntries, type Section } from "@/lib/content";
import { PageHeading } from "./ui";
import Link from "next/link";
const config = {
  weekly: {
    label: "WEEKLY SESSIONS",
    title: "함께 설명하며, 더 깊이",
    description:
      "한 주 동안 배운 내용을 나누고, 질문을 통해 이해의 빈틈을 채웁니다.",
    status: "첫 발표 기록을 기다리고 있습니다.",
    text: "주말 모임의 주제, 핵심 내용과 다음 질문을 이곳에 모읍니다.",
    steps: [
      "이번 주 학습 주제",
      "발표의 핵심 내용",
      "함께 나눈 질문",
      "다음 주 탐구할 것",
    ],
  },
  design: {
    label: "DESIGN WORKSPACE",
    title: "움직이기 전에, 설계부터",
    description:
      "관절 구성, 부품 선정과 예산. 만들고 싶은 로봇을 구체적인 설계로 옮깁니다.",
    status: "2026년 12월 설계 단계 예정",
    text: "아래는 설계 시 확인할 항목입니다. 부품과 비용은 선정 후 실제 값으로 기록합니다.",
    steps: [
      "자유도와 관절 구성 정의",
      "모터·감속기와 센서 선정",
      "부품목록(BOM)과 예산 산정",
      "전원·통신 구성과 도면 검토",
    ],
  },
  build: {
    label: "BUILD JOURNAL",
    title: "설계가 실물이 되는 시간",
    description:
      "부품 하나, 배선 한 가닥부터. 조립과 실험의 시행착오를 빠짐없이 기록합니다.",
    status: "2027년 제작 단계 예정",
    text: "제작이 시작되면 발주, 조립 사진, 동작 검증과 개선 과정을 날짜별로 남깁니다.",
    steps: [
      "부품 발주와 입고 확인",
      "프레임 조립과 배선",
      "관절별 단위 동작 검증",
      "통합 제어와 개선 기록",
    ],
  },
};
export default function RecordPage({
  section,
}: {
  section: Exclude<Section, "notes">;
}) {
  const info = config[section];
  const entries = getEntries(section);
  return (
    <>
      <PageHeading
        label={info.label}
        title={info.title}
        description={info.description}
      />
      {entries.length ? (
        <div className="record-list">
          {entries.map((entry) => (
            <article className="record-entry" id={entry.slug} key={entry.slug}>
              <span className="eyebrow">{entry.date}</span>
              <h2>{entry.title}</h2>
              <div className="prose">
                <MarkdownContent>{entry.body}</MarkdownContent>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="record-placeholder">
          <div className="empty-state">
            <span className="empty-symbol">
              {section === "weekly" ? "◎" : section === "design" ? "⌘" : "⚒"}
            </span>
            <span className="eyebrow orange">
              {section === "weekly"
                ? "AWAITING FIRST SESSION"
                : "ON THE ROADMAP"}
            </span>
            <h2>{info.status}</h2>
            <p>{info.text}</p>
            <Link href="/study" className="button">
              먼저 로봇 탐구하기 ↗
            </Link>
          </div>
          <div className="record-checklist">
            <span className="eyebrow">WHAT WE WILL DOCUMENT</span>
            {info.steps.map((step, index) => (
              <div key={step}>
                <span className="mono orange">0{index + 1}</span>
                <span>{step}</span>
                <span className="muted">예정</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <aside className="info-callout">
        아직 수행하지 않은 발표·설계·제작의 결과는 표시하지 않습니다. 공개
        기록이 생기면 이 페이지에 추가됩니다.
      </aside>
    </>
  );
}
