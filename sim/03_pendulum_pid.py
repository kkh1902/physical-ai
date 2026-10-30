"""세 번째 실습: 거꾸로 선 진자를 PID 제어로 똑바로 세운다."""
import sys
import time
import mujoco
import mujoco.viewer

KP, KI, KD = 30.0, 10.0, 5.0  # PID 게인: 바꿔가며 실험해보자 (Kd=0으로 바꿔보면 흔들림을 볼 수 있다)
TARGET = 0.0                  # 목표 각도 (0 = 수직으로 선 상태)

XML = """
<mujoco model="03 PID Inverted Pendulum">
  <option timestep="0.001"/>
  <asset>  <!-- 배경·바닥이 없으면 검은 화면에 막대만 보인다 -->
    <texture type="skybox" builtin="gradient" rgb1="0.4 0.6 0.8" rgb2="0 0 0" width="256" height="256"/>
    <texture name="grid" type="2d" builtin="checker" rgb1="0.2 0.3 0.4" rgb2="0.3 0.4 0.5" width="256" height="256"/>
    <material name="grid" texture="grid" texrepeat="8 8"/>
  </asset>
  <worldbody>
    <light pos="0 0 3"/>
    <geom type="plane" size="2 2 0.1" material="grid"/>
    <geom type="cylinder" fromto="0 0 0 0 0 1" size="0.02" rgba="0.6 0.6 0.6 1" contype="0" conaffinity="0"/>  <!-- 받침대 (충돌 없음) -->
    <body name="pole" pos="0 0 1">
      <joint name="hinge" type="hinge" axis="0 1 0"/>
      <geom type="capsule" fromto="0 0 0 0 0 0.5" size="0.03" mass="1" rgba="0.9 0.3 0.2 1"/>
    </body>
  </worldbody>
  <actuator>
    <motor joint="hinge" ctrlrange="-10 10"/>
  </actuator>
</mujoco>
"""

model = mujoco.MjModel.from_xml_string(XML)
data = mujoco.MjData(model)
data.qpos[0] = 0.3  # 수직에서 0.3rad 기울어진 채로 시작

integral = 0.0


def control():
    global integral
    error = TARGET - data.qpos[0]
    integral += error * model.opt.timestep
    # PID: 현재 오차(P) + 오차 누적(I) - 각속도로 브레이크(D)
    data.ctrl[0] = KP * error + KI * integral - KD * data.qvel[0]


if "--headless" in sys.argv:
    next_print = 0.0
    while data.time < 5.0:
        control()
        mujoco.mj_step(model, data)
        if data.time >= next_print:
            print(f"{data.time:.1f}초: 각도 {data.qpos[0]:+.4f} rad")
            next_print += 1.0
    final_error = abs(TARGET - data.qpos[0])
    print(f"최종 오차: {final_error:.5f} rad")
    print("PASS" if final_error < 0.02 else "FAIL")
else:
    with mujoco.viewer.launch_passive(model, data) as viewer:
        while viewer.is_running():  # 창을 닫으면 종료
            start = time.time()
            control()
            mujoco.mj_step(model, data)
            viewer.sync()
            time.sleep(max(0.0, model.opt.timestep - (time.time() - start)))  # 실시간 속도 맞추기
