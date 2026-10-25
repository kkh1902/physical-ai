export type LearningStage = {
  id: string;
  title: string;
  english: string;
  track: string;
  duration: string;
  prerequisite: string;
  goal: string;
  concepts: string[];
  tasks: string[];
  deliverable: string;
  checkpoint: string;
  resource: { label: string; url: string };
  note?: string;
};
export const learningStages: LearningStage[] = [
  {
    id: "foundation",
    title: "개발 환경과 코드",
    english: "FOUNDATIONS",
    track: "소프트웨어",
    duration: "1–2주",
    prerequisite: "시작점 · 사전 로보틱스 경험 불필요",
    goal: "로봇을 배우기 위한 실험 환경을 만들고, 작은 코드를 스스로 수정합니다.",
    concepts: ["Linux 터미널·Git", "Python 함수·클래스", "벡터·행렬 기초"],
    tasks: [
      "터미널에서 폴더·파일을 다루고 Git으로 변경 기록 남기기",
      "Python으로 센서처럼 시간에 따라 변하는 데이터를 생성하고 그래프로 보기",
      "벡터·행렬로 2차원 점을 이동·회전하는 코드 작성하기",
    ],
    deliverable: "실행 방법이 적힌 실습 저장소 + 데이터 그래프",
    checkpoint: "예제의 입력을 바꾸고 결과가 달라지는 이유를 설명할 수 있다.",
    resource: {
      label: "Python 공식 튜토리얼",
      url: "https://docs.python.org/ko/3/tutorial/",
    },
  },
  {
    id: "ros",
    title: "ROS 2로 기능 연결",
    english: "ROBOT COMMUNICATION",
    track: "소프트웨어",
    duration: "2–3주",
    prerequisite: "01 · Python과 터미널 기본 조작",
    goal: "여러 프로그램이 메시지를 주고받는 작은 로봇 시스템을 만듭니다.",
    concepts: ["노드·토픽·메시지", "서비스·액션", "워크스페이스·launch"],
    tasks: [
      "공식 CLI 튜토리얼에서 turtlesim을 실행하고 노드·토픽 살펴보기",
      "Python 발행자와 구독자를 직접 작성해 데이터 전달하기",
      "launch 파일로 여러 노드를 실행하고 rosbag으로 기록·재생하기",
    ],
    deliverable: "두 노드의 통신 그림 + 실행 가능한 패키지",
    checkpoint: "누가 어떤 데이터를 발행하고 구독하는지 직접 그릴 수 있다.",
    resource: {
      label: "ROS 2 공식 튜토리얼",
      url: "https://docs.ros.org/en/jazzy/Tutorials.html",
    },
    note: "ROS 2는 OS와 배포판 조합을 먼저 확인하세요. 링크는 Jazzy 기준이며, 기존 Ubuntu 20.04에 그대로 설치하는 안내는 아닙니다.",
  },
  {
    id: "kinematics",
    title: "좌표계와 로봇의 구조",
    english: "KINEMATICS",
    track: "로봇 수학",
    duration: "2–3주",
    prerequisite: "01 · 벡터·행렬 / 02 · 기본 통신",
    goal: "관절 각도가 손과 발의 위치로 이어지는 관계를 이해합니다.",
    concepts: ["자유도·좌표 변환", "정기구학·역기구학", "URDF·tf2·RViz"],
    tasks: [
      "평면 2관절 팔의 끝점 위치를 계산하고 그림으로 확인하기",
      "링크와 관절을 정의한 간단한 URDF 모델 만들기",
      "RViz에서 관절을 움직이고 좌표계가 어떻게 변하는지 확인하기",
    ],
    deliverable: "2관절 팔 계산 노트 + URDF와 RViz 화면",
    checkpoint:
      "관절 공간과 작업 공간의 차이를 설명하고 좌표 변환을 따라갈 수 있다.",
    resource: {
      label: "Modern Robotics · 기구학과 제어",
      url: "https://modernrobotics.northwestern.edu/",
    },
  },
  {
    id: "control",
    title: "센서와 관절 제어",
    english: "SENSING & CONTROL",
    track: "제어·하드웨어",
    duration: "2–3주",
    prerequisite: "03 · 관절과 좌표계 이해",
    goal: "측정값과 목표값을 비교하고, 하나의 관절을 제어하는 원리를 익힙니다.",
    concepts: ["엔코더·IMU·노이즈", "토크·감속비·마찰", "피드백·PID·응답"],
    tasks: [
      "가상 센서 데이터에 노이즈를 넣고 원본과 비교하기",
      "시뮬레이션에서 단일 관절 목표를 바꾸며 오차·응답 그래프 기록하기",
      "제어 이득을 바꾸고 지연·오버슈트·진동을 비교해 설명하기",
    ],
    deliverable: "관절 응답 비교 그래프 + 제어 실험 노트",
    checkpoint:
      "명령값과 측정값을 구분하고 불안정한 응답을 그래프에서 찾을 수 있다.",
    resource: {
      label: "Modern Robotics · Robot Control",
      url: "https://modernrobotics.northwestern.edu/",
    },
  },
  {
    id: "simulation",
    title: "가상 로봇 통합",
    english: "SIMULATION",
    track: "통합 실습",
    duration: "2–4주",
    prerequisite: "02–04 · 통신·구조·제어",
    goal: "물리 시뮬레이션에서 모델과 제어 코드를 하나로 연결합니다.",
    concepts: ["질량·관성·접촉", "모델과 상태의 구분", "데이터 기록·재현"],
    tasks: [
      "MuJoCo의 간단한 관절 모델을 불러와 중력과 접촉 확인하기",
      "가상 센서와 관절 명령을 연결하고 반복 실험하기",
      "동일한 초기 상태에서 실험을 다시 실행해 결과 비교하기",
    ],
    deliverable: "재현 가능한 가상 관절 또는 로봇 팔 데모",
    checkpoint:
      "모델·초기 조건·제어 입력을 구분하고 실험 결과를 재현할 수 있다.",
    resource: {
      label: "MuJoCo 공식 개요와 예제",
      url: "https://mujoco.readthedocs.io/en/stable/overview.html",
    },
  },
  {
    id: "humanoid",
    title: "휴머노이드로 확장",
    english: "HUMANOID SYSTEMS",
    track: "로봇 수학",
    duration: "3–6주 이상",
    prerequisite: "03–05 · 기구학·제어·시뮬레이션",
    goal: "팔 하나의 제어에서 다관절 전신과 접촉·균형 문제로 범위를 넓힙니다.",
    concepts: ["무게중심·지지 영역", "다관절 협응", "상태 추정·접촉"],
    tasks: [
      "가상 휴머노이드의 관절·센서·구동기 구조를 목록으로 정리하기",
      "양발 접촉 상태에서 작은 자세 변화와 무게중심 관찰하기",
      "보행보다 먼저 정적 자세 유지 실험과 실패 사례를 기록하기",
    ],
    deliverable: "균형 개념도 + 가상 자세 유지 실험 기록",
    checkpoint:
      "팔 제어와 전신 균형 문제의 차이를 설명하고 실험 범위를 제한할 수 있다.",
    resource: {
      label: "MuJoCo · 관절·접촉·모델링",
      url: "https://mujoco.readthedocs.io/en/stable/overview.html",
    },
    note: "실제 보행은 장기 심화 주제입니다. 이 단계의 완료가 실물 휴머노이드 보행 능력을 의미하지 않습니다.",
  },
  {
    id: "design",
    title: "작은 하드웨어부터 설계",
    english: "HARDWARE DESIGN",
    track: "제어·하드웨어",
    duration: "2–4주 이상",
    prerequisite: "04–06 · 제어 실험과 요구 조건",
    goal: "전신 제작 전에 단일 관절 또는 작은 모듈의 요구 조건과 부품을 검토합니다.",
    concepts: ["하중·토크 요구", "BOM·전원·통신", "기구·열·배선"],
    tasks: [
      "대상 모듈의 범위·하중·동작 조건을 문서로 정의하기",
      "부품 데이터시트를 비교해 모터·감속기·센서 선정 근거 적기",
      "예산·전원 분배·배선·고정 구조와 검증 절차 설계하기",
    ],
    deliverable: "단일 모듈 설계서 + BOM + 검증 계획",
    checkpoint:
      "부품을 고른 이유와 한계, 아직 검증하지 못한 가정을 설명할 수 있다.",
    resource: { label: "프로젝트 설계서에 기록하기", url: "/design" },
  },
  {
    id: "build",
    title: "제작·검증·공유",
    english: "BUILD & ITERATE",
    track: "통합 실습",
    duration: "반복 · 일정 유동",
    prerequisite: "07 · 검토된 모듈 설계와 검증 계획",
    goal: "작게 만들고, 측정하고, 실패를 기록하면서 시스템을 개선합니다.",
    concepts: ["단위 검증·통합", "측정과 오차 분석", "제작일지·회고"],
    tasks: [
      "모듈을 조립하고 무부하부터 단계적으로 동작 확인하기",
      "설계 예상과 측정 결과를 비교해 수정 사항 기록하기",
      "재현 방법·사진·실패 원인·다음 실험을 제작일지로 정리하기",
    ],
    deliverable: "동작 검증 기록 + 개선 전후 비교 + 주간 발표",
    checkpoint: "다른 사람이 기록을 보고 실험 과정과 한계를 이해할 수 있다.",
    resource: { label: "제작일지에서 과정 기록하기", url: "/build" },
  },
];
