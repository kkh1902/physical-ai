import { PageHeading } from "@/components/ui";
import LearningRoadmap from "@/components/LearningRoadmap";
export const metadata = { title: "학습 로드맵" };
export default function Roadmap() {
  return (
    <>
      <PageHeading
        label="FROM ZERO TO HUMANOID"
        title="어디서 시작할지, 무엇을 만들지"
        description="개발 기초부터 가상 로봇 제어, 작은 모듈 제작까지. 단계별 실습과 결과물로 연결한 휴머노이드 학습 경로입니다."
      />
      <LearningRoadmap />
      <aside className="info-callout">
        <strong>이 로드맵의 출처와 범위</strong>
        <br />이 사이트를 위해 제안한 독학 경로입니다. 두산로보틱스 ROKEY의 공식
        커리큘럼이나 수료 기준이 아니며, 개인 secondbrain 자료는 아직 연동되지
        않았습니다. 기간은 학습량과 배경지식에 따라 달라집니다. 개념과 도구의
        참고 자료:{" "}
        <a
          href="https://docs.ros.org/en/jazzy/Tutorials.html"
          target="_blank"
          rel="noreferrer"
        >
          ROS 2 공식 튜토리얼 ↗
        </a>
        ,{" "}
        <a
          href="https://modernrobotics.northwestern.edu/"
          target="_blank"
          rel="noreferrer"
        >
          Modern Robotics ↗
        </a>
        ,{" "}
        <a
          href="https://mujoco.readthedocs.io/en/stable/overview.html"
          target="_blank"
          rel="noreferrer"
        >
          MuJoCo 공식 문서 ↗
        </a>
        . 체크 상태는 이 기기의 브라우저에만 저장되며 학습 성취를 자동 평가하지
        않습니다.
      </aside>
    </>
  );
}
