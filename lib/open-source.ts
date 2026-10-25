export type RoboticsProject = {
  name: string;
  repository: string;
  category: string;
  description: string;
  explore: string;
  tags: string[];
};

// Descriptions checked against each project's official repository on 2026-10-22.
export const roboticsProjects: RoboticsProject[] = [
  {
    name: "ROS 2", repository: "ros2/ros2", category: "프레임워크",
    description: "로봇의 여러 프로그램이 메시지를 주고받으며 함께 동작하도록 돕는 라이브러리와 도구 모음이에요.",
    explore: "노드·토픽·메시지로 센서와 제어 프로그램을 연결하는 구조를 살펴봐요.",
    tags: ["통신", "Python", "C++"],
  },
  {
    name: "MuJoCo", repository: "google-deepmind/mujoco", category: "시뮬레이션",
    description: "관절과 접촉을 포함한 물리 현상을 계산하는 시뮬레이터예요. 로봇의 동작을 가상 환경에서 탐구할 수 있어요.",
    explore: "로봇 모델을 불러와 관절과 접촉이 움직임에 주는 영향을 관찰해요.",
    tags: ["물리", "시뮬레이터", "Python"],
  },
  {
    name: "Isaac Lab", repository: "isaac-sim/IsaacLab", category: "학습·데이터",
    description: "로봇 학습 실험을 구성하는 프레임워크예요. 시뮬레이션 환경과 학습 과정을 연결해요.",
    explore: "예제 환경의 관측·행동·보상 구성을 읽으며 로봇 학습의 구조를 이해해요.",
    tags: ["로봇 학습", "시뮬레이션", "Python"],
  },
  {
    name: "LeRobot", repository: "huggingface/lerobot", category: "학습·데이터",
    description: "로봇 AI 학습을 위한 도구를 제공하는 프로젝트예요. 로봇 데이터와 학습 모델을 연결하는 흐름을 살펴볼 수 있어요.",
    explore: "데이터를 수집하고 학습에 사용하는 과정을 공식 예제로 따라가요.",
    tags: ["모방학습", "데이터셋", "Python"],
  },
  {
    name: "Pinocchio", repository: "stack-of-tasks/pinocchio", category: "제어·연산",
    description: "로봇의 강체 동역학 알고리즘과 미분 계산을 제공하는 라이브러리예요.",
    explore: "관절 위치와 속도로 로봇의 자세와 동역학을 계산하는 예제를 읽어봐요.",
    tags: ["기구학", "동역학", "C++"],
  },
  {
    name: "Drake", repository: "RobotLocomotion/drake", category: "제어·연산",
    description: "모델을 기반으로 로봇 시스템을 설계하고 검증하는 도구 모음이에요.",
    explore: "로봇 모델을 구성하고 동작을 시뮬레이션하는 공식 예제를 살펴봐요.",
    tags: ["모델링", "최적화", "Python"],
  },
  {
    name: "OpenArm", repository: "enactic/openarm", category: "하드웨어",
    description: "Physical AI 연구를 위한 공개 로봇 팔 프로젝트예요. 하드웨어와 제어 소프트웨어의 연결을 탐구할 수 있어요.",
    explore: "로봇 팔의 구조와 소프트웨어 구성을 살펴보며 제작에 필요한 요소를 정리해요.",
    tags: ["로봇 팔", "휴머노이드", "ROS 2"],
  },
  {
    name: "SO-100 / SO-101", repository: "TheRobotStudio/SO-ARM100", category: "하드웨어",
    description: "직접 조립하는 로봇 팔의 구조와 제작 자료를 공개하는 프로젝트예요. LeRobot과 함께 사용하는 구성을 다뤄요.",
    explore: "SO-101의 부품 목록과 조립 가이드를 읽고 하드웨어 제작 과정을 알아봐요.",
    tags: ["로봇 팔", "3D 프린팅", "LeRobot"],
  },
];
