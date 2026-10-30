"""일곱 번째 실습: Menagerie 로봇 3대(Panda 팔, G1 휴머노이드, Go2 로봇개)를
한 장면에 나란히 세워 두고 각자 홈 자세를 유지시킨다.

핵심: mujoco.MjSpec 으로 '빈 무대' 스펙을 만들고, 로봇 스펙을 frame 에 attach 한다.
      접두사(prefix)를 다르게 주면 이름 충돌 없이 한 모델에 합쳐진다.

준비: sim/menagerie 에 franka_emika_panda, unitree_g1, unitree_go2 가 있어야 한다.
  cd menagerie && git sparse-checkout add franka_emika_panda unitree_g1 unitree_go2
"""
import sys

import numpy as np
import mujoco
import mujoco.viewer

# 1) 무대: 바닥 + 조명 + 하늘 배경
spec = mujoco.MjSpec()
spec.modelname = "07 Robot Gallery"  # 뷰어 창 제목 (영어만)
# 로봇들의 solver 설정(attach 시 부모 값이 우선)을 Menagerie 권장값에 맞춘다
spec.option.integrator = mujoco.mjtIntegrator.mjINT_IMPLICITFAST
spec.option.cone = mujoco.mjtCone.mjCONE_ELLIPTIC
spec.option.impratio = 100
spec.visual.headlight.diffuse = [0.6, 0.6, 0.6]
spec.visual.headlight.ambient = [0.4, 0.4, 0.4]
spec.add_texture(name="skybox", type=mujoco.mjtTexture.mjTEXTURE_SKYBOX,
                 builtin=mujoco.mjtBuiltin.mjBUILTIN_GRADIENT,
                 rgb1=[0.3, 0.5, 0.7], rgb2=[0, 0, 0], width=512, height=3072)
spec.add_texture(name="grid", type=mujoco.mjtTexture.mjTEXTURE_2D,
                 builtin=mujoco.mjtBuiltin.mjBUILTIN_CHECKER, mark=mujoco.mjtMark.mjMARK_EDGE,
                 rgb1=[0.2, 0.3, 0.4], rgb2=[0.1, 0.2, 0.3], markrgb=[0.8, 0.8, 0.8],
                 width=300, height=300)
spec.add_material(name="grid", textures=["", "grid"], texrepeat=[5, 5], reflectance=0.2)
spec.worldbody.add_geom(type=mujoco.mjtGeom.mjGEOM_PLANE, size=[4, 4, 0.05], material="grid")
spec.worldbody.add_light(pos=[0, 0, 4], dir=[0, 0, -1], diffuse=[0.5, 0.5, 0.5])

# 2) 로봇 3대를 x 위치만 다르게 attach
#    (이름, 파일, 접두사, x 위치) — 팔은 왼쪽, 사람은 가운데, 개는 오른쪽
ROBOTS = [
    ("Panda", "menagerie/franka_emika_panda/panda.xml", "panda_", -1.0),
    ("G1",    "menagerie/unitree_g1/g1.xml",            "g1_",     0.0),
    ("Go2",   "menagerie/unitree_go2/go2.xml",          "go2_",    1.0),
]
children = {}
for name, path, prefix, x in ROBOTS:
    child = mujoco.MjSpec.from_file(path)
    # attach 한 child 는 따로 compile 할 수 없으니, 키프레임 읽기용 모델을 별도로 만든다
    children[prefix] = mujoco.MjModel.from_xml_path(path)
    frame = spec.worldbody.add_frame(pos=[x, 0, 0])
    frame.attach_body(child.worldbody.first_body(), prefix, "")

model = spec.compile()
data = mujoco.MjData(model)

