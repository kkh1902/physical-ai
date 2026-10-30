@AGENTS.md

## MuJoCo 실습 (`sim/`)

- 실습 파일마다 XML 루트에 `model` 이름을 붙인다. 뷰어 창 제목이 `MuJoCo : <model>`로 표시되어 여러 창을 이름으로 구분할 수 있다.
  - 예: `<mujoco model="03 Pendulum">`
- `model` 이름은 **영어로** 쓴다. 한글은 뷰어 창 제목에서 깨진다.
- 이름 형식: `<번호> <짧은 영어 설명>` (예: `02 Ball Drop Viewer`, `03 PID Inverted Pendulum`)
