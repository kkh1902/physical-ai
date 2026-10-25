export const navigation = [
  { href: "/", label: "개요" },
  { href: "/roadmap", label: "학습 로드맵" },
  { href: "/study", label: "로봇 탐구" },
  { href: "/notes", label: "학습 노트" },
  { href: "/weekly", label: "주간 발표" },
  { href: "/design", label: "설계서" },
  { href: "/build", label: "제작일지" },
  { href: "/open-source", label: "오픈소스" },
];
export const roadmap = [
  {
    title: "기초 다지기",
    date: "2026. 10",
    description: "로보틱스 기초와 시스템 구조 이해",
    href: "/study",
  },
  {
    title: "감각과 움직임",
    date: "2026. 11",
    description: "센서·구동기와 피드백 제어 학습",
    href: "/study",
  },
  {
    title: "연결과 시뮬레이션",
    date: "2026. 11–12",
    description: "ROS 2 통신과 가상 환경 탐구",
    href: "/notes",
  },
  {
    title: "나만의 설계",
    date: "2026. 12",
    description: "관절 구조·부품 선정과 예산 계획",
    href: "/design",
  },
  {
    title: "실물로 옮기기",
    date: "2027 · 예정",
    description: "부품 발주부터 조립·배선까지",
    href: "/build",
  },
  {
    title: "첫 움직임",
    date: "2027 · 예정",
    description: "통합 제어·검증과 개선의 반복",
    href: "/build",
  },
];
export const robotParts = [
  {
    id: "head",
    label: "센서 & 인지",
    english: "PERCEPTION",
    title: "세계를 읽는 눈",
    description:
      "카메라와 거리 센서로 주변 환경을 관찰합니다. 센서 데이터는 로봇이 자신의 위치와 주변 물체를 추정하는 입력이 됩니다.",
    examples: "카메라 · 거리 센서 · IMU",
    signal: "환경 → 센서 데이터",
  },
  {
    id: "torso",
    label: "컴퓨팅 & 제어",
    english: "COMPUTATION",
    title: "관찰을 행동으로",
    description:
      "센서 정보를 처리하고 목표에 맞는 동작을 계산합니다. 상위 컴퓨터의 계획과 실시간 제어기의 빠른 피드백이 함께 필요합니다.",
    examples: "온보드 컴퓨터 · MCU · 통신 버스",
    signal: "센서 데이터 → 목표 명령",
  },
  {
    id: "arms",
    label: "팔 & 구동기",
    english: "ACTUATION",
    title: "명령이 힘이 되는 곳",
    description:
      "모터와 감속기가 전기 에너지를 관절의 움직임으로 바꿉니다. 토크, 속도, 발열, 유격을 함께 고려해야 합니다.",
    examples: "모터 · 감속기 · 엔코더",
    signal: "목표 명령 → 관절 토크",
  },
  {
    id: "pelvis",
    label: "골반 & 전원",
    english: "POWER & STRUCTURE",
    title: "시스템을 지탱하는 중심",
    description:
      "골반은 몸통과 다리를 연결하고 하중을 전달합니다. 배터리와 전원 분배 장치는 각 부품에 필요한 에너지를 공급합니다. 위치는 설계에 따라 달라집니다.",
    examples: "프레임 · 배터리 · 전원 분배",
    signal: "전기 에너지 → 각 서브시스템",
  },
  {
    id: "legs",
    label: "다리 & 균형",
    english: "LOCOMOTION",
    title: "균형 위의 한 걸음",
    description:
      "다리의 여러 관절을 조율해 몸을 지탱하고 이동합니다. 무게중심, 접촉 상태와 자세를 함께 고려해야 합니다.",
    examples: "고관절 · 무릎 · 발목 · 접촉 센서",
    signal: "자세 추정 → 균형 제어",
  },
];
