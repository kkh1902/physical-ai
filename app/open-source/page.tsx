import { PageHeading } from "@/components/ui";
import OpenSourceBrowser from "@/components/OpenSourceBrowser";

export const metadata = {
  title: "로봇 오픈소스",
  description: "ROS 2, MuJoCo, LeRobot부터 공개 로봇 팔까지. 로보틱스 학습과 제작에 연결하는 오픈소스 프로젝트 모음.",
};

export default function OpenSource() {
  return <>
    <PageHeading label="OPEN SOURCE / ROBOTICS" title="함께 만든 기술로, 다음 움직임을" description="시뮬레이션부터 로봇 학습과 하드웨어까지. 공개된 코드와 설계를 읽으며 나의 프로젝트에 필요한 연결을 찾아봐요." />
    <div className="opensource-intro"><span className="eyebrow">READ THE CODE. UNDERSTAND THE ROBOT.</span><p>어떤 문제를 해결하는 도구인지 확인하고, 공식 예제에서 출발해요.</p></div>
    <OpenSourceBrowser />
  </>;
}
