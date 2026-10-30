"""네 번째 실습: Unitree Go2 로봇개를 불러와 PD 제어로 앉았다 일어서게 한다.

준비: sim/ 폴더에서
  git clone --depth 1 --filter=blob:none --sparse https://github.com/google-deepmind/mujoco_menagerie.git menagerie
  cd menagerie && git sparse-checkout set unitree_go2
"""
import sys

import numpy as np
import mujoco
import mujoco.viewer

# 1) 모델 불러오기: Menagerie의 scene.xml = 로봇(go2.xml) + 바닥 + 조명
spec = mujoco.MjSpec.from_file("menagerie/unitree_go2/scene.xml")
spec.modelname = "04 Go2 Stand PD"  # 뷰어 창 제목
model = spec.compile()
data = mujoco.MjData(model)

# 2) 'home' 키프레임(서 있는 자세)에서 시작
mujoco.mj_resetDataKeyframe(model, data, 0)

# 다리 순서: FL, FR, RL, RR / 관절 순서: hip(옆), thigh(허벅지), calf(종아리)
STAND = model.key_ctrl[0].copy()        # [0, 0.9, -1.8] x 4
SIT = np.tile([0.0, 1.3, -2.6], 4)      # 무릎을 더 접은 자세

# 3) PD 게인: Go2 모터는 '토크' 입력이라 각도를 직접 넣으면 안 된다
KP, KD = 60.0, 3.0


def control(t):
    # 4초 주기로 서기 <-> 앉기 사이를 부드럽게 오간다
    alpha = 0.5 - 0.5 * np.cos(2 * np.pi * t / 4.0)
    target = (1 - alpha) * STAND + alpha * SIT

    q = data.qpos[7:]   # 앞 7개는 몸통 위치(3) + 자세 쿼터니언(4)
    dq = data.qvel[6:]  # 앞 6개는 몸통 선속도(3) + 각속도(3)
    data.ctrl[:] = KP * (target - q) - KD * dq


if "--headless" in sys.argv:
    # 창 없이 8초 돌려서 몸통 높이만 확인
    while data.time < 8.0:
        control(data.time)
        mujoco.mj_step(model, data)
        if abs(data.time % 1.0) < model.opt.timestep:
            print(f"t={data.time:4.1f}s  몸통 높이={data.qpos[2]:.3f} m")
else:
    with mujoco.viewer.launch_passive(model, data) as viewer:
        while viewer.is_running():
            control(data.time)
            mujoco.mj_step(model, data)
            viewer.sync()
