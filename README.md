# Physical AI / LAB

휴머노이드 로봇을 공부하고 설계하고 제작하는 과정을 기록하는 Next.js 사이트입니다.

UI는 shadcn/ui(Radix Nova), Tailwind CSS v4, Lucide 아이콘을 사용합니다. `components.json`에 설치 구성이 있으며 `components/ui/`에는 CLI로 추가한 버튼·카드·배지·입력·탭·체크박스·진행률·슬라이더·툴팁·시트가 있습니다. 라이트 테마가 기본이고 기존 `data-theme` 전환과 공통 디자인 토큰을 공유합니다.

공통 레이아웃은 `WorkspaceShell`과 shadcn `SidebarProvider`로 구성합니다. 네이비 사이드바는 상단 버튼이나 Ctrl/Cmd+B로 접을 수 있으며 모바일에서는 왼쪽 메뉴로 열립니다. 배색·콘텐츠 폭별 반응형 규칙은 `app/workspace.css`에 있습니다. [shadcn Sidebar](https://ui.shadcn.com/docs/components/radix/sidebar)와 [Material 색상 역할](https://m3.material.io/m3/pages/color-roles?s=m3)을 참고해 네이비·흰색·주황색의 역할을 구분했습니다.

## 실행

Node.js 20.9 이상이 필요합니다. WSL에서는 Windows npm 대신 Linux Node/npm을 사용하세요.

```bash
npm install
npm run dev
```

로컬 주소: http://localhost:3000

```bash
npm test       # 공개 카드 필터링·링크 변환·철회·파일 보호 테스트
npm run lint
npm run build
```

## 페이지

| 경로       | 기능                                                           |
| ---------- | -------------------------------------------------------------- |
| `/`        | 프로젝트 소개, 제안 일정, 학습 노트                            |
| `/roadmap` | 8단계 학습 경로, 실습 체크, 결과물·진입 기준·참고 문서         |
| `/study`   | Three.js 휴머노이드 회전·확대·분해·부품 선택, 신호 흐름과 용어 |
| `/notes`   | 주제 필터, 검색과 Markdown 상세 페이지                         |
| `/weekly`  | 공개 발표 기록. 아직 기록이 없으면 준비 상태                   |
| `/design`  | 공개 설계 기록. 아직 기록이 없으면 계획 항목                   |
| `/build`   | 공개 제작 기록. 아직 기록이 없으면 계획 항목                   |

테마와 학습 실습 체크는 localStorage에 보관합니다. 브라우저/기기 간 동기화와 로그인은 없습니다. 학습 체크는 본인이 기록하는 표시이며 성취도 자동 평가가 아닙니다.

## 콘텐츠는 어디에서 오나?

사이트는 `content/{notes,weekly,design,build}/*.md`에서 **`publish: true`인 글만** 읽습니다. 초기 노트 3개는 이 사이트를 위해 작성한 입문 가이드로 `kind: guide`로 명시했습니다. 개인 학습·실험·발표 기록이 아닙니다.

현재 secondbrain 원본은 가져오지 않았습니다. 학습 로드맵은 공식 자료를 참고해 제안한 독학 경로이며 두산로보틱스 ROKEY 공식 과정의 재현이 아닙니다. 원본 PDF를 배포하지 않습니다. 실제 과정 카드가 공개 설정되면 아래 스크립트로 연결할 수 있습니다.

## secondbrain 동기화

```bash
# 먼저 변경될 파일 목록만 확인
npm run sync -- --dry-run

# 로보틱스 폴더가 마운트된 경우 공개 카드 반영
npm run sync

# 다른 로컬 경로 사용
npm run sync -- --source "/path/to/robotics" --dry-run
```

기본 원본 경로: `/home/pc/gdrive/secondbrain/wiki/20-29 커리어/23 로보틱스`

```yaml
---
title: 공개할 글의 제목
description: 목록에 표시할 설명
created: "2026-10-21"
publish: true
site_section: notes # notes | weekly | design | build
tags: [로보틱스, ROS 2]
---
Markdown 본문
```

- 원본은 읽기만 합니다. 카드의 공개 설정을 임의로 바꾸지 않습니다.
- YAML의 boolean `true`만 허용합니다. 문자열 `"true"`나 공개 설정이 없는 카드는 제외합니다.
- 제목·설명·날짜·태그 등 허용된 메타데이터만 복사합니다. `sources`, `source_count`와 기타 필드는 제외합니다.
- 공개 카드 사이의 위키링크를 사이트 경로로 변환합니다. 비공개·미동기화 문서 링크는 문서 이름 없이 대체합니다. 위키 첨부 문법은 복사하지 않습니다. 외부 이미지·일반 Markdown 링크는 본문에 남으므로 공개 카드의 본문은 게시 전에 검토하세요.
- `.secondbrain-manifest.json`으로 스크립트가 관리하는 파일을 추적합니다. 공개를 철회하거나 원본을 삭제하면 다음 동기화 때 해당 출력 파일을 제거합니다.
- 직접 작성한 파일은 덮어쓰거나 삭제하지 않습니다. 파일명 충돌·잘못된 섹션은 오류로 종료합니다.
- 동기화 후 개발 서버를 다시 실행하거나 프로덕션 빌드를 다시 하세요. 변경 목록과 Git diff를 확인한 뒤 커밋합니다.

기존 계획의 Python 스크립트 대신 프로젝트에 이미 필요한 YAML 파서를 재사용하는 Node.js 스크립트(`scripts/sync-secondbrain.mjs`)로 구현했습니다.

## 모델의 범위

Three.js 모델은 학습용 절차 생성 모델입니다. 실제 기종 CAD, 치수·자유도·토크 사양이나 제작 도면이 아니며 물리 시뮬레이션을 수행하지 않습니다. 실제 검증 결과와 제작 사양은 향후 설계서/제작일지에 별도로 기록합니다.

## 배포

현재는 로컬 구현입니다. Vercel에서는 이 저장소를 연결하고 표준 Next.js 빌드(`npm run build`)를 사용합니다. 콘텐츠는 저장소에 있는 공개 Markdown을 빌드 시 읽으므로 Google Drive 마운트 없이도 배포할 수 있습니다.
