"""첫 실습: 공을 1m 높이에서 떨어뜨려 바닥에 닿는 시간을 확인한다."""
import mujoco

XML = """
<mujoco model="01 Ball Drop (numbers)">
  <option timestep="0.001"/>
  <worldbody>
    <geom type="plane" size="2 2 0.1"/>
    <body name="ball" pos="0 0 1">
      <freejoint/>
      <geom type="sphere" size="0.05" mass="1"/>
    </body>
  </worldbody>
</mujoco>
"""

model = mujoco.MjModel.from_xml_string(XML)
data = mujoco.MjData(model)

while data.time < 2.0:
    mujoco.mj_step(model, data)
    if data.qpos[2] <= 0.05:  # 공 중심이 반지름 높이 = 바닥 접촉
        print(f"바닥 도달: {data.time:.3f}초 (이론값 약 0.436초)")
        break
