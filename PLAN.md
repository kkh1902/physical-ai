# Physical AI 사이트 계획

작성 2026-10-19. 휴머노이드 로봇 제작 과정을 공부부터 제작까지 기록하고 보여주는 사이트.

## 1. 목표

- 공부한 내용, 로드맵, 설계서, 제작일지를 한곳에서 보여준다.
- 글은 secondbrain에 한 번만 쓰고, 사이트는 그걸 가져다 보여준다(두 번 쓰지 않음).
- 포트폴리오로 쓸 수 있게 공개 사이트로 운영한다.

## 2. 전체 흐름

```
공부한 내용
 └─ /sec 로 저장 → secondbrain wiki/20-29 커리어/23 로보틱스/*.md
     └─ publish: true 인 카드만
         └─ npm run sync (동기화 스크립트) → 사이트 저장소 content/notes/
             └─ git push → Vercel 자동 배포
```

github.io 블로그는 별도로 두고, 주요 단계마다 회고 글을 쓰고 사이트로 링크한다.

## 3. 기술 구성

| 항목 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js (App Router) | 기존 사이트들과 같은 스택 |
| 글 | Markdown/MDX | secondbrain 카드를 그대로 사용 |
| 3D | three.js | 휴머노이드 분해도 |
| 배포 | Vercel | push 하면 자동 배포 |
| 저장소 | GitHub `kkh1902/physical-ai` | 계정 규칙(kkh1902) 따름 |
| 주소 | Vercel 기본 주소로 시작 | 도메인은 나중에 |

로그인·DB는 넣지 않는다. 글은 Claude가 대신 올린다.

## 4. 페이지 구성

| 페이지 | 경로 | 내용 | 시기 |
|---|---|---|---|
| 홈 | `/` | 목표(휴머노이드), 로드맵 단계와 날짜 | 1단계 |
| 공부 | `/study` | 3D 분해도, 신호 흐름, 용어 | 1단계 |
| 노트 | `/notes`, `/notes/[slug]` | secondbrain에서 가져온 공부 카드 | 2단계 |
| 주간 발표 | `/weekly` | 주말 모임 주차별 발표 기록 | 3단계 |
| 설계서 | `/design` | 부품목록(BOM), 예산, 관절 구성 | 12월 |
| 제작일지 | `/build` | 발주·조립 기록, 사진 | 2027 |

## 5. secondbrain 연동 규칙

### 어떤 카드를 올리나

카드 frontmatter에 `publish: true`가 있는 것만 올린다. secondbrain에는 인원 스펙, 개인 일정 같은 비공개 정보가 섞여 있어서 기본값은 비공개다.

```yaml
---
created: 2026-10-19
updated: 2026-10-19
status: active
publish: true        # 사이트에 올림
site_section: notes  # notes | weekly | design | build
sources: [...]
source_count: 1
tags: [로보틱스, ROS2]
---
```

### 동기화 스크립트 (`scripts/sync_secondbrain.py`)

| 단계 | 동작 |
|---|---|
| 1 | `/home/pc/gdrive/secondbrain/wiki/20-29 커리어/23 로보틱스/` 의 md를 읽음 |
| 2 | `publish: true` 인 것만 고름 |
| 3 | 사이트에 필요 없는 필드(`sources`, `source_count`)를 뺌 |
| 4 | `[[23.02 카드이름]]` 위키링크를 `/notes/<slug>` 링크로 바꿈 |
| 5 | `site_section`에 따라 `content/notes/`, `content/weekly/` 등에 저장 |
| 6 | 바뀐 파일 목록을 출력 (커밋은 사람이 확인 후) |

- secondbrain은 Google Drive(rclone) 마운트라 느리다. 사이트 빌드가 직접 읽지 않고, 스크립트로 저장소에 복사해 둔다.
- secondbrain 원본은 수정하지 않는다(읽기만).
- `files/로보틱스/`의 PDF 원본(ROKEY 커리큘럼)은 다른 회사 자료라 사이트에 올리지 않는다. 요약 카드만 올린다.

## 6. 폴더 구조

```
physical-ai/
├─ app/
│  ├─ page.tsx            홈 + 로드맵
│  ├─ study/page.tsx      3D 분해도, 신호 흐름, 용어
│  ├─ notes/              노트 목록과 상세
│  └─ weekly/             주간 발표
├─ components/
│  ├─ Robot3D.tsx         three.js 분해도
│  └─ Roadmap.tsx
├─ content/
│  ├─ notes/              동기화된 공부 카드
│  └─ weekly/             동기화된 발표 기록
├─ scripts/
│  └─ sync_secondbrain.py
└─ PLAN.md
```

## 7. 작업 단계

### 0단계 — 세팅
- [ ] Next.js 프로젝트 생성
- [ ] GitHub `kkh1902/physical-ai` 저장소 생성, 커밋 작성자 `gihunKim <kkh1902@naver.com>`
- [ ] Vercel 연결, 첫 배포

### 1단계 — 기본 페이지
- [ ] 홈: 로드맵 (단계 6개, 날짜)
- [ ] 공부: 3D 분해도(부품 클릭, 조립↔분해 슬라이더), 신호 흐름, 용어 카드
- [ ] 라이트/다크 모드, 모바일 화면 확인

### 2단계 — secondbrain 연동
- [ ] 동기화 스크립트 작성
- [ ] 23.01~23.03 카드에 `publish: true` 추가 후 첫 동기화
- [ ] 노트 목록·상세 페이지

### 3단계 — 운영
- [ ] 주간 발표 페이지 (매주 주말 모임 후 카드 추가 → 동기화)
- [ ] github.io에 첫 회고 글 + 사이트 링크

### 이후
- [ ] 12월: 설계서 페이지
- [ ] 2027: 제작일지 페이지, 도메인 연결

## 8. 운영 방식

1. 공부하거나 발표한 내용을 말하면 Claude가 `/sec`로 secondbrain에 카드 저장 (`publish: true` 포함)
2. `npm run sync` 실행 → 바뀐 파일 확인
3. 커밋·push → Vercel 자동 배포
4. 배포된 화면을 직접 열어 확인

## 9. 정해야 할 것

| 항목 | 현재 | 비고 |
|---|---|---|
| 사이트 이름 | 미정 (가칭 physical-ai) | 저장소 이름도 같이 바뀔 수 있음 |
| 주말 모임 인원 이름 노출 | 미정 | 발표 기록에 실명을 쓸지 |
| 도메인 | 나중에 | Vercel 기본 주소로 시작 |

## 참고

- GitHub는 kkh1902 계정만 사용 (`gh auth switch --user kkh1902`)
- secondbrain 카테고리: `wiki/20-29 커리어/23 로보틱스/`
- 원본 자료: dr-rokey.com, 두산로보틱스 ROKEY BOOT CAMP 커리큘럼 PDF
