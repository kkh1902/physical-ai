import DeferredRobotViewer from "@/components/DeferredRobotViewer";
import { PageHeading, SectionHeading } from "@/components/ui";
import Link from "next/link";
export const metadata = { title: "로봇 탐구" };
const glossary = [
  {
    term: "자유도",
    english: "Degrees of Freedom",
    text: "독립적으로 움직일 수 있는 축의 수. 자유도가 늘면 자세의 선택지도 늘지만 제어가 복잡해집니다.",
  },
  {
    term: "토크",
    english: "Torque",
    text: "축을 회전시키는 힘의 효과. 필요한 관절 토크는 하중과 지렛팔 길이 등에 따라 달라집니다.",
  },
  {
    term: "엔코더",
    english: "Encoder",
    text: "모터나 관절의 위치·회전을 측정하는 센서. 명령대로 움직였는지 확인하는 피드백에 쓰입니다.",
  },
  {
    term: "역기구학",
    english: "Inverse Kinematics",
    text: "손이나 발을 목표 위치에 놓기 위해 각 관절이 어떤 각도가 되어야 하는지 구하는 문제입니다.",
  },
  {
    term: "피드백 제어",
    english: "Feedback Control",
    text: "목표와 측정값의 차이를 계속 확인하면서 입력을 보정하는 방식입니다.",
  },
  {
    term: "ROS 2",
    english: "Robot Operating System 2",
    text: "로봇 소프트웨어의 여러 기능이 메시지를 주고받으며 함께 동작하도록 돕는 도구와 라이브러리입니다.",
  },
];
export default function Study() {
  return (
    <>
      <PageHeading
        label="INTERACTIVE LAB"
        title="하나의 로봇, 연결된 시스템"
        description="부품을 선택하고 모델을 분해하며, 로봇의 감각과 판단과 움직임을 연결해보세요."
      />
      <div className="study-lab">
        <div className="lab-topline">
          <span className="mono">
            <span className="live-dot" /> HUMANOID / SYSTEM EXPLORER
          </span>
          <span className="tag">UNITREE G1 · GLB</span>
        </div>
        <DeferredRobotViewer />
        <p className="lab-disclaimer">
          Unitree G1 공개 시각화 메시를 사용합니다. 분해 간격과 시스템 구분은
          학습용 표현이며 제작·정비 도면이 아닙니다.{" "}
          <a href="/models/unitree-g1.LICENSE" target="_blank" rel="noreferrer">모델 라이선스 ↗</a>
        </p>
      </div>
      <section className="section">
        <SectionHeading
          number="01"
          label="SIGNAL FLOW"
          title="감각에서 움직임까지."
          description="로봇은 명령을 한 번 실행하는 데서 끝나지 않습니다. 결과를 다시 읽고, 다음 움직임을 조정합니다."
        />
        <div className="signal-flow">
          {[
            { n: "01", title: "감지", sub: "SENSE", text: "카메라·IMU·엔코더" },
            {
              n: "02",
              title: "추정 & 계획",
              sub: "PLAN",
              text: "환경·상태 추정과 목표 설정",
            },
            {
              n: "03",
              title: "제어",
              sub: "CONTROL",
              text: "목표와 측정값의 차이 계산",
            },
            {
              n: "04",
              title: "구동",
              sub: "ACT",
              text: "모터·관절의 실제 움직임",
            },
          ].map((item) => (
            <div className="signal-step" key={item.n}>
              <span className="mono orange">
                {item.n} / {item.sub}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="signal-arrow">→</span>
            </div>
          ))}
        </div>
        <div className="feedback-line">
          ↖ 측정된 위치·속도·자세를 다시 전달하는 피드백 루프 ↙
        </div>
      </section>
      <section className="section">
        <SectionHeading
          number="02"
          label="ROBOTICS VOCABULARY"
          title="처음 만나는 로봇의 언어."
        />
        <div className="glossary-grid">
          {glossary.map((item) => (
            <div className="glossary-card" key={item.term}>
              <span className="mono muted">{item.english}</span>
              <h3>{item.term}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <Link href="/notes" className="button section-button">
          학습 노트에서 더 읽기 ↗
        </Link>
      </section>
    </>
  );
}
