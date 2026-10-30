"""다섯 번째 실습: Franka Panda 로봇팔을 불러와 관절을 사인파로 부드럽게 움직이고 그리퍼를 여닫는다.

준비: sim/ 폴더에서
  cd menagerie && git sparse-checkout add franka_emika_panda
"""
import sys

import numpy as np
import mujoco
import mujoco.viewer

# 1) 모델 불러오기: Menagerie의 scene.xml = 로봇(panda.xml) + 바닥 + 조명
spec = mujoco.MjSpec.from_file("menagerie/franka_emika_panda/scene.xml")
spec.modelname = "05 Panda Joint Motion"  # 뷰어 창 제목
model = spec.compile()
data = mujoco.MjData(model)

# 2) 'home' 키프레임에서 시작 (reset 시 ctrl도 키프레임 값으로 채워진다)
mujoco.mj_resetDataKeyframe(model, data, 0)

# 팔 관절 7개(joint1~7) + 그리퍼 1개(actuator8) = 액추에이터 8개
HOME = model.key_ctrl[0, :7].copy()  # home 자세의 관절 각도

# 3) Panda 액추에이터는 '위치(position)' 서보다: ctrl에 목표 각도를 그대로 넣는다
#    (PD 게인은 XML 안에 이미 들어 있어서 토크를 직접 계산할 필요가 없다)
# 관절별 진폭(rad): 범위를 벗어나지 않도록 작게, 주파수(Hz)는 관절마다 다르게
AMP = np.array([0.6, 0.3, 0.6, 0.4, 0.3, 0.3, 0.3])
FREQ = np.array([0.20, 0.25, 0.20, 0.25, 0.20, 0.20, 0.20])
PHASE = np.linspace(0, np.pi, 7)
# 참고: joint5~7 모터는 힘 한계가 ±12 Nm로 약해서, 진폭/속도를 작게 잡아야 목표를 따라간다

# 안전 확인: 목표가 관절 범위(= ctrlrange) 안에 있어야 한다
lo, hi = model.actuator_ctrlrange[:7].T
assert np.all(HOME - AMP >= lo) and np.all(HOME + AMP <= hi), "목표가 관절 범위를 벗어남"

GRIPPER_PERIOD = 4.0  # 그리퍼 열기 <-> 닫기 주기(초)


def targets(t):
    # 홈 자세를 중심으로 sin 곡선 (t=0에서 시작 속도 0에 가깝게 위상 보정)
    ramp = min(t / 1.0, 1.0)  # 첫 1초 동안 진폭을 서서히 키워 급출발 방지
    return HOME + ramp * AMP * np.sin(2 * np.pi * FREQ * t + PHASE) - ramp * AMP * np.sin(PHASE)


def control(t):
    data.ctrl[:7] = targets(t)
    # 그리퍼 ctrl: 0(닫힘) ~ 255(열림). 코사인으로 부드럽게 여닫는다
    alpha = 0.5 + 0.5 * np.cos(2 * np.pi * t / GRIPPER_PERIOD)
    data.ctrl[7] = 255.0 * alpha


if "--headless" in sys.argv:
    # 창 없이 8초 돌려서 매초 추종 오차와 그리퍼 벌어짐을 출력
    max_err = 0.0
    while data.time < 8.0:
        control(data.time)
        mujoco.mj_step(model, data)
        err = np.max(np.abs(data.ctrl[:7] - data.qpos[:7]))
        max_err = max(max_err, err)
        if not np.all(np.isfinite(data.qpos)):
            raise RuntimeError("NaN 발생: 시뮬레이션이 불안정함")
        if abs(data.time % 1.0) < model.opt.timestep:
            opening = data.qpos[7] + data.qpos[8]  # 두 손가락 합 = 벌어진 폭
            print(f"t={data.time:4.1f}s  최대 추종오차={max_err:.4f} rad  그리퍼 폭={opening * 1000:5.1f} mm")
            max_err = 0.0
else:
    with mujoco.viewer.launch_passive(model, data) as viewer:
        while viewer.is_running():
            control(data.time)
            mujoco.mj_step(model, data)
            viewer.sync()
