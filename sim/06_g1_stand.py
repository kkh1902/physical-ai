"""여섯 번째 실습: Unitree G1 휴머노이드를 불러와 관절 PD 제어로 서 있게 하고, 살짝 쪼그려 앉았다 일어서게 한다.

RL 없이 '관절 목표 각도 + 제어기'만으로 선다. G1 액추에이터는 Go2와 달리 position 타입
(kp=500, 감쇠 dampratio=1)이라 ctrl에 목표 각도를 넣으면 PD가 모델 안에서 계산된다.
(ctrl = 목표 각도, 토크 = kp*(ctrl-q) - kv*dq)

준비: sim/ 폴더에서
  cd menagerie && git sparse-checkout add unitree_g1
"""
import sys

import numpy as np
import mujoco
import mujoco.viewer

# 1) 모델 불러오기: Menagerie의 scene.xml = 로봇(g1.xml) + 바닥 + 조명
spec = mujoco.MjSpec.from_file("menagerie/unitree_g1/scene.xml")
spec.modelname = "06 G1 Stand PD"  # 뷰어 창 제목

# 2) 부위별 PD 게인: 다리/허리는 뻣뻣하게, 팔은 부드럽게
#    position 액추에이터: 토크 = kp*(ctrl - q) - kv*dq  (gainprm[0]=kp, biasprm[1]=-kp, biasprm[2]=-kv)
GAINS = {"hip": (500, 30), "knee": (500, 30), "ankle": (300, 20),
         "waist": (500, 30), "arm": (200, 10)}
for act in spec.actuators:
    key = next((k for k in ("hip", "knee", "ankle", "waist") if k in act.name), "arm")
    kp, kd = GAINS[key]
    act.gainprm[0] = kp
    act.biasprm[:3] = [0, -kp, -kd]

model = spec.compile()
data = mujoco.MjData(model)

# 3) 'stand' 키프레임(서 있는 자세)에서 시작
mujoco.mj_resetDataKeyframe(model, data, 0)

STAND = model.key_ctrl[0].copy()  # 다리·허리는 0, 팔은 살짝 굽힌 자세
lo, hi = model.actuator_ctrlrange.T
act = {model.actuator(i).name: i for i in range(model.nu)}

# 쪼그려 앉기: 무릎을 접는 만큼 엉덩이·발목 피치로 균형을 맞춰 발바닥 위에 무게중심을 유지
SQUAT = 0.35   # 무릎 굽힘 각도 (rad, 약 20도)
PERIOD = 4.0   # 한 번 앉았다 일어나는 시간 (초)
START = 2.0    # 처음 2초는 가만히 서 있기


def control(t):
    alpha = 0.0 if t < START else 0.5 - 0.5 * np.cos(2 * np.pi * (t - START) / PERIOD)
    q = SQUAT * alpha
    target = STAND.copy()
    for side in ("left", "right"):
        target[act[f"{side}_knee_joint"]] += q
        target[act[f"{side}_hip_pitch_joint"]] -= q / 2
        target[act[f"{side}_ankle_pitch_joint"]] -= q / 2
    data.ctrl[:] = np.clip(target, lo, hi)


def tilt_deg():
    # 몸통(pelvis)의 z축이 월드 위(z)에서 얼마나 기울었는지 (쿼터니언 -> 각도)
    w, x, y, z = data.qpos[3:7]
    cos_tilt = 1 - 2 * (x * x + y * y)
    return np.degrees(np.arccos(np.clip(cos_tilt, -1, 1)))


if "--headless" in sys.argv:
    # 창 없이 8초 돌려서 골반 높이와 기울기를 확인
    next_print = 0.0
    while data.time < 8.0:
        control(data.time)
        mujoco.mj_step(model, data)
        if data.time >= next_print:
            print(f"t={data.time:4.1f}s  골반 높이={data.qpos[2]:.3f} m  기울기={tilt_deg():5.1f}도")
            next_print += 1.0
else:
    with mujoco.viewer.launch_passive(model, data) as viewer:
        while viewer.is_running():
            control(data.time)
            mujoco.mj_step(model, data)
            viewer.sync()