# 3) attach 하면 키프레임이 사라지므로, 각 로봇의 키프레임(key_qpos/key_ctrl)을
#    '관절/액추에이터 이름'으로 찾아 초기 자세와 목표값을 직접 만든다.
KEY = {"panda_": "home", "g1_": "stand", "go2_": "home"}
targets = {}  # 접두사 -> (관절 id 배열, 목표 각도 배열) : 토크 모터용 PD에 사용
for prefix, cm in children.items():
    k = mujoco.mj_name2id(cm, mujoco.mjtObj.mjOBJ_KEY, KEY[prefix])
    # 관절 초기 각도
    for j in range(cm.njnt):
        jname = mujoco.mj_id2name(cm, mujoco.mjtObj.mjOBJ_JOINT, j)
        full = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_JOINT, prefix + jname) if jname else -1
        if full < 0:
            continue  # 이름 없는 freejoint 는 아래에서 따로 처리
        q = cm.key_qpos[k][cm.jnt_qposadr[j]:cm.jnt_qposadr[j] + (7 if cm.jnt_type[j] == 0 else 1)]
        data.qpos[model.jnt_qposadr[full]:model.jnt_qposadr[full] + len(q)] = q
    # 액추에이터 목표(ctrl)
    for a in range(cm.nu):
        aname = mujoco.mj_id2name(cm, mujoco.mjtObj.mjOBJ_ACTUATOR, a)
        targets[prefix + aname] = cm.key_ctrl[k][a]

# 몸통(freejoint)이 있는 로봇은 키프레임 높이로 세워 둔다 (x 위치는 frame 이 담당)
FREE = {}
for j in range(model.njnt):
    if model.jnt_type[j] == mujoco.mjtJoint.mjJNT_FREE:
        adr = model.jnt_qposadr[j]
        body = model.jnt_bodyid[j]
        bname = mujoco.mj_id2name(model, mujoco.mjtObj.mjOBJ_BODY, body)
        FREE[bname] = adr
for prefix, cm in children.items():
    k = mujoco.mj_name2id(cm, mujoco.mjtObj.mjOBJ_KEY, KEY[prefix])
    for bname, adr in list(FREE.items()):
        if bname.startswith(prefix):
            data.qpos[adr:adr + 7] = cm.key_qpos[k][:7]
            data.qpos[adr] += dict((p, x) for _, _, p, x in ROBOTS)[prefix]
            FREE[prefix] = adr
            del FREE[bname]
mujoco.mj_forward(model, data)

# 4) 액추에이터 분류: Panda/G1 은 position(각도 입력), Go2 는 motor(토크 입력 -> PD 필요)
KP, KD = 60.0, 3.0  # Go2 PD 게인 (04_go2_stand.py 와 동일)
act = {}  # 접두사 -> [(액추에이터 id, 목표)]
for i in range(model.nu):
    aname = mujoco.mj_id2name(model, mujoco.mjtObj.mjOBJ_ACTUATOR, i)
    for prefix in children:
        if aname.startswith(prefix):
            act.setdefault(prefix, []).append((i, targets[aname]))
GO2_ACT = [(i, tgt, model.jnt_qposadr[model.actuator_trnid[i, 0]],
            model.jnt_dofadr[model.actuator_trnid[i, 0]]) for i, tgt in act["go2_"]]


def control(t):
    # Panda, G1: position 액추에이터 -> 목표 각도를 그대로 넣는다 (Panda 마지막은 그리퍼)
    for prefix in ("panda_", "g1_"):
        for i, tgt in act[prefix]:
            data.ctrl[i] = tgt
    # Go2: 토크 모터 -> PD 로 토크 계산
    for i, tgt, qa, da in GO2_ACT:
        data.ctrl[i] = KP * (tgt - data.qpos[qa]) - KD * data.qvel[da]


def report():
    panda_err = max(abs(data.qpos[model.jnt_qposadr[mujoco.mj_name2id(
        model, mujoco.mjtObj.mjOBJ_JOINT, f"panda_joint{n}")]] - targets[f"panda_actuator{n}"])
        for n in range(1, 8))
    print(f"t={data.time:3.0f}s  Go2 높이={data.qpos[FREE['go2_'] + 2]:.3f} m  "
          f"G1 높이={data.qpos[FREE['g1_'] + 2]:.3f} m  Panda 최대 관절오차={panda_err:.4f} rad")


if "--headless" in sys.argv:
    # 창 없이 5초 돌려서 1초마다 상태 출력
    while data.time < 5.0:
        control(data.time)
        mujoco.mj_step(model, data)
        if abs(data.time % 1.0) < model.opt.timestep:
            report()
    ok = np.all(np.isfinite(data.qpos)) and data.qpos[FREE['go2_'] + 2] > 0.15 \
        and data.qpos[FREE['g1_'] + 2] > 0.5
    print("PASS" if ok else "FAIL")
else:
    with mujoco.viewer.launch_passive(model, data) as viewer:
        while viewer.is_running():
            control(data.time)
            mujoco.mj_step(model, data)
            viewer.sync()
