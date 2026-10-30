"""두 번째 실습: 01과 같은 공 낙하를 3D 뷰어 창으로 직접 본다."""
import mujoco
import mujoco.viewer

XML = """
<mujoco model="02 Ball Drop Viewer">
  <option timestep="0.001"/>
  <worldbody>
    <light pos="0 0 3"/>
    <geom type="plane" size="2 2 0.1" rgba="0.8 0.8 0.8 1"/>
    <body name="ball" pos="0 0 1">
      <freejoint/>
      <geom type="sphere" size="0.05" mass="1" rgba="0.9 0.3 0.2 1"/>
    </body>
  </worldbody>
</mujoco>
"""

model = mujoco.MjModel.from_xml_string(XML)
mujoco.viewer.launch(model)  # 창 안에서 Backspace = 리셋, Space = 일시정지
