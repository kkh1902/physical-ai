"""세 번째 실습: 단진자를 30도에서 놓고 각도 그래프와 주기를 확인한다.

실행: .venv/bin/python 03_pendulum.py          (그래프만 저장)
      .venv/bin/python 03_pendulum.py --view   (3D 뷰어로도 보기)
"""
import math
import sys

import matplotlib

matplotlib.use("Agg")  # 창 없이 PNG로 저장
import matplotlib.pyplot as plt
import mujoco

L = 1.0  # 줄 길이 (m)
G = 9.81
START_DEG = 30

XML = f"""
<mujoco model="03 Pendulum">
  <option timestep="0.001" gravity="0 0 -{G}"/>
  <worldbody>
    <light pos="0 0 3"/>
    <body name="pole" pos="0 0 1.5">
      <joint name="hinge" type="hinge" axis="0 1 0"/>
      <geom type="capsule" fromto="0 0 0 0 0 -{L}" size="0.01" mass="0.001" rgba="0.6 0.6 0.6 1"/>
      <geom type="sphere" pos="0 0 -{L}" size="0.05" mass="1" rgba="0.9 0.3 0.2 1"/>
    </body>
  </worldbody>
</mujoco>
"""

model = mujoco.MjModel.from_xml_string(XML)
data = mujoco.MjData(model)
data.qpos[0] = math.radians(START_DEG)

times, angles = [], []
while data.time < 10.0:
    mujoco.mj_step(model, data)
    times.append(data.time)
    angles.append(math.degrees(data.qpos[0]))

# 각도가 +에서 -로 바뀌는 순간(0도 통과) 사이 간격 = 한 주기
crossings = [times[i] for i in range(1, len(angles)) if angles[i - 1] > 0 >= angles[i]]
measured = (crossings[-1] - crossings[0]) / (len(crossings) - 1)
theory = 2 * math.pi * math.sqrt(L / G)  # 작은 각도 근사
print(f"측정 주기: {measured:.3f}초")
print(f"이론 주기: {theory:.3f}초 (작은 각도 근사 — 30도에선 실제가 조금 더 김)")

plt.plot(times, angles)
plt.axhline(0, color="gray", linewidth=0.5)
plt.xlabel("time (s)")
plt.ylabel("angle (deg)")
plt.title(f"Simple pendulum, start {START_DEG} deg, period {measured:.3f} s")
plt.savefig("03_pendulum.png", dpi=120)
print("그래프 저장: 03_pendulum.png")

if "--view" in sys.argv:
    import mujoco.viewer

    mujoco.mj_resetData(model, data)
    data.qpos[0] = math.radians(START_DEG)
    mujoco.viewer.launch(model, data)
