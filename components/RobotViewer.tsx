"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { robotParts } from "@/lib/data";
import { createGlbHumanoid } from "./robot/glb-humanoid";
import { Slider } from "@/components/ui/slider";

export default function RobotViewer({
  compact = false,
}: {
  compact?: boolean;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const sliderId = useId();
  const [selected, setSelected] = useState("head");
  const [explosion, setExplosion] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const state = useRef({ selected, explosion });
  useEffect(() => {
    state.current = { selected, explosion };
  }, [selected, explosion]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setError(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    camera.position.set(4, 1.9, 8.4);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.05, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = !compact;
    controls.minDistance = 4.5;
    controls.maxDistance = 16;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI * 0.81;
    controls.autoRotateSpeed = 0.55;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setMotion = () => {
      controls.autoRotate = compact && !motion.matches;
    };
    setMotion();
    motion.addEventListener("change", setMotion);

    // A studio reflection environment gives machined edges legible highlights.
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmrem.fromScene(environment, 0.04);
    scene.environment = environmentMap.texture;
    scene.environmentIntensity = 0.72;
    environment.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xd8e9ff, 0x333037, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.5);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe1e6f0, 3);
    rim.position.set(-4, 1, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x9ddaff, 2.5);
    fill.position.set(4, 3, -2);
    scene.add(fill);

    const model = createGlbHumanoid();
    let active = true;
    model.ready.then(() => { if (active) setLoading(false); }).catch(() => {
      if (active) { setLoading(false); setLoadError(true); }
    });
    scene.add(model.root);
    const floor = new THREE.Group();
    floor.position.y = -2.225;
    scene.add(floor);
    const grid = new THREE.GridHelper(9, 30, 0x555053, 0x303437);
    const gridMaterial = grid.material as THREE.LineBasicMaterial;
    gridMaterial.transparent = true;
    gridMaterial.opacity = compact ? 0 : 0.12;
    floor.add(grid);
    for (const [radius, opacity] of [
      [1.4, compact ? 0 : 0.2],
      [1.53, 0],
    ]) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius, radius + 0.007, 96),
        new THREE.MeshBasicMaterial({
          color: 0x8b929e,
          side: THREE.DoubleSide,
          transparent: true,
          opacity,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.005;
      floor.add(ring);
    }
    // A soft contact footprint anchors the feet without expensive shadow passes.
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 128;
    const context = shadowCanvas.getContext("2d");
    let shadowTexture: THREE.CanvasTexture | undefined;
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
      gradient.addColorStop(0, "rgba(0,0,0,.55)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
      shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 1.5),
        new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          depthWrite: false,
        }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(0, 0.01, 0.08);
      floor.add(shadow);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let start: [number, number] | null = null;
    const down = (event: PointerEvent) => {
      start = [event.clientX, event.clientY];
    };
    const cancel = () => {
      start = null;
    };
    const up = (event: PointerEvent) => {
      const origin = start;
      start = null;
      if (
        compact ||
        !origin ||
        Math.hypot(event.clientX - origin[0], event.clientY - origin[1]) > 5
      )
        return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(model.selectable, false)[0];
      if (hit) setSelected(hit.object.userData.part);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", cancel);
    let contextLost = false;
    const loseContext = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      setError(true);
    };
    const restoreContext = () => {
      contextLost = false;
      setError(false);
    };
    renderer.domElement.addEventListener("webglcontextlost", loseContext);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      restoreContext,
    );

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      // Keep the whole figure visible in narrow canvases as well as widescreen labs.
      camera.fov = Math.max(
        34,
        THREE.MathUtils.radToDeg(
          2 *
            Math.atan(
              1.75 /
                (camera.position.distanceTo(controls.target) * camera.aspect),
            ),
        ),
      );
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(host);
    let frame = 0;
    let framingScale = 1;
    let previous = performance.now();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (!visible || document.hidden || contextLost) return;
      const amount = state.current.explosion / 100;
      model.update(
        amount,
        compact ? null : state.current.selected,
        motion.matches ? 1 : delta,
      );
      const nextScale = THREE.MathUtils.lerp(
        framingScale,
        1 + amount * 0.24,
        motion.matches ? 1 : 1 - Math.exp(-10 * delta),
      );
      camera.position
        .sub(controls.target)
        .multiplyScalar(nextScale / framingScale)
        .add(controls.target);
      framingScale = nextScale;
      floor.position.y = -2.225 - amount * 0.58;
      controls.update(delta);
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      active = false;
      model.dispose();
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      motion.removeEventListener("change", setMotion);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", cancel);
      renderer.domElement.removeEventListener("webglcontextlost", loseContext);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        restoreContext,
      );
      controls.dispose();
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>(model.materials);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
        ) {
          geometries.add(object.geometry);
          for (const material of Array.isArray(object.material)
            ? object.material
            : [object.material])
            materials.add(material);
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      shadowTexture?.dispose();
      environmentMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [compact]);

  const part = robotParts.find((part) => part.id === selected)!;
  return (
    <div className={`robot-viewer ${compact ? "compact" : "interactive"}`}>
      <div
        className="robot-canvas"
        ref={mount}
        role="img"
        aria-label="Unitree G1 휴머노이드 GLB 모델. 드래그로 회전하고 부품을 선택하여 구조를 탐구할 수 있습니다."
      />
      {loading && !error && <div className="webgl-fallback" role="status"><p>로봇 3D 모델을 불러오는 중…</p></div>}
      {loadError && !error && <div className="webgl-fallback" role="status"><p>로봇 모델을 불러오지 못했습니다. 페이지를 새로고침해 주세요.</p></div>}
      {error && (
        <div className="webgl-fallback" role="status">
          <span>◈</span>
          <p>이 환경에서는 3D 그래픽을 표시할 수 없습니다.</p>
          <p>
            {compact
              ? "공부 페이지에서 부품별 구조를 확인하세요."
              : "아래 부품별 설명으로 탐구를 이어가세요."}
          </p>
        </div>
      )}
      {!compact && (
        <>
          <div className="viewer-hint">
            드래그하여 회전 · 스크롤하여 확대 · 부품 클릭
          </div>
          <div className="explosion-control">
            <label htmlFor={sliderId}>
              <span>조립</span>
              <span className="mono">EXPLODED VIEW {explosion}%</span>
              <span>분해</span>
            </label>
            <Slider
              id={sliderId}
              min={0}
              max={100}
              step={1}
              value={[explosion]}
              aria-label="휴머노이드 분해 정도"
              onValueChange={(value) => setExplosion(value[0])}
            />
          </div>
          <div className="part-tabs" aria-label="로봇 부품">
            {robotParts.map((item, index) => (
              <button
                aria-pressed={selected === item.id}
                onClick={() => setSelected(item.id)}
                key={item.id}
              >
                <span className="mono">0{index + 1}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="part-description" aria-live="polite">
            <span className="eyebrow orange">{part.english}</span>
            <h3>{part.title}</h3>
            <p>{part.description}</p>
            <div className="part-meta">
              <span>{part.examples}</span>
              <span>{part.signal}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

